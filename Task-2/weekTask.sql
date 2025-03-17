-- Active: 1741678145621@@127.0.0.1@5432@weektask
-- Table 1: working_status
CREATE TABLE working_status (
    id SERIAL PRIMARY KEY,
    description VARCHAR(50) NOT NULL
);

--Inserting data into working_status
INSERT INTO working_status (description) VALUES
('Working'),
('Expired'),
('Retired'),
('Suspended');

select*from working_status;

-- Table 2: designations(5)
CREATE TABLE designations (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

--Inserting data into working status
INSERT INTO designations (description) VALUES
('Software Engineer'),
('Senior Software Engineer'),
('Team Lead'),
('Project Manager'),
('HR Manager');

select* from designations;

-- Table 3: location(6 locations)
CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    district VARCHAR(100) NOT NULL
);

--Inserting data into location table
INSERT INTO location (district) VALUES
('Hyderabad'),
('Bangalore'),
('Chennai'),
('Mumbai'),
('Delhi'),
('Pune');

select*from location;
-- Table 4: salary_components
CREATE TABLE salary_components (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL,
    type INT NOT NULL CHECK (type IN (1, 2))  -- 1 for Earning, 2 for Deduction
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
-- Table 5: employees
CREATE TABLE employees (
    id VARCHAR(5) PRIMARY KEY, 
    firstname VARCHAR(100) NOT NULL, 
    lastname VARCHAR(100) NOT NULL, 
    surname VARCHAR(100), 
    doj DATE NOT NULL, 
    dob DATE NOT NULL, 
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    phone VARCHAR(10) UNIQUE NOT NULL, 
    working_status_id INT NOT NULL REFERENCES working_status(id) ON DELETE CASCADE, 
    designation_id INT NOT NULL REFERENCES designations(id) ON DELETE CASCADE, 
    location_id INT NOT NULL REFERENCES location(id) ON DELETE CASCADE, 
    gross DECIMAL(10, 2) NOT NULL CHECK (gross >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--Inserting 20 Data into employees table....................

INSERT INTO employees (id, firstname, lastname, surname, doj, dob, gender, phone, working_status_id, designation_id, location_id, gross)
VALUES
('AA01', 'John', 'Doe', 'Smith', '2020-01-15', '1990-05-20', 'Male', '9876543210', 1, 2, 3, 50000.00),
('AA02', 'Jane', 'Smith', NULL, '2021-02-10', '1992-08-15', 'Female', '9876543211', 2, 3, 1, 60000.00),
('AA03', 'Robert', 'Brown', NULL, '2019-03-05', '1988-12-10', 'Male', '9876543212', 1, 1, 2, 55000.00),
('AA04', 'Emily', 'Clark', 'Johnson', '2018-04-22', '1991-07-18', 'Female', '9876543213', 3, 2, 3, 70000.00),
('AA05', 'Michael', 'Johnson', NULL, '2017-05-30', '1987-11-25', 'Male', '9876543214', 1, 4, 1, 80000.00),
('AA06', 'Sarah', 'Davis', NULL, '2020-06-17', '1993-02-14', 'Female', '9876543215', 2, 3, 2, 45000.00),
('AA07', 'David', 'Wilson', NULL, '2022-07-01', '1994-03-03', 'Male', '9876543216', 1, 1, 3, 48000.00),
('AA08', 'Laura', 'Martinez', NULL, '2016-08-19', '1985-09-09', 'Female', '9876543217', 3, 5, 1, 75000.00),
('AA09', 'James', 'Anderson', NULL, '2015-09-25', '1986-04-22', 'Male', '9876543218', 2, 2, 2, 67000.00),
('AA10', 'Olivia', 'Thomas', NULL, '2023-10-10', '1995-01-17', 'Female', '9876543219', 1, 1, 3, 52000.00),
('AA11', 'William', 'Jackson', NULL, '2014-11-14', '1983-08-08', 'Male', '9876543220', 3, 4, 1, 90000.00),
('AA12', 'Emma', 'White', NULL, '2021-12-05', '1990-12-19', 'Female', '9876543221', 1, 2, 2, 58000.00),
('AA13', 'Alexander', 'Harris', NULL, '2013-01-20', '1982-06-06', 'Male', '9876543222', 3, 3, 3, 85000.00),
('AA14', 'Sophia', 'Martin', NULL, '2018-02-28', '1989-10-23', 'Female', '9876543223', 2, 1, 1, 49000.00),
('AA15', 'Daniel', 'Garcia', NULL, '2016-03-15', '1987-11-11', 'Male', '9876543224', 1, 5, 2, 63000.00),
('AA16', 'Isabella', 'Martinez', NULL, '2020-04-10', '1991-04-04', 'Female', '9876543225', 3, 2, 3, 56000.00),
('AA17', 'Matthew', 'Robinson', NULL, '2015-05-01', '1985-07-07', 'Male', '9876543226', 1, 1, 1, 77000.00),
('AA18', 'Ava', 'Clark', NULL, '2019-06-12', '1992-09-30', 'Female', '9876543227', 2, 4, 2, 69000.00),
('AA19', 'Joseph', 'Lewis', NULL, '2017-07-08', '1988-12-12', 'Male', '9876543228', 3, 3, 3, 81000.00),
('AA20', 'Mia', 'Lee', NULL, '2022-08-23', '1996-05-05', 'Female', '9876543229', 1, 5, 1, 54000.00);

--Table 6 : salaries table
select*FROM employees;
CREATE TABLE salaries (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(5) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    month VARCHAR(15) NOT NULL,
    year INT NOT NULL,
    paid_on DATE NOT NULL,
    gross DECIMAL(10, 2) NOT NULL CHECK (gross > 0),
    deduction DECIMAL(10, 2) DEFAULT 0 CHECK (deduction >= 0 AND deduction <= gross),
    net DECIMAL(10, 2) NOT NULL CHECK (net = gross - deduction),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--inserting data into salaries table

INSERT INTO salaries (employee_id, month, year, paid_on, gross, deduction, net) VALUES
('AA01', 'January', 2024, '2024-01-31', 50000.00, 5000.00, 45000.00),
('AA02', 'January', 2024, '2024-01-31', 60000.00, 4000.00, 56000.00),
('AA03', 'January', 2024, '2024-01-31', 55000.00, 4500.00, 50500.00),
('AA04', 'January', 2024, '2024-01-31', 52000.00, 4200.00, 47800.00),
('AA05', 'January', 2024, '2024-01-31', 58000.00, 5800.00, 52200.00),
('AA06', 'February', 2024, '2024-02-29', 50000.00, 4800.00, 45200.00),
('AA07', 'February', 2024, '2024-02-29', 60000.00, 6000.00, 54000.00),
('AA08', 'February', 2024, '2024-02-29', 52000.00, 4300.00, 47700.00),
('AA09', 'February', 2024, '2024-02-29', 48000.00, 4000.00, 44000.00),
('AA10', 'February', 2024, '2024-02-29', 75000.00, 7000.00, 68000.00),
('AA11', 'March', 2024, '2024-03-31', 51000.00, 4500.00, 46500.00),
('AA12', 'March', 2024, '2024-03-31', 61000.00, 5000.00, 56000.00),
('AA13', 'March', 2024, '2024-03-31', 53000.00, 3500.00, 49500.00),
('AA14', 'March', 2024, '2024-03-31', 49000.00, 3800.00, 45200.00),
('AA15', 'March', 2024, '2024-03-31', 70000.00, 6000.00, 64000.00),
('AA16', 'April', 2024, '2024-04-30', 52000.00, 4000.00, 48000.00),
('AA17', 'April', 2024, '2024-04-30', 63000.00, 5000.00, 58000.00),
('AA18', 'April', 2024, '2024-04-30', 54000.00, 3500.00, 50500.00),
('AA19', 'April', 2024, '2024-04-30', 49500.00, 3000.00, 46500.00),
('AA20', 'April', 2024, '2024-04-30', 71000.00, 6000.00, 65000.00);

select * from salaries;
-- Table 7 : salary_details
CREATE TABLE salary_details (
    id SERIAL PRIMARY KEY,
    salary_id INT NOT NULL REFERENCES salaries(id),
    salary_component_id INT NOT NULL REFERENCES salary_components(id),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserting data into salary_details table
INSERT INTO salary_details (salary_id, salary_component_id, amount) VALUES

(1, 1, 20000.00), 
(1, 2, 5000.00),  
(1, 3, 8000.00),  
(1, 4, 2000.00), 
(1, 5, 1500.00),  
(1, 6, 3000.00),  
(1, 7, 2500.00),  
(1, 8, 1800.00),  

( 2, 1, 22000.00),
(2, 2, 5500.00),
(2, 3, 8500.00), 
(2, 4, 2500.00), 
(2, 5, 1600.00), 
(2, 6, 3500.00), 
(2, 7, 3000.00), 
(2, 8, 2000.00), 

(3, 1, 25000.00), 
(3, 2, 6000.00), 
(3, 3, 9000.00),
(3, 4, 2700.00), 
(3, 5, 1800.00),
(3, 6, 4000.00), 
(3, 7, 3200.00), 
(3, 8, 2200.00), 

(4, 1, 27000.00), 
(4, 2, 6500.00), 
(4, 3, 9500.00), 
(4, 4, 3000.00), 
(4, 5, 2000.00), 
(4, 6, 4500.00) ,
(4, 7, 3500.00), 
(4, 8, 2500.00),

(5, 1, 28000.00),
(5, 2, 7000.00), 
(5, 3, 10000.00), 
(5, 4, 3200.00),  
(5, 5, 2200.00), 
(5, 6, 5000.00),  
(5, 7, 3700.00), 
(5, 8, 2700.00),  

(6, 1, 30000.00), 
(6, 2, 7500.00),  
(6, 3, 11000.00),
(6, 4, 3500.00),  
(6, 5, 2500.00),  
(6, 6, 5500.00),  
(6, 7, 4000.00), 
(6, 8, 3000.00),  

(7, 1, 32000.00), 
(7, 2, 8000.00),  
(7, 3, 12000.00), 
(7, 4, 3800.00),  
(7, 5, 2700.00),  
(7, 6, 6000.00),  
(7, 7, 4500.00),  
(7, 8, 3200.00);  

select * from salary_details;
/*(1) : list of employees (name, doj, dob, gender, phone, working_status, designation, location)*/
select 
    e.firstname,e.doj,e.dob,e.gender,e.phone,
    w.description as working_status ,
    d.description as designation,
    l.district as location 
from employees e
join working_status w
on e.working_status_id = w.id
join designations d ON e.designation_id = d.id 
join location l ON e.location_id = l.id;

/*(2) : count of employees in location wise (location, employee_count) */
SELECT 
    l.district AS location,
    COUNT(e.id) AS employee_count
FROM 
    employees e
JOIN 
    location l ON l.id = e.location_id
GROUP BY 
    l.district;

/*(3) : count of employees in designation wise (designation,employee count),*/
SELECT 
    d.description AS designation,
    COUNT(e.id) AS employee_count
FROM 
    employees e
JOIN 
    designations d ON d.id = e.designation_id
GROUP BY 
    d.description;

/* (4) : count of employees in working status (working status,employee count) */
SELECT 
    w.description AS working_status,
    COUNT(e.id) AS employee_count
FROM 
    employees e
JOIN 
    working_status w ON w.id = e.working_status_id
GROUP BY 
    w.description;

 /*(5) : employees retirement date (employee_id, employee_name, dob, doj, retirement_date)*/  
SELECT 
    id,firstname,lastname,dob,
    (dob + INTERVAL '60 years')::date AS retirement_date
FROM 
    employees;


 /*(6) : salary received by each employee for last month 
 (employee_id, name, salary_year, salary_month, gross, deduction, net).*/
select e.id as employee_id,
e.firstname as employee_name,
s.year as salary_year,
s.month as salary_month,
s.gross, s.deduction,s.net 
from employees e 
JOIN salaries s 
on e.id=s.employee_id
where s.paid_on >= NOW()-INTERVAL '1 MONTH'
ORDER BY e.id
;

/*(7) : maximum, minimum salary of employee, average salary of employees. */
select min(gross) as maximum_salary,
max(gross) as minimum_salary,
avg(gross) as average_salary
from salaries;


/* (8) : show salary break up(each salary component) of each employee wise.*/
SELECT
    e.id AS employee_id,e.firstname AS employee_name,
    sc.description as component_name,
    sd.amount
FROM
    employees e
JOIN
    salaries s ON e.id = s.employee_id
JOIN
    salary_details sd ON s.id = sd.salary_id
JOIN
    salary_components sc ON sd.salary_component_id = sc.id;
    

/* (9) : list of emp who have not received salary for last month.*/

SELECT e.id, concat(e.firstname,'',e.lastname,'',e.surname)name
FROM employees e
where e.id NOT IN(SELECT s.employee_id from salaries s where s.paid_on>=Now()-INTERVAL '1 Month')
ORDER BY e.id;



    







