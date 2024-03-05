//Previously used to connect server to database. As all database calls have been extracted to the API, this code can now be commented out

/* const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  multipleStatements: true,
});

module.exports = pool;
*/