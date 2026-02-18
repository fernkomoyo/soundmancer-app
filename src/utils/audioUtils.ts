
export const fileToAudioBuffer = async (file: File): Promise<AudioBuffer> => {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new AudioContext(); // temporary context for decoding
    return await audioContext.decodeAudioData(arrayBuffer);
};

export const sliceAudioBuffer = (buffer: AudioBuffer, start: number, end: number): AudioBuffer => {
    const rate = buffer.sampleRate;
    const startOffset = Math.max(0, Math.floor(start * rate));
    const endOffset = Math.min(buffer.length, Math.floor(end * rate));
    const frameCount = endOffset - startOffset;

    // Create new buffer
    const audioContext = new AudioContext();
    const newBuffer = audioContext.createBuffer(buffer.numberOfChannels, frameCount, rate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const newData = newBuffer.getChannelData(channel);
        const oldData = buffer.getChannelData(channel);
        // Copy the segment
        for (let i = 0; i < frameCount; i++) {
            newData[i] = oldData[i + startOffset];
        }
    }
    return newBuffer;
};

// Maximizer (Loudness War style!)
export const normalizeAudioBuffer = async (buffer: AudioBuffer): Promise<AudioBuffer> => {
    // Standard Peak Normalization is too quiet for modern standards.
    // We use a "Maximizer" chain: Gain -> Limiter.

    const offlineCtx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    const source = offlineCtx.createBufferSource();
    source.buffer = buffer;

    // 1. Pre-Gain: Boost the signal significantly to push it against the limiter.
    // +6dB is a x2 multiplier. +10dB is x3.16. 
    // Let's go with a healthy +6dB boost to ensure "Loudness".
    const boost = offlineCtx.createGain();
    boost.gain.value = 2.5; // Roughly +8dB. 

    // 2. Limiter: Squash the peaks to prevent clipping while keeping the body loud.
    // Using DynamicsCompressor as a Limiter
    const limiter = offlineCtx.createDynamicsCompressor();
    limiter.threshold.value = -1.0; // Ceiling at -1dB
    limiter.knee.value = 0.0;       // Hard knee (immediate limiting)
    limiter.ratio.value = 20.0;     // High ratio (wall)
    limiter.attack.value = 0.002;   // Fast attack (catch peaks)
    limiter.release.value = 0.1;    // Fast release (recover quickly)

    // Wiring
    source.connect(boost);
    boost.connect(limiter);
    limiter.connect(offlineCtx.destination);

    source.start(0);

    return await offlineCtx.startRendering();
};

// Simple WAV encoder 
export const bufferToWav = (buffer: AudioBuffer): Blob => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);  // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this loop)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for (i = 0; i < buffer.numberOfChannels; i++)
        channels.push(buffer.getChannelData(i));

    while (pos < buffer.length) {
        for (i = 0; i < numOfChan; i++) {             // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][pos])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(44 + offset, sample, true);
            offset += 2;
        }
        pos++;
    }

    return new Blob([bufferArray], { type: 'audio/wav' });

    function setUint16(data: any) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data: any) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
};
