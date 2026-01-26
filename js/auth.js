import { API_BASE_URL } from "./constant.js";

let mode = "registration";
const toggleAuth = document.getElementsByClassName("toggle-auth");
const registrationFormWrapper = document.getElementById("registration");
const loginFormWrapper = document.getElementById("login");
const registrationForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

function authToggleFunction() {
  mode = mode == "registration" ? "login" : "registration";
  registrationFormWrapper.classList.toggle("hidden");
  loginFormWrapper.classList.toggle("hidden");
  console.log(mode)
  if (mode == "login") {
    document.title = "Login | VapourShare";
  } else if (mode == "registration") {
    document.title = "Registration | VapourShare";
  }
}

function validate(data) {
  if (!data.username || !data.password) {
    alert("Fill all the detail");
    return false;
  }
  if (
    mode === "registration" &&
    data.type != "sender" &&
    data.type != "receiver"
  ) {
    alert("Select one of the two role");
    return false;
  }
  return true;
}

async function registrationFunction(e) {
  e.preventDefault();
  const formData = new FormData(registrationForm);
  const data = Object.fromEntries(formData);

  if (!validate(data)) return;
  try {
    const res = await fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await res.json();

    if (!res.ok) {
      throw new Error(resData.message || "Something went wrong");
    }

    alert("User registered");
  } catch (err) {
    alert(err);
  }
}

async function loginFunction(e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData);

  if (!validate) return;
  try {
    const res = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await res.json();

    if (!res.ok) {
      throw new Error(resData.message || "Something went wrong");
    }

    alert("User logged in");
  } catch (err) {
    alert(err);
  }
}

Array.from(toggleAuth).forEach((e) => {
  e.addEventListener("click", authToggleFunction);
});
registrationForm.addEventListener("submit", registrationFunction);
loginForm.addEventListener("submit", loginFunction);
