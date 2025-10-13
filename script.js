document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const introScreen = document.getElementById("introScreen");
  const gameScreen = document.getElementById("gameScreen");
  const bgMusic = new Audio("https://cdn.pixabay.com/audio/2023/03/16/audio_3e08b3b1e9.mp3");

  bgMusic.loop = true;
  bgMusic.volume = 0.5;

  startButton.addEventListener("click", () => {
    // Play music if not already playing
    bgMusic.play();

    // Fade out intro screen
    introScreen.style.opacity = "0";
    introScreen.style.transition = "opacity 1s ease";

    // After fade, show game screen
    setTimeout(() => {
      introScreen.style.display = "none";
      gameScreen.style.display = "flex";
    }, 1000);
  });
});
