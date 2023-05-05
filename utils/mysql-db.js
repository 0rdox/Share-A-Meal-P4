// get the client
const mysql = require('mysql2');

// create the connection to database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'shareameal',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
});

// For pool initialization, see above
pool.getConnection(function(err, conn) {
    // Do something with the connection

    if (err) {
        console.log("Error, can't connect to SQL");
    }
    if (conn) {

        // simple query
        conn.query(
            'SELECT `id`, `name` FROM `meal`',
            function(err, results, fields) {
                //   console.log('errors: ', err)
                //   console.log('results: ', results); // results contains rows returned by server
            }
        );
        pool.releaseConnection(conn);
    }
});


module.exports = pool;