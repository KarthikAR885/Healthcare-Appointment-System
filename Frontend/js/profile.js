const API_BASE_URL =
    "http://127.0.0.1:8080/api";

let existingDoctorNotes =
    "";



document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkLogin();

        loadProfile();

        setupSaveButton();

    }
);



// Check User
function checkLogin() {

    const patientId =
        localStorage.getItem(
            "userId"
        );


    if (!patientId) {

        alert(
            "Please login again"
        );


        window.location.href =
            "login.html";

    }

}



// Save Button
function setupSaveButton() {

    const saveBtn =
        document.getElementById(
            "save-profile-btn"
        );


    if (!saveBtn)
        return;


    saveBtn.onclick =
        saveProfile;

}



// Load Profile
async function
loadProfile() {

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
        ) return;



        const responseText =
            await response.text();

        const profile =
            responseText ?
                JSON.parse(responseText) :
                {};



        if (
            !profile
        ) return;

        existingDoctorNotes =
            profile.doctorNotes ||
            "";



        document.getElementById(
            "age"
        ).value =
            profile.age ||
            "";



        document.getElementById(
            "gender"
        ).value =
            profile.gender ||
            "";



        document.getElementById(
            "bloodGroup"
        ).value =
            profile.bloodGroup ||
            "";



        document.getElementById(
            "medicalHistory"
        ).value =
            profile.medicalHistory ||
            "";

    }

    catch (
        error
    ) {

        console.log(
            "No profile found"
        );

    }

}



// Save Profile
async function
saveProfile() {

    const patientId =
        localStorage.getItem(
            "userId"
        );

    const token =
        localStorage.getItem(
            "token"
        );



    const profileData = {

        patientId:
            patientId,


        age:
            document.getElementById(
                "age"
            ).value ?
                Number(
                    document.getElementById(
                        "age"
                    ).value
                ) :
                null,


        gender:
            document.getElementById(
                "gender"
            ).value,


        bloodGroup:
            document.getElementById(
                "bloodGroup"
            ).value,


        medicalHistory:
            document.getElementById(
                "medicalHistory"
            ).value,


        doctorNotes:
            existingDoctorNotes

    };



    try {

        const response =
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
                            profileData
                        )

                }

            );



        if (
            response.ok
        ) {

            alert(
                "Profile saved successfully"
            );

        }

        else {

            alert(
                "Failed to save profile"
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
