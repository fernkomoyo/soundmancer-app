
import React, { useState } from 'react';
import { OnlineSound } from '../types';

interface OnlineSoundSearchProps {
    onDownload: (sound: OnlineSound) => void;
}

export const OnlineSoundSearch: React.FC<OnlineSoundSearchProps> = ({ onDownload }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<OnlineSound[]>([]);
    const [loading, setLoading] = useState(false);
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResults([]);

        try {
            // @ts-ignore - IPC
            const sounds = await window.ipcRenderer.invoke('search-sounds', query);
            setResults(sounds);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const playPreview = (url: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        if (playingPreview === url) {
            setPlayingPreview(null);
            return;
        }

        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play();
        audio.onended = () => setPlayingPreview(null);
        audioRef.current = audio;
        setPlayingPreview(url);
    };

    const handleDownload = async (sound: OnlineSound) => {
        setDownloadingId(sound.id);
        await onDownload(sound);
        setDownloadingId(null);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search sounds (e.g., vine boom)..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-colors disabled:opacity-50"
                >
                    {loading ? '...' : 'Search'}
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {results.length === 0 && !loading && (
                    <div className="text-center text-gray-500 py-8">
                        {query ? 'No results found.' : 'Search for sounds above.'}
                    </div>
                )}

                {results.map((sound) => (
                    <div key={sound.id} className="bg-gray-800/50 p-3 rounded-lg flex items-center justify-between border border-transparent hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <button
                                onClick={() => playPreview(sound.url)}
                                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors shrink-0"
                            >
                                {playingPreview === sound.url ? '⏸' : '▶'}
                            </button>
                            <div className="min-w-0">
                                <div className="font-medium text-sm truncate text-white" title={sound.name}>{sound.name}</div>
                                {sound.description && <div className="text-xs text-gray-500 truncate">{sound.description}</div>}
                            </div>
                        </div>

                        <button
                            onClick={() => handleDownload(sound)}
                            disabled={downloadingId === sound.id}
                            className="ml-2 px-3 py-1.5 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded text-xs font-bold transition-all shrink-0 border border-green-600/20"
                        >
                            {downloadingId === sound.id ? '⬇...' : 'Add'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
