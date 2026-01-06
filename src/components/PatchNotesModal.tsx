import React from 'react';
import { PatchNote } from '../data/patchNotes';

interface PatchNotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    version: string;
    notes: PatchNote[];
}

export const PatchNotesModal: React.FC<PatchNotesModalProps> = ({ isOpen, onClose, version, notes }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="bg-gray-900/90 border border-blue-500/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            What's New <span className="text-blue-400 text-lg font-mono opacity-80">v{version}</span>
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Thanks for using SoundMancer!</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    {notes.map((note, index) => (
                        <div key={index} className="group">
                            <div className="flex items-start gap-4">
                                <div className={`
                                    p-2 rounded-lg shrink-0 mt-1
                                    ${note.type === 'feature' ? 'bg-green-500/10 text-green-400' : ''}
                                    ${note.type === 'fix' ? 'bg-red-500/10 text-red-400' : ''}
                                    ${note.type === 'improvement' ? 'bg-blue-500/10 text-blue-400' : ''}
                                    ${note.type === 'announcement' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                                `}>
                                    {note.type === 'feature' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    )}
                                    {note.type === 'fix' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                                    )}
                                    {note.type === 'improvement' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                                    )}
                                    {note.type === 'announcement' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">{note.title}</h3>
                                    {note.description && (
                                        <p className="text-gray-400 text-sm leading-relaxed">{note.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Awesome!
                    </button>
                </div>
            </div>
        </div>
    );
};
