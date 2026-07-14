# 🌌 JJK Merkez (jjk-desktop)

The new data-driven and interactive desktop application version of the old static Jujutsu Kaisen fan site, built with **Tauri**.

## ✨ Features

*   📰 **Live News Hub:** Detailed editorial articles are combined with an automatically refreshed feed from Crunchyroll News, Anime News Network, and MyAnimeList. The app validates remote data, caches the last successful feed for seven days, keeps a bundled offline fallback, and opens articles inside the app.
*   👤 **Character Wiki:** 129 character and entity profiles spanning the main manga through its finale; complete local portrait coverage, face-focused responsive framing, Turkish-aware search, category/affiliation/status filters, spoiler controls, techniques, weaknesses, story summaries, and detailed tabbed articles.
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
├── 📂 scripts/              # Live-news RSS collector and validation
├── 📂 .github/workflows/    # Scheduled three-hour news refresh
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

To refresh the live-news feed manually:

```bash
npm run news:update
```

The `Haber akışını güncelle` GitHub Actions workflow runs at minute 17 every three hours and commits `src/data/live-news.json` only when the validated feed changes. The desktop app checks the published feed at startup and whenever the user selects **Haberleri yenile**.

## 👤 Developer

**Eren** — This is a fan project developed purely for educational and entertainment purposes.
