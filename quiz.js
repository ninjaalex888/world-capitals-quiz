
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const nameStatus = document.getElementById("name-status");
  const passwordStatus = document.getElementById("password-status");
  const passwordGroup = document.getElementById("password-group");
  const passwordLabel = document.getElementById("password-label");
  const showPasswordToggle = document.getElementById("show-password");
  const guestCheckbox = document.getElementById("guest-mode");
  const startBtn = document.getElementById("start-btn");

  let isExistingUser = false;
  let isGuest = false;

  guestCheckbox.addEventListener("change", () => {
    isGuest = guestCheckbox.checked;
    if (isGuest) {
      usernameInput.disabled = true;
      passwordInput.disabled = true;
      passwordGroup.style.display = "none";
      nameStatus.textContent = "🧳 Playing as Guest";
      nameStatus.style.color = "#38bdf8";
      startBtn.disabled = false;
    } else {
      usernameInput.disabled = false;
      passwordInput.disabled = false;
      usernameInput.value = "";
      passwordInput.value = "";
      nameStatus.textContent = "";
      passwordStatus.textContent = "";
      passwordGroup.style.display = "none";
      startBtn.disabled = true;
    }
  });

  usernameInput.addEventListener("input", async () => {
    const username = usernameInput.value.trim();
    passwordInput.value = "";
    startBtn.disabled = true;
    passwordStatus.textContent = "";

    if (!username) {
      nameStatus.textContent = "";
      passwordGroup.style.display = "none";
      return;
    }

    const doc = await db.collection("users").doc(username).get();
    isExistingUser = doc.exists;

    if (isExistingUser) {
      nameStatus.textContent = "🔐 Username found, enter your password";
      nameStatus.style.color = "#facc15";
      passwordLabel.textContent = "Enter your password:";
    } else {
      nameStatus.textContent = "✅ Username available, create a password";
      nameStatus.style.color = "#4ade80";
      passwordLabel.textContent = "Create a password:";
    }

    passwordGroup.style.display = "block";
  });

  passwordInput.addEventListener("input", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username) return;

    if (isExistingUser) {
      const doc = await db.collection("users").doc(username).get();
      if (doc.exists && doc.data().password === password) {
        passwordStatus.textContent = "✅ Password correct";
        passwordStatus.style.color = "#4ade80";
        startBtn.disabled = false;
      } else {
        passwordStatus.textContent = "❌ Incorrect password";
        passwordStatus.style.color = "#f87171";
        startBtn.disabled = true;
      }
    } else {
      if (password.length >= 3) {
        passwordStatus.textContent = "✅ Password saved";
        passwordStatus.style.color = "#4ade80";
        startBtn.disabled = false;
      } else {
        passwordStatus.textContent = "❌ Too short (min 3 chars)";
        passwordStatus.style.color = "#f87171";
        startBtn.disabled = true;
      }
    }
  });

  showPasswordToggle.addEventListener("change", () => {
    passwordInput.type = showPasswordToggle.checked ? "text" : "password";
  });

  startBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!isGuest && (!username || !password)) return;

    if (!isGuest && !isExistingUser) {
      await db.collection("users").doc(username).set({
        password: password,
        highScore: 0,
        history: []
      });
    }

    localStorage.setItem("quiz_username", isGuest ? "Guest" : username);
    localStorage.setItem("quiz_isGuest", isGuest ? "true" : "false");

    // Proceed to show quiz
    document.getElementById("intro-card").style.display = "none";
    document.getElementById("quiz-section").style.display = "block";
    document.getElementById("country-name").textContent = "France";
    document.getElementById("options").innerHTML = `
      <button>Paris</button>
      <button>Lyon</button>
      <button>Marseille</button>
      <button>Bordeaux</button>
      <button>Nantes</button>
    `;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !startBtn.disabled) {
      startBtn.click();
    }
  });
});

// Simulate quiz score and save it to Firestore after quiz ends
function saveScore(score) {
  const username = localStorage.getItem("quiz_username");
  const isGuest = localStorage.getItem("quiz_isGuest") === "true";
  if (isGuest || !username) return;

  const userRef = db.collection("users").doc(username);
  userRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      const prevHigh = data.highScore || 0;
      const newHigh = Math.max(score, prevHigh);
      const history = data.history || [];
      history.push({ score: score, time: new Date().toISOString() });

      userRef.update({
        highScore: newHigh,
        history: history
      });
    }
  });
}

// Call this when the quiz ends with a score
// Example: saveScore(8); // if user got 8 questions right
