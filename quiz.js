
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


let data = [
  {{ country: "France", capital: "Paris", options: ["Paris", "Lyon", "Nice", "Marseille", "Toulouse"] }},
  {{ country: "Japan", capital: "Tokyo", options: ["Tokyo", "Osaka", "Kyoto", "Nagoya", "Sapporo"] }},
  {{ country: "Brazil", capital: "Brasília", options: ["São Paulo", "Brasília", "Rio de Janeiro", "Salvador", "Fortaleza"] }},
  {{ country: "Canada", capital: "Ottawa", options: ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary"] }},
  {{ country: "Australia", capital: "Canberra", options: ["Sydney", "Melbourne", "Canberra", "Brisbane", "Perth"] }}
];

let currentQuestion = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let questionOrder = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function loadQuestion() {
  const index = questionOrder[currentQuestion];
  const q = data[index];
  document.getElementById("country-name").textContent = q.country;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => handleAnswer(option, q.capital);
    optionsDiv.appendChild(btn);
  });
  document.getElementById("result").textContent = "";
  document.getElementById("next-btn").style.display = "none";
}

function handleAnswer(selected, correct) {
  const result = document.getElementById("result");
  if (selected === correct) {
    result.textContent = "✅ Correct!";
    result.style.color = "#4ade80";
    correctAnswers++;
  } else {
    result.textContent = `❌ Wrong. Correct answer: ${correct}`;
    result.style.color = "#f87171";
  }
  document.getElementById("next-btn").style.display = "inline-block";
  Array.from(document.getElementById("options").children).forEach(btn => {
    btn.disabled = true;
  });
}

document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < totalQuestions) {
    loadQuestion();
  } else {
    document.getElementById("quiz-section").innerHTML = `<h2>Quiz finished!</h2><p>Your score: ${correctAnswers} / ${totalQuestions}</p>`;
    const isGuest = localStorage.getItem("quiz_isGuest") === "true";
    const user = localStorage.getItem("quiz_username");
    if (!isGuest && user) {
      const userRef = db.collection("users").doc(user);
      userRef.get().then(doc => {
        if (doc.exists) {
          const data = doc.data();
          const prevHigh = data.highScore || 0;
          const history = data.history || [];
          history.push({ score: correctAnswers, total: totalQuestions, time: new Date().toISOString() });
          userRef.update({
            highScore: Math.max(prevHigh, correctAnswers),
            history: history
          });
        }
      });
    }
  }
});
