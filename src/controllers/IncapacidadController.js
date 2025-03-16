const db = require("../../models/index")

const createIncapacidad = async (req, res) => {
    try {
        const { id_empleado, tipo_incapacidad, fecha_inicio, fecha_fin, motivo, archivo_adjunto } = req.body;
        
        // Validate employee exists
        const empleado = await db.empleados.findByPk(id_empleado);
        if (!empleado) {
            return res.status(404).json({ error: 'El empleado no existe' });
        }

        const incapacidad = await db.incapacidades.create({
            id_empleado,
            tipo_incapacidad,
            fecha_inicio,
            fecha_fin,
            motivo,
            archivo_adjunto
        });

        res.status(201).json({
            message: "Incapacidad registrada con éxito",
            incapacidad
        });
        
    } catch (error) {
        console.log("Error al registrar la incapacidad:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getIncapacidades = async (req, res) => {
    try {
        const incapacidades = await db.incapacidades.findAll({
            include: { model: db.empleados, as: "empleado" }
        });
        
        res.status(200).json(incapacidades);
    } catch (error) {
        console.log("Error al obtener las incapacidades:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getIncapacidadById = async (req, res) => {
    try {
        const id = req.params.id;
        const incapacidad = await db.incapacidades.findByPk(id, {
            include: { model: db.empleados, as: "empleado" }
        });

        if (!incapacidad) {
            return res.status(404).json({ error: 'La incapacidad no existe' });
        }

        res.status(200).json(incapacidad);
    } catch (error) {
        console.log("Error al obtener la incapacidad:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getIncapacidadesByEmpleado = async (req, res) => {
    try {
        const id_empleado = req.params.id;
        
        // Validate employee exists
        const empleado = await db.empleados.findByPk(id_empleado);
        if (!empleado) {
            return res.status(404).json({ error: 'El empleado no existe' });
        }

        const incapacidades = await db.incapacidades.findAll({
            where: { id_empleado }
        });

        res.status(200).json(incapacidades);
    } catch (error) {
        console.log("Error al obtener las incapacidades del empleado:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const updateIncapacidad = async (req, res) => {
    try {
        const id = req.params.id;
        const incapacidad = await db.incapacidades.findByPk(id);

        if (!incapacidad) {
            return res.status(404).json({ error: 'La incapacidad no existe' });
        }

        await incapacidad.update(req.body);
        
        res.status(200).json({
            message: "Incapacidad actualizada con éxito",
            incapacidad
        });
    } catch (error) {
        console.log("Error al actualizar la incapacidad:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = {
    createIncapacidad,
    getIncapacidades,
    getIncapacidadById,
    getIncapacidadesByEmpleado,
    updateIncapacidad
};