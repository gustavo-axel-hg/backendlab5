const pool = require('../db');

// Obtener todos los registros del estacionamiento
exports.getAllParkingCars = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM carros_estacionamiento ORDER BY hora_entrada DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los registros del estacionamiento:', error);
        res.status(500).json({ error: 'Error al obtener los registros del estacionamiento' });
    }
};

// Obtener un registro por ID
exports.getParkingCarById = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM carros_estacionamiento WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error al obtener el registro' });
    }
};

// Crear un nuevo registro de entrada
exports.createParkingCar = async (req, res) => {
    const {
        placa,
        propietario,
        marca,
        modelo,
        color,
        espacio,
        hora_entrada,
        observaciones
    } = req.body;

    if (!placa || !propietario) {
        return res.status(400).json({ error: 'La placa y el propietario son obligatorios' });
    }

    const placaNormalizada = String(placa).trim().toUpperCase();

    try {
        // Evitar doble ingreso del mismo vehiculo si aun sigue estacionado.
        const activeResult = await pool.query(
            'SELECT id FROM carros_estacionamiento WHERE placa = $1 AND estado = $2',
            [placaNormalizada, 'estacionado']
        );

        if (activeResult.rows.length > 0) {
            return res.status(409).json({ error: 'Ese vehiculo ya tiene una entrada activa' });
        }

        const result = await pool.query(
            'INSERT INTO carros_estacionamiento (placa, propietario, marca, modelo, color, espacio, hora_entrada, observaciones, estado) VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, NOW()), $8, $9) RETURNING *',
            [placaNormalizada, propietario, marca, modelo, color, espacio, hora_entrada, observaciones, 'estacionado']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear el registro de estacionamiento:', error);
        res.status(500).json({ error: 'Error al crear el registro de estacionamiento' });
    }
};

// Actualizar un registro
exports.updateParkingCar = async (req, res) => {
    const {
        placa,
        propietario,
        marca,
        modelo,
        color,
        espacio,
        observaciones,
        estado
    } = req.body;
    const parkingId = req.params.id;

    if (!placa || !propietario) {
        return res.status(400).json({ error: 'La placa y el propietario son obligatorios' });
    }

    const placaNormalizada = String(placa).trim().toUpperCase();

    try {
        const checkResult = await pool.query('SELECT * FROM carros_estacionamiento WHERE id = $1', [parkingId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        const updateResult = await pool.query(
            'UPDATE carros_estacionamiento SET placa = $1, propietario = $2, marca = $3, modelo = $4, color = $5, espacio = $6, observaciones = $7, estado = $8 WHERE id = $9 RETURNING *',
            [placaNormalizada, propietario, marca, modelo, color, espacio, observaciones, estado || 'estacionado', parkingId]
        );

        res.json(updateResult.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el registro:', error);
        res.status(500).json({ error: 'Error al actualizar el registro' });
    }
};

// Registrar salida del estacionamiento
exports.checkOutParkingCar = async (req, res) => {
    const parkingId = req.params.id;

    try {
        const checkResult = await pool.query('SELECT * FROM carros_estacionamiento WHERE id = $1', [parkingId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        if (checkResult.rows[0].estado === 'retirado') {
            return res.status(400).json({ error: 'El vehiculo ya fue retirado' });
        }

        const updateResult = await pool.query(
            'UPDATE carros_estacionamiento SET estado = $1, hora_salida = NOW() WHERE id = $2 RETURNING *',
            ['retirado', parkingId]
        );

        res.json(updateResult.rows[0]);
    } catch (error) {
        console.error('Error al registrar salida:', error);
        res.status(500).json({ error: 'Error al registrar salida' });
    }
};

// Eliminar un registro
exports.deleteParkingCar = async (req, res) => {
    const parkingId = req.params.id;

    try {
        const checkResult = await pool.query('SELECT * FROM carros_estacionamiento WHERE id = $1', [parkingId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        await pool.query('DELETE FROM carros_estacionamiento WHERE id = $1', [parkingId]);
        res.json({ message: 'Registro eliminado con exito' });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({ error: 'Error al eliminar el registro' });
    }
};
