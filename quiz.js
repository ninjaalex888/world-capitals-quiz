
const data = [
  {
    country: "Japan",
    capital: "Tokyo",
    cities: ["Osaka","Kyoto","Sapporo","Nagoya"]
  },
  {
    country: "Canada",
    capital: "Ottawa",
    cities: ["Toronto","Vancouver","Montreal","Calgary"]
  },
  {
    country: "Australia",
    capital: "Canberra",
    cities: ["Sydney","Melbourne","Brisbane","Perth"]
  },
  {
    country: "Brazil",
    capital: "Brasília",
    cities: ["Rio de Janeiro","São Paulo","Salvador","Fortaleza"]
  },
  {
    country: "Egypt",
    capital: "Cairo",
    cities: ["Alexandria","Giza","Luxor","Aswan"]
  },
  {
    country: "Germany",
    capital: "Berlin",
    cities: ["Munich","Hamburg","Frankfurt","Cologne"]
  },
  {
    country: "Kenya",
    capital: "Nairobi",
    cities: ["Mombasa","Kisumu","Nakuru","Eldoret"]
  },
  {
    country: "India",
    capital: "New Delhi",
    cities: ["Mumbai","Bengaluru","Kolkata","Chennai"]
  },
  {
    country: "Mexico",
    capital: "Mexico City",
    cities: ["Guadalajara","Monterrey","Cancún","Puebla"]
  },
  {
    country: "France",
    capital: "Paris",
    cities: ["Lyon","Marseille","Nice","Toulouse"]
  }
];


let current = 0;
let totalQuestions = Infinity;
let questionOrder = [];
let currentIndex = 0;


function askQuizLength() {
  document.getElementById('start-btn').onclick = () => {
    const choice = document.getElementById('quiz-length').value;
    if (choice === 'infinite') {
      totalQuestions = Infinity;
    } else {
      const n = parseInt(choice);
      if (!isNaN(n) && n > 0) {
        totalQuestions = Math.min(n, data.length);
      }
    }
    questionOrder = [...Array(data.length).keys()];
    shuffle(questionOrder);
    document.getElementById('quiz-section').style.display = 'block';
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('quiz-length').style.display = 'none';
    document.querySelector("label[for='quiz-length']").style.display = 'none';
    loadQuestion();
  };

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

const countryEl = document.getElementById('country-name');
const optionsEl = document.getElementById('options');
const resultEl = document.getElementById('result');
const nextBtn = document.getElementById('next-btn');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
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
  } else {
    resultEl.textContent = `❌ Wrong! Correct answer: ${correct}`;
    resultEl.style.color = "#f87171";
  }
  nextBtn.style.display = "block";
}

nextBtn.onclick = () => {
  
  currentIndex++;
  if (currentIndex >= totalQuestions) {
    countryEl.textContent = "Quiz Complete!";
    optionsEl.innerHTML = "";
    resultEl.textContent = "";
    nextBtn.style.display = "none";
  } else {
    loadQuestion();
  }

};

document.addEventListener('DOMContentLoaded', askQuizLength);
