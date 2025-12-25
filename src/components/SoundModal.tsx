import React, { useState, useRef, useEffect } from 'react';
import { Sound, OnlineSound } from '../types';
import { AudioTrimmer } from './AudioTrimmer';
import { OnlineSoundSearch } from './OnlineSoundSearch';

interface SoundModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (soundData: Partial<Sound> & { file: File | null }) => void;
    categories: string[];
    initialSound?: Sound | null;
}

export const SoundModal: React.FC<SoundModalProps> = ({
    isOpen,
    onClose,
    onSave,
    categories,
    initialSound,
}) => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('🎵');
    const [category, setCategory] = useState('Uncategorized');
    const [keybind, setKeybind] = useState('');
    const [volume, setVolume] = useState(1.0);
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const [activeTab, setActiveTab] = useState<'local' | 'online'>('local');
    const [showTrimmer, setShowTrimmer] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            if (initialSound) {
                // Edit Mode
                setName(initialSound.name);
                setIcon(initialSound.icon || '🎵');
                setCategory(initialSound.category || categories[0] || 'Uncategorized');
                setKeybind(initialSound.keybind || '');
                setVolume(initialSound.volume ?? 1.0);
                // For editing, we don't necessarily need a file ref unless they change it
                // We'll handle this by making file optional in onSave
                setFile(null);
                setActiveTab('local');
            } else {
                // Add Mode
                setName('');
                setIcon('🎵');
                setCategory(categories[0] || 'Uncategorized');
                setKeybind('');
                setVolume(1.0);
                setFile(null);
                setShowTrimmer(false);
                setActiveTab('local');
            }
        }
    }, [isOpen, initialSound]);

    const handleOnlineSoundSelect = async (sound: OnlineSound) => {
        try {
            // @ts-ignore
            const path = await window.ipcRenderer.invoke('download-sound', {
                url: sound.url,
                fileName: sound.name
            });

            // Mock a File object with the path for App.tsx to read
            const mockFile = {
                name: sound.name + '.mp3',
                path: path,
                size: 0, // Unknown, doesn't matter much for local
                type: 'audio/mpeg'
            };

            setFile(mockFile as any);
            setName(sound.name);
            if (sound.icon) setIcon(sound.icon); // Or parse emoji if possible

            setActiveTab('local');

        } catch (err) {
            console.error("Failed to download online sound", err);
        }
    };

    if (!isOpen) return null;

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        // Auto-fill name if empty
        if (!name) {
            setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('audio/')) {
            handleFileSelect(droppedFile);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
            onSave({
                name,
                icon,
                category,
                keybind,
                volume,
                file: file || null
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div
                className="glass-panel rounded-2xl shadow-2xl w-full max-w-md border border-white/10 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 mobile:max-h-[90vh] mobile:overflow-y-auto"
                style={{ maxHeight: '90vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {showTrimmer ? 'Trim Audio' : (initialSound ? 'Edit Sound' : 'Add New Sound')}
                        </h2>
                        {!showTrimmer && <p className="text-xs text-gray-400 mt-1">
                            {initialSound ? 'Update details or keybinds.' : 'Upload or discover new sounds.'}
                        </p>}
                    </div>
                </div>

                {!showTrimmer && !initialSound && (
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('local')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'local' ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            Upload File
                        </button>
                        <button
                            onClick={() => setActiveTab('online')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'online' ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            Discover (Online)
                        </button>
                    </div>
                )}

                {showTrimmer && file ? (
                    <div className="p-6">
                        <AudioTrimmer
                            file={file}
                            maxDuration={7}
                            onConfirm={(trimmedFile) => {
                                setFile(trimmedFile);
                                setShowTrimmer(false);
                            }}
                            onCancel={() => setShowTrimmer(false)}
                        />
                    </div>
                ) : activeTab === 'online' ? (
                    <div className="p-4 flex-1 overflow-hidden min-h-[400px] flex flex-col">
                        <OnlineSoundSearch onDownload={handleOnlineSoundSelect} />
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 flex-1 overflow-y-auto min-h-0">

                            {/* File Upload Area */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                                    border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                                    flex flex-col items-center gap-2
                                    ${isDragging
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : file
                                            ? 'border-green-500 bg-green-500/10'
                                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'}
                                `}
                            >
                                {file ? (
                                    <>
                                        <div className="text-2xl">✅</div>
                                        <div className="text-sm font-medium text-white truncate max-w-full">
                                            {file.name}
                                        </div>
                                        <div className="text-xs text-green-400">Ready. {(file.size / 1024).toFixed(1)} KB</div>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowTrimmer(true);
                                            }}
                                            className="mt-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs font-bold text-white flex items-center gap-1 z-10"
                                        >
                                            ✂️ Trim Audio
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-2xl">📁</div>
                                        <div className="text-sm font-medium text-gray-300">
                                            {initialSound ? 'Click to Change File (Optional)' : 'Click to Browse or Drag File'}
                                        </div>
                                        <div className="text-xs text-gray-500">Supports MP3, WAV, OGG</div>
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                    accept="audio/*"
                                    className="hidden"
                                />
                            </div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-4 gap-4">
                                {/* Name Input */}
                                <div className="col-span-3 flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Sound Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Vine Boom"
                                        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                {/* Volume Slider */}
                                <div className="col-span-4 flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase">
                                        <label>Volume</label>
                                        <span className="text-blue-400">{(volume * 100).toFixed(0)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>

                                <div className="col-span-1 flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Icon</label>
                                    <div className="relative">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={icon}
                                                onChange={(e) => setIcon(e.target.value)}
                                                placeholder="🎵"
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-3 pr-10 py-2 text-center text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                                                className="absolute right-1 top-1 bottom-1 w-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                            >
                                                😀
                                            </button>
                                        </div>

                                        {isEmojiPickerOpen && (
                                            <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-3 z-50 grid grid-cols-6 gap-2 animate-in fade-in zoom-in duration-200">
                                                {['🔊', '📢', '🔥', '💀', '🤡', '😭',
                                                    '😂', '😱', '🤬', '🤯', '🤢', '🤮',
                                                    '🎺', '🥁', '🎸', '🎹', '🎼', '🎤',
                                                    '🚨', '💥', '💣', '💨', '🛑', '🚫',
                                                    '🐶', '🐱', '🐓', '🦗', '🐐', '🐒',
                                                    '💯', '🆙', '🆒', '✅', '❌', '✨'
                                                ].map(emoji => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() => {
                                                            setIcon(emoji);
                                                            setIsEmojiPickerOpen(false);
                                                        }}
                                                        className="h-8 w-8 flex items-center justify-center rounded hover:bg-white/10 text-lg transition-colors"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {/* Click outside listener could be added here or just rely on manual toggle */}
                                        {isEmojiPickerOpen && (
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsEmojiPickerOpen(false)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Keybind Input */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Global Keybind</label>
                                <input
                                    type="text"
                                    value={keybind}
                                    placeholder="Click to record (e.g. Ctrl+Alt+1)"
                                    readOnly
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                        if (e.key === 'Escape' || e.key === 'Backspace') {
                                            setKeybind('');
                                            return;
                                        }

                                        // Ignore isolated modifier presses
                                        if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;

                                        const parts = [];
                                        if (e.ctrlKey) parts.push('CommandOrControl'); // Electron format
                                        if (e.altKey) parts.push('Alt');
                                        if (e.shiftKey) parts.push('Shift');
                                        if (e.metaKey) parts.push('Super');

                                        let key = e.key.toUpperCase();
                                        if (key === ' ') key = 'Space';

                                        parts.push(key);
                                        setKeybind(parts.join('+'));
                                    }}
                                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                                />
                            </div>

                            {/* Category Input */}
                            <div className="flex flex-col gap-1 relative">
                                <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => {
                                            setCategory(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay to allow click
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Select or type new..."
                                    />
                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-40 overflow-y-auto z-10">
                                            {/* Existing Categories */}
                                            {categories.filter(c => {
                                                const exactMatch = categories.some(existing => existing.toLowerCase() === category.toLowerCase());
                                                if (exactMatch) return true;
                                                return c.toLowerCase().includes(category.toLowerCase());
                                            }).map(cat => (
                                                <div
                                                    key={cat}
                                                    className="px-3 py-2 hover:bg-gray-800 cursor-pointer text-sm text-gray-300"
                                                    onClick={() => {
                                                        setCategory(cat);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    {cat}
                                                </div>
                                            ))}

                                            {/* Create New Option */}
                                            {category && !categories.some(c => c.toLowerCase() === category.toLowerCase()) && (
                                                <div
                                                    className="px-3 py-2 hover:bg-green-900/50 cursor-pointer text-sm text-green-400 border-t border-gray-800 font-medium"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    + Create "{category}"
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </form>

                        {/* Footer Buttons */}
                        <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:underline transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!name || (!file && !initialSound)}
                                className={`
                                    px-6 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all
                                    ${name && (file || initialSound)
                                        ? 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/25'
                                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
                                `}
                            >
                                {initialSound ? 'Save Changes' : 'Add Sound'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div >
    );
};
