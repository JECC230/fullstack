const pool = require('../db');

class ProductosRepository {
    async getAll() {
        const result = await pool.query('SELECT * FROM productos ORDER BY id DESC');
        return result.rows;
    }

    async getById(id) {
        const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
        return result.rows[0];
    }

    async create(data) {
        const { nombre, precio, marca, categoria } = data;
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const result = await pool.query(
            `INSERT INTO productos (nombre, precio, marca, categoria, sku) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nombre, precio, marca || 'Genérico', categoria || 'Varios', 'SK' + randomNum]
        );
        return result.rows[0];
    }

    async update(id, data) {
        const { nombre, precio } = data;
        const result = await pool.query(
            'UPDATE productos SET nombre = COALESCE($1, nombre), precio = COALESCE($2, precio) WHERE id = $3 RETURNING *',
            [nombre ?? null, precio ?? null, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        return result.rowCount > 0;
    }

    async buscarAvanzado({ nombre, minPrecio, maxPrecio, limit, offset }) {
        let consulta = 'SELECT * FROM productos';
        let consultaConteo = 'SELECT COUNT(*) FROM productos';
        const filtros = [];
        const valores = [];
        let indice = 1;

        if (nombre) {
            filtros.push(`nombre ILIKE $${indice}`);
            valores.push(`%${nombre}%`);
            indice++;
        }
        if (minPrecio !== undefined) {
            filtros.push(`precio >= $${indice}`);
            valores.push(minPrecio);
            indice++;
        }
        if (maxPrecio !== undefined) {
            filtros.push(`precio <= $${indice}`);
            valores.push(maxPrecio);
            indice++;
        }

        if (filtros.length > 0) {
            const clausulaWhere = ' WHERE ' + filtros.join(' AND ');
            consulta += clausulaWhere;
            consultaConteo += clausulaWhere;
        }

        consulta += ` ORDER BY id DESC LIMIT $${indice} OFFSET $${indice + 1}`;
        
        const resDatos = await pool.query(consulta, [...valores, limit, offset]);
        const resConteo = await pool.query(consultaConteo, valores);

        return {
            productos: resDatos.rows,
            total: parseInt(resConteo.rows[0].count)
        };
    }
}

module.exports = { ProductosRepository };