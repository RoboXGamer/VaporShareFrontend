import { apiRequest, protectRoute } from "./api.js";

protectRoute("receiver");

const user = JSON.parse(localStorage.getItem("user"));
document.getElementById("user-display").innerText = `Hi, ${user.fullName}`;

const globalBody = document.getElementById("global-body");
const logoutBtn = document.getElementById("logout-btn");
const refreshBtn = document.getElementById("refresh-btn");
const modal = document.getElementById("file-modal");
const closeModal = document.getElementById("close-modal");

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

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

async function showDetails(id) {
  try {
    const response = await apiRequest(`/files/${id}`);
    const file = response.data;

    document.getElementById("modal-title").innerText = file.filename;
    document.getElementById("modal-desc").innerText = file.description;
    document.getElementById("modal-cat").innerText = file.category;
    document.getElementById("modal-sid").innerText = file.key;
    document.getElementById("modal-expiry").innerText = new Date(
      file.expiry
    ).toLocaleString();

    modal.style.display = "flex";
  } catch (error) {
    console.error("Failed to load file details");
  }
}

// Make it globally accessible for the onclick in dynamic rows
window.showDetails = showDetails;

async function loadGlobalFiles() {
  try {
    const response = await apiRequest("/files/all");
    const files = response.data;

    globalBody.innerHTML = files.length
      ? ""
      : '<tr><td colspan="5" class="text-center">No files available</td></tr>';

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
                <td>${file.userid?.username || "Unknown"}</td>
                <td>${dateStr}</td>
                <td><button onclick="showDetails('${
                  file._id
                }')" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">View Details</button></td>
            `;
      globalBody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load global files");
  }
}

refreshBtn.addEventListener("click", loadGlobalFiles);

loadGlobalFiles();
