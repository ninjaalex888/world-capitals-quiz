
document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const nameStatus = document.getElementById("name-status");
  const passwordGroup = document.getElementById("password-group");
  const passwordLabel = document.getElementById("password-label");
  const passwordStatus = document.getElementById("password-status");
  const guestCheckbox = document.getElementById("guest-mode");
  const showPasswordToggle = document.getElementById("show-password");
  const startBtn = document.getElementById("start-btn");

  let isExistingUser = false;
  let isGuest = false;

  guestCheckbox.addEventListener("change", () => {
    isGuest = guestCheckbox.checked;
    if (isGuest) {
      usernameInput.disabled = true;
      passwordInput.disabled = true;
      passwordGroup.style.display = "none";
      nameStatus.textContent = "🧳 Guest mode enabled";
      passwordStatus.textContent = "";
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
    passwordStatus.textContent = "";
    startBtn.disabled = true;

    if (!username) {
      nameStatus.textContent = "";
      passwordGroup.style.display = "none";
      return;
    }

    try {
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
    } catch (err) {
      console.error("Error checking username:", err);
    }
  });

  passwordInput.addEventListener("input", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      startBtn.disabled = true;
      return;
    }

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

    if (isGuest) {
      localStorage.setItem("quiz_username", "Guest");
      localStorage.setItem("quiz_isGuest", "true");
    } else {
      if (!username || !password) return;

      if (!isExistingUser) {
        await db.collection("users").doc(username).set({
          password: password,
          highScore: 0,
          history: []
        });
      }

      localStorage.setItem("quiz_username", username);
      localStorage.setItem("quiz_isGuest", "false");
    }

    document.getElementById("intro-card").style.display = "none";
    document.getElementById("quiz-section").style.display = "block";
    document.getElementById("country-name").textContent = "France";
    document.getElementById("options").innerHTML = `
      <button>Paris</button>
      <button>Lyon</button>
      <button>Marseille</button>
      <button>Nice</button>
      <button>Toulouse</button>
    `;
  });
});
