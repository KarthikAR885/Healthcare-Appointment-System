const API_BASE_URL = "http://127.0.0.1:8080/api";

document.addEventListener("DOMContentLoaded", loadPrescriptions);

async function loadPrescriptions() {
    const patientId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const tbody = document.getElementById("prescription-body");

    if (!patientId || !token) {
        alert("Please login again");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/prescription/patient/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load prescriptions");
        }

        const prescriptions = await response.json();

        if (prescriptions.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">No prescriptions found</td></tr>`;
            return;
        }

        tbody.innerHTML = prescriptions.map(item => `
            <tr>
                <td>${item.createdDate}</td>
                <td>${item.doctorName}</td>
                <td>${item.diagnosis}</td>
                <td>${item.medicines}</td>
                <td>${item.notes || ""}</td>
                <td>
                    <button class="btn btn-primary" onclick="downloadPrescription(${item.id})">
                        Save PDF
                    </button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="6">Failed to load prescriptions</td></tr>`;
    }
}

async function downloadPrescription(id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_BASE_URL}/prescription/download/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Download failed");
        }

        const pdfBlob = await response.blob();
        savePdfBlob(pdfBlob, `prescription-${id}.pdf`);
    } catch (error) {
        console.error(error);
        alert("Failed to save prescription PDF");
    }
}

function savePdfBlob(pdfBlob, fileName) {
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");

    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(pdfUrl);
}
