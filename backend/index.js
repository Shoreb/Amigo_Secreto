require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Redis } = require('@upstash/redis');
const ExcelJS = require('exceljs');

const app = express();


app.use(cors()); 
app.use(express.json()); 

const redis = Redis.fromEnv();
const REDIS_KEY = 'amigo_secreto_participantes';



app.get('/', (req, res) => {
  res.send({ status: 'OK', mensaje: 'Servidor del Amigo Secreto funcionando 🚀' });
});

app.post('/api/participantes', async (req, res) => {
  try {
    const { nombre, cantante } = req.body;

    if (!nombre || !cantante) {
      return res.status(400).json({
        error: 'Debes enviar tanto el nombre como el cantante.'
      });
    }

    const participante = {
      nombre: nombre.trim(),
      cantante: cantante.trim(),
      fechaRegistro: new Date().toISOString()
    };

  
    await redis.sadd(REDIS_KEY, JSON.stringify(participante));

    return res.status(201).json({
      exito: true,
      mensaje: '¡Participante registrado con éxito!',
      datos: participante
    });

  } catch (error) {
    console.error('Error al guardar en Redis:', error);
    return res.status(500).json({ error: 'Hubo un error al guardar el registro.' });
  }
});

app.get('/api/participantes', async (req, res) => {
  try {
  
    const miembrosRaw = await redis.smembers(REDIS_KEY);

    const participantes = miembrosRaw.map(item => typeof item === 'string' ? JSON.parse(item) : item);

    return res.status(200).json({
      total: participantes.length,
      participantes
    });

  } catch (error) {
    console.error('Error al consultar Redis:', error);
    return res.status(500).json({ error: 'Hubo un error al consultar la lista.' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en el puerto ${PORT}`);
});




// ENDPOINT PARA DESCARGAR EL EXCEL

app.get('/api/exportar-excel', async (req, res) => {
  try {
   
    const miembrosRaw = await redis.smembers(REDIS_KEY);
    const participantes = miembrosRaw.map(item => 
      typeof item === 'string' ? JSON.parse(item) : item
    );


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Amigo Secreto');


    worksheet.columns = [
      { header: '#', key: 'index', width: 6 },
      { header: 'Nombre del Participante', key: 'nombre', width: 30 },
      { header: 'Cantante Elegido', key: 'cantante', width: 30 },
      { header: 'Fecha de Registro', key: 'fechaRegistro', width: 25 },
    ];

    // Estilo para el encabezado (Fila 1)
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2C3E50' } // Color azul oscuro elegante
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
    console.error('Error al generar el archivo Excel:', error);
    return res.status(500).json({ error: 'No se pudo generar el Excel' });
  }
});