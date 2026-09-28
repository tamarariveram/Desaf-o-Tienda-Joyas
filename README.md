# API Joyas — Desafío Módulo 6 (estructura alineada al index.js del profe)

## Estructura del proyecto
```
joyas-api/
├── index.js
├── routes.log          <- vacío, se llena solo al usar la API
├── script.sql
├── controllers/
│   └── joya.controller.js
└── utils/
    └── dbConnection.js
```

## Paso 1: Instalar dependencias
```
npm install
```
(el `package.json` ya trae express, pg, pg-format y cors. Importante: usa Express 4, ya que la ruta `app.get("*")` no funciona en Express 5.)

## Paso 2: Crear la base de datos
Abre tu terminal `psql` y ejecuta el contenido de `script.sql` (crea la base `joyas`,
la tabla `inventario` y los 6 registros de ejemplo).

## Paso 3: Configurar la conexión
Abre `utils/dbConnection.js` y reemplaza `"TU_PASSWORD_AQUI"` por tu contraseña real
de Postgres.

## Paso 4: Crear el archivo de logs (¡importante!)
Ya te dejé `routes.log` vacío en la carpeta. Si lo borras por error, créalo de nuevo
vacío antes de levantar el servidor — si no existe, el middleware `consoleRoute`
va a tirar un error al leerlo.

## Paso 5: Levantar el servidor
```
node index.js
```
Deberías ver en consola:
```
🟢 Servidor iniciado con éxito en ---> http://localhost:3000 <---
💾 Base de datos conectada y funcionando a las ...
```

## Paso 6: Probar en Thunder Client

**Ruta principal con HATEOAS, límite, página y orden:**
```
GET http://localhost:3000/joyas?limits=3&page=2&order_by=stock_ASC
```

**Ruta de filtros (parametrizada):**
```
GET http://localhost:3000/joyas/filtros?precio_min=25000&precio_max=30000&categoria=aros&metal=plata
```

**Ruta inexistente (para probar el 404 personalizado):**
```
GET http://localhost:3000/cualquiercosa
```

Después de probar, abre `routes.log` — debería tener una línea nueva por cada
consulta que hiciste a `/joyas` o `/joyas/filtros`.
