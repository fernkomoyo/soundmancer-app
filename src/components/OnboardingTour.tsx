
import React, { useState, useRef, useEffect } from 'react';

interface OnboardingStep {
    title: string;
    description: string;
    icon: string;
    color: string;
}

const STEPS: OnboardingStep[] = [
    {
        title: "Welcome to SoundMancer",
        description: "Your ultimate audio playground. Control sound effects and more with style.",
        icon: "👋",
        color: "from-blue-500 to-purple-500"
    },
    {
        title: "Play Your Sounds",
        description: "Click any button to play a sound instantly. Left-click plays to everyone, Right-click stops the sound.",
        icon: "🔊",
        color: "from-green-400 to-emerald-600"
    },
    {
        title: "Add & Discover",
        description: "Drag & drop audio files to add them, or use the '+' button to discover trending sounds online.",
        icon: "➕",
        color: "from-yellow-400 to-orange-500"
    },
    {
        title: "Mini Mode",
        description: "Gaming? shrink the app into a compact 'Steam Deck' style overlay using the Mini Mode button.",
        icon: "📱",
        color: "from-pink-500 to-rose-500"
    },
    {
        title: "Settings & Config",
        description: "Ensure your Microphone and Virtual Cable are set up correctly in the Settings menu for the best experience.",
        icon: "⚙️",
        color: "from-gray-400 to-gray-600"
    }
];

interface OnboardingTourProps {
    onComplete: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Tilt State
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            triggerCompletion();
        }
    };

    const triggerCompletion = () => {
        setShowConfetti(true);
        setTimeout(() => {
            setIsClosing(true);
            setTimeout(onComplete, 300);
        }, 1500); // Wait for confetti
    };

    const step = STEPS[currentStep];

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>

            {/* Confetti Container */}
            {showConfetti && <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div key={i} className="absolute animate-confetti" style={{
                        left: `${Math.random() * 100}%`,
                        top: '-10px',
                        backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${Math.random() * 2 + 1}s`
                    }} />
                ))}
            </div>}

            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full max-w-lg perspective-1000"
            >
                {/* 3D Card */}
                <div
                    className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden transition-transform duration-100 ease-out"
                    style={{
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                        transformStyle: 'preserve-3d'
                    }}
                >

                    {/* Dynamic Background Glow */}
                    <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${step.color} opacity-20 blur-[60px] transition-colors duration-500`} />

                    {/* Icon with 3D Pop */}
                    <div
                        className="text-7xl mb-6 relative z-10 transition-transform duration-300 drop-shadow-2xl"
                        style={{ transform: 'translateZ(50px)' }}
                    >
                        {step.icon}
                    </div>

                    {/* Content with 3D Pop */}
                    <div style={{ transform: 'translateZ(30px)' }}>
                        <h2 className="text-4xl font-black mb-4 text-white tracking-tight animate-in slide-in-from-bottom-2 duration-300" key={step.title + '_title'}>
                            {step.title}
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-sm mx-auto animate-in slide-in-from-bottom-4 duration-500" key={step.description + '_desc'}>
                            {step.description}
                        </p>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex gap-3 mb-8" style={{ transform: 'translateZ(20px)' }}>
                        {STEPS.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/20'}`}
                            />
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 w-full" style={{ transform: 'translateZ(40px)' }}>
                        <button
                            onClick={() => { setIsClosing(true); setTimeout(onComplete, 300); }}
                            className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleNext}
                            className={`
                                flex-[2] py-3.5 rounded-xl font-bold text-white shadow-lg transition-all group relative overflow-hidden
                                bg-gradient-to-r ${step.color}
                            `}
                        >
                            <span className="relative z-10 group-hover:scale-110 block transition-transform">
                                {currentStep === STEPS.length - 1 ? "Let's Rock! 🚀" : "Next"}
                            </span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>

                </div>
            </div>

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                @keyframes confetti {
                    0% { transform: translateY(0) rotate(0); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti {
                    animation: confetti 2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
