const format = require("pg-format");
const { pool } = require("../utils/dbConnection");

const getJoyas = async ({ limits = 10, page = 1, order_by = "id_ASC" }) => {
  const [campo, direccion] = order_by.split("_");
  const offset = (page - 1) * limits;

  const consulta = format(
    "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
    campo,
    direccion,
    limits,
    offset,
  );

  try {
    const { rows: joyas } = await pool.query(consulta);
    return joyas;
  } catch (error) {
    throw new Error("No se pudieron obtener las joyas: " + error.message);
  }
};

const getFilteredJoyas = async ({
  precio_min,
  precio_max,
  categoria,
  metal,
}) => {
  const condiciones = [];
  const valores = [];

  const agregarFiltro = (campo, comparador, valor) => {
    valores.push(valor);
    condiciones.push(`${campo} ${comparador} $${valores.length}`);
  };

  if (precio_min) agregarFiltro("precio", ">=", precio_min);
  if (precio_max) agregarFiltro("precio", "<=", precio_max);
  if (categoria) agregarFiltro("categoria", "=", categoria);
  if (metal) agregarFiltro("metal", "=", metal);

  let consulta = "SELECT * FROM inventario";
  if (condiciones.length > 0) {
    consulta += ` WHERE ${condiciones.join(" AND ")}`;
  }

  try {
    const { rows: joyas } = await pool.query(consulta, valores);
    return joyas;
  } catch (error) {
    throw new Error("No se pudieron filtrar las joyas: " + error.message);
  }
};

const prepararHATEOAS = (joyas) => {
  const results = joyas.map((j) => ({
    name: j.nombre,
    href: `/joyas/joya/${j.id}`,
  }));

  const totalJoyas = joyas.length;
  const stockTotal = joyas.reduce((acumulado, j) => acumulado + j.stock, 0);

  return { totalJoyas, stockTotal, results };
};

module.exports = { getJoyas, getFilteredJoyas, prepararHATEOAS };
