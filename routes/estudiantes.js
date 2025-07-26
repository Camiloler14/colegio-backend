const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middlewares/auth');

// Obtener todos los estudiantes (orden alfabético)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM estudiantes ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear nuevo estudiante (solo admin)
router.post('/', auth.verifyToken, auth.requireAdmin, async (req, res) => {
  const { nombre, grado } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO estudiantes (nombre, grado) VALUES ($1, $2) RETURNING *',
      [nombre, grado]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ message: 'Error al crear estudiante' });
  }
});

// Actualizar estudiante (solo admin)
router.put('/:id', auth.verifyToken, auth.requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre, grado } = req.body;
  try {
    const result = await pool.query(
      'UPDATE estudiantes SET nombre = $1, grado = $2 WHERE id = $3 RETURNING *',
      [nombre, grado, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ message: 'Error al actualizar estudiante' });
  }
});

// Eliminar estudiante (solo admin)
router.delete('/:id', auth.verifyToken, auth.requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM estudiantes WHERE id = $1', [id]);
    res.json({ message: 'Estudiante eliminado' });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ message: 'Error al eliminar estudiante' });
  }
});

module.exports = router;
