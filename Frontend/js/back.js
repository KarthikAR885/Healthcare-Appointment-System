document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("page-back-btn")) {
        return;
    }

    const backButton = document.createElement("button");
    backButton.id = "page-back-btn";
    backButton.type = "button";
    backButton.className = "page-back-btn";
    backButton.textContent = "Back";

    backButton.addEventListener("click", () => {
        if (window.history.length > 1) {
            window.history.back();
            return;
        }

        const role = localStorage.getItem("role");

        if (role === "ADMIN") {
            window.location.href = "admin-dashboard.html";
        } else if (role === "DOCTOR") {
            window.location.href = "doctor-dashboard.html";
        } else if (role === "PATIENT") {
            window.location.href = "patient-dashboard.html";
        } else {
            window.location.href = "index.html";
        }
    });

    document.body.appendChild(backButton);
});
