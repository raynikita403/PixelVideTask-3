-- Active: 1741678145621@@127.0.0.1@5432@employeedetails
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  
    full_name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'employee')) NOT NULL,
    token VARCHAR(255)
);

select*from users;
update users SET role='employee' WHERE full_name='Prasanna';

CREATE TABLE designation_details (
    id SERIAL PRIMARY KEY,
    designation_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);
INSERT INTO designation_details (designation_name, description) 
VALUES 
('Software Engineer', 'Responsible for developing and maintaining software applications'),
('Project Manager', 'Oversees project execution and team management'),
('HR Manager', 'Manages recruitment, employee relations, and company policies'),
('QA Engineer', 'Ensures software quality through testing and validation'),
('UI/UX Designer', 'Designs user-friendly interfaces and enhances user experience');

SELECT * from designation_details;

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    district VARCHAR(100) NOT NULL
);
INSERT INTO locations (district) 
VALUES 
('Hyderabad'),
('Bangalore'),
('Mumbai'),
('Chennai'),
('Delhi');

select * from locations;
CREATE TABLE working_status (
    id SERIAL PRIMARY KEY,
    description VARCHAR(50) NOT NULL
);
INSERT INTO working_status (description) VALUES
('Active'),
('On Leave'),
('Resigned'),
('Terminated'),
('Retired');

SELECT*from working_status;
CREATE TABLE employee_details (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    surname VARCHAR(100),
    doj DATE NOT NULL,  
    dob DATE NOT NULL,  
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    phone VARCHAR(10) UNIQUE NOT NULL,
    working_status_id INTEGER NOT NULL,
    designation_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    gross NUMERIC(10,2) NOT NULL,
    profile_img TEXT, 
    FOREIGN KEY (designation_id) REFERENCES designation_details(id) ON DELETE CASCADE,
    FOREIGN KEY (working_status_id) REFERENCES working_status(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);
ALTER TABLE employee_details
ADD COLUMN email VARCHAR(255) UNIQUE;

INSERT INTO employee_details (
    firstname, lastname, surname, doj, dob, gender, phone, 
    working_status_id, designation_id, location_id, gross, profile_img
) VALUES 
('Amit', 'Sharma', 'Kumar', '2022-05-15', '1995-08-20', 'Male', '9876543210', 1, 1, 1, 50000.00, 'http://cdn7.dissolve.com/p/D430_50_156/D430_50_156_600.jpg'),
('Priya', 'Reddy', 'Devi', '2021-07-10', '1992-06-15', 'Female', '9876543211', 2, 2, 2, 60000.00, 'http://cdn7.dissolve.com/p/D430_50_156/D430_50_156_600.jpg'),
('Rahul', 'Verma', 'Singh', '2020-09-25', '1990-12-10', 'Male', '9876543212', 3, 3, 3, 70000.00, 'http://cdn7.dissolve.com/p/D430_50_156/D430_50_156_600.jpg');


select*from employee_details;


CREATE TABLE salary_components (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL,
    type INT NOT NULL CHECK (type IN (1, 2))  
);

---Inserting data into salary_components 
INSERT INTO salary_components (description, type) VALUES
('Basic', 1),
('DA', 1), 
('HRA', 1), 
('CA', 1), 
('Medical Allowance', 1),
('Bonus', 1),
('TDS',2),
('PF',2);

select*from salary_components;

CREATE TABLE salaries (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employee_details(id) ON DELETE CASCADE,  
    month VARCHAR(15) NOT NULL,
    year INT NOT NULL,
    paid_on DATE NOT NULL,
    gross DECIMAL(10, 2) NOT NULL CHECK (gross > 0),
    deduction DECIMAL(10, 2) DEFAULT 0 CHECK (deduction >= 0 AND deduction <= gross),
    net DECIMAL(10, 2) NOT NULL CHECK (net = gross - deduction),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



ALTER TABLE salaries DROP CONSTRAINT salaries_check1;

SELECT * from salaries;

INSERT INTO salaries (employee_id, month, year, paid_on, gross, deduction, net) VALUES
(69, 'January', 2025, '2025-01-31', 50000.00, 5000.00, 45000.00),
(71, 'February', 2025, '2025-02-28', 60000.00, 6000.00, 54000.00),
(56, 'March', 2025, '2025-03-31', 55000.00, 4000.00, 51000.00),
(58, 'April', 2025, '2025-04-30', 70000.00, 7000.00, 63000.00),
(59, 'May', 2025, '2025-05-31', 48000.00, 3000.00, 45000.00);

ALTER TABLE salaries ADD CONSTRAINT unique_emp_month_year UNIQUE(employee_id, month, year);


select*from salaries;
DELETE FROM salaries WHERE employee_id = 58 AND month='January';


SELECT* from salaries;
CREATE TABLE salary_details (
    id SERIAL PRIMARY KEY,
    salary_id INT NOT NULL REFERENCES salaries(id),
    salary_component_id INT NOT NULL REFERENCES salary_components(id),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO salary_details (salary_id, salary_component_id, amount) VALUES

(26, 1, 20000.00), 
(26, 2, 5000.00),  
(26, 3, 8000.00),  
(26, 4, 2000.00), 
(26, 5, 1500.00),  
(26, 6, 3000.00),  
(26, 7, 2500.00),  
(26, 8, 1800.00),  

(27, 1, 22000.00),
(27, 2, 5500.00),
(27, 3, 8500.00), 
(27, 4, 2500.00), 
(27, 5, 1600.00), 
(27, 6, 3500.00), 
(27, 7, 3000.00), 
(27, 8, 2000.00), 

(28, 1, 25000.00), 
(28, 2, 6000.00), 
(28, 3, 9000.00),
(28, 4, 2700.00), 
(28, 5, 1800.00),
(28, 6, 4000.00), 
(28, 7, 3200.00), 
(28, 8, 2200.00), 

(29, 1, 27000.00), 
(29, 2, 6500.00), 
(29, 3, 9500.00), 
(29, 4, 3000.00), 
(29, 5, 2000.00), 
(29, 6, 4500.00) ,
(29, 7, 3500.00), 
(29, 8, 2500.00),

(30, 1, 28000.00),
(30, 2, 7000.00), 
(30, 3, 10000.00), 
(30, 4, 3200.00),  
(30, 5, 2200.00), 
(30, 6, 5000.00),  
(30, 7, 3700.00), 
(30, 8, 2700.00);

SELECT*from salary_details;
select*from salary_components;

SELECT 
    e.id, 
    e.firstname, 
    e.lastname, 
    e.surname, 
    e.doj, 
    e.dob, 
    e.gender, 
    e.phone, 
    ws.description AS working_status, 
    d.designation_name, 
    l.district AS location, 
    e.gross
FROM employee_details e
JOIN working_status ws ON e.working_status_id = ws.id
JOIN designation_details d ON e.designation_id = d.id
JOIN locations l ON e.location_id = l.id
WHERE e.id = 4;

  SELECT 
    e.id, 
    e.firstname, 
    e.lastname, 
    e.gross,
    d.designation_name AS designation, 
    w.description AS working_status, 
    l.district AS location,
    s.deduction,
    s.net,
    s.paid_on
FROM employee_details e
LEFT JOIN designation_details d ON e.designation_id = d.id
LEFT JOIN working_status w ON e.working_status_id = w.id
LEFT JOIN locations l ON e.location_id = l.id
LEFT JOIN salaries s ON e.id = s.employee_id;



CREATE TYPE leave_status AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    leave_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    reason TEXT,
    status leave_status DEFAULT 'Pending'
);



select*from leave_requests;

INSERT INTO leave_requests (employee_name, leave_type, start_date, end_date, reason, status) VALUES
('Nikita Ray', 'Sick Leave', '2025-04-10', '2025-04-12', 'Flu symptoms', 'Pending'),
('Ratan Roy', 'Vacation', '2025-05-01', '2025-05-05', 'Family trip', 'Approved'),
('Prasoon Pandey', 'Casual Leave', '2025-04-15', '2025-04-16', 'Personal work', 'Pending'),
('Rahul Prihar', 'Sick Leave', '2025-04-10', '2025-04-12', 'Doctor appointment', 'Rejected'),
('Priti Baghel', 'Vacation', '2025-06-01', '2025-06-05', 'Holiday with friends', 'Approved'),
('Maya Rajput', 'Maternity Leave', '2025-04-20', '2025-07-20', 'Pregnancy leave', 'Pending'),
('Prasanna Kadali', 'Sick Leave', '2025-04-16', '2025-04-18', 'Hospital treatment', 'Approved'),
('Rohini Vishwakarma', 'Casual Leave', '2025-04-22', '2025-04-23', 'Family event', 'Pending');

delete from leave_requests WHERE id=8;
INSERT INTO leave_requests (employee_name, leave_type, start_date, end_date, reason, status) VALUES('Rohini Vishwakarma', 'Casual Leave', '2025-04-22', '2025-04-23', 'Family event', 'Pending');
---------------------------------------------------------------------------------------------
----HOA------

CREATE Table scheme(
    id SERIAL PRIMARY KEY,
    description VARCHAR(25) NOT NULL UNIQUE,
    type INT NOT NULL check(type IN(1,2)),
    code VARCHAR(3) NOT NULL
);
SELECT * from scheme;

CREATE Table department(
    id SERIAL PRIMARY KEY,
    description VARCHAR(25) NOT NULL UNIQUE,
    type INT NOT NULL check(type IN(1,2,3,4,5))
);

SELECT*from department;




CREATE Table hoa(
    id SERIAL PRIMARY KEY,
    hod INT NOT NULL REFERENCES department(id),
    estScheme INT NOT NULL REFERENCES scheme(id),
    hoa VARCHAR(40) UNIQUE NOT NULL,
    hoa_tier VARCHAR(40) UNIQUE NOT NULL,
    mjH VARCHAR(4) NOT NULL,
    smjH VARCHAR(2) NOT NULL,
    mnH VARCHAR(3) NOT NULL,
    gsH VARCHAR(2) NOT NULL,
    sH VARCHAR(2) NOT NULL,
    dH VARCHAR(3) NOT NULL,
    sdH VARCHAR(3) NOT NULL,
    scheme_code INT REFERENCES scheme(id),
    year VARCHAR(10) NOT NULL,
    amount NUMERIC(10,2) DEFAULT 100.00,
    status VARCHAR(10) NOT NULL
);

INSERT INTO scheme(description,type,code) VALUES
('Establishment', 1, 'NVN'),
('Scheme', 2, 'PVN');

SELECT * FROM scheme;


INSERT INTO department(description,type) VALUES
('Agriculture Dept', 1),
('Education Dept', 2),
('Health Dept', 3),
('Rural Dev. Dept', 4),
('Urban Planning Dept', 5);

SELECT * FROM department;
 SELECT 
    hoa.id,
    d.description AS hod_description, 
    s.description AS estScheme_description, 
      CONCAT(hoa.mjH, hoa.smjH, hoa.mnH, hoa.gsH, hoa.sH, hoa.dH, hoa.sdH) AS hoa,
    CONCAT(hoa.mjH, '-', hoa.smjH, '-', hoa.mnH, '-', hoa.gsH, '-', hoa.sH, '-', hoa.dH, '-', hoa.sdH) AS hoa_tier,  
    hoa.mjH,
    hoa.smjH,
    hoa.mnH,
    hoa.gsH,
    hoa.sH,
    hoa.dH,
    hoa.sdH,
    s.description,
    hoa.year,
    hoa.amount,
    hoa.status
FROM 
    hoa
JOIN 
    department d ON hoa.hod = d.id  
JOIN 
    scheme s ON hoa.estScheme = s.id;  

select * from hoa;
SELECT 
    h.mjh, 
    h.smjh, 
    h.mnh, 
    h.gsh, 
    h.sh, 
    h.dh, 
    h.sdh, 
    h.year, 
    d.description AS hod_description, 
    s.description AS estscheme_description
FROM 
    hoa h
JOIN 
    department d ON h.hod = d.id
JOIN 
    scheme s ON h.estScheme = s.id
WHERE 
    h.id = 2;
