const { Pool, Client } = require("pg");
const config = require('./db_connection.json')

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
});

/*CREATE organizations table

  pool.query(
    "CREATE TABLE organizations(id SERIAL PRIMARY KEY, org_name TEXT);",
    (err, res) => {
      console.log(err, res);
    }
  );
  */

/*CREATE daughters table with relation parent in organizations
  pool.query(
    "CREATE TABLE daughters(id SERIAL PRIMARY KEY, parent_id INT NOT NULL, FOREIGN KEY (parent_id) REFERENCES organizations (id), org_name TEXT);",
    (err, res) => {
      console.log(err, res);
      pool.end();
    }
  );
  */

 pool.query("SELECT * from organizations", (err, res) => {
  console.log(err, res.rows);
  pool.end();
});
