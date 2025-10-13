// --- Before: Game Script ---
// Basic player setup and ambient animation

let player = {
  x: 0,
  y: 0,
  speed: 2,
  direction: 0,
  moving: false
};

const playerElement = document.createElement('div');
playerElement.className = 'player';
document.body.appendChild(playerElement);

// Handle movement
const keys = {};
window.addEventListener('keydown', e => (keys[e.key] = true));
window.addEventListener('keyup', e => (keys[e.key] = false));

function update() {
  player.moving = false;
  if (keys['w'] || keys['ArrowUp']) { player.y -= player.speed; player.direction = 0; player.moving = true; }
  if (keys['s'] || keys['ArrowDown']) { player.y += player.speed; player.direction = 180; player.moving = true; }
  if (keys['a'] || keys['ArrowLeft']) { player.x -= player.speed; player.direction = 270; player.moving = true; }
  if (keys['d'] || keys['ArrowRight']) { player.x += player.speed; player.direction = 90; player.moving = true; }

  playerElement.style.transform = `translate(${player.x}px, ${player.y}px) rotate(${player.direction}deg)`;

  // Idle animation pulse
  playerElement.style.opacity = player.moving ? '1' : (0.8 + Math.sin(Date.now()/500) * 0.1);

  requestAnimationFrame(update);
}
update();

// Ambient sound simulation (evening vibe)
const ambient = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c4b6c5103e.mp3?filename=evening-crickets-ambient.mp3');
ambient.loop = true;
ambient.volume = 0.4;
ambient.play().catch(() => {
  console.log('Autoplay blocked, sound will start after user interaction');
});
document.getElementById('startBtn').addEventListener('click', () => {
  alert('Game starting soon!');
});
