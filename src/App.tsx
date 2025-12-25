import { useState, useRef, useEffect } from 'react';
import './App.css';
import { useAudioDevices } from './hooks/useAudioOutput';
import { SoundGrid } from './components/SoundGrid';
import { SoundModal } from './components/SoundModal';
import { SettingsModal } from './components/SettingsModal';
import { Sound } from './types';

function App() {
  const {
    outputs,
    inputs,
    selectedOutputId,
    setSelectedOutputId,
    selectedInputId,
    setSelectedInputId,
    refreshDevices
  } = useAudioDevices();

  const [sounds, setSounds] = useState<Sound[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isPassthroughEnabled, setIsPassthroughEnabled] = useState(true);
  const [monitorVolume, setMonitorVolume] = useState(1.0); // 0 to 1
  const [broadcastVolume, setBroadcastVolume] = useState(1.0); // 0 to 1
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSound, setEditingSound] = useState<Sound | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMiniMode, setIsMiniMode] = useState(false); // New State
  const micAudioRef = useRef<HTMLAudioElement | null>(null);

  // Derived state for categories
  const categories = ['All', ...new Set(sounds.map(s => s.category || 'Uncategorized'))];

  const filteredSounds = selectedCategory === 'All'
    ? sounds
    : sounds.filter(s => (s.category || 'Uncategorized') === selectedCategory);

  // Load Sounds on Startup
  useEffect(() => {
    const INITIAL_SOUNDS: Sound[] = [
      { id: '1', name: 'Vine Boom', path: 'https://www.myinstants.com/media/sounds/vine-boom.mp3', icon: '💥', category: 'Memes' },
      { id: '2', name: 'Bruh', path: 'https://www.myinstants.com/media/sounds/movie_1.mp3', icon: '🗿', category: 'Memes' },
      { id: '3', name: 'Airhorn', path: 'https://www.myinstants.com/media/sounds/airhorn.mp3', icon: '📣', category: 'Effects' },
    ];

    const loadSounds = async () => {
      if ((window as any).ipcRenderer) {
        try {
          const loadedSounds = await (window as any).ipcRenderer.invoke('load-sounds');
          if (loadedSounds && loadedSounds.length > 0) {
            setSounds(loadedSounds);
          } else {
            setSounds(INITIAL_SOUNDS);
          }
        } catch (err) {
          console.error("Failed to load sounds:", err);
          setSounds(INITIAL_SOUNDS);
        }
      } else {
        setSounds(INITIAL_SOUNDS);
      }
    };
    loadSounds();
  }, []);

  // Save Sounds Helper
  const updateSounds = (newSounds: Sound[]) => {
    setSounds(newSounds);
    if ((window as any).ipcRenderer) {
      (window as any).ipcRenderer.invoke('save-sounds', newSounds)
        .catch((err: any) => console.error("Failed to save sounds:", err));

      // Update shortcuts
      (window as any).ipcRenderer.invoke('update-global-shortcuts', newSounds)
        .catch((err: any) => console.error("Failed to update shortcuts:", err));
    }
  };

  // Passthrough Logic
  useEffect(() => {
    let stream: MediaStream | null = null;
    let audioEl: HTMLAudioElement | null = null;

    const startPassthrough = async () => {
      try {
        if (!isPassthroughEnabled || !selectedInputId) return;

        // 1. Get Mic Stream
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: selectedInputId } }
        });

        // 2. Play it via an Audio Element
        if (!micAudioRef.current) {
          micAudioRef.current = new Audio();
        }
        audioEl = micAudioRef.current;
        audioEl.srcObject = stream;

        // 3. Route to Virtual Cable (Broadcast Output)
        // CRITICAL: We do NOT want to hear ourselves on default speakers, so we ONLY setSinkId
        // If setSinkId is not supported or fails, it will play to default, which causes echo.
        // So we strictly try to sink it to the non-default output.
        if (selectedOutputId && selectedOutputId !== 'default') {
          // @ts-ignore
          if (typeof audioEl.setSinkId === 'function') {
            // @ts-ignore
            await audioEl.setSinkId(selectedOutputId);
          }
        } else {
          // If output is default, we probably shouldn't pass through to avoid feedback loop
          // or we must mute it locally.
          // For safety: if output is 'default', we don't play.
          console.warn("Passthrough only works when a specific output device (like Cable Input) is selected.");
          return;
        }

        await audioEl.play();

      } catch (err) {
        console.error("Passthrough error:", err);
      }
    };

    if (isPassthroughEnabled) {
      startPassthrough();
    } else {
      // Cleanup if disabled
      if (micAudioRef.current) {
        micAudioRef.current.pause();
        micAudioRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (micAudioRef.current) {
        micAudioRef.current.pause();
        micAudioRef.current.srcObject = null;
      }
    };
  }, [isPassthroughEnabled, selectedInputId, selectedOutputId]);


  // Global Shortcut Listener
  useEffect(() => {
    if (!(window as any).ipcRenderer) return;

    const handlePlaySound = (_event: any, soundId: string) => {
      console.log("Global shortcut triggered in renderer for:", soundId);
      // Dispatch a custom event that SoundButton components can listen to
      window.dispatchEvent(new CustomEvent(`trigger-sound-${soundId}`));
    };

    (window as any).ipcRenderer.on('play-sound', handlePlaySound);

    // Initial Registration
    (window as any).ipcRenderer.invoke('update-global-shortcuts', sounds);

    return () => {
      (window as any).ipcRenderer.off('play-sound', handlePlaySound);
    };
  }, [sounds]);


  const handleAddSoundClick = () => {
    setEditingSound(null);
    setIsModalOpen(true);
  };

  const handleEditSound = (sound: Sound) => {
    setEditingSound(sound);
    setIsModalOpen(true);
  };

  const handleDeleteSound = (id: string) => {
    const newSounds = sounds.filter(s => s.id !== id);
    updateSounds(newSounds);
  };

  const handleSaveSound = (soundData: Partial<Sound> & { file: File | null }) => {
    if (editingSound) {
      // Update Existing
      const updatedSounds = sounds.map(s => {
        if (s.id === editingSound.id) {
          // If file is provided, update path, else keep old
          let newPath = s.path;
          if (soundData.file) {
            if ((soundData.file as any).path) {
              newPath = `media://${(soundData.file as any).path}`;
            } else {
              newPath = URL.createObjectURL(soundData.file);
            }
          }

          return {
            ...s,
            name: soundData.name || s.name,
            icon: soundData.icon || s.icon,
            category: soundData.category || s.category,
            keybind: soundData.keybind, // Allow clearing keybind
            path: newPath
          };
        }
        return s;
      });
      updateSounds(updatedSounds);
    } else {
      // Create New
      if (soundData.file) {
        let filePath;
        // Check if running in Electron and we have the full path
        if ((soundData.file as any).path) {
          // Use our custom media protocol for local files
          filePath = `media://${(soundData.file as any).path}`;
        } else {
          // Fallback for browser testing (not persistent)
          filePath = URL.createObjectURL(soundData.file);
        }

        const newSound: Sound = {
          id: Date.now().toString(),
          name: soundData.name || 'New Sound',
          path: filePath,
          icon: soundData.icon || '🎵',
          category: soundData.category || 'Uncategorized',
          keybind: soundData.keybind
        };

        updateSounds([...sounds, newSound]);
        // Switch to the category of the new sound
        if (newSound.category) {
          setSelectedCategory(newSound.category);
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    const soundId = e.dataTransfer.getData('soundId');

    if (soundId) {
      const updatedSounds = sounds.map(sound => {
        if (sound.id === soundId) {
          return { ...sound, category: targetCategory };
        }
        return sound;
      });
      updateSounds(updatedSounds);
    }
  };

  const toggleMiniMode = () => {
    const newState = !isMiniMode;
    setIsMiniMode(newState);
    if ((window as any).ipcRenderer) {
      (window as any).ipcRenderer.invoke('toggle-mini-mode', newState);
    }
  };

  return (
    <div className={`flex flex-col h-screen bg-transparent text-white overflow-hidden transition-all duration-300 ${isMiniMode ? 'rounded-3xl' : ''}`}>
      {/* Header */}
      {!isMiniMode && (
        <header className="flex flex-col gap-5 p-6 glass-header relative z-20 drag">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 italic relative group">
                <img src="/logo-header.jpg" alt="Logo" className="w-12 h-12 rounded-xl shadow-lg border border-white/10 group-hover:scale-110 transition-transform duration-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 glow-text animate-pulse-slow pr-2">
                  SoundMancer
                </span>
              </h1>
              <button
                onClick={toggleMiniMode}
                className="no-drag text-[10px] font-bold tracking-wider uppercase bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 relative z-50 cursor-pointer backdrop-blur-md"
                style={{ WebkitAppRegion: 'no-drag' } as any}
              >
                Mini Mode
              </button>
            </div>

            <button
              onClick={() => {
                console.log("Settings button clicked");
                setIsSettingsOpen(true);
              }}
              className="p-3 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-90 group no-drag relative z-50 cursor-pointer"
              title="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-400 group-hover:rotate-90 transition-all duration-500 pointer-events-none drop-shadow-md">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide no-drag items-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, cat)}
                className={`
                        px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-out relative overflow-hidden group
                        ${selectedCategory === cat
                    ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'}
                    `}
              >
                <span className="relative z-10">{cat}</span>
                {selectedCategory === cat && (
                  <div className="absolute inset-0 bg-blue-400/10 blur-md pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </header>
      )}

      {isMiniMode && (
        <div className="drag h-8 bg-black/60 backdrop-blur-md flex items-center justify-between px-3 cursor-move z-50 border-b border-white/5">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Mini</span>
          <button
            onClick={toggleMiniMode}
            className="no-drag text-[10px] text-blue-400 hover:text-white transition-colors"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            EXPAND
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <SoundGrid
          sounds={filteredSounds}
          outputDeviceId={selectedOutputId}
          monitorVolume={monitorVolume}
          broadcastVolume={broadcastVolume}
          onAddSound={handleAddSoundClick}
          onDelete={handleDeleteSound}
          //@ts-ignore
          onEdit={handleEditSound}
          isCompact={isMiniMode}
        />
      </main>

      {/* Add Sound Modal */}
      <SoundModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSound}
        categories={categories.filter(c => c !== 'All')}
        initialSound={editingSound}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        inputs={inputs}
        outputs={outputs}
        selectedInputId={selectedInputId}
        setSelectedInputId={setSelectedInputId}
        selectedOutputId={selectedOutputId}
        setSelectedOutputId={setSelectedOutputId}
        isPassthroughEnabled={isPassthroughEnabled}
        setIsPassthroughEnabled={setIsPassthroughEnabled}
        monitorVolume={monitorVolume}
        setMonitorVolume={setMonitorVolume}
        broadcastVolume={broadcastVolume}
        setBroadcastVolume={setBroadcastVolume}
        refreshDevices={refreshDevices}
      />
    </div>
  );
}

export default App;
