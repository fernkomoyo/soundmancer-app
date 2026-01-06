import { app, BrowserWindow, ipcMain, protocol, globalShortcut, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { autoUpdater } from 'electron-updater'
import YTDlpWrap from 'yt-dlp-wrap'

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
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
autoUpdater.logger = console;

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...');
});

autoUpdater.on('error', (err) => {
  console.error('Error in auto-updater: ', err);
});
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

  // Helper helper to read arbitrary files (for YT import)
  ipcMain.handle('read-file', async (_event, filePath) => {
    try {
      const buffer = await fs.promises.readFile(filePath);
      return buffer;
    } catch (err) {
      console.error("Failed to read file", err);
      throw err;
    }
  });

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
  ipcMain.handle('search-sounds', async (_event, { query, page = 1 }) => {
    try {
      const response = await fetch(`https://www.myinstants.com/api/v1/instants/?format=json&name=${encodeURIComponent(query)}&page=${page}`);
      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();

      const results = data.results.map((item: any) => ({
        id: item.id?.toString() || Math.random().toString(),
        name: item.name,
        url: item.sound,
        icon: item.image || undefined,
        color: item.color,
        description: item.description
      }));

      return {
        results,
        count: data.count,
        next: data.next
      };

    } catch (err) {
      console.error('Search failed:', err);
      // Return empty structure on error to avoid breaking frontend destructuring if expected
      return { results: [], count: 0, next: null };
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

  // YouTube Downloader (yt-dlp - Nuclear Option)
  const ytDlpPath = path.join(app.getPath('userData'), 'yt-dlp.exe');
  const ytDlpWrap = new YTDlpWrap(ytDlpPath);

  const ensureBinaries = async () => {
    const binDir = path.join(app.getPath('userData'), 'bin');
    if (!fs.existsSync(binDir)) await fs.promises.mkdir(binDir, { recursive: true });

    const ffmpegSrc = require('ffmpeg-static');
    const ffprobeSrc = require('ffprobe-static').path;

    const ffmpegDest = path.join(binDir, 'ffmpeg.exe');
    const ffprobeDest = path.join(binDir, 'ffprobe.exe');

    if (!fs.existsSync(ffmpegDest)) await fs.promises.copyFile(ffmpegSrc, ffmpegDest);
    if (!fs.existsSync(ffprobeDest)) await fs.promises.copyFile(ffprobeSrc, ffprobeDest);

    return binDir;
  };

  const ensureYtDlpBinary = async () => {
    if (!fs.existsSync(ytDlpPath)) {
      console.log("Downloading yt-dlp binary to", ytDlpPath);
      await YTDlpWrap.downloadFromGithub(ytDlpPath);
      console.log("yt-dlp binary downloaded!");
    }
  };

  ipcMain.handle('download-youtube-audio', async (_event, { url, start, end }) => {
    try {
      if (!url) throw new Error('No URL provided');

      await ensureYtDlpBinary();
      const binDir = await ensureBinaries();

      const tempDir = app.getPath('temp');
      const fileName = `yt_clip_${Date.now()}.mp3`;
      const filePath = path.join(tempDir, fileName);

      console.log("Executing yt-dlp for:", url, "Range:", start, "-", end);

      const args = [
        url,
        '-v',
        '--force-ipv4',
        '-f', 'bestaudio/best',
        '-x',
        '--audio-format', 'mp3',
        '--ffmpeg-location', binDir,
        '-o', filePath
      ];

      // Add partial download args if start/end provided
      if (start !== undefined && end !== undefined) {
        // yt-dlp format: *START-END (e.g. *10-20)
        args.push('--download-sections', `*${start}-${end}`);
        args.push('--force-keyframes-at-cuts');
      }

      console.log("Starting yt-dlp with args:", JSON.stringify(args));

      return new Promise((resolve, reject) => {
        const readableStream = ytDlpWrap.exec(args);

        readableStream.on('progress', (progress: any) => {
          console.log(`yt-dlp progress: ${progress.percent}%`);
        });

        readableStream.on('ytDlpEvent', (eventType: string, eventData: string) => {
          console.log(`[yt-dlp] ${eventType}: ${eventData}`);
        });

        readableStream.on('error', (error: Error) => {
          console.error('yt-dlp error:', error);
          reject(error);
        });

        readableStream.on('close', () => {
          console.log("yt-dlp process closed");
          resolve(filePath);
        });

        // readableStream.stdout is not exposed in types
        // readableStream.stdout.on('data', (data: any) => console.log(`[yt-dlp stdout] ${data.toString()}`));
        // readableStream.stderr.on('data', (data: any) => console.error(`[yt-dlp stderr] ${data.toString()}`));
      });

    } catch (err: any) {
      console.error('YouTube download failed:', err);
      const logPath = path.join(process.env.APP_ROOT, 'error_log.txt');
      const logMessage = `[${new Date().toISOString()}] Error: ${err.message}\nStack: ${err.stack}\n\n`;
      fs.appendFileSync(logPath, logMessage);
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

  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  ipcMain.handle('export-sound', async (_event, { name, path: soundPath }) => {
    try {
      const { filePath } = await dialog.showSaveDialog(win!, {
        title: `Save ${name}`,
        defaultPath: `${name}.mp3`,
        filters: [
          { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }
        ]
      });

      if (!filePath) return false;

      // Handle different path types
      let sourcePath = soundPath;
      if (sourcePath.startsWith('media://')) {
        sourcePath = sourcePath.replace('media://', '');
        sourcePath = decodeURI(sourcePath);
      } else if (sourcePath.startsWith('http')) {
        // Download if remote
        const response = await fetch(sourcePath);
        if (!response.ok) throw new Error('Download failed');
        const buffer = await response.arrayBuffer();
        await fs.promises.writeFile(filePath, Buffer.from(buffer));
        return true;
      }

      // Copy local file
      await fs.promises.copyFile(sourcePath, filePath);
      return true;

    } catch (err) {
      console.error('Export failed:', err);
      return false;
    }
  });
})
