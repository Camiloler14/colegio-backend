const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/usuarios');
const estudiantesRoutes = require('./routes/estudiantes');
const faltasRoutes = require('./routes/faltas');

app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/faltas', faltasRoutes);

// Puerto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
