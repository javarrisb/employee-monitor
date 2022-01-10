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




