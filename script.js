const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const overlay = document.getElementById("overlay");
const bgMusic = document.getElementById("bgMusic");
const rainSound = document.getElementById("rainSound");

let opacity = 0; // fade-in control
let player = { x: canvas.width / 2, y: canvas.height - 100, speed: 5 };
let keys = {};
let showTamara = false;

// 🌧️ simple rain particles
let drops = [];
for (let i = 0; i < 200; i++) {
  drops.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 4 + Math.random() * 4,
    length: 10 + Math.random() * 10
  });
}

function drawRain() {
  ctx.strokeStyle = "rgba(180,180,255,0.3)";
  ctx.lineWidth = 1;
  for (let drop of drops) {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x, drop.y + drop.length);
    ctx.stroke();
  }
}

function updateRain() {
  for (let drop of drops) {
    drop.y += drop.speed;
    if (drop.y > canvas.height) {
      drop.y = 0 - drop.length;
      drop.x = Math.random() * canvas.width;
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillRect(player.x - 10, player.y - 50, 20, 50);
}

function drawTamara() {
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(canvas.width / 2 + 150, canvas.height - 130, 20, 50);
}

function fadeInScene() {
  ctx.fillStyle = `rgba(0,0,0,${1 - opacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (opacity < 1) opacity += 0.01;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRain();
  updateRain();

  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  drawPlayer();
  if (showTamara) drawTamara();
  fadeInScene();
  requestAnimationFrame(animate);
}

// 🎬 Start sequence
window.addEventListener("load", () => {
  bgMusic.volume = 0.6;
  rainSound.volume = 0.3;

  bgMusic.play();
  setTimeout(() => rainSound.play(), 2000);

  // Fade out piano after 8 seconds
  const fadeOutMusic = setInterval(() => {
    if (bgMusic.volume > 0.01) {
      bgMusic.volume -= 0.01;
    } else {
      bgMusic.pause();
      clearInterval(fadeOutMusic);
    }
  }, 300);

  // Fade out overlay
  setTimeout(() => overlay.classList.add("fade-out"), 2000);

  // Tamara appears slowly
  setTimeout(() => (showTamara = true), 10000);

  animate();
});

// Controls
window.addEventListener("keydown", e => (keys[e.key] = true));
window.addEventListener("keyup", e => (keys[e.key] = false));
