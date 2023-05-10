// get the client
const mysql = require('mysql2');

// create the connection to database


// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_DATABASE || 'shareameal',
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
});

pool.on('connection', function(connection) {
    //   console.log("connect")
});

pool.on('acquire', function(connection) {
    //   console.log("acquire")
});

pool.on('release', function(connection) {
    //   console.log("release")
});

module.exports = pool;