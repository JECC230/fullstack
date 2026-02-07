import express from 'express';
import pedidosRoutes from './src/routes/pedidos_routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Usamos las rutas
app.use('/pedidos', pedidosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor de Pedidos activo en http://localhost:${PORT}`);
});