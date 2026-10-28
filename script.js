// World Capitals Quiz – shared logic for every page.

const $ = id => document.getElementById(id);

// ---------------- STORAGE ----------------
function readJSON(key, fallback){
  try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch{ return fallback; }
}
function writeJSON(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); }
  catch{ /* storage blocked (e.g. private mode) – the quiz still works */ }
}

// ---------------- SETTINGS ----------------
const DEFAULT_SETTINGS = {showFlag:true, showPhoto:true, theme:'system'};
const getSettings = () => ({...DEFAULT_SETTINGS, ...readJSON('settings', {})});

function applyTheme(theme){
  const root = document.documentElement;
  if(theme === 'light' || theme === 'dark') root.dataset.theme = theme;
  else delete root.dataset.theme;
}

// ---------------- DATA ----------------
let fullDB = [];
async function loadDB(){
  if(fullDB.length) return fullDB;
  try{
    fullDB = await fetch('countries.json').then(r => r.json());
  }catch(err){
    $('info').textContent = "Couldn't load the country list. If you opened the file directly, run start_dev_server.bat instead.";
    throw err;
  }
  return fullDB;
}

function shuffle(a){
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------- SCORES ----------------
// One row per session, updated after each answer: {timestamp, mode, score, total}.
let mode = '', score = 0, total = 0, sessionId = 0;

function saveScore(){
  const arr = readJSON('guestScores', []);
  const row = {timestamp:sessionId, mode, score, total};
  const i = arr.findIndex(r => r.timestamp === sessionId);
  if(i >= 0) arr[i] = row; else arr.push(row);
  writeJSON('guestScores', arr);
}

// Older versions saved a Practice row after every answer (1/1, 2/2, 3/3…).
// Collapse each of those runs into its final row, once.
function migrateScores(){
  if(readJSON('scoresMigrated', false)) return;
  const out = [];
  for(const r of readJSON('guestScores', [])){
    const prev = out[out.length - 1];
    const sameRun = r.mode === 'Practice' && prev?.mode === 'Practice'
      && r.total === prev.total + 1 && r.timestamp - prev.timestamp < 10 * 60 * 1000;
    if(sameRun) out[out.length - 1] = r; else out.push(r);
  }
  writeJSON('guestScores', out);
  writeJSON('scoresMigrated', true);
}
migrateScores();

// ---------------- QUIZ CARD ----------------
const QUIZ_HTML = `
  <div class="quiz-meta"><span id="label"></span><span id="scoreText"></span></div>
  <img id="flag" class="flag" alt="" hidden>
  <h2 id="question" class="question"></h2>
  <div id="choices" class="choices"></div>
  <p id="feedback" class="feedback" role="status"></p>
  <figure id="photo" class="photo" hidden>
    <img id="photoImg" alt="">
    <figcaption><span id="photoCaption"></span> · <a id="photoCredit" target="_blank" rel="noopener">Photo: Wikimedia Commons</a></figcaption>
  </figure>
  <div id="actions" class="actions"></div>`;

function showQuestion(q, onAnswer){
  const settings = getSettings();
  const box = $('quiz');
  box.innerHTML = QUIZ_HTML;
  box.hidden = false;

  if(settings.showFlag){
    const flag = $('flag');
    flag.onerror = () => flag.hidden = true;
    flag.src = `flags/${q.code}.png`;
    flag.alt = `Flag of ${q.country}`;
    flag.hidden = false;
  }

  const name = document.createElement('strong');
  name.textContent = q.country;
  $('question').append('What is the capital of ', name, '?');

  shuffle([q.capital, ...q.distractors]).forEach(city => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = city;
    btn.onclick = () => { reveal(q, city); onAnswer(city === q.capital, city); };
    $('choices').appendChild(btn);
  });

  // Photo is shown only after answering (it could give the answer away),
  // so warm the cache now to make the reveal instant.
  if(settings.showPhoto && q.photo) new Image().src = q.photo;
}

function reveal(q, chosen){
  const correct = chosen === q.capital;
  document.querySelectorAll('.choice').forEach(b => {
    b.disabled = true;
    if(b.textContent === q.capital) b.classList.add('correct');
    else if(b.textContent === chosen) b.classList.add('wrong');
  });

  const fb = $('feedback');
  fb.className = 'feedback ' + (correct ? 'good' : 'bad');
  fb.textContent = correct
    ? `✅ Correct! ${q.capital} is the capital of ${q.country}.`
    : `❌ Not quite. The capital of ${q.country} is ${q.capital}.`;

  if(getSettings().showPhoto && q.photo){
    const fig = $('photo'), img = $('photoImg');
    img.onerror = () => fig.hidden = true;
    img.src = q.photo;
    img.alt = `${q.capital}, ${q.country}`;
    $('photoCaption').textContent = `${q.capital}, ${q.country}`;
    $('photoCredit').href = q.photoSource;
    fig.hidden = false;
  }
}

// target is a URL (link) or a function (button)
function addAction(label, target, secondary = false){
  const el = document.createElement(typeof target === 'string' ? 'a' : 'button');
  el.className = secondary ? 'btn secondary' : 'btn';
  el.textContent = label;
  if(typeof target === 'string') el.href = target; else el.onclick = target;
  $('actions').appendChild(el);
  return el;
}

// ---------------- DAILY ----------------
// Everyone gets the same country on the same calendar date.
function todayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function dailyIndex(key, n){
  const day = Date.parse(key + 'T00:00:00Z') / 86400000; // whole days since 1970
  return (day * 7919) % n; // 7919 is prime, so every country comes up before any repeats
}

async function startDaily(){
  const db = await loadDB();
  const today = todayKey();
  const q = db[dailyIndex(today, db.length)];

  const finish = () => {
    $('info').textContent = 'Come back tomorrow for a new country.';
    addAction('Keep practising', 'practice.html');
    addAction('Score history', 'scores.html', true);
  };

  showQuestion(q, (correct, city) => {
    mode = 'Daily'; sessionId = Date.now(); score = correct ? 1 : 0; total = 1;
    writeJSON('dailyResult', {date:today, country:q.country, choice:city});
    saveScore();
    finish();
  });
  $('label').textContent = new Date().toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'});

  const played = readJSON('dailyResult', null);
  if(played && played.date === today){
    if(played.country === q.country) reveal(q, played.choice);
    else document.querySelectorAll('.choice').forEach(b => b.disabled = true);
    finish();
  }
}

// ---------------- PRACTICE -------------
async function startPractice(){
  const db = await loadDB();
  mode = 'Practice'; score = 0; total = 0; sessionId = Date.now();
  let order = shuffle([...db]), i = 0;

  const next = () => {
    if(i >= order.length){ order = shuffle([...db]); i = 0; }
    const number = total + 1;
    showQuestion(order[i++], correct => {
      total++;
      if(correct) score++;
      saveScore();
      updatePracticeMeta(number);
      addAction('Next question →', next).focus();
    });
    updatePracticeMeta(number);
    if(total) window.scrollTo(0, 0);
  };
  next();
}
function updatePracticeMeta(number){
  $('label').textContent = `Question ${number}`;
  $('scoreText').textContent = total ? `${score} / ${total} correct` : '';
}

// ---------------- SCORE PAGE ----------
function buildScores(){
  const rows = readJSON('guestScores', []).slice().reverse();
  const daily = rows.filter(r => r.mode === 'Daily');
  const practice = rows.filter(r => r.mode === 'Practice');
  const sum = (arr, key) => arr.reduce((n, r) => n + (r[key] || 0), 0);
  const answered = sum(practice, 'total');

  $('statDaily').textContent = `${sum(daily, 'score')} / ${daily.length}`;
  $('statSessions').textContent = practice.length;
  $('statAccuracy').textContent = answered ? Math.round(100 * sum(practice, 'score') / answered) + '%' : '–';

  const body = $('scoreRows');
  if(!rows.length){
    $('scoreTable').hidden = true;
    $('noScores').hidden = false;
    return;
  }
  rows.forEach(r => {
    const tr = document.createElement('tr');
    [new Date(r.timestamp).toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'}), r.mode, `${r.score} / ${r.total}`]
      .forEach((text, col) => {
        const td = document.createElement('td');
        td.textContent = text;
        if(col === 2) td.className = 'num';
        tr.appendChild(td);
      });
    body.appendChild(tr);
  });
}

// ---------------- SETTINGS PAGE -------
function initSettings(){
  const s = getSettings();
  $('showFlag').checked = s.showFlag;
  $('showPhoto').checked = s.showPhoto;
  const theme = document.querySelector(`input[name="theme"][value="${s.theme}"]`)
    || document.querySelector('input[name="theme"][value="system"]');
  theme.checked = true;

  document.querySelectorAll('#settingsForm input').forEach(input => input.addEventListener('change', () => {
    const next = {
      showFlag:$('showFlag').checked,
      showPhoto:$('showPhoto').checked,
      theme:document.querySelector('input[name="theme"]:checked').value,
    };
    writeJSON('settings', next);
    applyTheme(next.theme);
    $('saved').textContent = 'Saved ✓';
  }));
}
