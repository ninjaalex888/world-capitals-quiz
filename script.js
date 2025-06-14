
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
