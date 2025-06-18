
let fullDB=[], mode='', score=0, total=0;
let dailyAnswered=false;
let practiceOrder=[], pIndex=0;

const $ = id => document.getElementById(id);
const shuffle = a => a.sort(()=>Math.random()-.5);

async function loadDB(){
  if(fullDB.length) return;
  fullDB = await fetch('countries_200.json').then(r=>r.json());
}

// Build element if absent
function need(id){
  let el=$(id);
  if(!el){
    el=document.createElement('div');
    el.id=id;
    document.querySelector('main').appendChild(el);
  }
  return el;
}

function showQuestion(q){
  need('quizBox'); const box=$('quizBox'); box.innerHTML='';
  const qText=document.createElement('h3');qText.id='questionText';
  qText.textContent=`What is the capital of ${q.country}?`;
  box.appendChild(qText);

  const choices=document.createElement('div');choices.id='choicesContainer';box.appendChild(choices);

  shuffle([q.capital,...q.distractors]).forEach(city=>{
    const btn=document.createElement('button');btn.textContent=city;
    btn.onclick=()=>answer(btn,city===q.capital,q);
    choices.appendChild(btn);
  });

  const img=document.createElement('img');
  img.id='img';img.src=q.image;img.style.maxWidth='100%';img.onerror=()=>img.style.display='none';
  box.appendChild(img);

  const fact=need('fact');
  fact.textContent='';
}

function answer(btn,correct,q){
  const fact=$('fact');
  document.querySelectorAll('#choicesContainer button').forEach(b=>b.disabled=true);
  if(correct){
    btn.classList.add('success');score++;
    fact.textContent=`✅ Correct! ${q.capital} is the capital of ${q.country}.`;
  }else{
    btn.classList.add('fail');
    fact.textContent=`❌ Incorrect. ${q.capital} is the capital of ${q.country}.`;
  }

  if(mode==='Daily'){
    if(dailyAnswered) return;
    dailyAnswered=true;total=1;
    saveScore();
    setTimeout(()=>{location.href='scores.html';},1800);
  }else{
    total++;saveScore();
    setTimeout(nextPractice,1200);
  }
}

function saveScore(){
  const arr=JSON.parse(localStorage.getItem('guestScores')||'[]');
  arr.push({timestamp:Date.now(),mode,score,total});
  localStorage.setItem('guestScores',JSON.stringify(arr));
}

// ---------------- DAILY ----------------
async function startDaily(){
  await loadDB();
  const today=new Date().toDateString();
  if(localStorage.dailyPlayed===today){$('info').textContent='✅ Come back tomorrow!';return;}
  mode='Daily';score=0;total=0;
  const q=fullDB[Math.floor(Math.random()*fullDB.length)];
  showQuestion(q);
  localStorage.dailyPlayed=today; // mark attempt regardless right/wrong
}

// ---------------- PRACTICE -------------
async function startPractice(){
  await loadDB();
  mode='Practice';score=0;total=0;
  practiceOrder=shuffle([...fullDB]);
  pIndex=0;
  nextPractice();
}
function nextPractice(){
  if(pIndex>=practiceOrder.length){practiceOrder=shuffle([...fullDB]);pIndex=0;}
  showQuestion(practiceOrder[pIndex]);pIndex++;
}

// ---------------- SCORE PAGE ----------
function buildScores(){
  const arr=JSON.parse(localStorage.getItem('guestScores')||'[]').reverse();
  const table=$('scoreTable');table.innerHTML='<tr><th>Date</th><th>Mode</th><th>Score</th></tr>';
  if(!arr.length){table.innerHTML+='<tr><td colspan=3>No scores yet</td></tr>';return;}
  arr.forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${new Date(r.timestamp).toLocaleDateString()}</td><td>${r.mode}</td><td>${r.score}/${r.total}</td>`;
    table.appendChild(tr);
  });
}
