
document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.querySelector('#score-table tbody');
  const scores = await getTopScores(10);
  scores.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx + 1}</td><td>${row.username || 'Anon'}</td><td>${row.highScore}</td>`;
    tbody.appendChild(tr);
  });
});
