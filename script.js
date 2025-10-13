// ====== Scene 1: Rain & Character Intro ======
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Background fade effect
let opacity = 0;

// Load rain sound
const rainSound = new Audio("https://cdn.pixabay.com/download/audio/2023/03/16/audio_4c1c6ffec5.mp3?filename=rain-and-thunder-ambient-14415.mp3");
rainSound.loop = true;
rainSound.volume = 0.6;

// Start sound once player interacts
window.addEventListener("click", () => {
  rainSound.play();
});

// Player object
const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 100,
  width: 30,
  height: 60,
  color: "rgba(255,255,255,0.85)",
  speed: 5
};

// Keyboard input
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// Rain drops
const rain = [];
for (let i = 0; i < 150; i++) {
  rain.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    length: Math.random() * 15 + 10,
    speed: Math.random() * 4 + 2
  });
}

// Draw player and rain
function draw() {
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fade-in background
  if (opacity < 1) opacity += 0.002;
  ctx.globalAlpha = opacity;

  // Draw rain
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 1;
  rain.forEach(drop => {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x, drop.y + drop.length);
    ctx.stroke();

    drop.y += drop.speed;
    if (drop.y > canvas.height) drop.y = -10;
  });

  ctx.globalAlpha = 1;

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Update player position
function update() {
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;
  if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;

  // Keep player within screen
  player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
  player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
}

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
