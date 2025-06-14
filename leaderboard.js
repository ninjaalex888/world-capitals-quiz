
document.addEventListener('DOMContentLoaded',()=>{
  const key='capitals_leaderboard';
  const tbody=document.querySelector('#score-table tbody');
  const data=JSON.parse(localStorage.getItem(key)||'[]');
  data.forEach((row,i)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${i+1}</td><td>${row.user}</td><td>${row.score}</td>`;
    tbody.appendChild(tr);
  });
  // chart
  const ctx=document.getElementById('chart');
  new Chart(ctx,{type:'bar',data:{
    labels:data.map(r=>r.user),
    datasets:[{label:'Score %',data:data.map(r=>r.score),backgroundColor:'#a69cce'}]
  },options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,max:100}}}});
});
