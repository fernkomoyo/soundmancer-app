import React from 'react';
import { Sound } from '../types';
import { SoundButton } from './SoundButton';

interface SoundGridProps {
    sounds: Sound[];
    outputDeviceId: string;
    monitorVolume: number;
    broadcastVolume: number;
    onAddSound: () => void;
    onDelete: (id: string) => void;
    onEdit: (sound: Sound) => void;
    isCompact?: boolean;
}

export const SoundGrid: React.FC<SoundGridProps> = ({
    sounds,
    outputDeviceId,
    monitorVolume,
    broadcastVolume,
    onAddSound,
    onDelete,
    onEdit,
    isCompact = false,
}) => {
    return (
        <div className="p-4">
            <div className={`grid gap-4 pb-20 ${isCompact
                ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                }`}>
                {sounds.map(sound => (
                    <SoundButton
                        key={sound.id}
                        sound={sound}
                        outputDeviceId={outputDeviceId}
                        monitorVolume={monitorVolume}
                        broadcastVolume={broadcastVolume}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        isCompact={isCompact}
                    />
                ))}

                {/* Add Button - Hide in Mini Mode */}
                {!isCompact && (
                    <button
                        onClick={onAddSound}
                        className="
          flex flex-col items-center justify-center
          w-40 h-40 rounded-2xl cursor-pointer transition-all duration-300
          border-2 border-dashed border-white/10 hover:border-white/30 hover:bg-white/5
          group
        "
                    >
                        <div className="text-4xl text-white/20 group-hover:text-white/50 transition-colors mb-2">+</div>
                        <div className="text-sm font-medium text-white/30 group-hover:text-white/50 transition-colors">Add Sound</div>
                    </button>
                )}
            </div>
        </div>
    );
};
