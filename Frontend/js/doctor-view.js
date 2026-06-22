const API_BASE_URL =
    "http://127.0.0.1:8080/api";



document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadPatientProfile();

        setupSaveNotes();

    }
);



// Load Patient Profile
async function
loadPatientProfile() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const patientId =
        params.get(
            "patientId"
        );

    const token =
        localStorage.getItem(
            "token"
        );



    if (!patientId) {

        alert(
            "Patient not found"
        );

        return;

    }



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

            throw new Error();

        }



        const responseText =
            await response.text();

        const profile =
            responseText ?
                JSON.parse(responseText) :
                {};

        const patientProfile =
            profile || {};




        document.getElementById(
            "age"
        ).innerText =
            patientProfile.age ||
            "N/A";



        document.getElementById(
            "gender"
        ).innerText =
            patientProfile.gender ||
            "N/A";



        document.getElementById(
            "bloodGroup"
        ).innerText =
            patientProfile.bloodGroup ||
            "N/A";



        document.getElementById(
            "medicalHistory"
        ).innerText =
            patientProfile.medicalHistory ||
            "No history";



        // Load old notes
        document.getElementById(
            "doctorNotes"
        ).value =
            patientProfile.doctorNotes ||
            "";



        loadAppointmentHistory(
            patientId
        );

    }

    catch (
        error
    ) {

        console.error(
            error
        );


        alert(
            "Failed to load patient data"
        );

    }

}



// Previous Appointments
async function
loadAppointmentHistory(
    patientId
) {

    const token =
        localStorage.getItem(
            "token"
        );

    const historyBox =
        document.getElementById(
            "appointment-history"
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

        if (!response.ok) {
            throw new Error();
        }

        const history =
            await response.json();

        if (history.length === 0) {

            historyBox.innerHTML =
                "No appointments found";

            return;

        }

        historyBox.innerHTML =
            history
                    .map(
                        item => `
                            <p>
                                ${item.appointmentDate}
                                ${item.appointmentTime}
                                -
                                ${item.doctorName}
                                (${item.status})
                            </p>
                        `
                    )
                    .join("");

    }

    catch (
        error
    ) {

        console.error(
            error
        );

        historyBox.innerHTML =
            "Failed to load appointment history";

    }

}



// Setup Save Button
function
setupSaveNotes() {

    const saveBtn =
        document.getElementById(
            "save-notes-btn"
        );


    if (!saveBtn)
        return;


    saveBtn.onclick =
        saveDoctorNotes;

}



// Save Notes
async function
saveDoctorNotes() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const patientId =
        params.get(
            "patientId"
        );



    const doctorNotes =
        document.getElementById(
            "doctorNotes"
        ).value;

    const diagnosis =
        document.getElementById(
            "diagnosis"
        ).value;

    const medicines =
        document.getElementById(
            "medicines"
        ).value;

    const doctorId =
        localStorage.getItem(
            "userId"
        );

    const token =
        localStorage.getItem(
            "token"
        );



    try {

        // Load existing profile first
        const oldResponse =
            await fetch(

                `${API_BASE_URL}/profile/${patientId}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


        const oldResponseText =
            oldResponse.ok ?
                await oldResponse.text() :
                "";

        const oldProfile =
            oldResponseText ?
                JSON.parse(oldResponseText) :
                {};

        const profile =
            oldProfile || {};




        const updatedProfile = {

            patientId:
                Number(patientId),

            age:
                profile.age,

            gender:
                profile.gender,

            bloodGroup:
                profile.bloodGroup,

            medicalHistory:
                profile.medicalHistory,

            doctorNotes:
                doctorNotes

        };




        const profileResponse =
            await fetch(

                `${API_BASE_URL}/profile`,

                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(
                            updatedProfile
                        )

                }

            );

        const prescriptionResponse =
            await fetch(

                `${API_BASE_URL}/prescription`,

                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify({
                            patientId:
                                Number(patientId),

                            doctorId:
                                Number(doctorId),

                            medicines,

                            diagnosis,

                            notes:
                                doctorNotes
                        })

                }

            );



        if (
            profileResponse.ok &&
            prescriptionResponse.ok
        ) {

            alert(
                "Prescription saved successfully"
            );

        }

        else {

            alert(
                "Failed to save notes"
            );

        }

    }

    catch (
        error
    ) {

        console.error(
            error
        );


        alert(
            "Server error"
        );

    }

}
