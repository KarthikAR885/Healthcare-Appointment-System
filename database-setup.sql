CREATE DATABASE IF NOT EXISTS healthcare_db;
USE healthcare_db;

-- Spring Boot creates and updates the tables automatically because:
-- spring.jpa.hibernate.ddl-auto=update

-- Admin passwords must be BCrypt hashes. This hash is for password: admin123
-- Use this only for initial local setup, then change the password.
INSERT INTO admins (username, password)
SELECT 'admin', '$2a$10$AtbWD1BSUwsm4aSKKU8uZOQ0yWAA2kc14wnomY81OQzNlsb84yzXS'
WHERE NOT EXISTS (
    SELECT 1 FROM admins WHERE username = 'admin'
);

-- Sample patients use password: admin123
UPDATE patients
SET password = '$2a$10$AtbWD1BSUwsm4aSKKU8uZOQ0yWAA2kc14wnomY81OQzNlsb84yzXS'
WHERE email IN (
    'karthik@gmail.com',
    'rahul@gmail.com',
    'anitha@gmail.com'
);

-- Doctors are managed from the Admin Dashboard.
-- Patients can register from register.html.
-- Doctor login accounts use the patients table with role = 'DOCTOR' in this implementation.
-- Sample doctor login: john.smith@careplus.com / admin123
INSERT INTO patients (full_name, email, phone, password, role)
SELECT
    'Dr. John Smith',
    'john.smith@careplus.com',
    '9000000001',
    '$2a$10$AtbWD1BSUwsm4aSKKU8uZOQ0yWAA2kc14wnomY81OQzNlsb84yzXS',
    'DOCTOR'
WHERE NOT EXISTS (
    SELECT 1 FROM patients WHERE email = 'john.smith@careplus.com'
);
