# 🌍 World Capitals Quiz

A lightweight, single-page quiz that helps you learn the capitals of every country in the world.  
Choose between:

| Mode | Description |
|------|-------------|
| **Daily Challenge** | One question per day. You get **one** shot; result is saved as 1/1 or 0/1. |
| **Practice** | Never-ending quiz that shuffles all countries. Score is updated after every answer. |
| **Score History** | Browser-local table listing all of your attempts (date, mode, score). |

---

## 🚀 Quick Start (Local)

```bash
# 1. Clone the repo
git clone https://github.com/your-username/world-capitals-quiz.git
cd world-capitals-quiz

# 2. Start a tiny web server (Python ≥ 3.7)
python -m http.server 8000
# or: py -m http.server 8000   (on Windows)

# 3. Open your browser
http://localhost:8000/index.html        # Daily Challenge
http://localhost:8000/practice.html     # Infinite Practice
```

> **Why run a server?**  
> Loading `index.html` directly from the file system blocks the `fetch()` of `countries_200.json`.  
> A local HTTP server solves that.

---

## 🌐 Deploying to GitHub Pages

1. **Push** this repo to GitHub (`main` branch or any).  
2. In **Repository → Settings → Pages**  
   - Source: **Deploy from branch**  
   - Branch: `main` (or `gh-pages`)  
3. Save — GitHub will build and give you a **Live URL** like  
   `https://your-username.github.io/world-capitals-quiz`

Now anyone can play at that link:

```
https://your-username.github.io/world-capitals-quiz/
```

*(GitHub Pages serves static files automatically — no extra build step needed.)*

---

## 🔑 Features

- **Dynamic UI** – elements are created on-the-fly; zero hard-coded markup dependencies.  
- **Visual feedback** – green for correct, red for incorrect, plus skyline photo.  
- **Country fact** – a brief fact (or default capital statement) after each answer.  
- **Local persistence** – all scores live in `localStorage`; no backend required.  
- **Mobile-friendly design** – responsive buttons & images.  

---

## 📂 Project Structure

```
📁 world-capitals-quiz
│
├─ index.html          # Daily Challenge
├─ practice.html       # Infinite Practice
├─ scores.html         # Score History
├─ script.js           # All quiz logic
├─ style.css           # Styling (CSS variables)
└─ countries_200.json  # Country dataset (capital, distractors, skyline URL)
```

---

## ✨ Ideas for future upgrades

| Enhancement | Description |
|-------------|-------------|
| 🇺🇳 Flag icons | Flag CDN for quick SVGs or PNGs. |
| ⏱ Timed mode | Countdown per question for extra pressure. |
| 🔥 Streaks | Track consecutive daily wins. |
| 🎉 Confetti | Animation on correct daily answer. |
| 📈 Charts | Visualize progress with Chart.js. |

---

## 🖋 License

MIT – feel free to fork, remix, and learn.  
Credits to Unsplash photographers for skyline images.