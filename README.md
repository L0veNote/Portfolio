<div align="center">

# ✨ Portfolio

<img src="https://files.catbox.moe/gsgan6.png" width="100%">

<br>

**A stunning portfolio that auto-fetches your GitHub repos**

*Orange gradients • Smooth animations • Last.fm integration*

<br>

[![Portfolio](https://img.shields.io/badge/Portfolio-L0veNote-ff6b35?style=for-the-badge&logo=github&logoColor=white)](https://github.com/L0veNote)
[![License](https://img.shields.io/badge/License-MIT-fbbf24?style=for-the-badge)](LICENSE)

<img src="https://files.catbox.moe/gsgan6.png" width="100%">

</div>

<br>

## 🌸 Features

<table>
<tr>
<td width="50%">

### ⚡ Auto-Fetch
- GitHub profile & avatar
- All public repositories (up to 100)
- Stars, forks & language stats
- Smart filtering (excludes forks, README-only repos)

</td>
<td width="50%">

### 🎵 Last.fm Integration
- Now Playing / Last Played widget
- Real-time track updates (30s refresh)
- Album art display
- Total scrobble counter

</td>
</tr>
<tr>
<td width="50%">

### 🎨 Design
- Orange gradient theme with CSS variables
- Glassmorphism card effects
- Particle canvas background
- Cursor glow effect (desktop)
- Grid & noise overlays

</td>
<td width="50%">

### ✨ Animations
- Floating gradient orbs
- Smooth scroll reveals (IntersectionObserver)
- Card hover effects with glow
- Animated stat counters
- Loading spinners

</td>
</tr>
</table>

<br>

## 📑 Sections

- **Hero** — Profile card with GitHub avatar, bio, location, join date & stats (repos, stars, languages)
- **Projects** — Auto-populated grid of up to 12 repos with language, stars, forks, live preview links & archived tags
- **About** — Bio text, dynamically generated skills/languages grid, Last.fm Now Playing widget
- **Navigation** — Fixed navbar with smooth scroll, mobile hamburger menu

<img src="https://files.catbox.moe/gsgan6.png" width="100%">

<br>

## 🚀 Quick Start

```bash
# Clone it
git clone https://github.com/L0veNote/Portfolio.git

# Open it
cd Portfolio && npx serve
```

<br>

## ⚙️ Configuration

Edit `script.js`:

```javascript
// GitHub
const GITHUB_USERNAME = 'L0veNote';

// Last.fm
const LASTFM_USERNAME = 'Yurikae';
const LASTFM_API_KEY = 'your-api-key';
```

> 💡 Get a free Last.fm API key at [last.fm/api](https://www.last.fm/api/account/create)

<br>

<img src="https://files.catbox.moe/gsgan6.png" width="100%">

<br>

## 📁 Structure

```
Portfolio/
├── 📄 index.html    → Structure & layout (Outfit, Space Grotesk, Fira Code fonts)
├── 🎨 style.css     → Styles, animations & responsive breakpoints
├── ⚡ script.js     → GitHub & Last.fm API integrations
└── 📖 README.md     → Documentation
```

<br>

## 🎨 Customization

<details>
<summary><b>Change Colors</b></summary>

Edit CSS variables in `style.css`:

```css
:root {
    --orange-500: #f97316;
    --orange-600: #ea580c;
    --amber-400: #fbbf24;
    --bg-primary: #0a0a0b;
    --bg-secondary: #111113;
    --text-primary: #fafafa;
    --text-secondary: #a1a1aa;
}
```

</details>

<details>
<summary><b>Change Fonts</b></summary>

Update Google Fonts in `index.html`:
- **Outfit** → Body text
- **Space Grotesk** → Headings
- **Fira Code** → Code/monospace elements

</details>

<details>
<summary><b>Add Language Colors</b></summary>

Edit `LANGUAGE_COLORS` in `script.js` to add colors for additional programming languages.

</details>

<br>

<img src="https://files.catbox.moe/gsgan6.png" width="100%">

<br>

<div align="center">

**Made with 💜 by [L0veNote](https://github.com/L0veNote)**

*If you use this template, a star ⭐ would be lovely~*

<img src="https://files.catbox.moe/gsgan6.png" width="100%">

</div>
