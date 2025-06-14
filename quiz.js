
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
  const item = data[current];
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
  current = (current + 1) % data.length;
  loadQuestion();
};

document.addEventListener('DOMContentLoaded', loadQuestion);
