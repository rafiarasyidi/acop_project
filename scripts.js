// Single-page application (SPA) handling
document.addEventListener("DOMContentLoaded", function () {
  const acopLink = document.getElementById("acopLink");
  const resourceLink = document.querySelector('a[href="#resources"]');
  const submissionButton = document.getElementById("acopSubmissionBtn");

  // Attach listener to ACOP title link (top left)
  if (acopLink) {
    acopLink.addEventListener("click", function (e) {
      e.preventDefault();
      showView('view-acop');
    });
  }

  // Attach listener to "Resources" nav link
  if (resourceLink) {
    resourceLink.addEventListener("click", function (e) {
      e.preventDefault();
      showView('resourceGuidelines');
    });
  }

  // Attach listener to "ACOP Submission" button (if you added it below the table)
  if (submissionButton) {
    submissionButton.addEventListener("click", function (e) {
      e.preventDefault();
      showView('view-acop');
    });
  }
});

// Central function to toggle views
function showView(viewId) {
  const allViews = ['view-acop', 'resourceGuidelines', 'view-submission', 'view-report'];
  allViews.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  const toShow = document.getElementById(viewId);
  if (toShow) toShow.classList.remove('hidden');
}

// login button
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      window.location.href = "myrspo.html";
    });
  }
});

//logging out
function toggleUserMenu() {
  const menu = document.getElementById("userMenu");
  menu.classList.toggle("hidden");
}

// Optional: Close dropdown if clicking outside
document.addEventListener("click", function (e) {
  const dropdown = document.getElementById("userDropdown");
  const menu = document.getElementById("userMenu");

  if (!dropdown.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

// Dummy logout function
function logout() {
  window.location.href = "index.html";
}


// Toggle button ACOP Report
  function showACOPTab(view) {
    document.getElementById('acop-table-view').classList.add('hidden');
    document.getElementById('acop-dashboard-view').classList.add('hidden');

    if (view === 'table') {
      document.getElementById('acop-table-view').classList.remove('hidden');
    } else {
      document.getElementById('acop-dashboard-view').classList.remove('hidden');
    }
  }

  // Show table view on load
  document.addEventListener('DOMContentLoaded', () => {
    showACOPTab('table');
  });

// ---- Back End Connection --- //

// Toggle notification dropdown
function toggleNotificationDropdown() {
  document.getElementById('notificationDropdown').classList.toggle('hidden');
}

// Show confirmation after submitting a request
function submitRequest() {
  const name = document.querySelector('#requestForm input[type=text]').value.trim();
  const email = document.querySelector('#requestForm input[type=email]').value.trim();
  const message = document.querySelector('#requestForm textarea').value.trim();

  if (!name || !email || !message) {
    alert('Please complete all fields.');
    return;
  }

  document.getElementById('requestForm').classList.add('hidden');

  const confirmation = document.createElement('div');
  confirmation.className = "fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50";
  confirmation.innerHTML = `
    <div class="bg-white p-6 rounded shadow-lg text-center">
      <div class="text-green-600 text-4xl mb-2">✅</div>
      <p class="text-lg font-medium mb-2">Your request has been sent!</p>
      <button onclick="this.parentElement.parentElement.remove()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">OK</button>
    </div>
  `;
  document.body.appendChild(confirmation);
}

// Load data from server
let allData = [];

async function fetchData() {
  const res = await fetch("http://localhost:3000/data-sources");
  const data = await res.json();

  allData = data.map(doc => ({
    institution_name: doc.institution_name || "",
    dataset: doc.dataset || "",
    institution_country: doc.institution_country || "",
    data_coverage: doc.data_coverage || "",
    data_strengths: doc.data_strengths || "",
    theme: Array.isArray(doc.theme) ? doc.theme.join(", ") : "",
    data_depth: doc.data_depth || "",
    updates: doc.updates || "",
    use_case: doc.use_case || "",
    website: doc.website || "",
    data_security_level: doc.data_security_level || "",
    access_type: doc.access_type || "",
    status: "Verified"
  }));

  populateTable();
}

// Populate table with data
function populateTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  allData.forEach(item => {
    const row = `<tr class="border hover:bg-gray-100">
      <td class="p-2 border">${item.institution_name}</td>
      <td class="p-2 border">${item.dataset}</td>
      <td class="p-2 border">${item.institution_country}</td>
      <td class="p-2 border">${item.data_coverage}</td>
      <td class="p-2 border">${item.data_strengths}</td>
      <td class="p-2 border">${item.theme}</td>
      <td class="p-2 border">${item.data_depth}</td>
      <td class="p-2 border">${item.updates}</td>
      <td class="p-2 border">${item.use_case}</td>
      <td class="p-2 border"><a href="${item.website}" class="text-blue-600 underline" target="_blank">Link</a></td>
      <td class="p-2 border">${item.data_security_level}</td>
      <td class="p-2 border">${item.access_type}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Export table data as CSV
function exportToCSV() {
  let csv = "Institution Name,Dataset,Institution Country (HQ),Data Coverage,Data Strengths,Theme,Data Depth,Updates,Use Case,Website,Data Security Level,Access Type\n";
  allData.forEach(item => {
    csv += `"${item.institution_name}","${item.dataset}","${item.institution_country}","${item.data_coverage}","${item.data_strengths}","${item.theme}","${item.data_depth}","${item.updates}","${item.use_case}","${item.website}","${item.data_security_level}","${item.access_type}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "national_data_sources.csv";
  a.click();
}

// Filter table based on search and filters
function filterTable() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const depth = document.getElementById("depthFilter").value;
  const security = document.getElementById("securityFilter").value;
  const access = document.getElementById("accessTypeFilter").value;

  const filtered = allData.filter(item => {
    return (
      (item.institution_name || "").toLowerCase().includes(search) ||
      (item.dataset || "").toLowerCase().includes(search) ||
      (item.institution_country || "").toLowerCase().includes(search) ||
      (item.theme || "").toLowerCase().includes(search) ||
      (item.access_type || "").toLowerCase().includes(search) ||
      (item.data_depth || "").toLowerCase().includes(search) ||
      (item.data_coverage || "").toLowerCase().includes(search) ||
      (item.data_security_level || "").toLowerCase().includes(search)
    ) &&
    (depth === "" || item.data_depth === depth) &&
    (security === "" || item.data_security_level === security) &&
    (access === "" || item.access_type === access);
  });

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  filtered.forEach(item => {
    const row = `<tr class="border hover:bg-gray-100">
      <td class="p-2 border">${item.institution_name}</td>
      <td class="p-2 border">${item.dataset}</td>
      <td class="p-2 border">${item.institution_country}</td>
      <td class="p-2 border">${item.data_coverage}</td>
      <td class="p-2 border">${item.data_strengths}</td>
      <td class="p-2 border">${item.theme}</td>
      <td class="p-2 border">${item.data_depth}</td>
      <td class="p-2 border">${item.updates}</td>
      <td class="p-2 border">${item.use_case}</td>
      <td class="p-2 border"><a href="${item.website}" class="text-blue-600 underline" target="_blank">Link</a></td>
      <td class="p-2 border">${item.data_security_level}</td>
      <td class="p-2 border">${item.access_type}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Auto-run on page load
window.onload = fetchData;
