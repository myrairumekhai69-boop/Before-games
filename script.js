/* script.js
   Cinematic Scene 1 -> Scene 2 (Escape) prototype
   - uses audio elements in index.html
   - tries to play /voices/* files if present; otherwise falls back to speechSynthesis
*/

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

// UI / audio elements
const startBtn = document.getElementById('startBtn');
const skipBtn = document.getElementById('skipBtn');
const subtitlesBox = document.getElementById('subtitles');

const audio = {
  piano: document.getElementById('audio-piano'),
  strings: document.getElementById('audio-strings'),
  rain: document.getElementById('audio-rain'),
  sfxExplosion: document.getElementById('sfx-explosion'),
  sfxThunder: document.getElementById('sfx-thunder'),
  sfxFoot: document.getElementById('sfx-foot'),
  voices: {
    steven: document.getElementById('v_steven'),
    tamara: document.getElementById('v_tamara'),
    choke: document.getElementById('v_choke'),
    tami: document.getElementById('v_tami')
  }
};

// helper: play voice (tries file first, otherwise speechSynthesis)
async function playVoice(role, text) {
  const audioEl = audio.voices[role];
  if (audioEl && audioEl.src && !audioEl.src.includes('undefined')) {
    try {
      audioEl.pause(); audioEl.currentTime = 0;
      await audioEl.play();
      return new Promise(resolve => {
        audioEl.onended = () => { audioEl.onended = null; resolve(); };
      });
    } catch (e) {
      // fallback to speech
    }
  }
  // fallback: speechSynthesis (voice selection)
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      // no speech API — just show for timed duration
      setTimeout(resolve, Math.max(1400, text.length * 60));
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    // choose male/female voice heuristically
    const voices = window.speechSynthesis.getVoices();
    if (role === 'tamara' || role === 'tami') {
      const v = voices.find(v => /female|zira|samantha|kate|anna/i.test(v.name)) || voices.find(v=>/en/i.test(v.lang));
      if (v) u.voice = v;
    } else {
      const v = voices.find(v => /male|david|matthew|john/i.test(v.name)) || voices.find(v=>/en/i.test(v.lang));
      if (v) u.voice = v;
    }
    u.rate = 0.92; u.pitch = 1.0; u.volume = 1.0;
    u.onend = () => resolve();
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  });
}

// subtitle display (click to skip)
let subtitleTimeout = null;
function showSubtitle(text, duration = 3000) {
  subtitlesBox.style.display = 'block';
  subtitlesBox.innerText = text;
  // clicking subtitles advances the dialogue (skip)
  subtitlesBox.onclick = () => { if (subtitleTimeout) { clearTimeout(subtitleTimeout); subtitleTimeout = null;} };
  if (subtitleTimeout) clearTimeout(subtitleTimeout);
  subtitleTimeout = setTimeout(() => {
    subtitlesBox.style.display = 'none';
    subtitleTimeout = null;
  }, duration);
}

// cinematic data: automatic lines (role, text, optional delay before next)
const cinematic = [
  { role: 'tamara', text: "You wouldn't believe what I saw today. A patient without cortical activity started moving on its own.", delay: 1400 },
  { role: 'steven', text: "A virus? Is that even possible?", delay: 1200 },
  { role: 'tamara', text: "I think so. I've never seen anything like it. We should consider leaving the city — it could spread.", delay: 1600 },
  { role: 'choke', text: "Hey — what's going on? We heard an explosion near the hospital. Doctors were running out.", delay: 1400 },
  { role: 'tamara', text: "We need to go. Now.", delay: 1000 }
];

// small utility to fade audio element volume over time (ms)
function fadeAudio(el, from, to, ms=2000) {
  if (!el) return;
  const steps = 30;
  const stepTime = ms / steps;
  let cur = from;
  const diff = (to - from) / steps;
  el.volume = Math.max(0, Math.min(1, cur));
  let i = 0;
  const t = setInterval(() => {
    i++;
    cur += diff;
    el.volume = Math.max(0, Math.min(1, cur));
    if (i >= steps) { clearInterval(t); el.volume = Math.max(0, Math.min(1, to)); }
  }, stepTime);
}

// draw helpers: background rain, silhouettes, simple parallax
let raindrops = [];
function initRain() {
  raindrops = [];
  const count = Math.floor(canvas.width * canvas.height / 100000 * 120); // scale with resolution
  for (let i=0;i<count;i++){
    raindrops.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      len: 8 + Math.random()*18,
      speed: 3 + Math.random()*6,
      alpha: 0.18 + Math.random()*0.35
    });
  }
}
initRain();

// characters positions for Scene 1 (outside)
const chars = {
  steven: { x: canvas.width*0.44, y: canvas.height*0.66, color: '#bfb3a9' },
  tamara: { x: canvas.width*0.64, y: canvas.height*0.66, color: '#caa3a8' },
  choke: { x: canvas.width*0.25, y: canvas.height*0.7, color: '#aab5c1' },
  tami: { x: canvas.width*0.22, y: canvas.height*0.78, color: '#ffd9d9' }
};

// scene control
let currentScene = 1;
let cinematicIndex = 0;
let isSkipping = false;
let sceneRunning = false;

// basic draw functions
function drawScene1() {
  // dark wet street gradient
  const g = ctx.createLinearGradient(0,0,0,canvas.height);
  g.addColorStop(0, '#07121b');
  g.addColorStop(1, '#000000');
  ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);

  // wet reflective road area
  ctx.fillStyle = 'rgba(30,30,38,0.35)';
  ctx.fillRect(0, canvas.height*0.72, canvas.width, canvas.height*0.28);

  // subtle distant silhouettes (city skyline)
  ctx.fillStyle = 'rgba(10,10,14,0.6)';
  for (let i=0;i<40;i++){
    const w = 60 + (i%7)*20;
    const h = 60 + ((i*7)%200);
    ctx.fillRect(i*(canvas.width/40) - 20, canvas.height*0.5 - h, w, h);
  }

  // draw raindrops
  ctx.strokeStyle = 'rgba(170,180,220,0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let r of raindrops) {
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(r.x - 1.8, r.y + r.len);
  }
  ctx.stroke();

  // characters (colored silhouettes)
  for (const k of ['steven','tamara','choke','tami']) {
    const c = chars[k];
    ctx.fillStyle = c.color;
    // simple silhouette: head + body
    ctx.beginPath();
    ctx.arc(c.x, c.y - 36, 12, 0, Math.PI*2);
    ctx.fill();
    ctx.fillRect(c.x - 12, c.y - 36 + 12, 24, 44);
  }
}

function drawScene2(carState) {
  // interior: show windshield with rain drops and blurred outside
  // dark interior base:
  ctx.fillStyle = '#07070a'; ctx.fillRect(0,0,canvas.width,canvas.height);
  // outside blurred shapes:
  ctx.fillStyle = 'rgba(20,20,24,0.9)'; ctx.fillRect(0,0,canvas.width,canvas.height);
  // windshield sheen
  ctx.fillStyle = 'rgba(120,130,150,0.04)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  // simple dashboard silhouette
  ctx.fillStyle = '#050506';
  ctx.fillRect(0, canvas.height*0.78, canvas.width, canvas.height*0.22);
  // place 3 adults sitting ahead as colored silhouettes
  ctx.fillStyle = '#bfb3a9'; // steven left
  ctx.fillRect(canvas.width*0.36 - 20, canvas.height*0.5 - 60, 36, 60);
  ctx.fillStyle = '#caa3a8'; // tamara center
  ctx.fillRect(canvas.width*0.48 - 18, canvas.height*0.48 - 60, 36, 60);
  ctx.fillStyle = '#aab5c1'; // choke right
  ctx.fillRect(canvas.width*0.60 - 20, canvas.height*0.5 - 60, 36, 60);
  // littletami view: draw the doll/hotspot on her lap (interactive)
  if (carState && carState.showDoll) {
    ctx.fillStyle = '#ffd9d9';
    ctx.beginPath();
    const dx = canvas.width*0.62; const dy = canvas.height*0.78;
    ctx.arc(dx, dy, 10, 0, Math.PI*2); ctx.fill();
  }
  // rain streaks on windshield (vertical)
  ctx.strokeStyle = 'rgba(180,200,240,0.06)'; ctx.lineWidth = 2;
  for (let i=0;i<30;i++){
    const x = (i/30)*canvas.width + (Math.sin(perf*0.001 + i)*12);
    ctx.beginPath(); ctx.moveTo(x, -20); ctx.lineTo(x+2, canvas.height); ctx.stroke();
  }
}

// animation timing
let lastTime = performance.now(), perf = 0;
function animateLoop(t) {
  perf = t;
  const dt = (t - lastTime)/1000; lastTime = t;

  // update raindrops positions
  for (let r of raindrops) {
    r.y += r.speed * dt * 60;
    if (r.y > canvas.height + r.len) { r.y = -r.len; r.x = Math.random()*canvas.width; }
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);
  if (currentScene === 1) {
    drawScene1();
  } else if (currentScene === 2) {
    drawScene2(window.carState);
  }

  requestAnimationFrame(animateLoop);
}
requestAnimationFrame(animateLoop);

// --- cinematic flow control ---
async function playCinematic() {
  if (sceneRunning) return;
  sceneRunning = true;
  // start piano softly and rain soon
  audio.piano.volume = 0.9; audio.strings.volume = 0.0; audio.rain.volume = 0.0;
  try { await audio.piano.play(); } catch(e){ /* may be blocked */ }
  setTimeout(() => { audio.rain.play().catch(()=>{}); fadeAudio(audio.rain, 0, 0.35, 1200); }, 700);

  // play scripted lines
  for (let i = 0; i < cinematic.length; i++) {
    if (isSkipping) break;
    const item = cinematic[i];
    // show subtitle and play voice
    showSubtitle(item.text, Math.max(2000, item.text.length * 65));
    await playVoice(item.role, item.text);
    // optional short delay
    await new Promise(r => setTimeout(r, item.delay || 600));
    // during last lines ramp strings and schedule piano fade out before explosion
    if (i === 2) {
      // prepare for rising tension (strings slightly fade-in)
      fadeAudio(audio.strings, 0, 0.35, 2500);
    }
    if (i === cinematic.length - 2) {
      // explosion imminent: fade piano out slowly
      fadeAudio(audio.piano, audio.piano.volume, 0.02, 4000);
    }
  }

  if (!isSkipping) {
    // explosion moment
    audio.sfxExplosion.currentTime = 0; audio.sfxExplosion.play().catch(()=>{});
    // quick bright flash effect
    await flashScreen(180);
  }

  // after explosion, strings take lead, rain continues
  fadeAudio(audio.strings, audio.strings.volume, 0.6, 2200);
  fadeAudio(audio.piano, audio.piano.volume, 0.0, 1200);

  // quick pause then transition to Scene 2
  await new Promise(r => setTimeout(r, 900));
  goToScene2();
}

// small screen flash helper
function flashScreen(ms=180) {
  return new Promise(resolve => {
    const start = performance.now();
    const step = (t) => {
      const p = (t - start) / ms;
      ctx.fillStyle = `rgba(255,255,255,${1 - Math.max(0,1-p)})`;
      ctx.fillRect(0,0,canvas.width,canvas.height);
      if (t - start < ms) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

function goToScene2() {
  // scene switch: fade to black then show car interior
  currentScene = 2;
  // small car state
  window.carState = { showDoll: true };
  // show subtitles for subsequent dialog (auto-play inside car)
  autoPlayCarDialog();
}

// car dialog script
const carDialog = [
  { role:'choke', text: "We need to pick a route. The highway could be blocked." },
  { role:'steven', text: "Mountains — fewer people, less chance of trouble. It's longer but safer." },
  { role:'tamara', text: "We don't have time to argue. We leave now and head for the passes." },
  { role:'steven', text: "Hold on tight, Tami. We'll get out together." }
];

// play car dialog with voices + subtitles
async function autoPlayCarDialog() {
  for (let i=0;i<carDialog.length;i++){
    if (isSkipping) break;
    const item = carDialog[i];
    showSubtitle(item.text, Math.max(2000, item.text.length * 65));
    await playVoice(item.role, item.text);
    await new Promise(r => setTimeout(r, 500));
  }
  // end cinematic
  showSubtitle("Next Chapter Coming Soon", 4000);
  // optionally fade out strings slowly
  fadeAudio(audio.strings, audio.strings.volume, 0.12, 4000);
}

// Start / skip controls
startBtn.onclick = async () => {
  // resume any suspended audio contexts (some browsers)
  try { await Promise.all([audio.piano.play().catch(()=>{}), audio.rain.play().catch(()=>{} )]); } catch(e){}

  startBtn.style.display = 'none';
  skipBtn.style.display = 'inline-block';
  subtitlesBox.style.display = 'block';

  // give small delay then play
  setTimeout(() => { playCinematic().catch(()=>{}); }, 220);
};

skipBtn.onclick = () => {
  isSkipping = true;
  // stop voices and speech
  try { window.speechSynthesis.cancel(); } catch(e){}
  // pause audio quickly and jump to scene 2
  try { audio.piano.pause(); audio.strings.pause(); audio.rain.play().catch(()=>{}); } catch(e){}
  goToScene2();
  subtitlesBox.style.display = 'none';
};

// clicking subtitles will also skip current line
subtitlesBox.onclick = () => {
  // fast-forward: cancel speech or advance
  try { window.speechSynthesis.cancel(); } catch(e){}
  subtitlesBox.style.display = 'none';
};

// basic interaction in car (Lil Tami looks around + hotspots)
let dragging = false;
let look = { angleX: 0 };
canvas.addEventListener('pointerdown', (e) => { dragging = true; lastPointerX = e.clientX; });
canvas.addEventListener('pointerup', () => { dragging = false; });
let lastPointerX = 0;
canvas.addEventListener('pointermove', (e) => {
  if (!dragging || currentScene !== 2) return;
  const dx = e.clientX - lastPointerX;
  lastPointerX = e.clientX;
  look.angleX = Math.max(-20, Math.min(20, look.angleX + dx * 0.15));
  // slight parallax: move silhouettes
  chars.steven.x = canvas.width*0.36 - look.angleX*0.6;
  chars.tamara.x = canvas.width*0.48 - look.angleX*0.3;
  chars.choke.x = canvas.width*0.60 - look.angleX*0.2;
});

// hotspot interaction (e.g., doll on lap)
canvas.addEventListener('click', (e) => {
  if (currentScene !== 2) return;
  const dx = e.clientX, dy = e.clientY;
  // doll area heuristic
  const dollX = canvas.width*0.62, dollY = canvas.height*0.78, r=28;
  const dist = Math.hypot(dx - dollX, dy - dollY);
  if (dist < r) {
    // small reaction and voice
    showSubtitle("Lil Tami: *Hello, dolly.*", 2000);
    playVoice('tami', "Hello, dolly.").catch(()=>{});
    // toggle doll visibility / small effect
    window.carState.showDoll = !window.carState.showDoll;
  }
});

// preload speech voices list (some browsers won't populate until used)
window.speechSynthesis && window.speechSynthesis.getVoices();

// end file
