function openModal() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "flex";
}


function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.visibility = "visible";
  setTimeout(() => {
    toast.style.visibility = "hidden";
  }, 3000);
}


const firebaseConfig = {
  apiKey: "AIzaSyAi9sd4U0BLqvpOM3g5P2HdDzMjJxltrWY",
  authDomain: "worldcapitalsquiz.firebaseapp.com",
  projectId: "worldcapitalsquiz",
  storageBucket: "worldcapitalsquiz.appspot.com",
  messagingSenderId: "794094874571",
  appId: "1:794094874571:web:d292014542616ca553d04e",
  measurementId: "G-MKS0QNWVS4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

function signUp() {
  
  const messageBox = document.getElementById("authMessage");
  if (messageBox) messageBox.textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Signed up!"))
    .catch(error => alert(error.message));
}


function logIn() {
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Logged in!"))
    .catch(error => alert(error.message));
}


function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then(result => alert(`Signed in as ${result.user.displayName}`))
    .catch(error => alert("Google sign-in error: " + error.message));
}

function logOut() {
  signOut(auth).then(() => alert("Logged out!"));
}

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("userStatus").textContent = `Logged in as ${user.email}`;
    document.getElementById("authArea").style.display = "none";
    document.getElementById("quizContainer").style.display = "block";
  } else {
    document.getElementById("userStatus").textContent = "Not logged in";
    document.getElementById("authArea").style.display = "block";
    document.getElementById("quizContainer").style.display = "none";
  }
});

async function saveUserScore(score, total) {
  if (!auth.currentUser || window.isGuest) return;
  try {
    await addDoc(collection(db, "quizScores"), {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      score: score,
      total: total,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error("Error saving score: ", e);
  }
}

async function loadUserScores() {
  if (!auth.currentUser || window.isGuest) return;

  const q = query(
    collection(db, "quizScores"),
    where("uid", "==", auth.currentUser.uid)
  );

  const querySnapshot = await getDocs(q);
  let output = "<h3>Your Score History:</h3><ul style='padding-left: 20px'>";
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const timestamp = data.timestamp?.seconds ? new Date(data.timestamp.seconds * 1000).toLocaleString() : "Unknown time";
    output += `<li>${data.score}/${data.total} — ${timestamp}
      <button onclick="deleteUserScore('${docSnap.id}')">🗑️ Delete</button>
    </li>`;
  });
  output += "</ul>";
  document.getElementById("scoreHistory").innerHTML = output;
}

async function deleteUserScore(docId) {
  if (!auth.currentUser || window.isGuest) return;
  try {
    await deleteDoc(doc(db, "quizScores", docId));
    loadUserScores();
  } catch (e) {
    console.error("Failed to delete score:", e);
  }
}

function playAsGuest() {
  const quizContainer = document.getElementById("quizContainer");
  const authArea = document.getElementById("authArea");
  const userDisplay = document.getElementById("userDisplay");
  if (quizContainer) quizContainer.style.display = "block";
  if (authArea) authArea.style.display = "none";
  if (userDisplay) userDisplay.textContent = "Playing as Guest";
  window.isGuest = true;
}


// Make functions available globally for inline onclick handlers


window.signInWithGoogle = signInWithGoogle;
window.logOut = logOut;



function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function startQuiz() {
  try {
    const guest = window.isGuest || !firebase.auth().currentUser;
    const quizLength = parseInt(document.getElementById("numQuestions").value || "5");
    if (!quizLength || quizLength < 1) {
      showToast("Please enter a valid number of questions.");
      return;
    }

    document.getElementById("quizContainer").style.display = "block";
    document.getElementById("setupContainer").style.display = "none";

    // Start the quiz (placeholder logic)
    currentQuestionIndex = 0;
    loadQuestions(quizLength, guest);
  } catch (error) {
    console.error("Error starting quiz:", error);
    showToast("⚠️ Failed to start quiz. Check console for details.");
  }
}


function submitAnswer() {
  const userAnswer = document.getElementById("answerInput").value.trim().toLowerCase();
  const correctAnswer = selectedQuestions[currentQuestionIndex].capital.toLowerCase();

  if (userAnswer === correctAnswer) {
    score++;
    document.getElementById("resultText").textContent = "Correct!";
    document.getElementById("resultText").textContent =
      `Incorrect. The correct answer is ${selectedQuestions[currentQuestionIndex].capital}.`;
  }

  distractors.length = 4;
  distractors.push(correctCapital);
  currentQuestionIndex++;

  setTimeout(() => {
    document.getElementById("resultText").textContent = "";
    if (currentQuestionIndex < selectedQuestions.length || totalQuestions === 0) {
      if (currentQuestionIndex >= selectedQuestions.length && totalQuestions === 0) {
        selectedQuestions = shuffle([...questions]);
        currentQuestionIndex = 0;
      }
      showQuestion();
  resultText.textContent = `Incorrect. The correct answer is ${correct}.`;

  currentQuestionIndex++;

  setTimeout(() => {
    resultText.textContent = "";
    if (currentQuestionIndex < selectedQuestions.length || totalQuestions === 0) {
      if (currentQuestionIndex >= selectedQuestions.length && totalQuestions === 0) {
        selectedQuestions = shuffle([...questions]);
        currentQuestionIndex = 0;
      }
      showQuestion();
  } else {
    resultText.textContent = `Incorrect. The correct answer is ${correct}.`;
  }
      document.getElementById("quizArea").style.display = "none";
      alert(`Quiz finished! Your score: ${score}/${selectedQuestions.length}`);
      if (!window.isGuest) {
        saveUserScore(score, selectedQuestions.length);
      }
    }
}

window.submitAnswer = submitAnswer;
window.showQuestion = showQuestion;



function closeModal() {
  document.getElementById("loginModal").style.display = "none";
}


document.addEventListener("DOMContentLoaded", () => {
  if (!auth.currentUser) {
    playAsGuest();
  }

  document.getElementById("signUpBtn")?.addEventListener("click", signUp);
  document.getElementById("logInBtn")?.addEventListener("click", logIn);
  document.getElementById("googleBtn")?.addEventListener("click", signInWithGoogle);
  document.getElementById("guestBtn")?.addEventListener("click", playAsGuest);
});



function refreshNav(user) {
  const loginLink = document.getElementById("loginLogoutLink");
  const userDisplay = document.getElementById("userDisplay");
  const guestToggle = document.getElementById("guestToggle");

  const isLoggedIn = !!user;
  const isGuestMode = window.isGuest || !isLoggedIn;

  // Update user display
  userDisplay.textContent = isLoggedIn ? (user.displayName || user.email) : "Guest";

  // Update login/logout link
  if (isLoggedIn) {
    loginLink.textContent = "Logout";
  } else {
    resultText.textContent = `Incorrect. The correct answer is ${correct}.`;
  }
    loginLink.textContent = "Login";
  }

  // Guest toggle reflects state
  if (guestToggle) {
    guestToggle.checked = isGuestMode;
  }

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  // Button bindings
  $("startQuizBtn")?.addEventListener("click", startQuiz);
  $("signUpBtn")?.addEventListener("click", signUp);
  $("logInBtn")?.addEventListener("click", logIn);
  $("googleBtn")?.addEventListener("click", signInWithGoogle);
  $("guestBtn")?.addEventListener("click", playAsGuest);
  $("closeModalBtn")?.addEventListener("click", closeModal);

  // New nav bindings
  const loginLink = $("loginLogoutLink");
  loginLink?.addEventListener("click", (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      logOut();
  } else {
    resultText.textContent = `Incorrect. The correct answer is ${correct}.`;
  }
      openModal();
    }
  });

  $("guestToggle")?.addEventListener("change", (e) => {
    window.isGuest = e.target.checked;
    refreshNav(auth.currentUser);
    if (window.isGuest) {
      // Ensure quiz visible
      const quizContainer = document.getElementById("quizContainer");
      if (quizContainer) quizContainer.style.display = "block";
    }
  });

// Listen to Firebase auth changes
if (typeof auth !== "undefined") {
  auth.onAuthStateChanged((user) => {
    if (user) {
      window.isGuest = false;
    }
    refreshNav(user);
  });
}

// Ensure global guest default if no auth
if (typeof window.isGuest === "undefined") {
  window.isGuest = true;
}

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navRight = document.getElementById("navRight");
  hamburger?.addEventListener("click", () => {
    navRight.classList.toggle("show");
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});


// Keyboard navigation
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const activeModal = document.getElementById("loginModal");
    if (activeModal && activeModal.style.display === "flex") {
      logIn(); // Trigger login on Enter
    } else if (document.getElementById("startQuizBtn")) {
      document.getElementById("startQuizBtn").click();
    }
  } else if (event.key === "Escape") {
    const modal = document.getElementById("loginModal");
    if (modal && modal.style.display === "flex") {
      modal.style.display = "none";
    }
  }
});


let selectedOptionIndex = 0;

// Update focus and selection
function highlightOption(index) {
  const options = document.querySelectorAll('.option-button');
  options.forEach((btn, i) => {
    btn.classList.remove('selected-option');
    if (i === index) {
      btn.classList.add('selected-option');
      btn.focus();
    }
  });
}

document.addEventListener("keydown", function(event) {
  const options = document.querySelectorAll('.option-button');
  if (options.length > 0) {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      selectedOptionIndex = (selectedOptionIndex + 1) % options.length;
      highlightOption(selectedOptionIndex);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      selectedOptionIndex = (selectedOptionIndex - 1 + options.length) % options.length;
      highlightOption(selectedOptionIndex);
    } else if (event.key === "Enter") {
      options[selectedOptionIndex].click();
    }
  }
});


firebase.auth().onAuthStateChanged(function(user) {
  const loginLink = document.getElementById("loginLogoutLink");
  const guestCheckbox = document.getElementById("guestCheckbox");
  const userStatusSpan = document.getElementById("userStatus");

  const isGuest = guestCheckbox && guestCheckbox.checked;

  if (user && !isGuest) {
    loginLink.textContent = "Logout";
    loginLink.href = "#";
    loginLink.onclick = () => {
      firebase.auth().signOut();
      location.reload();
    };
    if (userStatusSpan) {
      userStatusSpan.textContent = user.email;
    }
  } else {
    loginLink.textContent = "Login";
    loginLink.href = "login.html";
    loginLink.onclick = null;
    if (userStatusSpan) {
      userStatusSpan.textContent = "Guest";
    }
  }
});

// Handle guest checkbox toggle
const guestCheckbox = document.getElementById("guestCheckbox");
if (guestCheckbox) {
  guestCheckbox.addEventListener("change", () => {
    location.reload();
  });
}






window.logIn = logIn;
window.signUp = signUp;
window.startQuiz = startQuiz;
window.playAsGuest = playAsGuest;

document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  $('logInBtn')?.addEventListener('click', logIn);
  $('signUpBtn')?.addEventListener('click', signUp);
  $('startQuizBtn')?.addEventListener('click', startQuiz);
});



function saveScore(score, total) {
  const user = firebase.auth().currentUser;
  const quizData = {
    score: score,
    total: total,
    timestamp: new Date().toISOString()
  };

  if (user) {
    // Store in Firestore under this user
    const db = firebase.firestore();
    db.collection("users").doc(user.uid).collection("quizHistory").add(quizData)
      .then(() => console.log("Score saved to Firestore"))
      .catch((error) => console.error("Error saving score:", error));
  } else {
    // Store in localStorage
    let guestScores = JSON.parse(localStorage.getItem("guestScores")) || [];
    guestScores.push(quizData);
    localStorage.setItem("guestScores", JSON.stringify(guestScores));
    console.log("Score saved locally for guest");
  }
}


function showQuestion(questionObj) {
  const questionEl = document.getElementById("questionText");
  const optionsEl = document.getElementById("optionsContainer");
  const imgEl = document.getElementById("capitalImg");

  // Clear previous
  optionsEl.innerHTML = "";
  questionEl.textContent = `Which of the following is the capital of ${questionObj.country}?`;

  // Prepare 5 options (capital + 4 distractors)
  const options = shuffle([questionObj.capital, ...questionObj.distractors]).slice(0, 5);

  options.forEach(city => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = city;
    btn.addEventListener("click", () => submitAnswer(city, questionObj.capital, questionObj));
    optionsEl.appendChild(btn);
  });

  // Set capital city image
  if (imgEl) {
    imgEl.src = `https://source.unsplash.com/400x250/?${encodeURIComponent(questionObj.capital + " skyline")}`;
  }
}

