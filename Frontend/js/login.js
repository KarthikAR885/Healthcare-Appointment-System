const API_BASE_URL = "http://127.0.0.1:8080/api";

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("login-form");

    if (!loginForm) {
        console.error("Login form not found");
        return;
    }

    loginForm.addEventListener("submit", handleLogin);

});

async function handleLogin(event) {

    event.preventDefault();

    const usernameInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const roleInput = document.getElementById("role");
    const alertBox = document.getElementById("login-alert");

    let username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleInput.value;

    // For admin login
    if (role === "ADMIN") {
        username = username.toLowerCase();
    }

    console.log("Login Request:", {
        username,
        password,
        role
    });

    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        // Read raw response first
        const responseText = await response.text();

        let data;

        try {
            data = JSON.parse(responseText);
        } catch {
            data = {
                message: responseText
            };
        }

        // If login failed
        if (!response.ok) {

            const errorMessage =
                data.message ||
                "Invalid username or password";

            showError(errorMessage, alertBox);
            return;
        }

        // Save login info
        localStorage.setItem(
            "token",
            data.token || ""
        );

        localStorage.setItem(
            "role",
            data.role || ""
        );

        localStorage.setItem(
            "userId",
            data.userId || ""
        );

        // Redirect user
        redirectByRole(data.role);

    }

    catch (error) {

        console.error("Login Error:", error);

        showError(
            "Server error. Please try again.",
            alertBox
        );
    }
}


function showError(message, alertBox) {

    if (!alertBox) {
        alert(message);
        return;
    }

    alertBox.textContent = message;
    alertBox.className = "alert alert-danger show";
}


function redirectByRole(role) {

    switch (role) {

        case "ADMIN":
            window.location.href = "admin-dashboard.html";
            break;

        case "DOCTOR":
            window.location.href = "doctor-dashboard.html";
            break;

        case "PATIENT":
            window.location.href = "patient-dashboard.html";
            break;

        default:
            alert("Login successful, but role not found.");
    }
}