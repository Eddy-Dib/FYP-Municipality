const mysql = require("mysql2");
const dotenv = require("dotenv");

// stores credentials and secrets of the database connection
dotenv.config();

/**
 * Database pool configuration
 * 
 * Creates a connection pool to the MySQL database, allowing
 * multiple simultaneous connections. 
 * 
 * @example
 * db.query('SELECT * FROM TABLE', (err, results) => {
 *   if (err) throw err;
 *   console.log(results);
 * });
 */
const db = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    }
);

module.exports = db;