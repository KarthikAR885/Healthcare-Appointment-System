const API_BASE_URL =
    "http://127.0.0.1:8080/api";



document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupButtons();

        setupTabs();

        checkPatient();

        loadAppointments();

        loadPatientProfile();

    }
);



// Check Login
function checkPatient() {

    const patientId =
        localStorage.getItem(
            "userId"
        );


    if (!patientId) {

        alert(
            "Please login again"
        );


        localStorage.clear();

        window.location.href =
            "login.html";

        return;

    }

}



// Buttons
function setupButtons() {

    const bookBtn =
        document.getElementById(
            "book-btn"
        );


    const logoutBtn =
        document.getElementById(
            "logout-btn"
        );


    if (bookBtn) {

        bookBtn.onclick =
            () => {

                window.location.href =
                    "appointment.html";

            };

    }



    if (logoutBtn) {

        logoutBtn.onclick =
            () => {

                localStorage.clear();

                window.location.href =
                    "login.html";

            };

    }

}



// Tabs Logic
function setupTabs() {

    const tabAppointments = document.getElementById("tab-appointments");
    const tabProfile = document.getElementById("tab-profile");
    const appointmentsView = document.getElementById("appointments-view");
    const profileView = document.getElementById("profile-view");

    if (tabAppointments && tabProfile) {
        tabAppointments.onclick = () => {
            tabAppointments.classList.add("active");
            tabProfile.classList.remove("active");
            appointmentsView.style.display = "block";
            profileView.style.display = "none";
        };

        tabProfile.onclick = () => {
            tabProfile.classList.add("active");
            tabAppointments.classList.remove("active");
            profileView.style.display = "block";
            appointmentsView.style.display = "none";
        };
    }
}



// Load Appointments
async function
loadAppointments() {

    const patientId =
        localStorage.getItem(
            "userId"
        );


    const token =
        localStorage.getItem(
            "token"
        );


    const tbody =
        document.getElementById(
            "appointments-body"
        );



    try {

        const response =
            await fetch(

                `${API_BASE_URL}/appointments/patient/${patientId}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );



        if (
            !response.ok
        ) {

            throw new Error();

        }



        const appointments =
            await response.json();



        tbody.innerHTML =
            "";



        if (
            appointments.length === 0
        ) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="7">

                        No appointments found

                    </td>

                </tr>

            `;

            return;

        }



        appointments.forEach(
            item => {

                tbody.innerHTML += `

                    <tr>

                        <td>
                            ${item.doctorName}
                        </td>

                        <td>
                            ${item.specialization}
                        </td>

                        <td>
                            ${item.appointmentDate}
                        </td>

                        <td>
                            ${item.appointmentTime}
                        </td>

                        <td>
                            ${item.notes || "N/A"}
                        </td>

                        <td>
                            ${item.status}
                        </td>

                        <td>

                            <button onclick="cancelAppointment(${item.id})">

                                Cancel

                            </button>

                        </td>

                    </tr>

                `;

            }
        );

    }

    catch (
        error
    ) {

        console.error(
            error
        );


        tbody.innerHTML = `

            <tr>

                <td colspan="7">

                    Failed to load appointments

                </td>

            </tr>

        `;

    }

}



// Load Patient Profile
async function
loadPatientProfile() {

    const patientId =
        localStorage.getItem(
            "userId"
        );

    const token =
        localStorage.getItem(
            "token"
        );



    try {

        const response =
            await fetch(

                `${API_BASE_URL}/profile/${patientId}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );



        if (
            !response.ok
        ) {

            return;

        }



        const responseText =
            await response.text();

        const profile =
            responseText ?
                JSON.parse(responseText) :
                {};




        document.getElementById(
            "p-age"
        ).innerText =
            profile.age ||
            "N/A";



        document.getElementById(
            "p-gender"
        ).innerText =
            profile.gender ||
            "N/A";



        document.getElementById(
            "p-bloodGroup"
        ).innerText =
            profile.bloodGroup ||
            "N/A";



        document.getElementById(
            "p-history"
        ).innerText =
            profile.medicalHistory ||
            "N/A";



        document.getElementById(
            "p-notes"
        ).innerText =
            profile.doctorNotes ||
            "No prescription yet";

    }

    catch (
        error
    ) {

        console.error(
            error
        );

    }

}



// Download Prescription
async function
downloadPrescription() {

    const patientId =
        localStorage.getItem(
            "userId"
        );

    const token =
        localStorage.getItem(
            "token"
        );


    try {

        const response =
            await fetch(

                `${API_BASE_URL}/prescription/download?patientId=${patientId}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


        if (
            !response.ok
        ) {

            throw new Error();

        }


        const pdfBlob =
            await response.blob();

        const pdfUrl =
            URL.createObjectURL(
                pdfBlob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            pdfUrl;

        link.download =
            `prescription-${patientId}.pdf`;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            pdfUrl
        );

    }

    catch (
        error
    ) {

        console.error(
            error
        );

        alert(
            "Failed to save prescription PDF"
        );

    }

}


// Cancel Appointment
async function cancelAppointment(appointmentId) {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.ok) {
            alert("Appointment cancelled successfully");
            loadAppointments();
        } else {
            alert("Failed to cancel appointment");
        }
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        alert("Error cancelling appointment");
    }
}
