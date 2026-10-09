# Lynn's Plan

Private diet & workout tracker for Lynn Hamad (PCOS + insulin resistance plan). Static HTML/JS app with offline support (PWA). Bilingual (English / Arabic).

**Live:** https://diet.lynnhamad.com

## Features
- Today: the day's 5 meals from the 7-day plan (tap to mark eaten), daily checklist score, streak
- Water (250 ml glasses, 2-2.5 L goal), workout / recovery / rest, metformin, sleep, post-meal walks
- Nutrition estimate (kcal, protein, carbs, fat, fiber) vs. daily targets, with "extra portion" logging when a day falls short
- 7-day meal plan with per-meal and per-day estimates
- Food substitutions (protein, carbs, fats, fruit, vegetables)
- Weekly grocery list + Sunday / Wednesday meal prep checklists
- Workout schedule (Doha Dergham 22-min full body) with weekly tracking
- Weight + waist tracking with charts and a 2-4 week waist-check reminder
- Month calendar colored by goals met; tap a day to edit it
- Your own product labels (labneh, cottage cheese, protein powder, milk, bread) for better estimates
- Export / import JSON backup

## Data
All plan content lives in `data.js`. Nutrition values are typical label estimates, not verified. User data stays in `localStorage` (`lynn-plan-v1`).

## Stack
Pure HTML/CSS/JS, no build step. Chart.js from CDN.

## Deploy
GitHub Pages auto-deploys from `main`. `CNAME` points to `diet.lynnhamad.com`. Bump `CACHE` in `sw.js` and the `?v=` query strings in `index.html` on every release.
