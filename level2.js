const images = ["bilder/farrari.png", "bilder/alfa-romeo-logo.png", "bilder/bugatti-logo.png"];
const answers = ["farrari", "alfa-romeo", "bugatti"];
let currentIndex = Math.floor(Math.random() * images.length);
let attempts = 0;
let score = 0;

function updateImage() {
  const img = document.getElementById("car-image");
  img.src = images[currentIndex];
  let blur = Math.max(20 - attempts * 5, 0);
  img.style.filter = "blur(" + blur + "px)";
}

function loadScore() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    score = user.scores.schwer || 0;
    document.getElementById("score").textContent = score;
  }
}

function saveScore() {
  let users = JSON.parse(localStorage.getItem("users"));
  let current = JSON.parse(localStorage.getItem("currentUser"));

  users = users.map(u => {
    if (u.name === current.name) {
      u.scores.schwer = score;
      current.scores.schwer = score;
    }
    return u;
  });

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(current));
  document.getElementById("score").textContent = score;
}

function checkAnswer() {
  const input = document.getElementById("brand-input").value.toLowerCase().trim();
  const correct = answers[currentIndex];

  if (input === correct) {
    score++;
    alert("Richtig!");
    saveScore();
    nextImage();
  } else {
    alert("Falsch!");
    attempts++;
    updateImage();
  }
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  attempts = 0;
  updateImage();
  document.getElementById("brand-input").value = "";
}

window.addEventListener("DOMContentLoaded", () => {
  updateImage();
  loadScore();
});
