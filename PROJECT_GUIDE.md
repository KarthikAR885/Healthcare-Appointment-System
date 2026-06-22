# Healthcare Appointment Booking and Management System

## Tech Stack

Backend: Java 17, Spring Boot, Spring Security, JWT, Spring Data JPA, Hibernate, MySQL, Maven.

Frontend: HTML5, CSS3, Vanilla JavaScript.

Database: MySQL.

## Run Instructions

1. Create the database:

```sql
CREATE DATABASE healthcare_db;
```

2. Confirm backend database settings in `Backend/healthcare-system/src/main/resources/application.properties`.

3. Start backend:

```bash
cd Backend/healthcare-system
mvn spring-boot:run
```

4. Start frontend from the `Frontend` folder:

```bash
python -m http.server 5500 --bind 127.0.0.1
```

5. Open:

```text
http://127.0.0.1:5500/login.html
```

## Main Pages

- `index.html`
- `login.html`
- `register.html`
- `patient-dashboard.html`
- `doctor-dashboard.html`
- `admin-dashboard.html`
- `appointment.html`
- `profile.html`
- `doctor-view.html`
- `doctor-patient-view.html`
- `prescription.html`

## Key API Endpoints

Authentication:
- `POST /api/auth/register`
- `POST /api/auth/login`

Doctors:
- `GET /api/doctors`
- `GET /api/doctors/{id}`
- `POST /api/doctors`
- `PUT /api/doctors/{id}`
- `DELETE /api/doctors/{id}`

Appointments:
- `POST /api/appointments`
- `GET /api/appointments/patient/{patientId}`
- `GET /api/appointments/doctor/{doctorId}`
- `PUT /api/appointments/{id}/approve`
- `PUT /api/appointments/{id}/cancel`
- `PUT /api/appointments/{id}/complete`

Patient Profile:
- `GET /api/profile/{patientId}`
- `POST /api/profile`

Admin:
- `GET /api/admin/patients`
- `GET /api/admin/appointments`

Prescriptions:
- `POST /api/prescription`
- `GET /api/prescription/{id}`
- `GET /api/prescription/patient/{patientId}`
- `GET /api/prescription/doctor/{doctorId}`
- `GET /api/prescription/download/{id}`

## Security

Public:
- `/api/auth/**`
- `GET /api/doctors/**`

Protected:
- `/api/admin/**`
- `/api/appointments/**`
- `/api/profile/**`
- `/api/prescription/**`

JWT tokens are stored in `localStorage` by the frontend and sent in the `Authorization: Bearer <token>` header.
