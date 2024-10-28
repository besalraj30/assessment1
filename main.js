const sidebarLinks = document.querySelectorAll(".sidebar nav ul li a");
const tabLinks = document.querySelectorAll(".tab-link");
const tabContent = document.getElementById("tabContent");
const spinner = document.getElementById("spinner");
const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");
 
// Sidebar functionality
sidebarLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelector(".sidebar nav ul li a.active")
      .classList.remove("active");
    link.classList.add("active");
    const section = link.textContent.trim();
    loadContentFromSidebar(section);
  });
});
 
// Tab functionality
tabLinks.forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelector(".tab-link.active").classList.remove("active");
    tab.classList.add("active");
    const tabId = tab.getAttribute("data-tab");
    loadContent(tabId);
  });
});
 
// Function to load dummy data into the table for each tab
function loadContent(tabId) {
  tabContent.innerHTML = "";
  spinner.classList.remove("hidden");
  // Fetch multiple items from JSONPlaceholder API
  fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      spinner.classList.add("hidden");
      renderTable(data);
    })
    .catch((error) => {
      spinner.classList.add("hidden");
      tabContent.innerHTML =
        "<p>Failed to load content. Please try again later.</p>";
      console.error("Error:", error);
    });
}
 
// Function to render data in a table format
function renderTable(data) {
  let tableHTML = `
        <table>
            <thead>
                <tr class="first-row">
                    <th>ID</th>
                    <th>Title</th>
                    <th>Content</th>
                </tr>
            </thead>
            <tbody>
    `;
  data.forEach((item) => {
    tableHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.body}</td>
            </tr>
        `;
  });
  tableHTML += `</tbody></table>`;
  tabContent.innerHTML = tableHTML;
 
  // Add event listeners to each row for selection
  const rows = document.querySelectorAll("#tabContent tr");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      rows.forEach((r) => r.classList.remove("selected-row"));
      row.classList.add("selected-row");
    });
  });
}
function openModal(data) {
  modalContent.innerHTML = `<p>Loading...</p>`;
  modalOverlay.classList.remove("hidden");
 
  // Fetch data from mock API for modal content
  fetch(`https://jsonplaceholder.typicode.com/users`)
    .then((response) => response.json())
    .then((userData) => {
      // Render table in modal
      let tableHTML = `
                <table class="modal-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
      userData.forEach((user) => {
        tableHTML += `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                        </tr>
                    `;
      });
      tableHTML += `</tbody></table>`;
      modalContent.innerHTML = tableHTML;
    })
    .catch((error) => {
      modalContent.innerHTML = "<p>Failed to load data.</p>";
    });
}
 
 
// Close the modal
function closeModalFunction() {
  modalOverlay.classList.add("hidden");
}
 
// Add event listeners for each table cell
document.addEventListener("click", (e) => {
  if (e.target.tagName === "TD") {
    openModal();
  }
});
 
// Close modal on clicking outside or pressing ESC
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModalFunction();
});
 
closeModal.addEventListener("click", closeModalFunction);
 
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModalFunction();
});
 
// // Optional function to load sidebar-specific content
// function loadContentFromSidebar(section) {
//   tabContent.innerHTML = `<p>Loaded content for ${section}</p>`;
// }
 
// Initial load for the first tab
loadContent(1);