// Base de datos simulada en memoria (Array)
let listaProductos = [
    //  'activo: true' a los datos iniciales
    { id: 1, nombre: "Leche Entera", categoria: "Lácteos", stock: 2, stockMinimo: 1, activo: true },
    { id: 2, nombre: "Arroz", categoria: "Granos", stock: 0, stockMinimo: 2, activo: true }
];

// Generador simple de IDs
const generarId = () => {
    const maxId = listaProductos.length > 0 ? Math.max(...listaProductos.map(p => p.id)) : 0;
    return maxId + 1;
};

// 1. OBTENER TODOS (GET)
// REGLA : Mostrar solo productos activos
export const obtenerProductos = (req, res) => {
    // Filtramos solo los que están activos
    const activos = listaProductos.filter(p => p.activo === true);
    
    res.status(200).json({
        mensaje: "Inventario recuperado exitosamente",
        total: activos.length,
        datos: activos
    });
};

// 2. OBTENER POR ID (GET)
export const obtenerProductoPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const producto = listaProductos.find(p => p.id === id);

    // REGLA: Si no existe o está inactivo, retornamos 404
    if (!producto || !producto.activo) {
        return res.status(404).json({ 
            error: "No encontrado",
            mensaje: `El producto con ID ${id} no existe o está inactivo.`
        });
    }

    res.status(200).json({ 
        mensaje: "Producto encontrado", 
        datos: producto 
    });
};

// 3. CREAR PRODUCTO (POST)
// REGLA : 'activo' inicia siempre en true (automático)
export const crearProducto = (req, res) => {
    const cuerpo = req.body;

    if (!cuerpo || Object.keys(cuerpo).length === 0) {
        return res.status(400).json({ error: "Bad Request", mensaje: "Cuerpo vacío" });
    }

    const { nombre, categoria, stock, stockMinimo } = cuerpo;

    // Validaciones
    if (!nombre || !categoria) {
        return res.status(400).json({ error: "Bad Request", mensaje: "Faltan nombre o categoria" });
    }
    
    // REGLA : Validar que stock sea >= 0
    if (stock < 0) {
        return res.status(400).json({ error: "Bad Request", mensaje: "El stock no puede ser negativo" });
    }

    const nuevoProducto = {
        id: generarId(),
        nombre,
        categoria,
        stock: stock || 0,
        stockMinimo: stockMinimo || 1,
        activo: true 
    };

    listaProductos.push(nuevoProducto);

    res.status(201).json({
        mensaje: "Producto creado exitosamente",
        datos: nuevoProducto
    });
};

// 4. ACTUALIZAR PRODUCTO (PUT)
export const actualizarProducto = (req, res) => {
    const id = parseInt(req.params.id);
    const cuerpo = req.body;
    const indice = listaProductos.findIndex(p => p.id === id);

    // REGLA : Validaciones específicas
    if (indice === -1) {
        return res.status(404).json({ error: "Not Found", mensaje: "Producto no encontrado" });
    }

    // Si está inactivo, devolver 403 (Prohibido) o 400
    if (listaProductos[indice].activo === false) {
        return res.status(403).json({ error: "Forbidden", mensaje: "No se puede editar un producto inactivo" });
    }

    if (!cuerpo || Object.keys(cuerpo).length === 0) {
        return res.status(400).json({ error: "Bad Request", mensaje: "Sin datos para actualizar" });
    }

    const { nombre, categoria, stock, stockMinimo } = cuerpo;

    // Validación de stock negativo en actualización
    if (stock !== undefined && stock < 0) {
        return res.status(400).json({ error: "Bad Request", mensaje: "El stock no puede ser negativo" });
    }

    listaProductos[indice] = {
        ...listaProductos[indice],
        nombre: nombre || listaProductos[indice].nombre,
        categoria: categoria || listaProductos[indice].categoria,
        stock: stock !== undefined ? stock : listaProductos[indice].stock,
        stockMinimo: stockMinimo !== undefined ? stockMinimo : listaProductos[indice].stockMinimo
    };

    res.status(200).json({
        mensaje: "Producto actualizado",
        datos: listaProductos[indice]
    });
};

// 5. ELIMINAR PRODUCTO (DELETE) - LOGICA "SOFT DELETE"
// REGLA: NO borrar del arreglo, solo cambiar activo = false
export const eliminarProducto = (req, res) => {
    const id = parseInt(req.params.id);
    const indice = listaProductos.findIndex(p => p.id === id);

    // Si no existe el ID
    if (indice === -1) {
        return res.status(404).json({ error: "Not Found", mensaje: "Producto no encontrado" });
    }

    // REGLA: Si ya está inactivo, devolver error 400
    if (listaProductos[indice].activo === false) {
        return res.status(400).json({ error: "Bad Request", mensaje: "El producto ya estaba inactivo" });
    }

    //   Borrado Lógico (Soft Delete)
    listaProductos[indice].activo = false;

    // REGLA : Devolver 204 (No Content) o 200 con mensaje. 
    res.status(200).json({
        mensaje: "Producto desactivado correctamente (Soft Delete)",
        idDesactivado: id
    });
};
