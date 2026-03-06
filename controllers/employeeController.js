const pool = require('../db');

// Obtener todos los empleados
exports.getAllEmployees = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM empleados ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los empleados:', error);
        res.status(500).json({ error: 'Error al obtener los empleados' });
    }
};

// Obtener un empleado por ID
exports.getEmployeeById = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM empleados WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
        res.status(500).json({ error: 'Error al obtener el empleado' });
    }
};

// Crear un nuevo empleado
exports.createEmployee = async (req, res) => {
    const { nombre, apellido, edad, puesto, salario, fecha_contratacion, tipo_coche } = req.body;

    // Validacion basica
    if (!nombre || !apellido || !puesto) {
        return res.status(400).json({ error: 'Nombre, apellido y puesto son obligatorios' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO empleados (nombre, apellido, edad, puesto, salario, fecha_contratacion, tipo_coche) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nombre, apellido, edad, puesto, salario, fecha_contratacion, tipo_coche]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear el empleado:', error);
        res.status(500).json({ error: 'Error al crear el empleado' });
    }
};

// Actualizar un empleado existente
exports.updateEmployee = async (req, res) => {
    const { nombre, apellido, edad, puesto, salario, fecha_contratacion, tipo_coche } = req.body;
    const employeeId = req.params.id;

    // Validacion basica
    if (!nombre || !apellido || !puesto) {
        return res.status(400).json({ error: 'Nombre, apellido y puesto son obligatorios' });
    }

    try {
        // Verificar si el empleado existe
        const checkResult = await pool.query('SELECT * FROM empleados WHERE id = $1', [employeeId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        // Actualizar el empleado
        const updateResult = await pool.query(
            'UPDATE empleados SET nombre = $1, apellido = $2, edad = $3, puesto = $4, salario = $5, fecha_contratacion = $6, tipo_coche = $7 WHERE id = $8 RETURNING *',
            [nombre, apellido, edad, puesto, salario, fecha_contratacion, tipo_coche, employeeId]
        );
        res.json(updateResult.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el empleado:', error);
        res.status(500).json({ error: 'Error al actualizar el empleado' });
    }
};

// Eliminar un empleado
exports.deleteEmployee = async (req, res) => {
    const employeeId = req.params.id;
    try {
        // Verificar si el empleado existe
        const checkResult = await pool.query('SELECT * FROM empleados WHERE id = $1', [employeeId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        // Eliminar el empleado
        await pool.query('DELETE FROM empleados WHERE id = $1', [employeeId]);
        res.json({ message: 'Empleado eliminado con exito' });
    } catch (error) {
        console.error('Error al eliminar el empleado:', error);
        res.status(500).json({ error: 'Error al eliminar el empleado' });
    }
};