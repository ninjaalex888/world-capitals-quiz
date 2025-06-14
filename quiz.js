
const data = [
  {country: "Japan", capital: "Tokyo", cities: ["Osaka","Kyoto","Sapporo","Nagoya"]},
  {country: "Canada", capital: "Ottawa", cities: ["Toronto","Vancouver","Montreal","Calgary"]},
  {country: "Australia", capital: "Canberra", cities: ["Sydney","Melbourne","Brisbane","Perth"]},
  {country: "Brazil", capital: "Brasília", cities: ["Rio de Janeiro","São Paulo","Salvador","Fortaleza"]},
  {country: "Egypt", capital: "Cairo", cities: ["Alexandria","Giza","Luxor","Aswan"]},
  {country: "Germany", capital: "Berlin", cities: ["Munich","Hamburg","Frankfurt","Cologne"]},
  {country: "Kenya", capital: "Nairobi", cities: ["Mombasa","Kisumu","Nakuru","Eldoret"]},
  {country: "India", capital: "New Delhi", cities: ["Mumbai","Bengaluru","Kolkata","Chennai"]},
  {country: "Mexico", capital: "Mexico City", cities: ["Guadalajara","Monterrey","Cancún","Puebla"]},
  {country: "France", capital: "Paris", cities: ["Lyon","Marseille","Nice","Toulouse"]}
];

let username = "";
let score = 0;
let totalQuestions = Infinity;
let questionOrder = [];
let currentIndex = 0;

const countryEl = document.getElementById('country-name');
const optionsEl = document.getElementById('options');
const resultEl = document.getElementById('result');
const nextBtn = document.getElementById('next-btn');

// sounds
const cheer = new Audio('audio/correct.mp3');
const boo = new Audio('audio/wrong.mp3');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function askUsername() {
  username = prompt("Enter a username for the leaderboard:");
  if (!username) username = "Guest";
  // load leaderboard or init
  if (!localStorage.getItem('wcq_leaderboard')) {
    localStorage.setItem('wcq_leaderboard', JSON.stringify([]));
  }
  askQuizLength();
}

function askQuizLength() {
  let choice = prompt("How many questions would you like? (5, 10, 20, or type 'infinite')", "10");
  if (!choice) choice = "10";
  choice = choice.toLowerCase();
  if (choice === "infinite") {
    totalQuestions = Infinity;
  } else {
    const n = parseInt(choice);
    if (!isNaN(n) && n > 0) {
      totalQuestions = Math.min(n, data.length);
    }
  }
  questionOrder = [...Array(data.length).keys()];
  shuffle(questionOrder);
  loadQuestion();
}

function loadQuestion() {
  resultEl.textContent = "";
  nextBtn.style.display = "none";
  const item = data[questionOrder[currentIndex]];
  countryEl.textContent = item.country;
  const choices = [...item.cities, item.capital];
  shuffle(choices);
  optionsEl.innerHTML = "";
  choices.forEach(city => {
    const btn = document.createElement('button');
    btn.textContent = city;
    btn.onclick = () => selectAnswer(city, item.capital);
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(selected, correct) {
  const buttons = optionsEl.querySelectorAll('button');
  buttons.forEach(b => b.disabled = true);
  if (selected === correct) {
    resultEl.textContent = "✅ Correct!";
    resultEl.style.color = "#34d399";
    cheer.play();
    score++;
  } else {
    resultEl.textContent = `❌ Wrong! Correct answer: ${correct}`;
    resultEl.style.color = "#f87171";
    boo.play();
  }
  nextBtn.style.display = "block";
}

function saveScore() {
  const board = JSON.parse(localStorage.getItem('wcq_leaderboard')) || [];
  const existing = board.find(b => b.user === username);
  if (existing) {
    if (score > existing.score) existing.score = score;
  } else {
    board.push({user: username, score});
  }
  board.sort((a,b)=>b.score-a.score);
  localStorage.setItem('wcq_leaderboard', JSON.stringify(board));
  displayLeaderboard(board);
}

function displayLeaderboard(board) {
  const table = document.createElement('table');
  table.style.marginTop = '1rem';
  table.innerHTML = '<thead><tr><th>Rank</th><th>User</th><th>Score</th></tr></thead>';
  const tbody = document.createElement('tbody');
  board.slice(0,10).forEach((entry, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx+1}</td><td>${entry.user}</td><td>${entry.score}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  resultEl.parentElement.appendChild(table);
}

nextBtn.onclick = () => {
  currentIndex++;
  if (currentIndex >= totalQuestions) {
    countryEl.textContent = "Quiz Complete!";
    optionsEl.innerHTML = "";
    resultEl.textContent = `Your score: ${score}/${totalQuestions === Infinity ? questionOrder.length : totalQuestions}`;
    nextBtn.style.display = "none";
    if (totalQuestions !== Infinity) saveScore();
  } else {
    loadQuestion();
  }
};

document.addEventListener('DOMContentLoaded', askUsername);
