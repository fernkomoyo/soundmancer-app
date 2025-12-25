export interface Sound {
    id: string;
    name: string;
    path: string; // File path
    icon?: string; // Emoji or image URL
    color?: string; // Button color
    volume?: number; // 0-1
    category?: string;
    keybind?: string;
    isFavorite?: boolean;
}

export interface OnlineSound {
    id: string;
    name: string;
    url: string;
    icon?: string;
    description?: string;
    color?: string;
}
