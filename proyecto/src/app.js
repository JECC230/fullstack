import express from 'express';
import inventarioRutas from './rutas/inventarioRutas.js';

const app = express();
const PUERTO = 3000;

// Middleware para entender JSON
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
    res.send('API Smarthome - Gestión de Inventario v1.0');
});

// Rutas de la entidad "Productos"
app.use('/api/productos', inventarioRutas);

app.listen(PUERTO, () => {
    console.log(`Servidor Smarthome corriendo en http://localhost:${PUERTO}`);
});