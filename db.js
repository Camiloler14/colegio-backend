const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
   },
});

pool.connect()
  .then(() => console.log('📡 Base de datos conectada exitosamente'))
  .catch(err => console.error('❌ Error al conectar con la base de datos:', err));

module.exports = pool;
