# 🌍 World Capitals Quiz

A lightweight quiz for learning the capital of every country: all 195 of them (the 193 UN members plus Vatican City and Taiwan).

**Play it here: https://ninjaalex888.github.io/world-capitals-quiz/**

| Page | What it does |
|------|--------------|
| **Daily Challenge** | One country a day, the same for everyone on the same difficulty. You get one try. |
| **Practice** | Endless questions at your chosen difficulty, with a running score. |
| **Score History** | Your results, saved in your browser. |
| **Settings** | Pick a difficulty, turn the country flag on or off, show the capital city photo before or after you answer (or not at all), and pick a light, dark or system theme. |

### Difficulty

| Level | Countries | Wrong answers |
|-------|-----------|---------------|
| Easy | 50 well-known countries | Any capital from the Easy list |
| Medium (default) | 106, including classic trick questions like Australia and Turkey | Any capital from the Medium list |
| Hard | 153 | Mostly capitals from the same region |
| Very hard | All 195 | Mostly capitals from the same region |

Each country in `countries.json` has a `level` from 1 to 4. A difficulty includes every level up to its own, so moving a country to a different level is a one-line edit.

Each question shows the country's flag and a photo of its capital. A famous view such as the Eiffel Tower can give the answer away, so in Settings you can move the photo to after you answer, or turn it off.

---

## 🚀 Run it locally

The pages load `countries.json` with `fetch()`, which browsers block when you open the HTML file directly, so run a small local web server:

```bash
git clone https://github.com/ninjaalex888/world-capitals-quiz.git
cd world-capitals-quiz
py -m http.server 8000        # Windows (or: python -m http.server 8000)
```

Then open http://localhost:8000. On Windows you can also double-click `start_dev_server.bat`.

---

## 🌐 Hosting (GitHub Pages)

The site is hosted for free on GitHub Pages and served straight from the `main` branch. There's no build step. Whatever is on `main` goes live within a minute or two of each push.

To set it up on a fork: **Settings → Pages → Source: Deploy from a branch → `main` / root**.

---

## 📂 Project structure

```
├─ index.html          # Daily Challenge
├─ practice.html       # Endless practice
├─ scores.html         # Score history
├─ settings.html       # Flag / photo / theme settings
├─ script.js           # All quiz logic
├─ style.css           # Styling (light + dark themes)
├─ countries.json      # 195 countries: capital, ISO code, region, difficulty level, photo link
├─ flags/              # Flag images (xx.png, by ISO country code)
├─ favicon.ico
└─ start_dev_server.bat
```

Everything is stored in the browser's `localStorage` (scores, today's daily result, settings). There's no backend and no accounts.

---

## ✨ Ideas for future upgrades

| Enhancement | Description |
|-------------|-------------|
| ⏱ Timed mode | Countdown per question for extra pressure. |
| 🔥 Streaks | Track consecutive daily wins. |
| 🗺 Regions | Practise one continent at a time (each country already has a `region`). |
| 🎉 Confetti | Animation on a correct daily answer. |
| 📈 Charts | Visualize progress over time. |

---

## 🖋 License & credits

Code: MIT. Feel free to fork, remix, and learn.

- Flag images from [flagcdn.com](https://flagcdn.com) (Flagpedia).
- City photos are loaded from [Wikimedia Commons](https://commons.wikimedia.org). Each photo links to its Commons page with the author and license.
