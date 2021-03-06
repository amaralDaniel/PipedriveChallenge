const { text } = require("express");
const { Pool, Client } = require("pg");
const config = require("./db_connection.json");

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
});

var insertOrganizationIntoDB = (org_name) => {
    const text = "INSERT INTO organizations(org_name)VALUES($1)ON CONFLICT(org_name)DO NOTHING"
    const values = [org_name];
  pool
    .query(
      text, values
    )
    .then((res) => {})
    .catch((err) => console.error("Error executing query", err.stack));
};

var insertDaughterIntoDB = (org_name, parent_id) => {
  const text =
    "INSERT INTO daughters(parent_id, org_name) VALUES($1, $2)ON CONFLICT(parent_id,org_name)DO NOTHING";
  const values = [parent_id, org_name];
  pool
    .query(text, values)
    .then((res) => {})
    .catch((err) => console.error("Error executing query", err.stack));
};

var getOrganizationByName = (org_name, callback) => {
    const text =
    "SELECT * FROM organizations WHERE org_name = $1";
    const values = [org_name];
  return pool
    .query(text, values)
    .then((res) => {
      callback(res.rows[0]);
    })
    .catch((err) => console.error("Error executing query", err.stack));
};

var getOrganizationByID = (org_id, callback) => {
    const text =
    "SELECT * FROM organizations WHERE id = $1";
    const values = [org_id];
  return pool
    .query(text, values)
    .then((res) => {
      callback(res.rows);
    })
    .catch((err) => console.error("Error executing query", err.stack));
};

var getDaughterByName = (org_name, callback) => {
    const text =
    "SELECT * FROM daughters WHERE org_name = $1";
    const values = [org_name]
  return pool
    .query(text, values)
    .then((res) => {
      callback(res.rows);
    })
    .catch((err) => console.error("Error executing query", err.stack));
};

var getDaughterRowsByParentId = (parent_id, searchWord, callback) => {
    const text =
    "SELECT * FROM daughters WHERE parent_id = $1 AND org_name != $2";
    const values = [parent_id, searchWord];
  return pool
    .query(
      text, values
    )
    .then((res) => {
      callback(res.rows);
    })
    .catch((err) => console.error("Error executing query", err.stack));
};

module.exports = {
  insertOrganizationIntoDB: insertOrganizationIntoDB,
  insertDaughterIntoDB: insertDaughterIntoDB,
  getOrganizationByName: getOrganizationByName,
  getDaughterByName: getDaughterByName,
  getDaughterRowsByParentId: getDaughterRowsByParentId,
  getOrganizationByID: getOrganizationByID,
};

/*CREATE organizations table

  pool.query(
    "CREATE TABLE organizations(id SERIAL PRIMARY KEY, org_name TEXT UNIQUE);",
    (err, res) => {
      console.log(err, res);
    }
  );
  */

//CREATE daughters table with relation parent in organizations
/*pool.query(
    "CREATE TABLE daughters(id SERIAL PRIMARY KEY, parent_id INT NOT NULL, FOREIGN KEY (parent_id) REFERENCES organizations (id), org_name TEXT, UNIQUE(parent_id, org_name));",
    (err, res) => {
      console.log(err, res);
      pool.end();
    }
  );*/
