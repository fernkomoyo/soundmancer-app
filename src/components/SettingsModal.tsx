import React from 'react';
import { DeviceSelector } from './DeviceSelector';
import { MicTest } from './MicTest';
import { AudioDevice } from '../hooks/useAudioOutput';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    inputs: AudioDevice[];
    outputs: AudioDevice[];
    selectedInputId: string;
    setSelectedInputId: (id: string) => void;
    selectedOutputId: string;
    setSelectedOutputId: (id: string) => void;
    isPassthroughEnabled: boolean;
    setIsPassthroughEnabled: (enabled: boolean) => void;
    monitorVolume: number;
    setMonitorVolume: (vol: number) => void;
    broadcastVolume: number;
    setBroadcastVolume: (vol: number) => void;
    refreshDevices: () => void;
    onReplayOnboarding: () => void;
    onResetSounds: () => void;
    onShowPatchNotes: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    inputs,
    outputs,
    selectedInputId,
    setSelectedInputId,
    selectedOutputId,
    setSelectedOutputId,
    isPassthroughEnabled,
    setIsPassthroughEnabled,
    monitorVolume,
    setMonitorVolume,
    broadcastVolume,
    setBroadcastVolume,
    refreshDevices,
    onReplayOnboarding,
    onResetSounds,
    onShowPatchNotes
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div
                className="relative w-full max-w-lg p-8 bg-gray-900/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors hover:rotate-90 duration-300"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-6 relative z-10">

                    {/* Device Controls */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Audio Devices</h3>
                            <button
                                onClick={refreshDevices}
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors group"
                            >
                                <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span> Refresh
                            </button>
                        </div>

                        <DeviceSelector
                            label="Input Device (Microphone)"
                            devices={inputs}
                            selectedDeviceId={selectedInputId}
                            onDeviceSelect={setSelectedInputId}
                        />
                        <MicTest deviceId={selectedInputId} />

                        <DeviceSelector
                            label="Output Device (Cable Input)"
                            devices={outputs}
                            selectedDeviceId={selectedOutputId}
                            onDeviceSelect={setSelectedOutputId}
                        />
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Passthrough Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-gray-200 font-medium">Mic Passthrough</label>
                            <p className="text-xs text-gray-500">Hear yourself through the output device</p>
                        </div>

                        <button
                            onClick={() => setIsPassthroughEnabled(!isPassthroughEnabled)}
                            className={`
                relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out
                ${isPassthroughEnabled ? 'bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-gray-700'}
              `}
                        >
                            <div
                                className={`
                    absolute top-1 w-5 h-5 rounded-full shadow-md transition-transform duration-300
                    ${isPassthroughEnabled
                                        ? 'translate-x-8 bg-green-500'
                                        : 'translate-x-1 bg-gray-400'}
                 `}
                            />
                        </button>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Volume Controls */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Volume Levels</h3>

                        {/* Monitor Volume */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Monitor Volume (You)</span>
                                <span className="text-blue-400 font-mono">{Math.round(monitorVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={monitorVolume}
                                onChange={(e) => setMonitorVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                            />
                        </div>

                        {/* Broadcast Volume */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Broadcast Volume (Others)</span>
                                <span className="text-purple-400 font-mono">{Math.round(broadcastVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={broadcastVolume}
                                onChange={(e) => setBroadcastVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Onboarding Control */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-gray-200 font-medium">Onboarding</label>
                            <p className="text-xs text-gray-500">View the welcome tour again</p>
                        </div>
                        <button
                            onClick={() => {
                                onClose();
                                onReplayOnboarding();
                            }}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-blue-300 border border-blue-500/30 transition-all hover:scale-105"
                        >
                            Replay Tour
                        </button>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Patch Notes */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-gray-200 font-medium">What's New</label>
                            <p className="text-xs text-gray-500">View latest updates and changes</p>
                        </div>
                        <button
                            onClick={onShowPatchNotes}
                            className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-xs font-semibold text-blue-400 border border-blue-500/30 transition-all hover:scale-105 flex items-center gap-2"
                        >
                            <span>📜</span> Release Notes
                        </button>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Storage */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-gray-200 font-medium">Storage</label>
                            <p className="text-xs text-gray-500">Manage your local sound files</p>
                        </div>
                        <button
                            onClick={() => {
                                // @ts-ignore
                                if (window.ipcRenderer) {
                                    // @ts-ignore
                                    window.ipcRenderer.invoke('open-sounds-folder');
                                }
                            }}
                            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs font-semibold text-gray-200 border border-gray-500/30 transition-all hover:scale-105 flex items-center gap-2"
                        >
                            <span>📂</span> Open Folder
                        </button>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Reset All Data - Destructive */}
                    <div className="flex items-center justify-between pb-2">
                        <div>
                            <label className="text-red-400 font-medium">Reset All Data</label>
                            <p className="text-xs text-red-400/50">Delete all sounds and reset settings</p>
                        </div>
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure? This will delete ALL sounds and cannot be undone.')) {
                                    onResetSounds();
                                    onClose();
                                }
                            }}
                            className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-500 border border-red-500/30 transition-all hover:scale-105"
                        >
                            Reset Everything
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
