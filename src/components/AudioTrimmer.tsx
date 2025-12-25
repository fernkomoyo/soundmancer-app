import React, { useEffect, useRef, useState } from 'react';
import { fileToAudioBuffer, sliceAudioBuffer, bufferToWav } from '../utils/audioUtils';

interface AudioTrimmerProps {
    file: File;
    maxDuration: number; // in seconds
    onConfirm: (trimmedFile: File) => void;
    onCancel: () => void;
}

export const AudioTrimmer: React.FC<AudioTrimmerProps> = ({ file, maxDuration, onConfirm, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(maxDuration);
    const [isPlaying, setIsPlaying] = useState(false);
    const playbackSource = useRef<AudioBufferSourceNode | null>(null);
    const audioContext = useRef<AudioContext | null>(null);

    // Initial Decode
    useEffect(() => {
        const loadAudio = async () => {
            try {
                const buffer = await fileToAudioBuffer(file);
                audioBufferRef.current = buffer;
                // Default end: min(bufferDuration, maxDuration)
                setEnd(Math.min(buffer.duration, maxDuration));
                setIsLoading(false);
            } catch (err) {
                console.error("Error decoding audio", err);
            }
        };
        loadAudio();

        // Setup Audio Context
        audioContext.current = new AudioContext();

        return () => {
            audioContext.current?.close();
        };
    }, [file, maxDuration]);

    // Draw Waveform
    useEffect(() => {
        if (!canvasRef.current || !audioBufferRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const buffer = audioBufferRef.current;
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear
        ctx.fillStyle = '#111827'; // bg-gray-900
        ctx.fillRect(0, 0, width, height);

        // Draw Waveform
        const data = buffer.getChannelData(0);
        const step = Math.ceil(data.length / width);
        const amp = height / 2;

        ctx.fillStyle = '#60A5FA'; // blue-400
        ctx.beginPath();
        for (let i = 0; i < width; i++) {
            let min = 1.0;
            let max = -1.0;
            for (let j = 0; j < step; j++) {
                const datum = data[(i * step) + j];
                if (datum < min) min = datum;
                if (datum > max) max = datum;
            }
            ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }

        // Draw Selection Overlay
        const pixelsPerSec = width / buffer.duration;
        const startX = start * pixelsPerSec;
        const endX = end * pixelsPerSec;

        // Dim unselected areas
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, startX, height);
        ctx.fillRect(endX, 0, width - endX, height);

        // Selection Border
        ctx.strokeStyle = '#10B981'; // green-500
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, 0, endX - startX, height);

    }, [start, end, isLoading]);

    const playPreview = () => {
        if (!audioContext.current || !audioBufferRef.current) return;

        if (isPlaying) {
            playbackSource.current?.stop();
            setIsPlaying(false);
            return;
        }

        const source = audioContext.current.createBufferSource();
        // Play only selected region
        const slice = sliceAudioBuffer(audioBufferRef.current, start, end);
        source.buffer = slice;
        source.connect(audioContext.current.destination);
        source.start();
        source.onended = () => setIsPlaying(false);
        playbackSource.current = source;
        setIsPlaying(true);
    };

    const handleConfirm = () => {
        if (!audioBufferRef.current) return;
        const slice = sliceAudioBuffer(audioBufferRef.current, start, end);
        const blob = bufferToWav(slice);
        const newFile = new File([blob], file.name, { type: 'audio/wav' });
        onConfirm(newFile);
    };

    // Simple range input logic for now (could be canvas dragging later)
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase">Trim Audio ({maxDuration}s limit)</h3>

            <div className="relative border border-gray-700 rounded-lg overflow-hidden bg-gray-900 h-32">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        Loading waveform...
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={128}
                    className="w-full h-full"
                />
            </div>

            {/* Controls */}
            {audioBufferRef.current && (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                        <span>Start: {start.toFixed(2)}s</span>
                        <span>Len: {(end - start).toFixed(2)}s</span>
                        <span>End: {end.toFixed(2)}s</span>
                    </div>

                    {/* Sliders (Temporary UI) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Start Position</label>
                        <input
                            type="range"
                            min={0}
                            max={audioBufferRef.current.duration}
                            step={0.1}
                            value={start}
                            onChange={(e) => {
                                const newStart = parseFloat(e.target.value);
                                if (newStart < end) {
                                    setStart(newStart);
                                    // Enforce max duration from left
                                    if (end - newStart > maxDuration) {
                                        setEnd(newStart + maxDuration);
                                    }
                                }
                            }}
                            className="w-full accent-green-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">End Position</label>
                        <input
                            type="range"
                            min={0}
                            max={audioBufferRef.current.duration}
                            step={0.1}
                            value={end}
                            onChange={(e) => {
                                const newEnd = parseFloat(e.target.value);
                                if (newEnd > start) {
                                    setEnd(newEnd);
                                    // Enforce max duration from right
                                    if (newEnd - start > maxDuration) {
                                        setStart(newEnd - maxDuration);
                                    }
                                }
                            }}
                            className="w-full accent-red-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-between pt-2">
                <button
                    onClick={playPreview}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold text-white flex items-center gap-1"
                >
                    {isPlaying ? '⏹️ Stop' : '▶️ Preview'}
                </button>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="text-gray-400 hover:text-white text-xs">Cancel</button>
                    <button
                        onClick={handleConfirm}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-xs font-bold text-white shadow-lg shadow-green-900/20"
                    >
                        ✂️ Trim & Use
                    </button>
                </div>
            </div>
        </div>
    );
};
