const  express  = require('express');
const {chList}= require('../config/character')
const { redis, REDIS_KEY } = require('../config/redis');



const router = express.Router();

router.get('/get', async (req, res) => {
  try {
    // 1. Obtener la lista de participantes que ya se registraron
    const miembrosRaw = await redis.smembers(REDIS_KEY);
    const participantes = miembrosRaw.map(item => 
      typeof item === 'string' ? JSON.parse(item) : item
    );

    // 2. Extraer solo los nombres de los cantantes/personajes ya ocupados
    const elegidos = new Set(
      participantes.map(p => p.cantante.toLowerCase().trim())
    );

    // 3. Filtrar chList para dejar solo los disponibles
    const disponibles = {};
    for (const [nombre, url] of Object.entries(chList)) {
      if (!elegidos.has(nombre.toLowerCase().trim())) {
        disponibles[nombre] = url;
      }
    }

    return res.status(200).json({
      success: true,
      personajes: disponibles
    });

  } catch (error) {
    console.error('Error al obtener personajes:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error al consultar la lista de personajes.' 
    });
  }
});

module.exports=router