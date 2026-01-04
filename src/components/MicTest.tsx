import React, { useEffect, useRef, useState } from 'react';

interface MicTestProps {
    deviceId: string;
}

export const MicTest: React.FC<MicTestProps> = ({ deviceId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const requestRef = useRef<number>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startMic = async () => {
            try {
                if (!deviceId) return;

                // Close previous context if exists
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                }

                stream = await navigator.mediaDevices.getUserMedia({
                    audio: { deviceId: { exact: deviceId } }
                });

                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                audioContextRef.current = audioContext;

                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.5; // Smooth out the motion
                analyserRef.current = analyser;

                const source = audioContext.createMediaStreamSource(stream);
                sourceRef.current = source;
                source.connect(analyser);

                draw();
                setError(null);
            } catch (err) {
                console.error("Mic Test Error:", err);
                setError("Could not access microphone. Please check permissions.");
            }
        };

        startMic();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, [deviceId]);

    const draw = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate RMS (more accurate volume) or just average
        let sum = 0;
        // Focus on voice frequencies (roughly 85Hz to 255Hz, first few bins give good approximation for volume)
        // Adjust loop range if needed. dataArray length is fftSize/2 = 128.
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;

        // Normalize 0-255 to 0-1, but amplify it a bit for visibility
        let volume = average / 128; // Amplify x2 effectively
        if (volume > 1) volume = 1;

        // Draw basic bar
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background track
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gradient Bar
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#22c55e'); // Green
        gradient.addColorStop(0.6, '#eab308'); // Yellow
        gradient.addColorStop(1, '#ef4444'); // Red

        ctx.fillStyle = gradient;

        // Width based on volume
        // Simple smoothing could also be done here by averaging with previous volume, 
        // but AnalyserNode smoothingTimeConstant does a lot already.
        const barWidth = canvas.width * volume;

        // Rounded corners for the filled part
        ctx.beginPath();
        ctx.roundRect(0, 0, barWidth, canvas.height, 4);
        ctx.fill();

        requestRef.current = requestAnimationFrame(draw);
    };

    if (error) {
        return <div className="text-xs text-red-400 mt-1">{error}</div>;
    }

    return (
        <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Test Microphone</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700 relative">
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={10}
                    className="w-full h-full block"
                />
            </div>
        </div>
    );
};
