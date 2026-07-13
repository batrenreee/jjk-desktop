# 🌌 JJK Merkez (jjk-desktop)

The new data-driven and interactive desktop application version of the old static Jujutsu Kaisen fan site, built with **Tauri**.

## ✨ Features

*   📰 **News Hub:** Dynamic cards sorted by date, powered by `data/news.json`. Clicking a news item opens it in the system's default browser.
*   👤 **Character Encyclopedia:** 39 different characters; features search, faction (Sorcerer / Curse / Other) and status filtering, along with a detailed information modal.
*   🎯 **Character Quiz:** Step-by-step interactive quiz with progress bars and scoring. Results can be copied or easily shared via 𝕏 / WhatsApp.
*   📖 **Manga Tracker:** A tracking system where read arcs are stored in `localStorage`, displaying completion statistics.
*   🎨 **Advanced Theme System:** Light/Dark mode support and 4 different accent color options (user preferences are saved locally).
*   💫 **Modern UI:** Scroll-reveal animations and a responsive hamburger menu design for narrow windows/screens.

## 📁 Project Structure

```text
📦 jjk-desktop
├── 📂 src/                  # Frontend (served directly by Tauri)
│   ├── 📄 index.html        # Home page (news)
│   ├── 📄 karakterler.html  # Character grid and details
│   ├── 📄 manga.html        # Manga tracking system
│   ├── 📄 test.html         # Character quiz
│   ├── 📂 css/              # app.css (all styles and theme variables)
│   ├── 📂 js/               # app.js (common) + page-based modules
│   ├── 📂 data/             # JSON data for news, characters, and manga
│   └── 📂 img/, 📂 videos/  # Media files and hero video
├── 📂 src-tauri/            # Rust side (window management and bundling)
├── 📄 server.cjs            # Mini static server for browser preview only
└── 📄 setup-and-run.ps1     # Finishes setup after reboot and launches the app
```

## 🛠️ Requirements

*   **Node.js** (Must be installed)
*   **Rust / rustup** (Must be installed)
*   **Visual Studio 2022 C++ Build Tools** (Automatically installed by the `setup-and-run.ps1` script)
*   **WebView2** (Comes pre-installed on Windows 11)

## 🚀 Running the App

If required tools are missing during your first setup, run the `setup-and-run.ps1` file via PowerShell to automate the installation process.

To start the development window:
```bash
npm run tauri dev
```

To build installable `.exe` / `.msi` outputs:
```bash
npm run tauri build
```

## 👤 Developer

**Eren** — This is a fan project developed purely for educational and entertainment purposes.
