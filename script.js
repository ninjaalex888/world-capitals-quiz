let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

const countryDB = [
  {
    country: "France",
    capital: "Paris",
    cities: ["Lyon", "Marseille", "Nice", "Bordeaux", "Paris"],
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_Night.jpg"
  },
  {
    country: "Japan",
    capital: "Tokyo",
    cities: ["Osaka", "Nagoya", "Kyoto", "Sapporo", "Tokyo"],
    image: "https://upload.wikimedia.org/wikipedia/commons/1/12/Tokyo_Tower_and_around_Skyscrapers.jpg"
  }
];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startQuiz() {
  const num = parseInt(document.getElementById("numQuestions").value, 10);
  selectedQuestions = shuffle(countryDB).slice(0, num);
  currentQuestionIndex = 0;
  score = 0;

  document.getElementById("setupContainer").style.display = "none";
  document.getElementById("quizContainer").style.display = "block";
  showQuestion(selectedQuestions[currentQuestionIndex]);
}

function showQuestion(q) {
  document.getElementById("questionText").textContent = `What is the capital of ${q.country}?`;
  const choicesContainer = document.getElementById("choicesContainer");
  choicesContainer.innerHTML = "";
  shuffle(q.cities).forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.onclick = () => submitAnswer(city === q.capital, q.capital);
    choicesContainer.appendChild(btn);
  });

  document.getElementById("capitalImage").innerHTML =
    `<img src="${q.image}" alt="${q.capital}" style="max-width:100%; margin-top:10px;" />`;
}

function submitAnswer(correct, answer) {
  if (correct) score++;
  document.getElementById("countryFact").textContent = `Correct answer: ${answer}`;
  document.getElementById("nextBtn").style.display = "inline";
}

function nextQuestion() {
  currentQuestionIndex++;
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("countryFact").textContent = "";
  if (currentQuestionIndex < selectedQuestions.length) {
    showQuestion(selectedQuestions[currentQuestionIndex]);
  } else {
    endQuiz();
  }
}

function endQuiz() {
  document.getElementById("quizContainer").style.display = "none";
  document.getElementById("resultText").textContent = `You scored ${score} out of ${selectedQuestions.length}`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startQuizBtn").onclick = startQuiz;
  document.getElementById("nextBtn").onclick = nextQuestion;
});
