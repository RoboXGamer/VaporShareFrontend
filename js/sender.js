import { apiRequest, protectRoute } from "./api.js";

protectRoute("sender");

const user = JSON.parse(localStorage.getItem("user"));
document.getElementById("user-display").innerText = `Hi, ${user.fullName}`;

const uploadForm = document.getElementById("upload-form");
const historyBody = document.getElementById("history-body");
const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {
  try {
    await apiRequest("/users/logout", { method: "POST" });
    localStorage.removeItem("user");
    window.location.href = "index.html";
  } catch (error) {
    localStorage.removeItem("user");
    window.location.href = "index.html";
  }
});

async function loadHistory() {
  try {
    const response = await apiRequest("/files/history");
    const files = response.data;

    historyBody.innerHTML = files.length
      ? ""
      : '<tr><td colspan="4" class="text-center">No uploads yet</td></tr>';

    files.forEach((file) => {
      const row = document.createElement("tr");
      const dateStr = file.createdAt
        ? new Date(file.createdAt)
            .toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
            .replace(",", "")
        : "N/A";

      row.innerHTML = `
                <td>${file.filename}</td>
                <td><span class="badge">${file.category}</span></td>
                <td>${dateStr}</td>
                <td><button onclick="alert('Key: ${file.key}')" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">View Link</button></td>
            `;
      historyBody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load history");
  }
}

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    filename: e.target.fileName.value,
    description: e.target.description.value,
    category: e.target.categoryTag.value,
    key: Math.random().toString(36).substring(2) + Date.now().toString(36),
    expiry: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
  };

  try {
    await apiRequest("/files/", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    alert("File metadata created successfully!");
    e.target.reset();
    loadHistory();
  } catch (error) {
    // Handled in api.js
  }
});

loadHistory();
