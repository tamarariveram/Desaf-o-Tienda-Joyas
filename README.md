# API Tienda de Joyas

API REST para consultar el inventario de una tienda de joyas. Permite limitar, paginar, ordenar y filtrar los registros, y entrega los resultados con estructura HATEOAS.

## Tecnologías

- Node.js
- Express
- PostgreSQL (`pg` y `pg-format`)
- CORS

## Características

- Listado de joyas con límite, paginación y ordenamiento por query string.
- Respuesta con estructura HATEOAS (`totalJoyas`, `stockTotal` y `results` con enlaces).
- Filtros por rango de precio, categoría y metal, con consultas parametrizadas para evitar SQL Injection.
- Middleware que registra en `routes.log` cada consulta realizada.
- Manejo de errores con `try/catch`.
- Respuesta 404 personalizada para rutas inexistentes.

## Estructura del proyecto

```
├── index.js
├── package.json
├── routes.log
├── script.sql
├── controllers/
│   └── joya.controller.js
└── utils/
    └── dbConnection.js
```

## Instalación

1. Instalar las dependencias:
   ```
   npm install
   ```
2. Crear la base de datos y la tabla ejecutando `script.sql` en `psql`:
   ```
   psql -U postgres -f script.sql
   ```
3. En `utils/dbConnection.js`, reemplazar `TU_PASSWORD_AQUI` por la contraseña de tu usuario de PostgreSQL.
4. Iniciar el servidor:
   ```
   node index.js
   ```
   El servidor queda disponible en `http://localhost:3000`.

## Endpoints

### `GET /joyas`

Devuelve las joyas en formato HATEOAS.

| Parámetro | Descripción | Valor por defecto |
|---|---|---|
| `limits` | Cantidad de joyas por página | `10` |
| `page` | Número de página (la primera es la 1) | `1` |
| `order_by` | Campo y dirección, por ejemplo `stock_ASC` o `precio_DESC` | `id_ASC` |

Ejemplo:
```
GET /joyas?limits=3&page=2&order_by=stock_ASC
```

Respuesta:
```json
{
  "totalJoyas": 3,
  "stockTotal": 19,
  "results": [
    { "name": "Anillo Wish", "href": "/joyas/joya/5" },
    { "name": "Collar History", "href": "/joyas/joya/2" },
    { "name": "Aros Berry", "href": "/joyas/joya/3" }
  ]
}
```

### `GET /joyas/filtros`

Devuelve las joyas que cumplen los filtros indicados. Todos los parámetros son opcionales y se pueden combinar.

| Parámetro | Descripción |
|---|---|
| `precio_min` | Joyas con precio mayor o igual al valor |
| `precio_max` | Joyas con precio menor o igual al valor |
| `categoria` | Categoría de la joya (por ejemplo `aros`) |
| `metal` | Metal de la joya (por ejemplo `plata`) |

Ejemplo:
```
GET /joyas/filtros?precio_min=25000&precio_max=30000&categoria=aros&metal=plata
```

### Rutas inexistentes

Cualquier otra ruta responde con estado `404` y el texto `Esta ruta no existe`.