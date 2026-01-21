let config = null;

async function getConfig() {
  if (config) return config;
  try {
    const response = await fetch("./config.json");
    config = await response.json();
    return config;
  } catch (e) {
    console.warn("Could not load config.json, using default");
    return { API_BASE_URL: "http://localhost:8000/api/v1" };
  }
}

export async function apiRequest(endpoint, options = {}) {
  const { API_BASE_URL } = await getConfig();
  const url = `${API_BASE_URL}${endpoint}`;

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Include credentials (cookies) for all requests
  const config = {
    ...options,
    headers,
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    alert(error.message); // Simple alert for now as requested
    throw error;
  }
}

export function redirectIfLoggedIn() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    if (user.type === "sender") {
      window.location.href = "/sender.html";
    } else if (user.type === "receiver") {
      window.location.href = "/receiver.html";
    }
  }
}

export function protectRoute(requiredRole) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "/index.html";
    return;
  }
  if (requiredRole && user.type !== requiredRole) {
    alert("Unauthorized access");
    window.location.href = "/index.html";
  }
}
