import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="glass-panel rounded-2xl p-8 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative Glow */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] pointer-events-none ${isDestructive ? 'bg-red-500/20' : 'bg-blue-500/20'}`} />

                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 mb-6 font-medium">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all
                            ${isDestructive
                                ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-500/25'
                                : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/25'}
                        `}
                        autoFocus
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
