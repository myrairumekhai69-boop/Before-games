// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Overlay and button elements
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");

// Play background music
const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.3;

// Fade-out and start animation
startBtn.addEventListener("click", () => {
  bgMusic.play();
  overlay.style.transition = "opacity 1.2s ease";
  overlay.style.opacity = "0";

  setTimeout(() => {
    overlay.style.display = "none";
    startAnimation();
  }, 1200);
});

// Particle setup
const particles = [];

for (let i = 0; i < 150; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 1.5,
    speedY: (Math.random() - 0.5) * 1.5,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateParticles() {
  particles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });
}

function startAnimation() {
  function animate() {
    drawParticles();
    updateParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

// Adjust canvas on resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
