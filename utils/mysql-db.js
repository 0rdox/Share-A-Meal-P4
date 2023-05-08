// get the client
const mysql = require('mysql2');
require('dotenv').config();

// create the connection to database
const pool = mysql.createPool({
    host: % ,
    port: process.env.DB_PORT,
    user: user1,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
});

// For pool initialization, see above
pool.getConnection(function(err, conn) {

    conn.query(
        'SELECT `id` FROM `user`',
    )

    if (err) {
        console.log("Error, can't connect to SQL");
    }
    if (conn) {

        pool.releaseConnection(conn);
    }
});


module.exports = pool;