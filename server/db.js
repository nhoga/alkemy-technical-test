const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "cameleot",
  host: "localhost",
  port: 5432,
  database: "alkemy",
});

module.exports = pool;
