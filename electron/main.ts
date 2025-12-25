import { app, BrowserWindow, ipcMain, protocol, globalShortcut } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { autoUpdater } from 'electron-updater'

// ... (imports remain mostly same, just added dialog and autoUpdater)

// const require = createRequire(import.meta.url) // Used implicitly for some node modules if needed
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ... (constants remain same)
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'SoundMancer',
    icon: path.join(process.env.VITE_PUBLIC, 'logo.jpg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    autoHideMenuBar: true, // Auto hide
  })

  win.setMenu(null); // Explicitly remove for Windows/Linux

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Auto-Updater Events
autoUpdater.on('update-available', () => {
  win?.webContents.send('update-available');
});

autoUpdater.on('update-downloaded', () => {
  win?.webContents.send('update-downloaded');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  // Check for updates immediately
  try {
    autoUpdater.checkForUpdatesAndNotify();
  } catch (err) {
    console.error('Auto-update check failed:', err);
  }

  // Register 'media' protocol to serve local files
  protocol.registerFileProtocol('media', (request, callback) => {
    const url = request.url.substr(8)
    const decodedUrl = decodeURI(url)
    callback({ path: decodedUrl })
  })

  createWindow()

  // IPC Handlers for Sound Persistence
  const soundsFile = path.join(app.getPath('userData'), 'sounds.json')

  ipcMain.handle('load-sounds', async () => {
    try {
      if (!fs.existsSync(soundsFile)) return []
      const data = await fs.promises.readFile(soundsFile, 'utf-8')
      return JSON.parse(data)
    } catch (err) {
      console.error('Failed to load sounds:', err)
      return []
    }
  })

  ipcMain.handle('save-sounds', async (_event, sounds) => {
    try {
      await fs.promises.writeFile(soundsFile, JSON.stringify(sounds, null, 2))
      return { success: true }
    } catch (err) {
      console.error('Failed to save sounds:', err)
      return { success: false, error: err }
    }
  })

  // Online Search Handler
  ipcMain.handle('search-sounds', async (_event, query) => {
    try {
      // Attempt to fetch more results by adding a limit param if supported, or just verify endpoint
      // NOTE: Unofficial API might ignore 'limit' or 'page' parameters.
      const response = await fetch(`https://www.myinstants.com/api/v1/instants/?format=json&name=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      return data.results.map((item: any) => ({
        id: item.id?.toString() || Math.random().toString(),
        name: item.name,
        url: item.sound,
        icon: item.image || undefined,
        color: item.color,
        description: item.description
      }));

    } catch (err) {
      console.error('Search failed:', err);
      return [];
    }
  });

  ipcMain.handle('toggle-mini-mode', async (_event, isMini) => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (isMini) {
        win.setSize(300, 400);
        win.setAlwaysOnTop(true, 'screen-saver');
      } else {
        win.setSize(1000, 800);
        win.setAlwaysOnTop(false);
      }
    }
  });

  ipcMain.handle('download-sound', async (_event, { url, fileName }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');

      const buffer = await response.arrayBuffer();
      const soundsDir = path.join(app.getPath('userData'), 'downloaded_sounds');

      if (!fs.existsSync(soundsDir)) {
        await fs.promises.mkdir(soundsDir, { recursive: true });
      }

      const safeName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const extension = path.extname(url) || '.mp3';
      const filePath = path.join(soundsDir, `${safeName}-${Date.now()}${extension}`);

      await fs.promises.writeFile(filePath, Buffer.from(buffer));
      return filePath;
    } catch (err) {
      console.error('Download failed:', err);
      throw err;
    }
  });

  // Global Shortcuts Handler
  ipcMain.handle('update-global-shortcuts', (_event, sounds: any[]) => {
    globalShortcut.unregisterAll();

    sounds.forEach(sound => {
      if (sound.keybind && sound.keybind.trim() !== '') {
        try {
          const ret = globalShortcut.register(sound.keybind, () => {
            if (win && !win.isDestroyed()) {
              win.webContents.send('play-sound', sound.id);
            }
          });
          if (!ret) {
            console.warn(`Registration failed for shortcut: ${sound.keybind}`);
          }
        } catch (err) {
          console.error(`Failed to register shortcut ${sound.keybind}:`, err);
        }
      }
    });
    return true;
  });

  // Manual Update Check IPC
  ipcMain.handle('check-for-updates', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  ipcMain.handle('quit-and-install', () => {
    autoUpdater.quitAndInstall();
  });
})
