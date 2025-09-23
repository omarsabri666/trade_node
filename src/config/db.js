const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "01110901681Dd",
    database: "trade_app",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = db;