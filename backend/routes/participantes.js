const express = require('express');
const ExcelJS = require('exceljs');
const { redis, REDIS_KEY } = require('../config/redis');

const router = express.Router();

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'admin123secret';

// Middleware para proteger rutas de administrador
const protegerAdmin = (req, res, next) => {

  const token = req.headers['x-admin-key'] || req.query.key;

  if (token !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Acceso no autorizado. Clave de administrador inválida.' });
  }

  next();
};

// ==========================================
// RUTAS PÚBLICAS
// ==========================================


router.post('/', async (req, res) => {
  try {
    const { nombre, cantante } = req.body;

    // 1. Validación de campos obligatorios
    if (!nombre || !cantante) {
      return res.status(400).json({ error: 'Debes enviar tanto el nombre como el cantante.' });
    }

    const nombreLimpio = nombre.trim();
    const cantanteLimpio = cantante.trim();

    // 2. Obtener lista actual para validar duplicados
    const miembrosRaw = await redis.smembers(REDIS_KEY);
    const participantes = miembrosRaw.map(item => 
      typeof item === 'string' ? JSON.parse(item) : item
    );

    // 3. Verificar si el cantante YA fue elegido por alguien más (case-insensitive)
    const cantanteYaElegido = participantes.some(
      p => p.cantante.toLowerCase() === cantanteLimpio.toLowerCase()
    );

    if (cantanteYaElegido) {
      return res.status(400).json({
        error: `El cantante "${cantanteLimpio}" ya fue elegido por otra persona. ¡Por favor elige otro!`
      });
    }

    // 4. Si pasa las validaciones, creamos y guardamos el registro
    const participante = {
      nombre: nombreLimpio,
      cantante: cantanteLimpio,
      fechaRegistro: new Date().toISOString()
    };

    await redis.sadd(REDIS_KEY, JSON.stringify(participante));

    return res.status(201).json({
      exito: true,
      mensaje: '¡Participante registrado con éxito!',
      datos: participante
    });

  } catch (error) {
    console.error('Error al guardar:', error);
    return res.status(500).json({ error: 'Error al guardar el registro.' });
  }
});

// GET /api/participantes (Ver total de registrados - público)
router.get('/', async (req, res) => {
  try {
    const miembrosRaw = await redis.smembers(REDIS_KEY);
    const participantes = miembrosRaw.map(item => typeof item === 'string' ? JSON.parse(item) : item);

    return res.status(200).json({
      total: participantes.length,
      participantes
    });
  } catch (error) {
    console.error('Error al consultar:', error);
    return res.status(500).json({ error: 'Error al consultar la lista.' });
  }
});


app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;

  
  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña es requerida.'
    });
  }

  // Comparación con la variable de entorno
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    return res.status(200).json({
      success: true,
      message: 'Contraseña correcta. Acceso concedido.'
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Contraseña incorrecta.'
    });
  }
});

// ==========================================
// RUTAS PRIVADAS (ADMIN)
// ==========================================

router.get('/exportar-excel', protegerAdmin, async (req, res) => {
  try {
    const miembrosRaw = await redis.smembers(REDIS_KEY);
    const participantes = miembrosRaw.map(item => typeof item === 'string' ? JSON.parse(item) : item);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Amigo Secreto');

    worksheet.columns = [
      { header: '#', key: 'index', width: 6 },
      { header: 'Nombre del Participante', key: 'nombre', width: 30 },
      { header: 'Cantante Elegido', key: 'cantante', width: 30 },
      { header: 'Fecha de Registro', key: 'fechaRegistro', width: 25 },
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2C3E50' }
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    participantes.forEach((p, idx) => {
      worksheet.addRow({
        index: idx + 1,
        nombre: p.nombre,
        cantante: p.cantante,
        fechaRegistro: p.fechaRegistro ? new Date(p.fechaRegistro).toLocaleString() : 'N/A'
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Amigo_Secreto_Participantes.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error al generar el Excel:', error);
    return res.status(500).json({ error: 'No se pudo generar el Excel.' });
  }
});

module.exports = router;