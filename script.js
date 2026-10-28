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
// photo: 'before' | 'after' | 'off' – when to show the capital city photo
const DEFAULT_SETTINGS = {difficulty:'medium', showFlag:true, photo:'before', theme:'system'};

// Each country has a level 1–4; a difficulty includes every level up to maxLevel.
// On the harder settings the wrong answers come from the same region.
const DIFFICULTIES = {
  easy:     {label:'Easy',      maxLevel:1, sameRegion:false, blurb:n => `${n} well-known countries`},
  medium:   {label:'Medium',    maxLevel:2, sameRegion:false, blurb:n => `${n} countries`},
  hard:     {label:'Hard',      maxLevel:3, sameRegion:true,  blurb:n => `${n} countries, with wrong answers from the same region`},
  veryhard: {label:'Very hard', maxLevel:4, sameRegion:true,  blurb:n => `All ${n} countries, with wrong answers from the same region`},
};
function difficultyKey(){
  const key = getSettings().difficulty;
  return DIFFICULTIES[key] ? key : DEFAULT_SETTINGS.difficulty;
}
const getDifficulty = () => DIFFICULTIES[difficultyKey()];

function getSettings(){
  const saved = readJSON('settings', {});
  // Older versions stored an on/off switch (showPhoto); keep an explicit "off".
  if(saved.showPhoto === false && !saved.photo) saved.photo = 'off';
  delete saved.showPhoto;
  return {...DEFAULT_SETTINGS, ...saved};
}

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
    if($('info')) $('info').textContent = "Couldn't load the country list. If you opened the file directly, run start_dev_server.bat instead.";
    throw err;
  }
  return fullDB;
}

const poolFor = (db, diff) => db.filter(c => c.level <= diff.maxLevel);

function shuffle(a, rand = Math.random){
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Small seeded random generator, so the Daily options are the same for everyone.
function seededRandom(seed){
  return () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The right capital plus 4 wrong ones from the same pool (same region first if asked).
function pickOptions(q, pool, sameRegion, rand = Math.random){
  const others = pool.filter(c => c.capital !== q.capital);
  const wrong = sameRegion ? shuffle(others.filter(c => c.region === q.region), rand).slice(0, 4) : [];
  for(const c of shuffle(others.filter(c => !wrong.includes(c)), rand)){
    if(wrong.length >= 4) break;
    wrong.push(c);
  }
  return shuffle([q.capital, ...wrong.map(c => c.capital)], rand);
}

// ---------------- SCORES ----------------
// One row per session, updated after each answer: {timestamp, mode, score, total, difficulty}.
let mode = '', score = 0, total = 0, sessionId = 0, difficulty = '';

function saveScore(){
  const arr = readJSON('guestScores', []);
  const row = {timestamp:sessionId, mode, score, total, difficulty};
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
    <div id="photoFrame" class="photo-frame"><img id="photoImg" alt=""></div>
    <figcaption><span id="photoCaption"></span> · <a id="photoCredit" target="_blank" rel="noopener">Photo: Wikimedia Commons</a></figcaption>
  </figure>
  <div id="actions" class="actions"></div>`;

function showQuestion(q, options, onAnswer){
  const settings = getSettings();
  const box = $('quiz');
  box.innerHTML = QUIZ_HTML;
  box.hidden = false;

  const flag = $('flag');
  if(settings.showFlag){
    flag.onerror = () => flag.hidden = true;
    flag.src = `flags/${q.code}.png`;
    flag.alt = `Flag of ${q.country}`;
    flag.hidden = false;
  }

  const name = document.createElement('strong');
  name.textContent = q.country;
  $('question').append('What is the capital of ', name, '?');

  options.forEach(city => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = city;
    btn.onclick = () => { reveal(q, city); onAnswer(city === q.capital, city); };
    $('choices').appendChild(btn);
  });

  if(q.photo && settings.photo === 'before'){
    // Above the question with the flag tucked into its corner; the caption
    // mustn't name the capital until the player has answered.
    showPhoto(q, `Capital of ${q.country}`);
    $('photo').classList.add('before');
    box.insertBefore($('photo'), $('question'));
    if(settings.showFlag) $('photoFrame').appendChild(flag);
  }else if(q.photo && settings.photo === 'after'){
    new Image().src = q.photo; // warm the cache so the reveal is instant
  }
}

function showPhoto(q, caption){
  const fig = $('photo'), img = $('photoImg');
  img.onerror = () => {
    fig.hidden = true;
    if($('photoFrame').contains($('flag'))) $('quiz').insertBefore($('flag'), fig);
  };
  img.src = q.photo;
  img.alt = caption;
  $('photoCaption').textContent = caption;
  $('photoCredit').href = q.photoSource;
  fig.hidden = false;
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

  if(!q.photo) return;
  const caption = `${q.capital}, ${q.country}`;
  if(!$('photo').hidden){
    $('photoCaption').textContent = caption;
    $('photoImg').alt = caption;
  }else if(getSettings().photo === 'after'){
    showPhoto(q, caption);
  }
}

// ---------------- SHARE ----------------
const siteURL = () => location.origin + location.pathname.replace(/[^/]*$/, '');

function dailyShareText(correct){
  const date = new Date().toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'});
  return `🌍 World Capitals Daily · ${date}\n${correct ? '✅ Got it' : '❌ Missed it'} on ${getDifficulty().label}\n${siteURL()}`;
}
const practiceShareText = () => `🌍 World Capitals Practice · ${getDifficulty().label}\n${score}/${total} correct\n${siteURL()}`;

// Phones get the native share sheet; everything else copies to the clipboard.
async function share(btn, text){
  const label = btn.textContent;
  try{
    if(navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)){
      await navigator.share({text});
      return;
    }
    await navigator.clipboard.writeText(text);
  }catch(err){
    if(err.name === 'AbortError') return; // closed the share sheet
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if(!ok){ btn.textContent = "Couldn't copy"; setTimeout(() => btn.textContent = label, 2000); return; }
  }
  btn.textContent = 'Copied ✓';
  setTimeout(() => btn.textContent = label, 2000);
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
// Everyone on the same difficulty gets the same country (and options) on the same calendar date.
function todayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const dayNumber = key => Date.parse(key + 'T00:00:00Z') / 86400000; // whole days since 1970
const dailyIndex = (day, n) => (day * 7919) % n; // 7919 is prime, so every country comes up before any repeats

async function startDaily(){
  const db = await loadDB();
  const diff = getDifficulty();
  const pool = poolFor(db, diff);
  const today = todayKey(), day = dayNumber(today);
  const played = readJSON('dailyResult', null);
  const playedToday = played && played.date === today;

  // Already played today: show that question again, even if the difficulty has changed since.
  const q = (playedToday && db.find(c => c.country === played.country)) || pool[dailyIndex(day, pool.length)];
  const options = (playedToday && played.options) || pickOptions(q, pool, diff.sameRegion, seededRandom(day));
  $('info').textContent = `Same country for everyone on ${diff.label} today. You get one try.`;

  const finish = correct => {
    $('info').textContent = 'Come back tomorrow for a new country.';
    const btn = addAction('Share result', () => share(btn, dailyShareText(correct)));
    addAction('Keep practising', 'practice.html', true);
    addAction('Score history', 'scores.html', true);
  };

  showQuestion(q, options, (correct, city) => {
    mode = 'Daily'; difficulty = difficultyKey(); sessionId = Date.now(); score = correct ? 1 : 0; total = 1;
    writeJSON('dailyResult', {date:today, country:q.country, choice:city, options});
    saveScore();
    finish(correct);
  });
  $('label').textContent = new Date().toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'});

  if(playedToday){
    reveal(q, played.choice);
    finish(played.choice === q.capital);
  }
}

// ---------------- PRACTICE -------------
async function startPractice(){
  const db = await loadDB();
  const diff = getDifficulty();
  const pool = poolFor(db, diff);
  mode = 'Practice'; difficulty = difficultyKey(); score = 0; total = 0; sessionId = Date.now();
  $('info').innerHTML = `${diff.label} · ${pool.length} countries · <a href="settings.html">change</a>`;
  let order = shuffle([...pool]), i = 0;

  const next = () => {
    if(i >= order.length){ order = shuffle([...pool]); i = 0; }
    const number = total + 1;
    const q = order[i++];
    showQuestion(q, pickOptions(q, pool, diff.sameRegion), correct => {
      total++;
      if(correct) score++;
      saveScore();
      updatePracticeMeta(number);
      addAction('Next question →', next).focus();
      const btn = addAction('Share score', () => share(btn, practiceShareText()), true);
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
    const modeText = DIFFICULTIES[r.difficulty] ? `${r.mode} · ${DIFFICULTIES[r.difficulty].label}` : r.mode;
    [new Date(r.timestamp).toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'}), modeText, `${r.score} / ${r.total}`]
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
  for(const name of ['difficulty', 'photo', 'theme']){
    const input = document.querySelector(`input[name="${name}"][value="${s[name]}"]`)
      || document.querySelector(`input[name="${name}"][value="${DEFAULT_SETTINGS[name]}"]`);
    input.checked = true;
  }

  document.querySelectorAll('#settingsForm input').forEach(input => input.addEventListener('change', () => {
    const next = {
      difficulty:document.querySelector('input[name="difficulty"]:checked').value,
      showFlag:$('showFlag').checked,
      photo:document.querySelector('input[name="photo"]:checked').value,
      theme:document.querySelector('input[name="theme"]:checked').value,
    };
    writeJSON('settings', next);
    applyTheme(next.theme);
    $('saved').textContent = 'Saved ✓';
  }));

  loadDB().then(db => {
    for(const [key, diff] of Object.entries(DIFFICULTIES)) $(`blurb-${key}`).textContent = diff.blurb(poolFor(db, diff).length);
  }).catch(() => { /* keep the default descriptions */ });
}
