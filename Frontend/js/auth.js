const API_BASE_URL = "http://127.0.0.1:8080/api";

// ======================
// UI ALERT FUNCTION
// ======================
function showAlert(elementId, message, type = "success") {
    const alertElement = document.getElementById(elementId);

    if (!alertElement) return;

    alertElement.textContent = message;
    alertElement.className = `alert alert-${type} show`;

    setTimeout(() => {
        alertElement.classList.remove("show");
    }, 5000);
}


// ======================
// REGISTER FUNCTION
// ======================
const registerForm = document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        // Password validation
        if (password !== confirmPassword) {
            showAlert(
                "register-alert",
                "Passwords do not match!",
                "danger"
            );
            return;
        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fullName,
                        email,
                        phone,
                        password
                    })
                }
            );

            if (response.ok) {

                showAlert(
                    "register-alert",
                    "Registration successful!",
                    "success"
                );

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);

            } else {

                const errorData = await response.json();

                showAlert(
                    "register-alert",
                    errorData.message || "Registration failed.",
                    "danger"
                );
            }

        } catch (error) {

            console.error(error);

            showAlert(
                "register-alert",
                "Cannot connect to backend server.",
                "danger"
            );
        }
    });
}


// ======================
// LOGIN FUNCTION
// ======================
const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            if (response.ok) {

                const data = await response.json();

                // Save user session
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("userId", data.userId);

                showAlert(
                    "login-alert",
                    "Login successful!",
                    "success"
                );

                setTimeout(() => {

                    if (data.role === "ADMIN") {
                        window.location.href =
                            "admin-dashboard.html";
                    } else {
                        window.location.href =
                            "patient-dashboard.html";
                    }

                }, 1000);

            } else {

                showAlert(
                    "login-alert",
                    "Invalid credentials.",
                    "danger"
                );
            }

        } catch (error) {

            console.error(error);

            showAlert(
                "login-alert",
                "Cannot connect to backend server.",
                "danger"
            );
        }
    });
}


// ======================
// LOGOUT FUNCTION
// ======================
document.addEventListener("DOMContentLoaded", () => {

    const logoutButton =
        document.getElementById("logout-btn");

    if (logoutButton) {

        logoutButton.addEventListener("click", () => {

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");

            window.location.href = "login.html";
        });
    }
});
