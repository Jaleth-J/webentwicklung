// main.js

window.addEventListener("DOMContentLoaded", () => {
  // Header + Login-Box einfügen
  document.getElementById("header").innerHTML = `
    <div class="header-container">
      <h1>Auto-Marken-Raten</h1>
      <button class="button small login-top" onclick="toggleLoginBox()">Login</button>
    </div>
    <div id="login-box" class="login-box hidden">
      <label for="username">Benutzer:</label>
      <input type="text" id="username" placeholder="z.B. max" />
      <label for="password">Passwort:</label>
      <input type="password" id="password" placeholder="z.B. 1234" />
      <button class="button" onclick="submitLogin()">Anmelden</button>
      <button class="button small" onclick="handleRegister()">Registrieren</button>
      <button class="button small" onclick="toggleTheme()">🌑</button>
      <div id="delete-user-container" style="display:none; margin-top:10px;">
        <button class="button small" id="delete-user-btn">🗑 Benutzer löschen</button>
      </div>
      <p id="login-message"></p>
    </div>
  `;

  // Wenn bereits eingeloggt, zeige den Button zum Löschen
  const username = localStorage.getItem("username");
  if (username) {
    const deleteContainer = document.getElementById("delete-user-container");
    const deleteBtn = document.getElementById("delete-user-btn");
    deleteContainer.style.display = "block";

    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Willst du deinen Account wirklich löschen?")) return;

      const res = await fetch("http://localhost:3000/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });

      const data = await res.json();
      if (data.success) {
        alert("Benutzer wurde gelöscht.");
        localStorage.clear();
        location.href = "index.html";
      } else {
        alert("Fehler beim Löschen.");
      }
    });
  }

  // Footer einfügen
  document.getElementById("footer").innerHTML = `
    <div class="footer-container">
      <span>© 2025</span>
      <button class="button small" onclick="location.href='index.html'">🏠 Startseite</button>
    </div>
  `;
});

function toggleLoginBox() {
  const box = document.getElementById("login-box");
  box.classList.toggle("hidden");
}

async function submitLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("login-message");

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("username", username);
      localStorage.setItem("highscore", JSON.stringify(data.highscore));
      msg.textContent = "Login erfolgreich!";
      msg.style.color = "limegreen";
      window.location.href = "modus.html";
    } else {
      msg.textContent = "Login fehlgeschlagen: " + data.message;
      msg.style.color = "red";
    }
  } catch (err) {
    msg.textContent = "Serverfehler: " + err.message;
    msg.style.color = "red";
  }
}

async function handleRegister() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("login-message");

  try {
    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      msg.textContent = "Registrierung erfolgreich! Du kannst dich jetzt einloggen.";
      msg.style.color = "limegreen";
    } else {
      msg.textContent = "Registrierung fehlgeschlagen: " + data.message;
      msg.style.color = "red";
    }
  } catch (err) {
    msg.textContent = "Serverfehler: " + err.message;
    msg.style.color = "red";
  }
}

async function updateScore(level, newScore) {
  const username = localStorage.getItem("username");
  if (!username) return;

  const res = await fetch("http://localhost:3000/update-score", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, level, score: newScore })
  });

  const data = await res.json();
  if (!data.success) {
    console.error("Fehler beim Score-Speichern");
  }
}

function toggleTheme() {
  const root = document.documentElement;
  if (root.classList.contains("light-mode")) {
    root.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  } else {
    root.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  }
}

// Theme anwenden
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
  document.documentElement.classList.add("light-mode");
}
document.getElementById('delete-user-btn')?.addEventListener('click', async () => {
  const username = localStorage.getItem('username');
  if (!username) return alert('Kein Benutzername gespeichert.');

  const sicher = confirm('Willst du deinen Benutzer wirklich löschen?');
  if (!sicher) return;

  try {
    const res = await fetch('http://localhost:3000/delete-user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    const data = await res.json();
    if (data.success) {
      alert('Benutzer gelöscht.');
      localStorage.clear();
      location.reload();
    } else {
      alert('Fehler: ' + data.message);
    }
  } catch (err) {
    alert('Fehler beim Löschen: ' + err.message);
  }
});

