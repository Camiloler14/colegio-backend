const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todas las faltas ordenadas por fecha y nombre
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
  SELECT f.id, f.id_estudiante, f.fecha, f.descripcion, e.nombre AS nombre_estudiante, e.grado 
  FROM faltas f
  JOIN estudiantes e ON f.id_estudiante = e.id
  ORDER BY f.fecha, e.nombre
`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener faltas' });
  }
});

// Crear nueva falta
router.post('/', async (req, res) => {
  const { id_estudiante, fecha, descripcion } = req.body;
  try {
    await pool.query(
  'INSERT INTO faltas (id_estudiante, fecha, descripcion) VALUES ($1, $2, $3)',
  [id_estudiante, fecha, descripcion]
);
    res.json({ message: 'Falta registrada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar la falta' });
  }
});

// Actualizar falta
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, descripcion } = req.body;
  try {
    await pool.query(
      'UPDATE faltas SET fecha = $1, descripcion = $2 WHERE id = $3',
      [fecha, descripcion, id]
    );
    res.json({ message: 'Falta actualizada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la falta' });
  }
});

// Eliminar falta
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM faltas WHERE id = $1', [id]);
    res.json({ message: 'Falta eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la falta' });
  }
});

module.exports = router;
