
// data same as before
const data = [
  {country:"Japan",capital:"Tokyo",cities:["Osaka","Kyoto","Nagoya","Sapporo"]},
  {country:"Canada",capital:"Ottawa",cities:["Toronto","Vancouver","Montreal","Calgary"]},
  {country:"Australia",capital:"Canberra",cities:["Sydney","Melbourne","Perth","Brisbane"]},
  {country:"Brazil",capital:"Brasília",cities:["Rio de Janeiro","São Paulo","Salvador","Fortaleza"]},
  {country:"Egypt",capital:"Cairo",cities:["Alexandria","Giza","Luxor","Aswan"]},
  {country:"Germany",capital:"Berlin",cities:["Munich","Hamburg","Frankfurt","Cologne"]},
  {country:"Kenya",capital:"Nairobi",cities:["Mombasa","Kisumu","Nakuru","Eldoret"]},
  {country:"India",capital:"New Delhi",cities:["Mumbai","Bengaluru","Kolkata","Chennai"]},
  {country:"Mexico",capital:"Mexico City",cities:["Guadalajara","Monterrey","Cancún","Puebla"]},
  {country:"France",capital:"Paris",cities:["Lyon","Marseille","Nice","Toulouse"]}
];

let totalQuestions = Infinity;
let questionOrder = [];
let curIdx = 0;
let correctCount = 0;

const countryEl = document.getElementById('country-name');
const optionsEl = document.getElementById('options');
const resultEl = document.getElementById('result');
const nextBtn = document.getElementById('next-btn');

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

function playSound(ok){
  const audio = new Audio(ok?'audio/correct.mp3':'audio/wrong.mp3');
  audio.play();
}

function loadQuestion(){
  resultEl.textContent="";
  nextBtn.style.display="none";
  const item = data[questionOrder[curIdx]];
  countryEl.textContent = item.country;
  const choices = [...item.cities, item.capital];
  shuffle(choices);
  optionsEl.innerHTML="";
  choices.forEach(c=>{
    const btn=document.createElement('button');
    btn.textContent=c;
    btn.onclick=()=>selectAnswer(c,item.capital);
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(sel, correct){
  optionsEl.querySelectorAll('button').forEach(b=>b.disabled=true);
  if(sel===correct){
    correctCount++;
    resultEl.textContent="✅ Correct!";
    resultEl.style.color="#34d399";
    playSound(true);
  }else{
    resultEl.textContent=`❌ Wrong! Capital: ${correct}`;
    resultEl.style.color="#f87171";
    playSound(false);
  }
  nextBtn.style.display="block";
}

function saveScore(username, score){
  const key='capitals_leaderboard';
  const lb=JSON.parse(localStorage.getItem(key)||"[]");
  lb.push({user:username,score});
  lb.sort((a,b)=>b.score-a.score);
  localStorage.setItem(key, JSON.stringify(lb.slice(0,10)));
}

function endQuiz(username){
  const pct = Math.round((correctCount/totalQuestions)*100);
  countryEl.textContent=`Quiz Complete! Score: ${pct}%`;
  optionsEl.innerHTML="";
  nextBtn.style.display="none";
  saveScore(username, pct);
}

// Start button logic
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('start-btn').onclick=()=>{
    const username = document.getElementById('username').value.trim();
    const msg = document.getElementById('msg');
    if(!username){
      msg.textContent="Please enter a username.";
      return;
    }
    // check uniqueness
    const lbKey='capitals_leaderboard';
    const lb=JSON.parse(localStorage.getItem(lbKey)||"[]");
    if(lb.some(r=>r.user.toLowerCase()===username.toLowerCase())){
      msg.textContent="Username already exists. Pick another.";
      return;
    }
    msg.textContent="";

    // Determine quiz length
    const dropdownVal = document.getElementById('quiz-length').value;
    const customVal = document.getElementById('custom-amount').value;
    if(customVal){
      totalQuestions = Math.min(parseInt(customVal), data.length);
    }else{
      totalQuestions = dropdownVal==='infinite'?Infinity:parseInt(dropdownVal);
    }

    // setup order
    questionOrder=[...Array(data.length).keys()];
    shuffle(questionOrder);
    curIdx=0;
    correctCount=0;

    // hide intro
    document.getElementById('intro-card').style.display='none';
    document.getElementById('quiz-section').style.display='block';

    loadQuestion();

    // store user for final save
    localStorage.setItem('current_user', username);
  };
});

nextBtn.onclick=()=>{
  curIdx++;
  if(curIdx>=totalQuestions){
    const user=localStorage.getItem('current_user')||'Guest';
    endQuiz(user);
  }else{
    loadQuestion();
  }
};
