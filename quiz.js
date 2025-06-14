
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

  let current = 0;
  const interval = setInterval(() => {
    if (current <= score) {
      countryEl.textContent = `🎉 Score: ${current}%`;
      current++;
    } else {
      clearInterval(interval);
      countryEl.textContent += ` (Rank: #${rank})`;
    }
  }, 25);

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
