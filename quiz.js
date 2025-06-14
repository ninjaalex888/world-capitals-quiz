
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

function playSound(ok){
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
  const score=Math.round((correctCount/curIdx)*100);
  countryEl.textContent=`Quiz Complete! Score: ${score}%`;
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
  curIdx++;
  if(curIdx>=totalQuestions){
    const user=localStorage.getItem('quiz_username')||'Anon';
    endQuiz(user);
  }else loadQuestion();
};

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('start-btn').onclick=()=>{
    const user=document.getElementById('username').value||'Anon';
    localStorage.setItem('quiz_username',user);
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
