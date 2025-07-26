const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🟢 Se recibió solicitud de login:', req.body);

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    console.log('🔍 Resultado de la consulta:', result.rows);

    if (result.rows.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    if (password !== user.password) {
  console.log('❌ Contraseña incorrecta (texto plano)');
  return res.status(401).json({ message: 'Contraseña incorrecta' });
}

console.log('✅ Contraseña correcta (texto plano)');

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log('✅ Login exitoso para:', user.email);

    res.json({ token, nombre: user.nombre, rol: user.rol });

  } catch (error) {
    console.error('💥 Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;