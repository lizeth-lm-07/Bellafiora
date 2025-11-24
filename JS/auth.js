// ===============================
// HELPERS DE AUTH
// ===============================
function getUsers() {
  const raw = localStorage.getItem("users");
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

// 🔐 Logout: solo borra al usuario actual
function logoutUser() {
  clearCurrentUser();
  updateAuthUI();
  console.log("Sesión cerrada. currentUser eliminado.");
}

// ===============================
// MODAL LOGIN / REGISTRO
// ===============================
function openAuthModal(defaultTab = "login") {
  const modal = document.getElementById("authModal");
  if (!modal) return;

  modal.classList.remove("hidden");

  const tabLogin = document.querySelector('.auth-tab[data-auth-tab="login"]');
  const tabSignup = document.querySelector('.auth-tab[data-auth-tab="signup"]');
  const formLogin = document.getElementById("loginForm");
  const formSignup = document.getElementById("signupForm");

  if (!tabLogin || !tabSignup || !formLogin || !formSignup) return;

  if (defaultTab === "signup") {
    tabSignup.classList.add("auth-tab-active");
    tabLogin.classList.remove("auth-tab-active");
    formSignup.classList.add("auth-form-active");
    formLogin.classList.remove("auth-form-active");
  } else {
    tabLogin.classList.add("auth-tab-active");
    tabSignup.classList.remove("auth-tab-active");
    formLogin.classList.add("auth-form-active");
    formSignup.classList.remove("auth-form-active");
  }
}

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  modal.classList.add("hidden");
}

// ===============================
// UI DEL HEADER (icono + nombre + logout)
// ===============================
function updateAuthUI() {
  const user = getCurrentUser();
  const userBtn   = document.getElementById("headerUserBtn");
  const userLabel = document.getElementById("headerUserLabel");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!userBtn) return; // por si estás en una página sin header

  if (user) {
    // Usuario logueado
    userBtn.classList.add("logged-in");

    if (userLabel) {
      const firstName = user.name ? user.name.split(" ")[0] : user.email;
      userLabel.textContent = firstName;
      userLabel.style.display = "inline-block";
    }

    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
    }
  } else {
    // Sin sesión
    userBtn.classList.remove("logged-in");

    if (userLabel) {
      userLabel.textContent = "";
      userLabel.style.display = "none";
    }

    if (logoutBtn) {
      logoutBtn.style.display = "none";
    }
  }
}

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const userBtn   = document.getElementById("headerUserBtn");
  const closeBtn  = document.getElementById("authCloseBtn");
  const backdrop  = document.querySelector("#authModal .auth-modal-backdrop");
  const logoutBtn = document.getElementById("logoutBtn");

  const tabLogin  = document.querySelector('.auth-tab[data-auth-tab="login"]');
  const tabSignup = document.querySelector('.auth-tab[data-auth-tab="signup"]');
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginMsg  = document.getElementById("loginMsg");
  const signupMsg = document.getElementById("signupMsg");

  // Abrir modal desde icono
  if (userBtn) {
    userBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openAuthModal("login");
    });
  }

  // Cerrar modal
  if (closeBtn) {
    closeBtn.addEventListener("click", closeAuthModal);
  }
  if (backdrop) {
    backdrop.addEventListener("click", closeAuthModal);
  }

  // Tabs
  if (tabLogin && tabSignup) {
    tabLogin.addEventListener("click", () => openAuthModal("login"));
    tabSignup.addEventListener("click", () => openAuthModal("signup"));
  }

  // SIGNUP
  if (signupForm && signupMsg) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;

      signupMsg.textContent = "";
      signupMsg.className = "auth-msg";

      if (!name || !email || !password) {
        signupMsg.textContent = "Llena todos los campos.";
        signupMsg.classList.add("error");
        return;
      }

      if (password.length < 6) {
        signupMsg.textContent = "La contraseña debe tener al menos 6 caracteres.";
        signupMsg.classList.add("error");
        return;
      }

      const users = getUsers();
      const exists = users.find((u) => u.email === email);

      if (exists) {
        signupMsg.textContent = "Este correo ya está registrado.";
        signupMsg.classList.add("error");
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      saveUsers(users);

      signupMsg.textContent = "Cuenta creada. Ahora puedes iniciar sesión.";
      signupMsg.classList.add("success");
      signupForm.reset();
    });
  }

  // LOGIN
  if (loginForm && loginMsg) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      loginMsg.textContent = "";
      loginMsg.className = "auth-msg";

      const users = getUsers();
      const user = users.find((u) => u.email === email && u.password === password);

      if (!user) {
        loginMsg.textContent = "Correo o contraseña incorrectos.";
        loginMsg.classList.add("error");
        return;
      }

      setCurrentUser(user);
      updateAuthUI();
      closeAuthModal();
      loginForm.reset();
      console.log("Usuario logueado:", user);
    });
  }

  // LOGOUT
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("¿Seguro que deseas cerrar sesión?")) {
        logoutUser();

        // Opcional: si estás en checkout, regresarlo al inicio
        if (location.pathname.includes("checkout.html")) {
          window.location.href = "index.html";
        }
      }
    });
  }

  // Al cargar la página, actualizar header
  updateAuthUI();
});
