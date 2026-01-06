export interface PatchNote {
    type: 'feature' | 'fix' | 'improvement' | 'announcement';
    title: string;
    description?: string;
}

export type PatchNotesMap = Record<string, PatchNote[]>;

export const PATCH_NOTES: PatchNotesMap = {
    "1.0.2": [
        {
            type: 'feature',
            title: 'Categories on Discover Menu 🌍',
            description: 'You can now browse sounds by categories in the online discovery menu.',
        }
    ],
    "1.0.1": [
        {
            type: 'feature',
            title: 'Mini Mode 🤏',
            description: 'Switch to a compact view to keep SoundMancer on top without taking up space.',
        },
        {
            type: 'improvement',
            title: 'YouTube Downloads 📺',
            description: 'Improved reliability of YouTube audio downloads.',
        },
        {
            type: 'fix',
            title: 'Settings Layout',
            description: 'Fixed alignment issues in the settings menu.',
        }
    ],
    // Example for future version
    /*
    "1.1.0": [
      {
        type: 'feature',
        title: 'Voice Modulator 🤖',
        description: 'Change your voice in real-time with new effects!',
      }
    ]
    */
};
