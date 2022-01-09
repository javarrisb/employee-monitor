INSERT INTO department (name)
VALUES 
    ('Marketing'),
    ('Accounting'),
    ('Human Resources'),
    ('Sales'),
    ('Production')
    ;

INSERT INTO role (title, salary, department_id)
VALUES
    ('Marketing Manager', 100000.00, 21),
    ('Asst. Marketing Manager', 75000.00, 21),
    ('Social Media Director', 50000.00, 21),
    ('Accounting Manager', 150000.00, 22),
    ('Accounting Technician', 80000.00, 22),
    ('Accounting Administrator', 60000.00, 22),
    ('Human Resources Director', 90000.00, 23),
    ('Chief Diversity Officer', 75000.00, 23),
    ('Human Resource Specialist', 65000.00, 23),
    ('Sales Director', 200000.00, 24),
    ('General Manager-Sales', 100000.00, 24),
    ('Senoir Sales Consultant', 50000.00, 24),
    ('Director of Engineering', 150000.00, 25),
    ('Software Architect', 90000.00, 25),
    ('Project Manager', 60000.00, 25)
    ;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Captain', 'America', 16, 1),
    ('Black', 'Panther', 17, NULL),
    ('Spider', 'Man', 18, 1),
    ('Bruce', 'Banner', 19, NULL),
    ('Doctor', 'Strange', 20, 2),
    ('Dead', 'Pool', 21, 2),
    ('Dare', 'Devil', 22, 2),
    ('Nick', 'Fury', 23, 3),
    ('Black', 'Widow', 24, 3),
    ('Jessica', 'Jones', 25, NULL),
    ('Captain', 'Marvel', 26, NULL),
    ('Luke', 'Cage', 27, 4),
    ('Iron', 'Man', 28, 4),
    ('Star', 'Lord', 29, NULL),
    ('Wanda', 'Maximoff', 30, 5)
    ;