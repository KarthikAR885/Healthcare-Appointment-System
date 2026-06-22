document.addEventListener("DOMContentLoaded", () => {
    checkDoctor();
    setupLogout();
    setupProfileForm();
    loadDoctorProfile();
    loadAppointments();
});

const API_BASE_URL = "http://127.0.0.1:8080/api";

function checkDoctor() {
    const role = localStorage.getItem("role");

    if (role !== "DOCTOR") {
        alert("Unauthorized access");
        window.location.href = "login.html";
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.clear();
            window.location.href = "login.html";
        };
    }
}

async function loadAppointments() {
    const doctorId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const tbody = document.getElementById("doctor-body");

    if (!doctorId || !token) {
        alert("Please login again");
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/appointments/doctor/${doctorId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load appointments");
        }

        const appointments = await response.json();

        if (appointments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">No appointments found</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = appointments.map(appointment => `
            <tr>
                <td>${appointment.patientName}</td>
                <td>${appointment.appointmentDate}</td>
                <td>${appointment.appointmentTime}</td>
                <td>${appointment.notes || "N/A"}</td>
                <td>${appointment.status}</td>
                <td>
                    <button
                        class="btn btn-primary"
                        onclick="viewPatient(${appointment.patientId})">
                        View
                    </button>
                    ${appointment.status !== "COMPLETED" && appointment.status !== "CANCELLED" ? `
                        <button onclick="completeAppointment(${appointment.id})">
                            Complete
                        </button>
                    ` : ""}
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error loading doctor appointments:", error);
        tbody.innerHTML = `
            <tr>
                <td colspan="6">Failed to load appointments</td>
            </tr>
        `;
    }
}

function viewPatient(patientId) {
    window.location.href = `doctor-patient-view.html?patientId=${patientId}`;
}

async function completeAppointment(id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            `${API_BASE_URL}/appointments/${id}/complete`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.ok) {
            await loadAppointments();
        } else {
            alert("Failed to complete appointment");
        }
    } catch (error) {
        console.error(error);
        alert("Server error");
    }
}

function setupProfileForm() {
    const profileForm = document.getElementById("doctor-profile-form");

    if (profileForm) {
        profileForm.addEventListener("submit", saveDoctorProfile);
    }
}

async function loadDoctorProfile() {
    const doctorId = localStorage.getItem("userId");
    const alertBox = document.getElementById("doctor-profile-alert");

    if (!doctorId) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`);

        if (!response.ok) {
            throw new Error("Failed to load doctor profile");
        }

        const doctor = await response.json();

        document.getElementById("doctorName").value = doctor.doctorName || "";
        document.getElementById("specialization").value = doctor.specialization || "";
        document.getElementById("experience").value = doctor.experience || "";
        document.getElementById("availableStatus").value = String(doctor.availableStatus !== false);
    } catch (error) {
        console.error(error);
        showProfileMessage(alertBox, "Failed to load doctor profile", "danger");
    }
}

async function saveDoctorProfile(event) {
    event.preventDefault();

    const doctorId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const alertBox = document.getElementById("doctor-profile-alert");

    const profileData = {
        doctorName: document.getElementById("doctorName").value.trim(),
        specialization: document.getElementById("specialization").value.trim(),
        experience: Number(document.getElementById("experience").value),
        availableStatus: document.getElementById("availableStatus").value === "true"
    };

    if (!profileData.doctorName || !profileData.specialization || !profileData.experience) {
        showProfileMessage(alertBox, "Please complete all doctor profile fields", "danger");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });

        if (!response.ok) {
            throw new Error("Failed to save doctor profile");
        }

        showProfileMessage(alertBox, "Doctor profile saved successfully", "success");
    } catch (error) {
        console.error(error);
        showProfileMessage(alertBox, "Failed to save doctor profile", "danger");
    }
}

function showProfileMessage(alertBox, message, type) {
    if (!alertBox) {
        alert(message);
        return;
    }

    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`;
}
