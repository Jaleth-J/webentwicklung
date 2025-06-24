const images = [
  "bilder/farrari.png",
  "bilder/alfa-romeo-logo.png",
  "bilder/bugatti-logo.png"
];

const answers = ["ferrari", "alfa romeo", "bugatti"];
let currentIndex = Math.floor(Math.random() * images.length);
let score = 0;

function updateImage() {
  const img = document.getElementById("car-image");
  img.src = images[currentIndex];
  img.style.filter = "none";
}

function loadScore() {
  const saved = localStorage.getItem("highscore");
  if (saved) {
    const parsed = JSON.parse(saved);
    score = parsed.level2 || 0;
    document.getElementById("score").textContent = score;
  }
}

function checkAnswer() {
  const guess = document.getElementById("brand-input").value.toLowerCase().trim();
  const correct = answers[currentIndex];

  if (guess === correct) {
    score++;
    alert("Richtig!");
    saveScoreToServer(score);
    saveScoreToLocal(score);
    nextImage();
  } else {
    alert("Falsch!");
    score = 0;
    saveScoreToLocal(score);
  }
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  updateImage();
  document.getElementById("brand-input").value = "";
}

function saveScoreToLocal(score) {
  const highscore = JSON.parse(localStorage.getItem("highscore")) || {};
  highscore.level2 = score;
  localStorage.setItem("highscore", JSON.stringify(highscore));
  document.getElementById("score").textContent = score;
}

async function saveScoreToServer(score) {
  const username = localStorage.getItem("username");
  if (!username) return;

  const res = await fetch("http://localhost:3000/saveScore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, level: "level2", score })
  });

  const data = await res.json();
  if (!data.success) {
    console.error("Fehler beim Score-Speichern im Backend");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  updateImage();
  loadScore();
});
