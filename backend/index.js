require('dotenv').config();
const express = require('express');
const cors = require('cors');

const participantesRoutes = require('./routes/participantes');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send({ status: 'OK', mensaje: 'Servidor Amigo Secreto activo 🚀' });
});

app.use('/api/participantes', participantesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en el puerto ${PORT}`);
});