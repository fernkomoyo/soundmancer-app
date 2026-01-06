import React, { useEffect, useRef } from 'react';
import { useAudioVisualizer } from '../contexts/AudioContext';

interface AudioVisualizerProps {
    className?: string;
    height?: number;
    barColor?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ className = "", height = 60 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { analyser } = useAudioVisualizer();
    const animationRef = useRef<number>();

    useEffect(() => {
        if (!analyser || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const renderFrame = () => {
            animationRef.current = requestAnimationFrame(renderFrame);

            // Get Data
            analyser.getByteFrequencyData(dataArray);

            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Visual properties
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            // Draw
            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height;

                // Fancy Gradient
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                gradient.addColorStop(0, '#3b82f6'); // Blue-500
                gradient.addColorStop(0.5, '#a855f7'); // Purple-500
                gradient.addColorStop(1, '#ec4899'); // Pink-500

                ctx.fillStyle = gradient;

                // Rounded tops?
                // ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                // Let's draw rounded caps
                const y = canvas.height - barHeight;

                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
                ctx.fill();

                x += barWidth + 1;
            }
        };

        renderFrame();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [analyser]);

    // Handle ResizeObservers to keep canvas resolution sharp
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                const dpr = window.devicePixelRatio || 1;
                canvas.width = width * dpr;
                canvas.height = height * dpr;

                // Reset scale for drawing context
                const ctx = canvas.getContext('2d');
                if (ctx) ctx.scale(dpr, dpr);
            }
        });

        observer.observe(canvas);
        return () => observer.disconnect();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full pointer-events-none opacity-80 ${className}`}
            style={{ height: `${height}px` }}
        />
    );
};
