// Module imports
const db = require('./db/connection');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');

// database connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    run();
})

// Run the application
run = function () {
    inquirer.prompt(
        {
            type: 'list',
            name: 'menuSelect',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Delete Department', 'Delete Role', 'Delete Employee']
        }
    ).then(response => {
        if (response.menuSelect === 'View All Departments') {
            viewDepartment();
        } else if (response.menuSelect === 'View All Roles') {
            viewRole();
        } else if (response.menuSelect === 'View All Employees') {
            viewEmployee();
        } else if (response.menuSelect === 'Add a Department') {
            addDepartment();
        } else if (response.menuSelect === 'Add a Role') {
            addRole();
        } else if (response.menuSelect === 'Add an Employee') {
            addEmployee();
        } else if (response.menuSelect === 'Update an Employee Role') {
            updateEmployee();
        } else if (response.menuSelect === 'Delete department') {
            deleteDepartment();
        } else if (response.menuSelect === 'Delete Role') {
            deleteRole();
        } else if (response.menuSelect === 'Delete Employee') {
            deleteEmployee();
        }
    });
};

// view all departments data
const viewDepartment = () => {
    const sql = `SELECT * FROM department`

    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        printTable(rows);
        run();
    });
};

// view all role data
const viewRole = () => {
    const sql = `SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id`

    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        printTable(rows);
        run();
    });
};

// view all employee data
const viewEmployee = () => {
    const sql = `SELECT e.id, e.first_name, e.last_name, role.title AS role,
    department.name AS department,
    role.salary AS salary,
    CONCAT(m.first_name, '', m.last_name) AS manager
    FROM employee e
    INNER JOIN role ON e.role_id = role.id
    LEFT JOIN department ON e.role_id = role.id AND role.department_id = department.id
    LEFT JOIN employee m ON m.id = e.manager_id`

    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        printTable(rows);
        run();
    });
};

// add a department
const addDepartment = () => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'newDepartment',
            message: 'WHat is the name of the department you would like to add?'
        }
    ).then(response => {
        const sql = `INSERT INTO departments (name) VALUES (?)`
        const params = response.newDepartment;

        db.query(sql, params, (err, result) => {
            if (err) {
                throw err;
            }
            console.log('New department added')
            viewDepartment();
        });
    });
};

// add a role
const addRole = () => {
    db.query(`SELECT * FROM department`, (err, rows) => {
        if (err) throw err;
        const departmentList = rows.map(department => {
            return {
                name: department.name,
                value: department.i
            }
        })
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the new role you would like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the new role?'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department will this role be added?',
                choices: 'departmentList'
            }])
            .then(response => {
                const sql = `INSERT INTO role (title, salary, department_id,) VALUES (?,?,?)`
                const params = [
                    response.title,
                    response.salary,
                    response.department_id
                ];
                db.query(sql, params, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    console.log('New role has been added!')
                    viewRole();
                });
            });
    });
};

// add an employee 
const addEmployee = () => {
    db.query(`SELECT * FROM role`, (err, rows) => {
        if (err) throw err;
        const role = rows.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        })
        // query to select employee with manager_d null for managers
        db.query(`SELECT * FROM employees`, (err, rows) => {
            if (err) throw err;
            const nullManager = {
                name: 'null',
                value: null
            };
            const managers = rows.filter(employee => employee.manager_id === null);
            const managersList = managers.map(manager => {
                return {
                    name: manager.first_name + ' ' + manager.last_name,
                    value: manager.id
                }
            })
            // no manager option
            managersList.push(nullManager);
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the new employee first name?'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the new employee last name?'
                },
                {
                    type: 'list',
                    name: 'title',
                    message: 'What is the new title this employee will have?',
                    choices: role
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is the manager of the new employee?',
                    choices: managersList
                }
            ])
                // query to employee data
                .then(response => {
                    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES (?,?,?,?)`;
                    const params = [response.firstName, response.lastName, response.title, response.manager];

                    db.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log('New employee has been added!');
                        viewEmployee();
                    })
                });
        });
    });
};

// delete department
const deleteDepartment = () => {
    db.query(`SELECT * FROM department`, (err, rows) => {
        if (err) throw err;
        const departmentList = rows.map(department => {
            return {
                name: department.name,
                value: department.id
            }
        })
        inquirer.prompt(
            {
                type: 'list',
                name: 'deleteDepartment',
                message: 'Which department would you like to delete?',
                choices: departmentList
            }
        )
            .then(response => {
                const sql = `DELETE FROM department WHERE id = ?`;
                const params = [response.deleteDepartment];

                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log('Department deleted');
                    viewDepartment();
                })
            });
    });
};

// delete role
const deleteRole = () => {
    // query to all roles data
    db.query(`SELECT * FROM role`, (err, rows) => {
        if (err) throw err;
        const roleList = rows.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        })
        inquirer.prompt(
            {
                type: 'list',
                name: 'deleteRole',
                message: 'Which role would you like to delete?',
                choices: roleList
            }
        )
            .then(response => {
                const sql = `DELETE FROM role WHERE id = ?`;
                const params = [response.deleteRole];

                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log('Role has been deleted');
                    viewRole();
                })
            });
    });
};

// delete employee
const deleteEmployee = () => {
    // query to all employee data
    db.query(`SELECT * FROM employee`, (err, rows) => {
        if (err) throw err;
        const employeeList = rows.map(employee => {
            return {
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id
            }
        })
        inquirer.prompt(
            {
                type: 'list',
                name: 'deleteEmployee',
                message: 'Which employee would you like to delete?',
                choices: employeeList
            }
        )
            .then(response => {
                const sql = `DELETE FROM employee WHERE id = ?`;
                const params = [response.deleteEmployee];

                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log('Employee has been deleted');
                    viewEmployee();
                })
            });
    });
};

// update existing employee role
const updateEmployee = () => {
    db.query(`SELECT * FROM role`, (err, rows) => {
        if (err) throw err;
        const roleList = rows.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        })
        db.query(`SELECT * FROM employee`, (err, rows) => {
            if (err) throw err;
            const employeeList = rows.map(employee => {
                return {
                    name: employee.first_name + ' ' + employee.last_name,
                    value: employee.id
                }
            })
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'What is the name of the employee you would like to update?',
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'newTitle',
                    message: 'What new title will this employee hold?',
                    choices: roleList
                }
            ])
                .then(response => {
                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
                    const params = [
                        response.newTitle,
                        response.employee
                    ]

                    db.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log('Employee role has been updated')
                    })
                    viewEmployee();
                })
        });
    });
};

