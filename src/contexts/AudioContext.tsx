import React, { createContext, useContext, useEffect, useRef } from 'react';

interface AudioContextType {
    connectToVisualizer: (audioElement: HTMLAudioElement) => void;
    analyser: AnalyserNode | null;
}

const AudioVisualizerContext = createContext<AudioContextType | null>(null);

export const useAudioVisualizer = () => {
    const context = useContext(AudioVisualizerContext);
    if (!context) {
        throw new Error('useAudioVisualizer must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const connectedElementsRef = useRef<WeakSet<HTMLAudioElement>>(new WeakSet());

    useEffect(() => {
        // Initialize AudioContext content
        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
        const ctx = new AudioContextClass();
        const analyser = ctx.createAnalyser();

        analyser.fftSize = 256; // Defines data resolution (64, 128, 256, 512, etc.)
        analyser.smoothingTimeConstant = 0.8; // Makes movement smoother

        audioContextRef.current = ctx;
        analyserRef.current = analyser;

        // Resume context on user interaction if needed
        const resumeAudio = () => {
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
        };
        window.addEventListener('click', resumeAudio);
        window.addEventListener('keydown', resumeAudio);

        return () => {
            ctx.close();
            window.removeEventListener('click', resumeAudio);
            window.removeEventListener('keydown', resumeAudio);
        };
    }, []);

    const connectToVisualizer = (audioElement: HTMLAudioElement) => {
        if (!audioContextRef.current || !analyserRef.current) return;

        // Prevent double connecting the same element
        if (connectedElementsRef.current.has(audioElement)) return;

        try {
            const source = audioContextRef.current.createMediaElementSource(audioElement);
            source.connect(analyserRef.current);
            // We connect Analyser->Destination so we can hear it? 
            // WAIT! MediaElementSource disconnects the audio from the speakers by default.
            // So we MUST connect: Source -> Analyser -> Destination
            analyserRef.current.connect(audioContextRef.current.destination);

            connectedElementsRef.current.add(audioElement);
        } catch (err) {
            console.warn("AudioVisualizer connection error:", err);
            // Often "HTMLMediaElement already connected previously to a different MediaElementSourceNode"
        }
    };

    return (
        <AudioVisualizerContext.Provider value={{ connectToVisualizer, analyser: analyserRef.current }}>
            {children}
        </AudioVisualizerContext.Provider>
    );
};
