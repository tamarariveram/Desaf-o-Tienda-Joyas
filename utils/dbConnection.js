const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "joyas",
  password: "TU_PASSWORD_AQUI",
  port: 5432,
});

const checkConnection = async () => {
  const { rows } = await pool.query("SELECT NOW()");
  return rows[0].now;
};

module.exports = { pool, checkConnection };
