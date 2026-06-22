const API_BASE_URL = "http://127.0.0.1:8080/api";


document.addEventListener("DOMContentLoaded", () => {

    fetchDoctors();

    const searchBtn =
        document.getElementById("search-btn");

    if (searchBtn) {

        searchBtn.addEventListener("click", () => {

            const specialty =
                document.getElementById(
                    "search-specialty"
                ).value.trim();

            fetchDoctors(specialty);

        });

    }

});



async function fetchDoctors(specialty = "") {

    const container =
        document.getElementById(
            "doctors-container"
        );

    if (!container) return;

    container.innerHTML =
        "<p style='text-align:center;'>Loading doctors...</p>";

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/doctors`
            );

        if (!response.ok) {
            throw new Error();
        }

        let doctors =
            await response.json();

        // Search filter
        if (specialty) {

            doctors =
                doctors.filter(doctor =>
                    (doctor.specialization || "")
                        .toLowerCase()
                        .includes(
                            specialty.toLowerCase()
                        )
                );

        }

        displayDoctors(doctors);

    } catch (error) {

        loadMockDoctors(specialty);

    }

}



function displayDoctors(doctors) {

    const container =
        document.getElementById(
            "doctors-container"
        );

    container.innerHTML = "";

    if (!doctors || doctors.length === 0) {

        container.innerHTML =
            "<p style='text-align:center;'>No doctors found</p>";

        return;

    }


    doctors.forEach((doctor) => {

        const doctorName =
            doctor.fullName ||
            doctor.doctorName ||
            doctor.name ||
            "Doctor";

        const specialization =
            doctor.specialization ||
            "General Medicine";

        const experience =
            doctor.experience ||
            5;


        const card =
            document.createElement("div");

        card.className =
            "doctor-card";


        card.innerHTML = `

            <div class="doctor-avatar">

                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8">

                    <circle
                        cx="12"
                        cy="8"
                        r="4">
                    </circle>

                    <path
                        d="M5 20c0-4 3-6 7-6s7 2 7 6">
                    </path>

                </svg>

            </div>


            <div class="doctor-info">

                <h3>
                    Dr. ${doctorName}
                </h3>

                <p class="doctor-specialty">
                    ${specialization}
                </p>

                <p class="doctor-experience">
                    ${experience} Years Experience
                </p>

                <p>
                    <strong>Availability:</strong>
                    Mon - Fri, 9AM - 5PM
                </p>

                <a
                    href="appointment.html?doctorId=${doctor.id}"
                    class="btn btn-primary">

                    Book Appointment

                </a>

            </div>

        `;

        container.appendChild(card);

    });

}



function loadMockDoctors(specialty = "") {

    let doctors = [

        {
            id: 1,
            fullName: "Rajesh Sharma",
            specialization: "Cardiology",
            experience: 8
        },

        {
            id: 2,
            fullName: "Priya Reddy",
            specialization: "Neurology",
            experience: 10
        },

        {
            id: 3,
            fullName: "Anjali Patel",
            specialization: "Pediatrics",
            experience: 6
        },

        {
            id: 4,
            fullName: "Vikram Singh",
            specialization: "Orthopedics",
            experience: 12
        }

    ];


    // Search filter
    if (specialty) {

        doctors =
            doctors.filter(doctor =>
                doctor.specialization
                    .toLowerCase()
                    .includes(
                        specialty.toLowerCase()
                    )
            );

    }

    displayDoctors(doctors);

}
