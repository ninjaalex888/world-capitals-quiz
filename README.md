# 🌍 World Capitals Quiz

Welcome to the **World Capitals Quiz** — a fun and challenging way to test your knowledge of countries and their capital cities!

### ✨ Features
- 🧠 Randomized quizzes with 45+ countries and growing
- 🟣 Sleek Vikings-inspired color theme
- 🧑 Guest and named-user support
- 🔐 Password-protected user scoring
- 📊 Leaderboard with stored historical scores
- 🌐 High-resolution political-style world map
- 📱 Fully mobile responsive

### 🚀 Get Started
1. Clone or download the repo.
2. Open `index.html` in your browser — or deploy via GitHub Pages.
3. Enter a username (new or returning), password, and quiz length.
4. Compete to rise to the top of the leaderboard!

### 🛠 Firebase Setup (Optional)
To enable persistent user score storage:
- Set up a Firebase project
- Enable Firestore
- Paste your config into the `index.html` Firebase block
- Set temporary test rules in Firestore:
```js
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{username} {
      allow read, write: if request.resource.data.password == resource.data.password;
    }
  }
}
```

---

Made with ❤️ by **ninjaalex888**  
