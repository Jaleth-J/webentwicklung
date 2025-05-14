const images = ["bilder/farrari.png", "bilder/alfa-romeo-logo.png", "bilder/bugatti-logo.png"];
const answers = ["farrari", "alfa romeo", "bugatti"];
let currentIndex = Math.floor(Math.random() * images.length);
let score = 0;

function updateImage() {
  const img = document.getElementById("car-image");
  img.src = images[currentIndex];
  img.style.filter = "none"; 
}

function loadScore() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    score = user.scores.leicht || 0;
    document.getElementById("score").textContent = score;
  }
}

function saveScore() {
  let users = JSON.parse(localStorage.getItem("users"));
  let current = JSON.parse(localStorage.getItem("currentUser"));

  users = users.map(u => {
    if (u.name === current.name) {
      u.scores.leicht = score;
      current.scores.leicht = score;
    }
    return u;
  });

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(current));
  document.getElementById("score").textContent = score;
}

function checkGuess() {
  const guess = document.getElementById("guess").value.toLowerCase().trim();
  const correct = answers[currentIndex];

  if (guess === correct) {
    score++;
    alert("Richtig!");
    saveScore();
    nextImage();
  } else {
    alert("Falsch!");
    score = 0;
    saveScore();
  }
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  updateImage();
  document.getElementById("guess").value = "";
}

window.addEventListener("DOMContentLoaded", () => {
  updateImage();
  loadScore();
});
