const { ProductosRepository } = require('../repositories/productos.repository');
const repo = new ProductosRepository();
const { validarProducto } = require('../domain/validaciones');

async function getAll(req, res) {
    try {
        const productos = await repo.getAll();
        return res.json(productos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getById(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'El ID debe ser un número válido' });
        }

        const producto = await repo.getById(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.json(producto);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function create(req, res) {
    const { nombre, precio, marca, categoria } = req.body;
    const validacion = validarProducto({ nombre, precio, marca, categoria });

    if (!validacion.ok) {
        return res.status(400).json({ error: validacion.error });
    }

    try {
        const nuevo = await repo.create(validacion.data);
        return res.status(201).json(nuevo);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function update(req, res) {
    try {
        const id = Number(req.params.id);
        const actualizado = await repo.update(id, req.body);
        if (!actualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.json(actualizado);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function remove(req, res) {
    try {
        const id = Number(req.params.id);
        const ok = await repo.delete(id);
        if (!ok) {
            return res.status(404).json({ error: 'No encontrado' });
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// ESTA ES LA FUNCIÓN NUEVA PARA LA ACTIVIDAD
async function searchAvanzado(req, res) {
    try {
        const nombre = req.query.nombre;
        const minPrecio = req.query.minPrecio ? parseFloat(req.query.minPrecio) : undefined;
        const maxPrecio = req.query.maxPrecio ? parseFloat(req.query.maxPrecio) : undefined;
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        
        if (page <= 0 || limit <= 0) {
            return res.status(400).json({ error: 'Paginación inválida' });
        }

        const offset = (page - 1) * limit;

        const { productos, total } = await repo.buscarAvanzado({
            nombre, minPrecio, maxPrecio, limit, offset
        });

        return res.json({
            data: productos,
            page,
            limit,
            total
        });
    } catch (error) {
        return res.status(500).json({ error: 'Error en la búsqueda avanzada' });
    }
}


module.exports = { 
    getAll, 
    getById, 
    create, 
    update, 
    remove, 
    searchAvanzado 
};