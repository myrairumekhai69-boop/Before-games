const startBtn = document.getElementById("startBtn");
const introScreen = document.getElementById("intro-screen");
const gameScreen = document.getElementById("game-screen");

startBtn.addEventListener("click", () => {
  introScreen.classList.add("fade-out");

  setTimeout(() => {
    introScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameScreen.classList.add("fade-in");
  }, 1000); // Matches 1s fade duration
});
