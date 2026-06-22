const API_BASE_URL = "http://127.0.0.1:8080/api";

// Data
let doctors = [];
let patients = [];
let appointments = [];

// Page Load
document.addEventListener("DOMContentLoaded", async () => {
    checkAdmin();
    setupLogout();
    setupTabs();
    setupDoctorForm();
    setupSearch();
    
    // Load initial data
    await loadDoctors();
    await loadPatients();
    await loadAppointments();
    
    showOverview();
});

// Admin Authentication
function checkAdmin() {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
        alert("Unauthorized access");
        window.location.href = "login.html";
        return;
    }
}

// Logout
function setupLogout() {
    const logoutBtn = document.getElementById("logout-btn");
    if (!logoutBtn) return;
    logoutBtn.onclick = () => {
        localStorage.clear();
        window.location.href = "login.html";
    };
}

function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    };
}

// API Calls
async function loadDoctors() {
    try {
        const response = await fetch(`${API_BASE_URL}/doctors`);
        if (response.ok) {
            doctors = await response.json();
        }
    } catch (error) {
        console.error("Error loading doctors", error);
    }
}

async function loadPatients() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/patients`, {
            headers: getAuthHeaders()
        });
        if (response.ok) {
            patients = await response.json();
        }
    } catch (error) {
        console.error("Error loading patients", error);
    }
}

async function loadAppointments() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/appointments`, {
            headers: getAuthHeaders()
        });
        if (response.ok) {
            appointments = await response.json();
        }
    } catch (error) {
        console.error("Error loading appointments", error);
    }
}

// Sidebar Tabs
function setupTabs() {
    const tabs = {
        "tab-dashboard": showOverview,
        "tab-doctors": showDoctors,
        "tab-patients": showPatients,
        "tab-appointments": showAppointments,
        "tab-reports": showReports
    };
    Object.keys(tabs).forEach(tabId => {
        const tab = document.getElementById(tabId);
        if (!tab) return;
        tab.onclick = () => {
            tabs[tabId]();
        };
    });
}

// Dashboard
function showOverview() {
    hideForms();
    document.getElementById("stats-view").style.display = "grid";
    document.getElementById("stat-doctors").innerText = doctors.length;
    document.getElementById("stat-patients").innerText = patients.length;
    document.getElementById("stat-appointments").innerText = appointments.length;
}

// Doctors
function showDoctors() {
    hideForms();
    document.getElementById("add-doctor-form-container").style.display = "block";
    renderDoctors(doctors);
}

function renderDoctors(doctorList) {
    let rows = "";
    doctorList.forEach((doctor) => {
        rows += `
            <tr>
                <td>Dr. ${doctor.doctorName || doctor.name}</td>
                <td>${doctor.specialization}</td>
                <td>${doctor.experience} Years</td>
                <td>
                    <button onclick="editDoctor(${doctor.id})">Edit</button>
                    <button onclick="deleteDoctor(${doctor.id})">Delete</button>
                </td>
            </tr>
        `;
    });
    renderTable(`
        <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>Action</th>
        </tr>
    `, rows);
}

// Patients
function showPatients() {
    hideForms();
    let rows = "";
    patients.forEach(patient => {
        rows += `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.fullName}</td>
                <td>${patient.email}</td>
                <td>${patient.phone || "N/A"}</td>
            </tr>
        `;
    });
    renderTable(`
        <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
        </tr>
    `, rows);
}

// Appointments
function showAppointments() {
    hideForms();
    let rows = "";
    appointments.forEach((appointment) => {
        rows += `
            <tr>
                <td>${appointment.patientName || appointment.patient}</td>
                <td>Dr. ${appointment.doctorName || appointment.doctor}</td>
                <td>${appointment.appointmentDate} ${appointment.appointmentTime}</td>
                <td>${appointment.status}</td>
                <td>
                    ${appointment.status === 'PENDING' ? `<button onclick="approveAppointment(${appointment.id})">Approve</button>` : ''}
                    ${appointment.status !== 'CANCELLED' ? `<button onclick="cancelAppointment(${appointment.id})">Cancel</button>` : ''}
                </td>
            </tr>
        `;
    });
    renderTable(`
        <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    `, rows);
}

// Reports
function showReports() {
    hideForms();
    const approved = appointments.filter(item => item.status === "APPROVED" || item.status === "Approved").length;
    const cancelled = appointments.filter(item => item.status === "CANCELLED" || item.status === "Cancelled").length;
    let rows = `
        <tr><td>Total Doctors</td><td>${doctors.length}</td></tr>
        <tr><td>Total Patients</td><td>${patients.length}</td></tr>
        <tr><td>Approved</td><td>${approved}</td></tr>
        <tr><td>Cancelled</td><td>${cancelled}</td></tr>
    `;
    renderTable(`
        <tr><th>Report</th><th>Count</th></tr>
    `, rows);
}

// Add Doctor
function setupDoctorForm() {
    const form = document.getElementById("add-doctor-form");
    if (!form) return;
    
    // Add hidden input for ID to support editing
    if (!document.getElementById("docId")) {
        const idInput = document.createElement("input");
        idInput.type = "hidden";
        idInput.id = "docId";
        form.appendChild(idInput);
    }

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const doctorId = document.getElementById("docId").value;
        const doctorData = {
            doctorName: document.getElementById("docName").value,
            specialization: document.getElementById("docSpecialty").value,
            experience: document.getElementById("docExp").value,
            availableStatus: true
        };

        try {
            const url = doctorId ? `${API_BASE_URL}/doctors/${doctorId}` : `${API_BASE_URL}/doctors`;
            const method = doctorId ? "PUT" : "POST";
            
            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: JSON.stringify(doctorData)
            });

            if (response.ok) {
                form.reset();
                document.getElementById("docId").value = "";
                await loadDoctors();
                showDoctors();
            } else {
                alert("Failed to save doctor");
            }
        } catch (error) {
            console.error("Error saving doctor:", error);
        }
    };
}

// Search
function setupSearch() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;
    searchInput.oninput = () => {
        const keyword = searchInput.value.toLowerCase();
        const filtered = doctors.filter(doctor =>
            (doctor.doctorName || doctor.name).toLowerCase().includes(keyword)
        );
        renderDoctors(filtered);
    };
}

// Actions
window.editDoctor = function(id) {
    const doctor = doctors.find(d => d.id === id);
    if (!doctor) return;
    
    document.getElementById("docId").value = doctor.id;
    document.getElementById("docName").value = doctor.doctorName || doctor.name;
    document.getElementById("docSpecialty").value = doctor.specialization;
    document.getElementById("docExp").value = doctor.experience;
}

window.deleteDoctor = async function(id) {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (response.ok) {
            await loadDoctors();
            showDoctors();
        } else {
            alert("Failed to delete doctor");
        }
    } catch (error) {
        console.error("Error deleting doctor:", error);
    }
}

window.approveAppointment = async function(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/approve`, {
            method: "PUT",
            headers: getAuthHeaders()
        });
        if (response.ok) {
            await loadAppointments();
            showAppointments();
        }
    } catch (error) {
        console.error("Error approving appointment:", error);
    }
}

window.cancelAppointment = async function(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
            method: "PUT",
            headers: getAuthHeaders()
        });
        if (response.ok) {
            await loadAppointments();
            showAppointments();
        }
    } catch (error) {
        console.error("Error cancelling appointment:", error);
    }
}

// Helpers
function hideForms() {
    document.getElementById("stats-view").style.display = "none";
    document.getElementById("add-doctor-form-container").style.display = "none";
}

function renderTable(headers, rows) {
    document.getElementById("admin-table").innerHTML = `
        <thead>${headers}</thead>
        <tbody>${rows}</tbody>
    `;
}
