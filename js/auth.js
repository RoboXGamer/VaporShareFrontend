import { apiRequest, redirectIfLoggedIn } from "./api.js";

let isLogin = true;

const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authDesc = document.getElementById("auth-desc");
const authBtn = document.getElementById("auth-btn");
const toggleBtn = document.getElementById("toggle-auth");
const fullNameGroup = document.getElementById("fullname-group");
const roleGroup = document.getElementById("role-group");

// Redirect if already logged in
redirectIfLoggedIn();

toggleBtn.addEventListener("click", () => {
  isLogin = !isLogin;
  if (isLogin) {
    authTitle.innerText = "Welcome Back";
    authDesc.innerText = "Login to your VaporShare account";
    authBtn.innerText = "Login";
    toggleBtn.innerText = "Need an account? Register";
    fullNameGroup.style.display = "none";
    roleGroup.style.display = "none";
  } else {
    authTitle.innerText = "Create Account";
    authDesc.innerText = "Get started with VaporShare";
    authBtn.innerText = "Register";
    toggleBtn.innerText = "Already have an account? Login";
    fullNameGroup.style.display = "flex";
    roleGroup.style.display = "flex";
  }
});

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    username: e.target.username.value,
    email: e.target.email.value,
    password: e.target.password.value,
  };

  if (!isLogin) {
    formData.fullName = e.target.fullName.value;
    formData.type = e.target.role.value;
  }

  const endpoint = isLogin ? "/users/login" : "/users/register";

  try {
    const response = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const userData = isLogin ? response.data.user : response.data.user;
    localStorage.setItem("user", JSON.stringify(userData));

    // Redirect based on type
    if (userData.type === "sender") {
      window.location.href = "sender.html";
    } else {
      window.location.href = "receiver.html";
    }
  } catch (error) {
    // Error is handled in api.js alert
  }
});
