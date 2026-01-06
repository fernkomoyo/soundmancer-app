import React, { useState } from 'react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleVerify = () => {
        if (code.trim() === 'SOUNDMANCER2025') {
            setSuccess(true);
            setTimeout(() => {
                onUpgrade();
                onClose();
            }, 1500);
        } else {
            setError('Invalid code. Please check your donation message.');
        }
    };

    const handleDonate = () => {
        // Find existing window.open or use simple anchor
        window.open('https://ko-fi.com', '_blank'); // Replace with your actual Ko-fi URL
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="bg-gray-900/90 border border-yellow-500/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Gold Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="p-8 text-center relative z-10">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                        <span className="text-3xl">👑</span>
                    </div>

                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                        Unlock <span className="text-yellow-400">Pro Mode</span>
                    </h2>

                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        Support the development of SoundMancer and unlock unlimited access to all online features!
                    </p>

                    <div className="bg-black/40 rounded-xl p-4 mb-6 border border-white/5 text-left space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500">❌ Free</span>
                            <span className="text-gray-400 ml-auto">Limit 5 Online Sounds</span>
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="flex items-center gap-3 text-sm font-bold text-yellow-100">
                            <span className="text-green-400">✅ Pro</span>
                            <span className="ml-auto text-yellow-500 drop-shadow-sm">Unlimited Everything</span>
                        </div>
                    </div>

                    {!success ? (
                        <div className="space-y-4">
                            <button
                                onClick={handleDonate}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-yellow-500/20"
                            >
                                ❤️ Donate on Ko-fi
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-gray-900 px-2 text-gray-500">Already Donated?</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Unlock Code"
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                        setError('');
                                    }}
                                    className="flex-1 bg-black/50 border border-white/10 focus:border-yellow-500/50 rounded-xl px-4 py-2 text-white outline-none transition-colors text-center font-mono placeholder:font-sans"
                                />
                                <button
                                    onClick={handleVerify}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-medium transition-colors"
                                >
                                    Verify
                                </button>
                            </div>

                            {error && (
                                <p className="text-red-400 text-xs animate-in slide-in-from-top-1">{error}</p>
                            )}
                        </div>
                    ) : (
                        <div className="py-2 animate-in zoom-in spin-in-3 duration-500">
                            <h3 className="text-2xl font-bold text-green-400 mb-2">Unlocked! 🚀</h3>
                            <p className="text-gray-400 text-sm">Thank you for your support.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-black/20 border-t border-white/5 text-center">
                    <button onClick={onClose} className="text-xs text-gray-500 hover:text-white transition-colors">
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};
