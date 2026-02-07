export class PedidosRepository {
    // Propiedades privadas
    #pedidos;
    #nextId;

    constructor() {
        this.#pedidos = [];
        this.#nextId = 1;
    }

    // Obtener todos, retorna una copia para seguridad
    findAll() {
        return [...this.#pedidos];
    }

    // Buscar por ID
    findById(id) {
        return this.#pedidos.find(p => p.id === id);
    }

    // Crear Guardar en memoria
    create(producto, cantidad) {
        const nuevoPedido = {
            id: this.#nextId++,
            producto,
            cantidad,
            estado: "pendiente" // Regla 1: Siempre inicia en pendiente
        };
        this.#pedidos.push(nuevoPedido);
        return nuevoPedido;
    }

    // Actualizar (Solo reemplaza datos, la validación viene de fuera)
    update(id, nuevosDatos) {
        const index = this.#pedidos.findIndex(p => p.id === id);
        if (index === -1) return null;

        // Fusionamos los datos actuales con los nuevos
        this.#pedidos[index] = { ...this.#pedidos[index], ...nuevosDatos };
        return this.#pedidos[index];
    }

    // Eliminar
    delete(id) {
        const index = this.#pedidos.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.#pedidos.splice(index, 1);
        return true;
    }
}