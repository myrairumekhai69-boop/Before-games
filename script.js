// Get elements
const startBtn = document.getElementById("startBtn");
const introScreen = document.getElementById("intro-screen");
const gameScreen = document.getElementById("game-screen");

// Start button click event
startBtn.addEventListener("click", () => {
  // Fade out intro screen
  introScreen.classList.add("fade-out");

  // Wait for fade to finish, then switch screens
  setTimeout(() => {
    introScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameScreen.classList.add("fade-in");

    // Player exploring animation
    const player = document.querySelector(".player");
    player.classList.add("exploring"); // start exploring animation
  }, 1000); // Matches 1s fade duration
});
