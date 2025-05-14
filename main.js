window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("header").innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center">
      
      <button class="button small login-top" onclick="location.href='login.html'">Login</button>
      <button class="button small" onclick="toggleTheme()">🌓</button>
    </div>
  `;
  document.getElementById("footer").innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <span>© 2025</span>
      <button class="button small" onclick="location.href='index.html'">🏠 Startseite</button>
    </div>
  `;
  
});




  
  
window.addEventListener("DOMContentLoaded", () => {
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
       <button class="button small" onclick="toggleTheme()">🌓</button>
      <p id="login-message"></p>
    </div>
  `;

  document.getElementById("footer").innerHTML = `
    <div class="footer-container">
      <span>© 2025</span>
      <button class="button small" onclick="location.href='index.html'">🏠 Startseite</button>
    </div>
  `;

  
  if (!localStorage.getItem("users")) {
    const defaultUser = [{
      name: "max",
      password: "1234",
      scores: {
        leicht: 0,
        schwer: 0
      }
    }];
    localStorage.setItem("users", JSON.stringify(defaultUser));
  }
});

function toggleLoginBox() {
  const box = document.getElementById("login-box");
  box.classList.toggle("hidden");
}

function submitLogin() {
  const uname = document.getElementById("username").value.toLowerCase();
  const pw = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("users"));
  const user = users.find(u => u.name === uname && u.password === pw);

  const box = document.getElementById("login-box");
  const msg = document.getElementById("login-message");

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    msg.textContent = "Login erfolgreich!";
    msg.style.color = "limegreen";

   
    box.innerHTML = `
      <label for="usernameEdit">Benutzername:</label>
      <input type="text" id="usernameEdit" value="${user.name}" />
      <label for="passwordEdit">Passwort:</label>
      <input type="password" id="passwordEdit" value="${user.password}" />
      <button class="button" onclick="editUser()">Bearbeiten</button>
      <button class="button" onclick="deleteUser()">Löschen</button>
      <p id="edit-message"></p>
    `;
  } else {
    msg.textContent = "Benutzername oder Passwort falsch.";
    msg.style.color = "red";
  }
}
function editUser() {
  const newName = document.getElementById("usernameEdit").value.toLowerCase();
  const newPw = document.getElementById("passwordEdit").value;
  let users = JSON.parse(localStorage.getItem("users"));
  let current = JSON.parse(localStorage.getItem("currentUser"));

  users = users.map(u => {
    if (u.name === current.name) {
      return { ...u, name: newName, password: newPw };
    }
    return u;
  });

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify({ ...current, name: newName, password: newPw }));

  document.getElementById("edit-message").textContent = "Daten aktualisiert.";
}
function deleteUser() {
  let users = JSON.parse(localStorage.getItem("users"));
  const current = JSON.parse(localStorage.getItem("currentUser"));

  users = users.filter(u => u.name !== current.name);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.removeItem("currentUser");

  
  const box = document.getElementById("login-box");
  box.innerHTML = `
    <label for="username">Benutzer:</label>
    <input type="text" id="username" placeholder="z.B. max" />
    <label for="password">Passwort:</label>
    <input type="password" id="password" placeholder="z.B. 1234" />
    <button class="button" onclick="submitLogin()">Anmelden</button>
    <p id="login-message"></p>
  `;
}
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
  document.documentElement.classList.add("light-mode");

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
