import React, { useState, useRef, useEffect } from 'react';
import { Sound } from '../types';

interface SoundButtonProps {
    sound: Sound;
    outputDeviceId: string;
    monitorVolume: number;
    broadcastVolume: number;
    onDelete?: (id: string) => void;
    onEdit?: (sound: Sound) => void;
    onToggleFavorite?: (id: string) => void;
    isCompact?: boolean;
}

export const SoundButton: React.FC<SoundButtonProps> = ({
    sound,
    outputDeviceId,
    monitorVolume,
    broadcastVolume,
    onDelete,
    onEdit,
    onToggleFavorite,
    isCompact = false,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    // Primary audio = Audio played to the default device (so the user can hear it)
    const monitorAudioRef = useRef<HTMLAudioElement | null>(null);

    // Secondary audio = Audio played to the selected output (e.g., Virtual Cable for Discord)
    const broadcastAudioRef = useRef<HTMLAudioElement | null>(null);

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('soundId', sound.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    // Initialize Audio objects
    useEffect(() => {
        monitorAudioRef.current = new Audio(sound.path);
        broadcastAudioRef.current = new Audio(sound.path);

        const monitor = monitorAudioRef.current;
        const broadcast = broadcastAudioRef.current;

        // Synchronize state based on the monitor (user-facing) audio
        const handleEnded = () => setIsPlaying(false);
        const handlePause = () => setIsPlaying(false);
        const handlePlay = () => setIsPlaying(true);

        monitor.addEventListener('ended', handleEnded);
        monitor.addEventListener('pause', handlePause);
        monitor.addEventListener('play', handlePlay);

        // Listen for Global Shortcut Trigger
        const handleGlobalTrigger = () => {
            console.log(`Global trigger received for ${sound.name}`);
            playSound();
        };
        window.addEventListener(`trigger-sound-${sound.id}`, handleGlobalTrigger);

        const handleStopAll = () => {
            if (monitor) {
                monitor.pause();
                monitor.currentTime = 0;
            }
            if (broadcast) {
                broadcast.pause();
                broadcast.currentTime = 0;
            }
            setIsPlaying(false);
        };
        window.addEventListener('stop-all-sounds', handleStopAll);

        return () => {
            monitor.removeEventListener('ended', handleEnded);
            monitor.removeEventListener('pause', handlePause);
            monitor.removeEventListener('play', handlePlay);
            window.removeEventListener(`trigger-sound-${sound.id}`, handleGlobalTrigger);
            window.removeEventListener('stop-all-sounds', handleStopAll);

            monitor.pause();
            monitor.src = '';
            broadcast.pause();
            broadcast.src = '';
        };
    }, [sound.path, sound.id, sound.name]);

    // Update volumes in real-time
    useEffect(() => {
        if (monitorAudioRef.current) {
            const vol = (sound.volume ?? 1) * monitorVolume;
            monitorAudioRef.current.volume = Math.min(Math.max(vol, 0), 1);
        }
    }, [monitorVolume, sound.volume]);

    useEffect(() => {
        if (broadcastAudioRef.current) {
            broadcastAudioRef.current.volume = (sound.volume ?? 1) * broadcastVolume;
        }
    }, [broadcastVolume, sound.volume]);

    // Handle Output Device selection for the broadcast audio
    useEffect(() => {
        if (broadcastAudioRef.current && outputDeviceId && outputDeviceId !== 'default') {
            // @ts-ignore - setSinkId is experimental/non-standard in some type defs
            if (typeof broadcastAudioRef.current.setSinkId === 'function') {
                // @ts-ignore
                broadcastAudioRef.current.setSinkId(outputDeviceId)
                    .catch((err: any) => console.error('Failed to set sinkId:', err));
            }
        }
    }, [outputDeviceId]);

    const playSound = async () => {
        const baseVolume = sound.volume ?? 1;

        // Play Monitor (Local)
        if (monitorAudioRef.current) {
            monitorAudioRef.current.currentTime = 0;
            monitorAudioRef.current.volume = baseVolume * monitorVolume;
            monitorAudioRef.current.play().catch(err => console.error("Monitor play error:", err));
        }

        // Play Broadcast (Virtual Cable / Output)
        if (broadcastAudioRef.current && outputDeviceId && outputDeviceId !== 'default') {
            try {
                const audio = broadcastAudioRef.current;

                // FORCE RESETING SINK ID
                // @ts-ignore
                if (typeof audio.setSinkId === 'function') {
                    // @ts-ignore
                    await audio.setSinkId(outputDeviceId);
                }

                audio.currentTime = 0;
                audio.volume = baseVolume * broadcastVolume;

                await audio.play();

            } catch (err) {
                console.error("[Play] Broadcast failed:", err);
            }
        }
    };

    const stopSound = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (monitorAudioRef.current) {
            monitorAudioRef.current.pause();
            monitorAudioRef.current.currentTime = 0;
        }
        if (broadcastAudioRef.current) {
            broadcastAudioRef.current.pause();
            broadcastAudioRef.current.currentTime = 0;
        }
    };

    if (isCompact) {
        return (
            <div
                draggable={true}
                onDragStart={handleDragStart}
                onClick={playSound}
                onContextMenu={stopSound}
                className={`
                    relative group flex flex-row items-center gap-2 p-2 
                    rounded-lg cursor-pointer transition-all duration-200 border border-white/10
                    ${isPlaying ? 'bg-green-500/30 border-green-500/50' : 'hover:bg-white/10 bg-black/40'}
                `}
            >
                <div className="text-xl pointer-events-none">{sound.icon && sound.icon.match(/^(https?:\/\/|data:|media:\/\/)/) ? '🔊' : (sound.icon || '🔊')}</div>
                <div className="text-xs font-bold text-white truncate flex-1 text-left">{sound.name}</div>
                {onToggleFavorite && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(sound.id); }}
                        className={`text-xs hover:scale-110 transition-transform ${sound.isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                        {sound.isFavorite ? '❤️' : '🤍'}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div
            draggable={true}
            onDragStart={handleDragStart}
            className={`
        relative group flex flex-col items-center justify-center
        w-40 h-40 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-md
        border border-white/5 shadow-lg overflow-hidden z-10
        ${isPlaying
                    ? 'bg-blue-600/20 border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[0.98]'
                    : 'bg-white/5 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20'}
      `}
            onClick={playSound}
            onContextMenu={stopSound} // Right click to stop
        >
            {sound.icon?.match(/^(https?:\/\/|data:|media:\/\/)/) ? (
                <img
                    src={sound.icon}
                    alt={sound.name}
                    className="w-16 h-16 object-cover rounded-full mb-3 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
            ) : (
                <div className="text-5xl mb-3 pointer-events-none transition-transform duration-500 group-hover:scale-110 filter drop-shadow-md">{sound.icon || '🔊'}</div>
            )}
            <div className="text-sm font-bold text-center px-3 truncate w-full text-white/90 group-hover:text-white transition-colors tracking-wide">
                {sound.name}
            </div>

            {/* Favorite Button (Absolute Top Left) */}
            {
                onToggleFavorite && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(sound.id);
                        }}
                        className={`
                        absolute top-2 left-2 z-20 
                        ${sound.isFavorite ? 'opacity-100' : 'opacity-40 hover:opacity-100'}
                        transition-all duration-200 hover:scale-110
                    `}
                    >
                        <span className={`text-lg drop-shadow-md ${sound.isFavorite ? 'grayscale-0' : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}`}>
                            {sound.isFavorite ? '❤️' : '🤍'}
                        </span>
                    </button>
                )
            }

            {/* Controls overlay (visible on hover) */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 z-20">
                {onEdit && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(sound); }}
                        className="p-1 bg-gray-900 rounded text-xs hover:text-blue-400"
                    >
                        ✏️
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this sound?')) {
                                onDelete(sound.id);
                            }
                        }}
                        className="p-1 bg-gray-900 rounded text-xs hover:text-red-400"
                        title="Delete"
                    >
                        🗑️
                    </button>
                )}
            </div>
        </div >
    );
};
