# Lynn Keto Diet

Private 28-day keto tracker for Lynn Hamad. Static HTML/JS app with offline support (PWA).

**Live:** https://diet.lynnhamad.com

## Features
- 🏠 Daily dashboard (water, meals, streak, day-of-28)
- ⚖️ Weight tracking with chart & IBW goal
- 📅 28-day adherence heatmap
- 🍳 11 breakfast / 🍽️ 20 lunch / 🌙 11 dinner / 🥤 7+6 snack options
- 🎲 Random meal picker per category
- ❤️ Favorites
- 🛒 Interactive shopping list
- 📸 Photo diary (local-only)
- 📤 Export/import JSON backup
- 📱 Installable as PWA (offline-capable)

## Stack
Pure HTML/CSS/JS, no build step. Chart.js from CDN. All data stays in `localStorage`.

## Deploy
GitHub Pages auto-deploys from `main` branch. `CNAME` points to `diet.lynnhamad.com`.
