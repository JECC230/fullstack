// Base de datos simulada en memoria (Array)
let listaProductos = [
    { id: 1, nombre: "Leche Entera", categoria: "Lácteos", stock: 2, stockMinimo: 1 },
    { id: 2, nombre: "Arroz", categoria: "Granos", stock: 0, stockMinimo: 2 }
];

// Generador simple de IDs
const generarId = () => {
    const maxId = listaProductos.length > 0 ? Math.max(...listaProductos.map(p => p.id)) : 0;
    return maxId + 1;
};

// 1. OBTENER TODOS (GET)
// Código 200: Todo salió bien
export const obtenerProductos = (req, res) => {
    res.status(200).json({
        mensaje: "Inventario recuperado exitosamente",
        total: listaProductos.length,
        datos: listaProductos
    });
};

// 2. OBTENER POR ID (GET)
export const obtenerProductoPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const producto = listaProductos.find(p => p.id === id);

    // ERROR 404: Si el producto no existe en el array
    if (!producto) {
        return res.status(404).json({ 
            error: "No encontrado",
            mensaje: `El producto con ID ${id} no existe en el inventario.`
        });
    }

    // ÉXITO 200
    res.status(200).json({ 
        mensaje: "Producto encontrado", 
        datos: producto 
    });
};

// 3. CREAR PRODUCTO (POST)
export const crearProducto = (req, res) => {
    const cuerpo = req.body;

    // ERROR 400: Validación si el cuerpo está vacío o es un objeto vacío {}
    if (!cuerpo || Object.keys(cuerpo).length === 0) {
        return res.status(400).json({ 
            error: "Solicitud incorrecta",
            mensaje: "El cuerpo de la petición no puede estar vacío." 
        });
    }

    const { nombre, categoria, stock, stockMinimo } = cuerpo;

    // ERROR 400: Validación de campos obligatorios
    if (!nombre || !categoria) {
        return res.status(400).json({ 
            error: "Datos incompletos",
            mensaje: "Debes enviar obligatoriamente 'nombre' y 'categoria'." 
        });
    }

    const nuevoProducto = {
        id: generarId(),
        nombre,
        categoria,
        stock: stock || 0,
        stockMinimo: stockMinimo || 1
    };

    listaProductos.push(nuevoProducto);

    // ÉXITO 201: 'Created' (Específico para cuando se crea algo nuevo)
    res.status(201).json({
        mensaje: "Producto creado exitosamente",
        datos: nuevoProducto
    });
};

// 4. ACTUALIZAR PRODUCTO (PUT)
export const actualizarProducto = (req, res) => {
    const id = parseInt(req.params.id);
    const cuerpo = req.body;

    // Buscamos el índice en el array
    const indice = listaProductos.findIndex(p => p.id === id);

    // ERROR 404: Si el ID no existe
    if (indice === -1) {
        return res.status(404).json({ 
            error: "No encontrado",
            mensaje: `No se puede actualizar. El producto con ID ${id} no existe.` 
        });
    }

    // ERROR 400: Si intentan actualizar pero no envían datos
    if (!cuerpo || Object.keys(cuerpo).length === 0) {
        return res.status(400).json({ 
            error: "Solicitud incorrecta",
            mensaje: "No enviaste datos para actualizar." 
        });
    }

    const { nombre, categoria, stock, stockMinimo } = cuerpo;

    // Actualizamos manteniendo los datos anteriores si no envían nuevos
    listaProductos[indice] = {
        ...listaProductos[indice],
        nombre: nombre || listaProductos[indice].nombre,
        categoria: categoria || listaProductos[indice].categoria,
        stock: stock !== undefined ? stock : listaProductos[indice].stock,
        stockMinimo: stockMinimo !== undefined ? stockMinimo : listaProductos[indice].stockMinimo
    };

    // ÉXITO 200
    res.status(200).json({
        mensaje: "Producto actualizado correctamente",
        datos: listaProductos[indice]
    });
};

// 5. ELIMINAR PRODUCTO (DELETE)
export const eliminarProducto = (req, res) => {
    const id = parseInt(req.params.id);
    
    // Verificamos si existe antes de intentar borrar
    const existe = listaProductos.some(p => p.id === id);

    // ERROR 404: Si no existe
    if (!existe) {
        return res.status(404).json({ 
            error: "No encontrado",
            mensaje: `No se puede eliminar. El producto con ID ${id} no existe.` 
        });
    }

    // Filtramos para borrar
    listaProductos = listaProductos.filter(p => p.id !== id);

    // ÉXITO 200
    res.status(200).json({
        mensaje: "Producto eliminado exitosamente",
        idEliminado: id
    });
};