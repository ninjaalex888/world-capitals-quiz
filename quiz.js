
const data = [{"country": "France", "capital": "Paris", "options": ["Paris", "Berlin", "London", "Warsaw", "Prague"]}, {"country": "Germany", "capital": "Berlin", "options": ["Prague", "Bern", "Helsinki", "Paris", "Berlin"]}, {"country": "Spain", "capital": "Madrid", "options": ["Warsaw", "Madrid", "Stockholm", "Oslo", "Bern"]}, {"country": "Italy", "capital": "Rome", "options": ["London", "Stockholm", "Vienna", "Berlin", "Rome"]}, {"country": "Portugal", "capital": "Lisbon", "options": ["Helsinki", "Lisbon", "Rome", "Stockholm", "Bern"]}, {"country": "Poland", "capital": "Warsaw", "options": ["Budapest", "Prague", "Warsaw", "Berlin", "Stockholm"]}, {"country": "Hungary", "capital": "Budapest", "options": ["London", "Madrid", "Rome", "Budapest", "Prague"]}, {"country": "Norway", "capital": "Oslo", "options": ["Paris", "Copenhagen", "Oslo", "Warsaw", "Vienna"]}, {"country": "Sweden", "capital": "Stockholm", "options": ["Copenhagen", "Stockholm", "Lisbon", "Madrid", "Warsaw"]}, {"country": "Netherlands", "capital": "Amsterdam", "options": ["Stockholm", "Berlin", "Helsinki", "Amsterdam", "Madrid"]}, {"country": "China", "capital": "Beijing", "options": ["Beijing", "Kuala Lumpur", "Kathmandu", "New Delhi", "Yangon"]}, {"country": "Japan", "capital": "Tokyo", "options": ["Bangkok", "Jakarta", "Tokyo", "Yangon", "Kathmandu"]}, {"country": "South Korea", "capital": "Seoul", "options": ["Tokyo", "Yangon", "Manila", "Seoul", "Tashkent"]}, {"country": "Thailand", "capital": "Bangkok", "options": ["Yangon", "Manila", "Beijing", "Bangkok", "Jakarta"]}, {"country": "Malaysia", "capital": "Kuala Lumpur", "options": ["New Delhi", "Tashkent", "Yangon", "Kuala Lumpur", "Jakarta"]}, {"country": "Indonesia", "capital": "Jakarta", "options": ["Colombo", "Yangon", "Hanoi", "Tashkent", "Jakarta"]}, {"country": "Philippines", "capital": "Manila", "options": ["New Delhi", "Manila", "Dhaka", "Beijing", "Tashkent"]}, {"country": "India", "capital": "New Delhi", "options": ["Hanoi", "Jakarta", "Kathmandu", "Yangon", "New Delhi"]}, {"country": "Nepal", "capital": "Kathmandu", "options": ["Manila", "Dhaka", "Colombo", "Seoul", "Kathmandu"]}, {"country": "Sri Lanka", "capital": "Colombo", "options": ["Seoul", "Kathmandu", "Jakarta", "New Delhi", "Colombo"]}, {"country": "Egypt", "capital": "Cairo", "options": ["Harare", "Accra", "Cairo", "Tripoli", "Algiers"]}, {"country": "Kenya", "capital": "Nairobi", "options": ["Accra", "Nairobi", "Cairo", "Kampala", "Khartoum"]}, {"country": "Nigeria", "capital": "Abuja", "options": ["Algiers", "Accra", "Khartoum", "Abuja", "Dakar"]}, {"country": "Ghana", "capital": "Accra", "options": ["Windhoek", "Addis Ababa", "Lagos", "Khartoum", "Accra"]}, {"country": "Senegal", "capital": "Dakar", "options": ["Windhoek", "Algiers", "Bamako", "Dakar", "Addis Ababa"]}, {"country": "Ethiopia", "capital": "Addis Ababa", "options": ["Algiers", "Accra", "Harare", "Addis Ababa", "Cairo"]}, {"country": "Uganda", "capital": "Kampala", "options": ["Kampala", "Tripoli", "Nairobi", "Windhoek", "Bamako"]}, {"country": "Zimbabwe", "capital": "Harare", "options": ["Harare", "Nairobi", "Algiers", "Khartoum", "Lagos"]}, {"country": "Algeria", "capital": "Algiers", "options": ["Bamako", "Harare", "Algiers", "Nairobi", "Tripoli"]}, {"country": "Libya", "capital": "Tripoli", "options": ["Nairobi", "Tripoli", "Dakar", "Cairo", "Lagos"]}, {"country": "USA", "capital": "Washington D.C.", "options": ["Bogot\u00e1", "Mexico City", "Quito", "Ottawa", "Washington D.C."]}, {"country": "Canada", "capital": "Ottawa", "options": ["Montevideo", "Buenos Aires", "Lima", "Ottawa", "Mexico City"]}, {"country": "Mexico", "capital": "Mexico City", "options": ["Ottawa", "Bras\u00edlia", "Santiago", "Mexico City", "Buenos Aires"]}, {"country": "Brazil", "capital": "Bras\u00edlia", "options": ["Bras\u00edlia", "Bogot\u00e1", "Santiago", "Montevideo", "Georgetown"]}, {"country": "Argentina", "capital": "Buenos Aires", "options": ["Buenos Aires", "Quito", "Caracas", "Washington D.C.", "Bras\u00edlia"]}, {"country": "Chile", "capital": "Santiago", "options": ["Buenos Aires", "Quito", "Lima", "Santiago", "Caracas"]}, {"country": "Colombia", "capital": "Bogot\u00e1", "options": ["Mexico City", "Bogot\u00e1", "Quito", "Bras\u00edlia", "Ottawa"]}, {"country": "Peru", "capital": "Lima", "options": ["Lima", "Bras\u00edlia", "Montevideo", "Buenos Aires", "Ottawa"]}, {"country": "Uruguay", "capital": "Montevideo", "options": ["Montevideo", "Bras\u00edlia", "Quito", "Washington D.C.", "Buenos Aires"]}, {"country": "Ecuador", "capital": "Quito", "options": ["Washington D.C.", "Ottawa", "Quito", "Caracas", "Bras\u00edlia"]}, {"country": "Australia", "capital": "Canberra", "options": ["Melbourne", "Canberra", "Auckland", "Suva", "Sydney"]}, {"country": "New Zealand", "capital": "Wellington", "options": ["Suva", "Apia", "Canberra", "Port Moresby", "Wellington"]}, {"country": "Fiji", "capital": "Suva", "options": ["Apia", "Canberra", "Nuku\u02bbalofa", "Melbourne", "Suva"]}, {"country": "Papua New Guinea", "capital": "Port Moresby", "options": ["Melbourne", "Suva", "Port Moresby", "Apia", "Auckland"]}];

let current = 0;
let correct = 0;
let order = [];
let totalQ = 10;

function shuffle(arr) {
  for (let i=arr.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}
function initQuiz(length){
  order = [...Array(data.length).keys()];
  shuffle(order);
  totalQ = Math.min(length, order.length);
  current = 0;
  correct = 0;
  document.getElementById('intro-card').style.display='none';
  document.getElementById('quiz-section').style.display='block';
  loadQuestion();
}
function loadQuestion(){
  const q = data[order[current]];
  document.getElementById('country-name').textContent = q.country;
  const optDiv = document.getElementById('options');
  optDiv.innerHTML='';
  q.options.forEach(op=>{
    const btn=document.createElement('button');
    btn.textContent=op;
    btn.className='option-btn';
    btn.onclick=()=>check(op,q.capital);
    optDiv.appendChild(btn);
  });
  document.getElementById('result').textContent='';
  const next=document.getElementById('next-btn');
  next.style.display='none';
  next.disabled=true;
}
function check(sel, correctAns){
  document.querySelectorAll('.option-btn').forEach(b=>b.disabled=true);
  const res=document.getElementById('result');
  if(sel===correctAns){ res.textContent='✅ Correct!'; res.style.color='#4ade80'; correct++; }
  else { res.textContent='❌ Incorrect. Correct: '+correctAns; res.style.color='#f87171'; }
  const next=document.getElementById('next-btn');
  next.style.display='block';
  next.disabled=false;
}
function nextQ(){
  current++;
  if(current<totalQ) loadQuestion();
  else finishQuiz();
}
function finishQuiz(){
  const scrEl=document.getElementById('quiz-section');
  scrEl.innerHTML='<h2>Finished!</h2><p>Score: '+correct+' / '+totalQ+'</p><a href="leaderboard.html">Leaderboard</a>';
  const user=document.getElementById('username').value.trim();
  if(user){
    const doc=db.collection('users').doc(user);
    doc.get().then(d=>{
      const prev=d.exists? (d.data().highScore||0):0;
      const pass=d.exists? d.data().password : '';
      doc.set({password:pass, highScore: Math.max(prev, correct)},{merge:true});
    });
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('next-btn').addEventListener('click',nextQ);
});
