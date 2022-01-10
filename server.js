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
    )
}