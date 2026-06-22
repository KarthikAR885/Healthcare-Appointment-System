const API_BASE_URL = "http://127.0.0.1:8080/api";
const doctorSelect = document.getElementById("doctorSelect");
const appointmentForm = document.getElementById("appointment-form");

document.addEventListener("DOMContentLoaded", init);

function init() {
    loadDoctors();
    if (appointmentForm) {
        appointmentForm.addEventListener("submit", handleBooking);
    }
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "login.html";
        });
    }
}

async function handleBooking(event) {
    event.preventDefault();
    
    const doctorId = document.getElementById("doctorSelect").value;
    const appointmentDate = document.getElementById("appointmentDate").value;
    const appointmentTime = document.getElementById("appointmentTime").value;
    const notes = document.getElementById("notes").value.trim();
    const patientId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    if (!patientId || !token || patientId === "undefined") {
        alert("Please login first to book an appointment");
        window.location.href = "login.html";
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                patientId: parseInt(patientId),
                doctorId: parseInt(doctorId),
                appointmentDate: appointmentDate,
                appointmentTime: appointmentTime,
                notes: notes,
                status: "PENDING"
            })
        });
        
        if (response.ok) {
            const alertBox = document.getElementById("booking-alert");
            if (alertBox) {
                alertBox.textContent = "Appointment booked successfully!";
                alertBox.className = "alert alert-success show";
                setTimeout(() => {
                    alertBox.classList.remove("show");
                    window.location.href = "patient-dashboard.html";
                }, 2000);
            } else {
                alert("Appointment booked successfully!");
                window.location.href = "patient-dashboard.html";
            }
        } else {
            const data = await response.json();
            const alertBox = document.getElementById("booking-alert");
            if (alertBox) {
                alertBox.textContent = data.message || "Booking failed.";
                alertBox.className = "alert alert-danger show";
            } else {
                alert("Booking failed.");
            }
        }
    } catch (error) {
        console.error("Booking error:", error);
        const alertBox = document.getElementById("booking-alert");
        if (alertBox) {
            alertBox.textContent = "Cannot connect to server.";
            alertBox.className = "alert alert-danger show";
        } else {
            alert("Cannot connect to server.");
        }
    }
}

async function loadDoctors() {
    try {
        const response = await fetch(`${API_BASE_URL}/doctors`);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const doctors = await response.json();

        console.log("Doctors:", doctors);

        renderDoctors(doctors);

    } catch (error) {
        console.error("Error loading doctors:", error);

        renderDoctors(getMockDoctors());
    }
}

function renderDoctors(doctors) {

    doctorSelect.innerHTML =
        `<option value="">-- Choose a Doctor --</option>`;

    doctors.forEach(doctor => {
        const option = document.createElement("option");

        option.value = doctor.id;
        option.textContent =
            `${doctor.doctorName} - ${doctor.specialization}`;

        doctorSelect.appendChild(option);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('doctorId');
    if (doctorId) {
        doctorSelect.value = doctorId;
    }
}

function getMockDoctors() {
    return [
        {
            id: 1,
            doctorName: "Sarah Jenkins",
            specialization: "Cardiology"
        },
        {
            id: 2,
            doctorName: "Michael Chen",
            specialization: "Neurology"
        },
        {
            id: 3,
            doctorName: "Emily Rodriguez",
            specialization: "Pediatrics"
        }
    ];
}
