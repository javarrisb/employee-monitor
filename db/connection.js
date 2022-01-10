// MySQL import
const mysql = require('mysql2');

require('dotenv').config();

// connect to the database
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        // My username 
        user: process.env.DB_USER,
        // My password 
        password: process.env.DB_PASS,
        database: 'business'
    },
    console.log('Connected to the business database.')
);

module.exports = db;