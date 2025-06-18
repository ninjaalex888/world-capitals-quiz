let fullDB=[];
let selectedQuestions=[];
let currentQuestionIndex=0;
let score=0;

async function loadData(){
  const res=await fetch("countries_200.json");
  fullDB=await res.json();
  shuffle(fullDB);
}
function shuffle(arr){return arr.sort(()=>Math.random()-0.5);}

function startQuiz(){
  const sel=document.getElementById("numQuestions").value;
  const infinite=sel==="infinite";
  const num=infinite?fullDB.length:parseInt(sel,10);
  selectedQuestions=shuffle([...fullDB]).slice(0,num);
  currentQuestionIndex=0;score=0;
  document.getElementById("setupContainer").style.display="none";
  document.getElementById("quizContainer").style.display="block";
  document.getElementById("resultText").textContent="";
  showQuestion(selectedQuestions[currentQuestionIndex],infinite);
}
function showQuestion(q,infinite){
  document.getElementById("questionText").textContent=`What is the capital of ${q.country}?`;
  const c=document.getElementById("choicesContainer");c.innerHTML="";
  const options=[...q.distractors,q.capital];shuffle(options);
  options.forEach(city=>{
    const b=document.createElement("button");b.textContent=city;
    b.onclick=()=>handleAnswer(city===q.capital,q.capital,infinite);c.appendChild(b);
  });
  document.getElementById("capitalImage").innerHTML=`<img src="${q.image}" alt="${q.capital}" style="max-width:100%;margin-top:10px;">`;
  document.getElementById("countryFact").textContent="";
}
function handleAnswer(correct,answer,infinite){
  const fact=document.getElementById("countryFact");
  if(correct){score++;fact.textContent="✅ Correct!";}else{fact.textContent="❌ Incorrect, try again!";return;}
  setTimeout(()=>{currentQuestionIndex++;if(currentQuestionIndex>=selectedQuestions.length){if(infinite){showQuestion(shuffle([...fullDB])[0],true);}else endQuiz();}else showQuestion(selectedQuestions[currentQuestionIndex],infinite);},1200);
}
function endQuiz(){
  document.getElementById("quizContainer").style.display="none";
  const total=selectedQuestions.length;
  document.getElementById("resultText").textContent=`You scored ${score} out of ${total}`;
  // Save to history
  const scores=JSON.parse(localStorage.getItem("guestScores")||"[]");
  scores.push({timestamp:Date.now(),score,total});
  localStorage.setItem("guestScores",JSON.stringify(scores));
}

document.addEventListener("DOMContentLoaded",async()=>{
  await loadData();
  document.getElementById("startQuizBtn").onclick=startQuiz;
});