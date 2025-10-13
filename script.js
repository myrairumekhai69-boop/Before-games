// updated version test — redeploy trigger

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const bgMusic = document.getElementById("bgMusic");

let particles = [];

// Particle class
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.alpha = 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.02;
    this.alpha -= 0.01;
  }

  draw() {
    ctx.fillStyle = `rgba(255, 60, 60, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Handle particles
function handleParticles() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].size <= 0.3 || particles[i].alpha <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
}

// On canvas click, create particles
canvas.addEventListener("click", e => {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(e.x, e.y));
  }
});

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  requestAnimationFrame(animate);
}

// Start button click event
startBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  bgMusic.volume = 0.5;
  bgMusic.play();
  animate();
});
