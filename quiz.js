const data = [
  {country: "Japan", capital: "Tokyo", cities: ['Osaka', 'Kyoto', 'Nagoya', 'Sapporo']},
  {country: "Canada", capital: "Ottawa", cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary']},
  {country: "Australia", capital: "Canberra", cities: ['Sydney', 'Melbourne', 'Perth', 'Brisbane']},
  {country: "Brazil", capital: "Brasília", cities: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Fortaleza']},
  {country: "Egypt", capital: "Cairo", cities: ['Alexandria', 'Giza', 'Luxor', 'Aswan']},
  {country: "Germany", capital: "Berlin", cities: ['Munich', 'Hamburg', 'Frankfurt', 'Cologne']},
  {country: "Kenya", capital: "Nairobi", cities: ['Mombasa', 'Kisumu', 'Nakuru', 'Eldoret']},
  {country: "India", capital: "New Delhi", cities: ['Mumbai', 'Bengaluru', 'Kolkata', 'Chennai']},
  {country: "Mexico", capital: "Mexico City", cities: ['Guadalajara', 'Monterrey', 'Cancún', 'Puebla']},
  {country: "France", capital: "Paris", cities: ['Lyon', 'Marseille', 'Nice', 'Toulouse']},
  {country: "Argentina", capital: "Buenos Aires", cities: ['Córdoba', 'Rosario', 'Mendoza', 'La Plata']},
  {country: "United States", capital: "Washington, D.C.", cities: ['New York', 'Los Angeles', 'Chicago', 'Houston']},
  {country: "United Kingdom", capital: "London", cities: ['Manchester', 'Birmingham', 'Liverpool', 'Leeds']},
  {country: "Italy", capital: "Rome", cities: ['Milan', 'Naples', 'Turin', 'Palermo']},
  {country: "Russia", capital: "Moscow", cities: ['St. Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan']},
  {country: "China", capital: "Beijing", cities: ['Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu']},
  {country: "South Korea", capital: "Seoul", cities: ['Busan', 'Incheon', 'Daegu', 'Daejeon']},
  {country: "Spain", capital: "Madrid", cities: ['Barcelona', 'Valencia', 'Seville', 'Zaragoza']},
  {country: "Netherlands", capital: "Amsterdam", cities: ['Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven']},
  {country: "Nigeria", capital: "Abuja", cities: ['Lagos', 'Kano', 'Ibadan', 'Port Harcourt']},
  {country: "Thailand", capital: "Bangkok", cities: ['Chiang Mai', 'Phuket', 'Pattaya', 'Nakhon Ratchasima']},
  {country: "Vietnam", capital: "Hanoi", cities: ['Ho Chi Minh City', 'Da Nang', 'Hai Phong', 'Can Tho']},
  {country: "Philippines", capital: "Manila", cities: ['Cebu City', 'Davao City', 'Quezon City', 'Zamboanga']},
  {country: "Turkey", capital: "Ankara", cities: ['Istanbul', 'Izmir', 'Bursa', 'Antalya']},
  {country: "Iran", capital: "Tehran", cities: ['Mashhad', 'Isfahan', 'Tabriz', 'Shiraz']},
  {country: "Pakistan", capital: "Islamabad", cities: ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi']},
  {country: "Indonesia", capital: "Jakarta", cities: ['Surabaya', 'Bandung', 'Medan', 'Semarang']},
  {country: "Malaysia", capital: "Kuala Lumpur", cities: ['George Town', 'Johor Bahru', 'Ipoh', 'Shah Alam']},
  {country: "Greece", capital: "Athens", cities: ['Thessaloniki', 'Patras', 'Heraklion', 'Larissa']},
  {country: "Ukraine", capital: "Kyiv", cities: ['Kharkiv', 'Odesa', 'Dnipro', 'Lviv']},
];


const data = [
  {country:"Japan",   capital:"Tokyo",         cities:["Osaka","Kyoto","Nagoya","Sapporo"]},
  {country:"Canada",  capital:"Ottawa",        cities:["Toronto","Vancouver","Montreal","Calgary"]},
  {country:"Australia",capital:"Canberra",     cities:["Sydney","Melbourne","Perth","Brisbane"]},
  {country:"Brazil",  capital:"Brasília",      cities:["Rio de Janeiro","São Paulo","Salvador","Fortaleza"]},
  {country:"Egypt",   capital:"Cairo",         cities:["Alexandria","Giza","Luxor","Aswan"]},
  {country:"Germany", capital:"Berlin",        cities:["Munich","Hamburg","Frankfurt","Cologne"]},
  {country:"Kenya",   capital:"Nairobi",       cities:["Mombasa","Kisumu","Nakuru","Eldoret"]},
  {country:"India",   capital:"New Delhi",     cities:["Mumbai","Bengaluru","Kolkata","Chennai"]},
  {country:"Mexico",  capital:"Mexico City",   cities:["Guadalajara","Monterrey","Cancún","Puebla"]},
  {country:"France",  capital:"Paris",         cities:["Lyon","Marseille","Nice","Toulouse"]}
];

let totalQuestions=Infinity, questionOrder=[], curIdx=0, correctCount=0;
const countryEl=document.getElementById('country-name');
const optionsEl=document.getElementById('options');
const resultEl=document.getElementById('result');
const nextBtn=document.getElementById('next-btn');

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
}


let currentAudio = null;
function playSound(ok){
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = new Audio(ok ? 'audio/correct.mp3' : 'audio/wrong.mp3');
  currentAudio.play();
}

  const audio=new Audio(ok?'audio/correct.mp3':'audio/wrong.mp3');
  audio.play();
}

function loadQuestion(){
  resultEl.textContent="";
  nextBtn.style.display="none";
  const item=data[questionOrder[curIdx]];
  countryEl.textContent=item.country;
  const choices=[...item.cities,item.capital];
  shuffle(choices);
  optionsEl.innerHTML="";
  choices.forEach(city=>{
    const btn=document.createElement('button');
    btn.textContent=city;
    btn.onclick=()=>select(city,item.capital);
    optionsEl.appendChild(btn);
  });
}

function select(sel,correct){
  const buttons=optionsEl.querySelectorAll('button');buttons.forEach(b=>b.disabled=true);
  if(sel===correct){
    resultEl.textContent="✅ Correct!";
    resultEl.style.color="#34d399";
    correctCount++;
    playSound(true);
  }else{
    resultEl.textContent=`❌ Wrong! Capital: ${correct}`;
    resultEl.style.color="#f87171";
    playSound(false);
  }
  nextBtn.style.display="block";
}


function endQuiz(username){
  const score = Math.round((correctCount / curIdx) * 100);
  const key = "capitals_leaderboard";
  const lb = JSON.parse(localStorage.getItem(key) || "[]");
  lb.push({ user: username, score });
  lb.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(lb.slice(0, 10)));
  const rank = lb.findIndex(entry => entry.user === username && entry.score === score) + 1;

  countryEl.textContent = `🎉 Score: ${score}% (Rank: #${rank})`;

  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";

  const lbBtn = document.createElement('button');
  lbBtn.textContent = 'View Leaderboard';
  lbBtn.onclick = () => window.location.href = 'leaderboard.html';
  optionsEl.appendChild(lbBtn);
}

  const score=Math.round((correctCount/curIdx)*100);
  countryEl.textContent=`Quiz Complete! Score: ${score}%`;
  const lbBtn = document.createElement('button');
  lbBtn.textContent = 'View Leaderboard';
  lbBtn.onclick = () => window.location.href = 'leaderboard.html';
  optionsEl.appendChild(lbBtn);
  optionsEl.innerHTML="";
  nextBtn.style.display="none";
  saveScore(username,score);
}

function saveScore(user,score){
  const key="capitals_leaderboard";
  const lb=JSON.parse(localStorage.getItem(key)||"[]");
  lb.push({user,score});
  lb.sort((a,b)=>b.score-a.score);
  localStorage.setItem(key,JSON.stringify(lb.slice(0,10)));
}

nextBtn.onclick=()=>{
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  curIdx++;
  if(curIdx>=totalQuestions){
    const user=localStorage.getItem('quiz_username')||'Anon';
    endQuiz(user);
  }else loadQuestion();
};

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('start-btn').onclick=()=>{
    const user='Guest';
    
    const sel=document.getElementById('quiz-length').value;
    const custom=document.getElementById('custom-amount').value;
    if(custom){
      totalQuestions=Math.min(parseInt(custom),data.length);
    }else totalQuestions=(sel==='infinite')?Infinity:parseInt(sel);
    questionOrder=[...Array(data.length).keys()];shuffle(questionOrder);
    document.getElementById('intro-card').style.display='none';
    document.getElementById('quiz-section').style.display='block';
    loadQuestion();
  };
});


document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const nameStatus = document.getElementById('name-status');
  const startBtn = document.getElementById('start-btn');

  if (!usernameInput) return;

  usernameInput.addEventListener('input', () => {
    const name = usernameInput.value.trim();
    const key = "capitals_leaderboard";
    const lb = JSON.parse(localStorage.getItem(key) || "[]");
    const exists = lb.some(entry => entry.user.toLowerCase() === name.toLowerCase());

    if (!name) {
      nameStatus.textContent = "";
      startBtn.disabled = true;
    } else if (exists) {
      nameStatus.textContent = "⚠️ Name not available";
      nameStatus.style.color = "#f87171";
      startBtn.disabled = true;
    } else {
      nameStatus.textContent = "✅ Name is available";
      nameStatus.style.color = "#34d399";
      startBtn.disabled = false;
    }
  });
});


function canStartQuiz() {
  const usernameInput = document.getElementById('username');
  const nameStatus = document.getElementById('name-status');
  const startBtn = document.getElementById('start-btn');

  return (
    usernameInput.value.trim().length > 0 &&
    nameStatus.textContent.includes("available") &&
    !startBtn.disabled
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const usernameInput = document.getElementById('username');

  startBtn.addEventListener('click', () => {
    if (!canStartQuiz()) return;

    const user = usernameInput.value.trim();
    const sel = document.getElementById('quiz-length').value;
    const custom = document.getElementById('custom-amount').value;

    let total = (sel === 'infinite') ? Infinity : parseInt(sel);
    if (custom) total = parseInt(custom);

    localStorage.setItem('quiz_username', user);
    questionOrder = [...Array(data.length).keys()];
    shuffle(questionOrder);
    totalQuestions = Math.min(total, data.length);

    document.getElementById('intro-card').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    loadQuestion();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && canStartQuiz()) {
      startBtn.click();
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const nameStatus = document.getElementById('name-status');
  const passwordGroup = document.getElementById('password-group');
  const passwordLabel = document.getElementById('password-label');
  const passwordInput = document.getElementById('password');
  const passwordStatus = document.getElementById('password-status');
  const startBtn = document.getElementById('start-btn');

  usernameInput.addEventListener('input', () => {
    const name = usernameInput.value.trim();
    const passStore = JSON.parse(localStorage.getItem('user_passwords') || "{}");

    if (!name) {
      nameStatus.textContent = "";
      passwordGroup.style.display = "none";
      startBtn.disabled = true;
      return;
    }

    if (passStore[name]) {
      nameStatus.textContent = "🔐 Username found, please enter your password";
      nameStatus.style.color = "#facc15";
      passwordGroup.style.display = "block";
      passwordLabel.textContent = "Enter your password:";
      startBtn.disabled = true;
    } else {
      nameStatus.textContent = "✅ Username available, create a password";
      nameStatus.style.color = "#4ade80";
      passwordGroup.style.display = "block";
      passwordLabel.textContent = "Create a password:";
      startBtn.disabled = true;
    }
  });

  passwordInput.addEventListener('input', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const passStore = JSON.parse(localStorage.getItem('user_passwords') || "{}");

    if (passStore[username]) {
      // login path
      if (passStore[username] === password) {
        passwordStatus.textContent = "✅ Password correct";
        passwordStatus.style.color = "#4ade80";
        startBtn.disabled = false;
      } else {
        passwordStatus.textContent = "❌ Incorrect password";
        passwordStatus.style.color = "#f87171";
        startBtn.disabled = true;
      }
    } else {
      // create password path
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

  startBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    let passStore = JSON.parse(localStorage.getItem('user_passwords') || "{}");

    if (!passStore[username]) {
      passStore[username] = password;
      localStorage.setItem('user_passwords', JSON.stringify(passStore));
    }

    const sel = document.getElementById('quiz-length').value;
    const custom = document.getElementById('custom-amount').value;
    let total = (sel === 'infinite') ? Infinity : parseInt(sel);
    if (custom) total = parseInt(custom);

    localStorage.setItem('quiz_username', username);
    questionOrder = [...Array(data.length).keys()];
    shuffle(questionOrder);
    totalQuestions = Math.min(total, data.length);

    document.getElementById('intro-card').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    loadQuestion();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !startBtn.disabled) {
      startBtn.click();
    }
  });
});
