const express = require('express');
const cors = require('cors');
const countryRoutes = require('./routes/countryRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const parkingRoutes = require('./routes/parkingRoutes');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
// Rutas
app.use('/api/countries', countryRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/parking-cars', parkingRoutes);
// Ruta de inicio
app.get('/', (req, res) => {
    res.send('API de Paises, Empleados y Estacionamiento funcionando correctamente con PostgreSQL');
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});