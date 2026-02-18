import React, { useState, useRef, useEffect } from 'react';
import { Sound, OnlineSound } from '../types';
import { AudioTrimmer } from './AudioTrimmer';
import { OnlineSoundSearch } from './OnlineSoundSearch';
import { UpgradeModal } from './UpgradeModal';
import { fileToAudioBuffer, normalizeAudioBuffer, bufferToWav } from '../utils/audioUtils';

interface SoundModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (soundData: Partial<Sound> & { file: File | null }) => void;
    categories: string[];
    initialSound?: Sound | null;
    onShowToast?: (message: string, type: 'success' | 'info' | 'error') => void;
    isPro: boolean;
    onlineSoundCount: number;
    onUpgrade: () => void;
}

export const SoundModal: React.FC<SoundModalProps> = ({
    isOpen,
    onClose,
    onSave,
    categories,
    initialSound,
    onShowToast,
    isPro,
    onlineSoundCount,
    onUpgrade
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
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    // const [isNormalizing, setIsNormalizing] = useState(false); // Removed as automatic now

    const isLimitReached = !isPro && onlineSoundCount >= 5;

    const [activeTab, setActiveTab] = useState<'local' | 'online' | 'youtube'>('local');
    const [showTrimmer, setShowTrimmer] = useState(false);

    // YouTube Clipper State
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [youtubeId, setYoutubeId] = useState('');
    const [clipStart, setClipStart] = useState(0);
    const [clipEnd, setClipEnd] = useState(10);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state when opening
    const [sourceType, setSourceType] = useState<'local' | 'online' | 'youtube'>('local');

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setDownloadProgress(0);
            // setIsNormalizing(false); // Unused
            if (initialSound) {
                // Edit Mode
                setName(initialSound.name);
                setIcon(initialSound.icon || '🎵');
                setCategory(initialSound.category || categories[0] || 'Uncategorized');
                setKeybind(initialSound.keybind || '');
                setVolume(initialSound.volume ?? 1.0);
                setFile(null);
                setActiveTab('local');
                setSourceType(initialSound.source || 'local');
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
                setSourceType('local');
            }
        }
    }, [isOpen, initialSound]);

    const [isProcessing, setIsProcessing] = useState(false);

    // Helper to process and normalize any file before setting it to state
    const processAndSetFile = async (rawFile: File, source: 'local' | 'online' | 'youtube') => {
        setIsProcessing(true);
        try {
            // 1. Decode
            const audioBuffer = await fileToAudioBuffer(rawFile);

            // 2. Normalize
            const normalizedBuffer = await normalizeAudioBuffer(audioBuffer);

            // 3. Encode back to WAV
            const normalizedBlob = bufferToWav(normalizedBuffer);
            const normalizedFile = new File([normalizedBlob], rawFile.name, { type: 'audio/wav' });

            setFile(normalizedFile);
            setSourceType(source);

            // Auto-fill name if empty and local
            if (!name && source === 'local') {
                setName(rawFile.name.replace(/\.[^/.]+$/, ""));
            }

        } catch (err) {
            console.error("Auto-normalization failed:", err);
            // Fallback to original file if normalization fails
            setFile(rawFile);
            setSourceType(source);
            if (onShowToast) onShowToast("Could not auto-normalize, using original.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    // ... (keep useEffect for download-progress)

    const handleOnlineSoundSelect = async (sound: OnlineSound) => {
        if (isLimitReached) {
            setIsUpgradeOpen(true);
            return;
        }

        try {
            // @ts-ignore
            const path = await window.ipcRenderer.invoke('download-sound', {
                url: sound.url,
                fileName: sound.name
            });

            // Mock a File object
            // Mock a File object (removed)
            /*
            const mockFile = {
                name: sound.name + '.mp3',
                path: path,
                size: 0,
                type: 'audio/mpeg'
            };
            */

            // Process/Normalize the downloaded file
            // Note: We can't easily read the file back here without more IPC if it was just downloaded to disk.
            // BUT, we can just fetch it? Or rely on the mock?
            // Wait, processAndSetFile expects a File/Blob that fileToAudioBuffer can read.
            // If mockFile.path is 'media://...', fileToAudioBuffer might fail if it uses FileReader on the "File" object which is just a POJO here.
            // We need to actually read the file into a Blob first.

            // @ts-ignore
            const buffer = await window.ipcRenderer.invoke('read-file', path);
            const blob = new Blob([buffer], { type: 'audio/mpeg' });
            const realFile = new File([blob], sound.name + '.mp3', { type: 'audio/mpeg' });

            // Now normalize it
            const audioBuffer = await fileToAudioBuffer(realFile);
            const normalizedBuffer = await normalizeAudioBuffer(audioBuffer);
            const normalizedBlob = bufferToWav(normalizedBuffer);

            // Save to disk immediately to persist
            const arrayBuffer = await normalizedBlob.arrayBuffer();
            // @ts-ignore
            const savedPath = await window.ipcRenderer.invoke('save-audio-file', {
                buffer: arrayBuffer,
                name: sound.name
            });

            // Create a mock file object with the saved path
            // This ensures App.tsx treats it as a local file with a 'path' property
            const persistentFile = {
                name: sound.name + '.wav',
                path: savedPath,
                type: 'audio/wav',
                size: normalizedBlob.size,
                slice: normalizedBlob.slice.bind(normalizedBlob) // Mimic Blob interface just in case
            };

            onSave({
                name: sound.name,
                icon: sound.icon || '🎵',
                category: categories[0] || 'Uncategorized',
                keybind: '',
                volume: 1.0,
                file: persistentFile as any,
                source: 'online'
            });

            if (onShowToast) {
                if (!isPro) {
                    const remaining = 4 - onlineSoundCount;
                    const msg = remaining > 0
                        ? `Added "${sound.name}"! (${remaining} free left)`
                        : `Added "${sound.name}"! (Last free slot used)`;
                    onShowToast(msg, 'success');
                } else {
                    onShowToast(`Added "${sound.name}"!`, 'success');
                }
            }

        } catch (err) {
            console.error("Failed to download online sound", err);
            if (onShowToast) onShowToast("Failed to download sound.", 'error');
        }
    };

    const handleYoutubeImport = async () => {
        if (isLimitReached) {
            setIsUpgradeOpen(true);
            return;
        }

        if (!youtubeId) return;
        setIsDownloading(true);
        setDownloadProgress(0);
        try {
            const canonicalUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
            // @ts-ignore
            const path = await window.ipcRenderer.invoke('download-youtube-audio', {
                url: canonicalUrl,
                start: clipStart,
                end: clipEnd
            });

            // Fetch via IPC
            // @ts-ignore
            const buffer = await window.ipcRenderer.invoke('read-file', path);
            const blob = new Blob([buffer], { type: 'audio/mpeg' });
            const file = new File([blob], `yt_clip_${youtubeId}.mp3`, { type: 'audio/mpeg' });

            // Auto-normalize
            // await processAndSetFile(file, 'youtube'); // We can't use processAndSetFile because it sets state.file which is UI state
            // We want to process it and then allow trimming OR saving.

            // For now, let's load it into the state so the user can Trim it.
            // But if we want to save it *after* trimming, `AudioTrimmer` returns a File/Blob.
            // So we need to handle the "Confirm Trim" logic effectively.

            // Let's rely on processAndSetFile to set the `file` state, 
            // BUT we also need to ensure that when they hit SAVE, it gets saved to disk.
            // Currently `handleSubmit` calls `onSave` with `file` state.
            // If `file` is a Blob (no path), `App.tsx` creates a Blob URL (ephemeral).

            // Logic change: When importing from YouTube, we want the *final* result to be saved to disk.
            // The `AudioTrimmer` returns a Blob (File). 
            // We should hook into `onSave` in `App.tsx`? No, `App.tsx` doesn't know about normalization/persistence.

            // Better approach: When `handleSubmit` is called, if the file doesn't have a path, WE SAVE IT HERE.
            // But `handleSubmit` is synchronous/simple. 

            // Let's modify `handleSubmit` to handle saving if needed? 
            // Or better: Modify `processAndSetFile` to optionally save? No.

            // Let's stick to the current flow:
            // 1. Download -> `file` state (Blob)
            // 2. User trims -> `file` state updates (Blob)
            // 3. User clicks Save -> `handleSubmit`
            // WE NEED TO INTERCEPT SUBMIT.

            await processAndSetFile(file, 'youtube');

            setShowTrimmer(true);
            if (!name) setName(`YouTube Clip`);
        } catch (err: any) {
            console.error("YouTube import error", err);
            const errorMessage = err.message || "Failed to download YouTube video.";
            if (onShowToast) onShowToast(`Error: ${errorMessage}`, 'error');
        } finally {
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    };

    if (!isOpen) return null;

    const handleFileSelect = (selectedFile: File) => {
        // Auto-normalize local files
        processAndSetFile(selectedFile, 'local');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('audio/')) {
            handleFileSelect(droppedFile); // Use the new handler
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        // ... existing submit
        e.preventDefault();
        if (name) {
            let finalFile = file;

            // If we have a file but no path (it's a Blob/File from memory), save it to disk!
            if (file && !(file as any).path) {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    // @ts-ignore
                    const savedPath = await window.ipcRenderer.invoke('save-audio-file', {
                        buffer: arrayBuffer,
                        name: name
                    });

                    finalFile = {
                        name: file.name,
                        path: savedPath,
                        type: file.type,
                        size: file.size,
                        slice: file.slice.bind(file)
                    } as any;
                } catch (err) {
                    console.error("Failed to save file during submit:", err);
                    if (onShowToast) onShowToast("Failed to save sound file to disk.", "error");
                    return;
                }
            }

            onSave({
                name,
                icon,
                category,
                keybind,
                volume,
                file: finalFile || null,
                source: sourceType
            });
            // ... (keep toast logic)
            if (sourceType === 'youtube' && !initialSound && onShowToast) {
                if (!isPro) {
                    const remaining = 4 - onlineSoundCount;
                    const msg = remaining > 0
                        ? `Imported "${name}"! (${remaining} free left)`
                        : `Imported "${name}"! (Last free slot used)`;
                    onShowToast(msg, 'success');
                } else {
                    onShowToast(`Imported "${name}"!`, 'success');
                }
            }
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="glass-panel rounded-2xl shadow-2xl w-full max-w-md h-[650px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] relative"
                style={{ maxHeight: '90vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

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
                        {/* ... Tabs ... */}
                        <button
                            onClick={() => setActiveTab('local')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'local' ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            Upload File
                        </button>

                        <div className="flex-1 relative group">
                            <button
                                onClick={() => {
                                    if (!isLimitReached) setActiveTab('online');
                                    else setIsUpgradeOpen(true);
                                }}
                                className={`w-full h-full py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2
                                    ${activeTab === 'online' ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5' : 'text-gray-400 hover:text-white'}
                                `}
                            >
                                Discover
                                {isLimitReached && <span className="text-[10px]">🔒</span>}
                            </button>
                        </div>

                        <div className="flex-1 relative group">
                            <button
                                onClick={() => {
                                    if (!isLimitReached) setActiveTab('youtube');
                                    else setIsUpgradeOpen(true);
                                }}
                                className={`w-full h-full py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2
                                    ${activeTab === 'youtube' ? 'text-red-400 border-b-2 border-red-400 bg-white/5' : 'text-gray-400 hover:text-white'}
                                `}
                            >
                                YouTube
                                {isLimitReached && <span className="text-[10px]">🔒</span>}
                            </button>
                        </div>
                    </div>
                )}

                {showTrimmer && file ? (
                    <div className="p-6">
                        <AudioTrimmer
                            file={file}
                            maxDuration={7}
                            onConfirm={async (trimmedFile) => {
                                // Re-normalize after trimming (trimming might actually change peak if we cut off a loud part, 
                                // so we might want to maximize the NEW clip. Or we might want to keep the original level.
                                // Usually users want the Result to be max volume.
                                await processAndSetFile(trimmedFile, sourceType);
                                setShowTrimmer(false);
                                setActiveTab('local');
                            }}
                            onCancel={() => setShowTrimmer(false)}
                        />
                    </div>
                ) : activeTab === 'online' ? (
                    // ... Online Search ...
                    <div className="p-4 flex-1 overflow-hidden min-h-[400px] flex flex-col">
                        <OnlineSoundSearch onDownload={handleOnlineSoundSelect} />
                    </div>
                ) : activeTab === 'youtube' ? (
                    // ... YouTube Tab ...
                    <div className="p-4 flex-1 overflow-hidden min-h-[400px] flex flex-col gap-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Paste YouTube URL..."
                                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                onChange={(e) => {
                                    const text = e.target.value;
                                    setYoutubeUrl(text);
                                    const match = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
                                    if (match && match[1]) setYoutubeId(match[1]);
                                    else setYoutubeId('');
                                }}
                                value={youtubeUrl}
                            />
                        </div>

                        {youtubeId ? (
                            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 shadow-lg">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="flex-1 bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-800 flex items-center justify-center flex-col gap-2 text-gray-500">
                                <span className="text-4xl text-red-500/20">▶</span>
                                <span className="text-sm">Paste a link to preview</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-900/50 rounded-xl border border-white/5">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400">Start Time (s)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={clipStart}
                                    onChange={(e) => setClipStart(parseFloat(e.target.value) || 0)}
                                    className="bg-black/30 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400">End Time (s)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={clipEnd}
                                    onChange={(e) => setClipEnd(parseFloat(e.target.value) || 0)}
                                    className="bg-black/30 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleYoutubeImport}
                            disabled={!youtubeId || isDownloading}
                            className={`
                                w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                                ${youtubeId && !isDownloading
                                    ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-500/20 hover:scale-[1.02]'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
                            `}
                        >
                            {isDownloading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    {downloadProgress > 0 ? `Downloading ${downloadProgress}%` : 'Downloading...'}
                                </span>
                            ) : (
                                <><span>✂️</span> Clip & Import Sound</>
                            )}
                        </button>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 flex-1 overflow-y-auto min-h-0">

                            {/* File Upload Area */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => !isProcessing && fileInputRef.current?.click()}
                                className={`
                                    border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                                    flex flex-col items-center gap-2
                                    ${isDragging
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : file
                                            ? 'border-green-500 bg-green-500/10'
                                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'}
                                    ${isProcessing ? 'opacity-50 cursor-wait' : ''}
                                `}
                            >
                                {isProcessing ? (
                                    <div className="flex flex-col items-center gap-2 py-4">
                                        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                        <span className="text-blue-400 text-sm font-bold animate-pulse">Normalizing Audio...</span>
                                    </div>
                                ) : file || (initialSound && !file) ? (
                                    <>
                                        <div className="text-2xl">✅</div>
                                        <div className="text-sm font-medium text-white truncate max-w-full">
                                            {file ? file.name : initialSound?.name + (initialSound?.path ? ' (Loaded)' : '')}
                                        </div>
                                        {file && <div className="text-xs text-green-400">Ready. {(file.size / 1024).toFixed(1)} KB</div>}

                                        <div className="flex gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowTrimmer(true);
                                                }}
                                                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs font-bold text-white flex items-center gap-1 z-10"
                                            >
                                                ✂️ Trim
                                            </button>
                                        </div>
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
                                    disabled={isProcessing}
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
                                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                                                onClick={() => setIsEmojiPickerOpen(false)}
                                            >
                                                <div
                                                    className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 grid grid-cols-6 gap-2 w-full max-w-sm animate-in zoom-in-95 duration-200"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
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
                                                            className="aspect-square flex items-center justify-center rounded-lg hover:bg-white/10 text-2xl transition-all hover:scale-110 active:scale-95"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
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

            <UpgradeModal
                isOpen={isUpgradeOpen}
                onClose={() => setIsUpgradeOpen(false)}
                onUpgrade={onUpgrade}
            />
        </div >
    );
};
