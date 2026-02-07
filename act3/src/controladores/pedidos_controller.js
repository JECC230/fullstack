import { PedidosRepository } from '../repositories/pedidos_repository.js';

// Instanciamos el repositorio
const repositorio = new PedidosRepository();

export const obtenerPedidos = (req, res) => {
    const pedidos = repositorio.findAll();
    res.status(200).json(pedidos);
};

export const obtenerPedidoPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const pedido = repositorio.findById(id);

    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.status(200).json(pedido);
};

export const crearPedido = (req, res) => {
    const { producto, cantidad } = req.body;

    // Regla 1: Validación de datos
    if (!producto || !cantidad) {
        return res.status(400).json({ message: "Faltan datos: producto y cantidad son obligatorios" });
    }

    // Regla 1: Cantidad mayor a 0
    if (cantidad <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });
    }

    const nuevo = repositorio.create(producto, cantidad);
    res.status(201).json({ message: "Pedido creado", data: nuevo });
};

export const actualizarPedido = (req, res) => {
    const id = parseInt(req.params.id);
    const { estado } = req.body; 
    
    // 1. Buscamos el pedido
    const pedidoActual = repositorio.findById(id);

    if (!pedidoActual) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Regla 2: Un pedido "confirmado" o "cancelado" NO puede modificarse
    if (pedidoActual.estado !== 'pendiente') {
        return res.status(400).json({ 
            message: `No se puede modificar un pedido en estado '${pedidoActual.estado}'` 
        });
    }

    // Regla 2: Validar estados permitidos
    const estadosPermitidos = ['confirmado', 'cancelado', 'pendiente'];
    if (estado && !estadosPermitidos.includes(estado)) {
        return res.status(400).json({ message: "Estado inválido. Solo se permite: confirmado o cancelado" });
    }

    // Si pasa las reglas, llamamos al repositorio
    const actualizado = repositorio.update(id, req.body);
    res.status(200).json({ message: "Pedido actualizado", data: actualizado });
};

export const eliminarPedido = (req, res) => {
    const id = parseInt(req.params.id);
    const pedidoActual = repositorio.findById(id);

    if (!pedidoActual) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Regla 3: Solo se eliminan pedidos "pendiente"
    if (pedidoActual.estado !== 'pendiente') {
        return res.status(400).json({ 
            message: "Solo se pueden eliminar pedidos en estado 'pendiente'" 
        });
    }

    const fueEliminado = repositorio.delete(id);
    res.status(200).json({ message: "Pedido eliminado correctamente" });
};