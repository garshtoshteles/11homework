DROP database if exists employee_db;
CREATE database employee_db;
USE employee_db;
CREATE table department (
id int auto_increment PRIMARY KEY, 
`name` varchar(30)
);
CREATE table `role` (
id int auto_increment PRIMARY KEY, 
title varchar(30),
salary decimal,
department_id int,
foreign key (department_id) references department(id)
);
CREATE table employee (
id int auto_increment PRIMARY KEY, 
first_name varchar(30),
last_name varchar(30),
role_id int,
manager_id int,
FOREIGN KEY (role_id) REFERENCES `role`(id),
foreign key (manager_id) references employee(id)
);
INSERT INTO department
    (`name`)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');
INSERT INTO `role`
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, NULL),
    ('Tom', 'Allen', 8, 7);