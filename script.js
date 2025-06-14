const questions = [
    { country: "France", capital: "Paris" },
    { country: "Japan", capital: "Tokyo" },
    { country: "Brazil", capital: "Brasilia" },
    { country: "Canada", capital: "Ottawa" },
    { country: "Australia", capital: "Canberra" },
    { country: "Ghana", capital: "Accra" },
    { country: "Norway", capital: "Oslo" },
    { country: "South Africa", capital: "Pretoria" },
    { country: "Thailand", capital: "Bangkok" },
    { country: "Argentina", capital: "Buenos Aires" }
];

let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let selectedQuestions = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    const dropdownValue = parseInt(document.getElementById("questionCount").value);
    const customValue = parseInt(document.getElementById("customCount").value);
    totalQuestions = customValue || dropdownValue;

    selectedQuestions = shuffle([...questions]);
    if (totalQuestions > 0 && totalQuestions <= selectedQuestions.length) {
        selectedQuestions = selectedQuestions.slice(0, totalQuestions);
    }

    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("quizArea").style.display = "block";
    document.getElementById("resultText").textContent = "";
    showQuestion();
}

function showQuestion() {
    const question = selectedQuestions[currentQuestionIndex];
    document.getElementById("questionText").textContent =
        `What is the capital of ${question.country}?`;
    document.getElementById("answerInput").value = "";
    document.getElementById("answerInput").focus();
}

function submitAnswer() {
    const userAnswer = document.getElementById("answerInput").value.trim().toLowerCase();
    const correctAnswer = selectedQuestions[currentQuestionIndex].capital.toLowerCase();

    if (userAnswer === correctAnswer) {
        score++;
        document.getElementById("resultText").textContent = "Correct!";
    } else {
        document.getElementById("resultText").textContent =
            `Incorrect. The correct answer is ${selectedQuestions[currentQuestionIndex].capital}.`;
    }

    currentQuestionIndex++;

    setTimeout(() => {
        document.getElementById("resultText").textContent = "";
        if (currentQuestionIndex < selectedQuestions.length || totalQuestions === 0) {
            if (currentQuestionIndex >= selectedQuestions.length && totalQuestions === 0) {
                selectedQuestions = shuffle([...questions]);
                currentQuestionIndex = 0;
            }
            showQuestion();
        } else {
            document.getElementById("quizArea").style.display = "none";
            saveUserScore(score, selectedQuestions.length);
            alert(`Quiz finished! Your score: ${score}/${selectedQuestions.length}`);
        }
    }, 1500);
}

function handleEnter(event) {
    if (event.key === "Enter") {
        submitAnswer();
    }
}


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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

function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => alert("Signed up!"))
    .catch(error => alert(error.message));
}

function logIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => alert("Logged in!"))
    .catch(error => alert(error.message));
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


import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const db = getFirestore(app);

async function saveUserScore(score, total) {
  if (!auth.currentUser) return;
  try {
    await addDoc(collection(db, "quizScores"), {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      score: score,
      total: total,
      timestamp: serverTimestamp()
    });
    console.log("Score saved to Firestore.");
  } catch (e) {
    console.error("Error saving score: ", e);
  }
}


import { query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

async function loadUserScores() {
  if (!auth.currentUser) return;

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
  if (!auth.currentUser) return;
  try {
    await deleteDoc(doc(db, "quizScores", docId));
    loadUserScores();
  } catch (e) {
    console.error("Failed to delete score:", e);
  }
}
