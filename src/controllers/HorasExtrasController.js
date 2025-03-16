const db = require("../../models/index")

const createHoraExtra = async (req, res) => {
    try {
        const { id_empleado, fecha, horas, motivo } = req.body;
        
        // Validate employee exists
        const empleado = await db.empleados.findByPk(id_empleado);
        if (!empleado) {
            return res.status(404).json({ error: 'El empleado no existe' });
        }

        const horaExtra = await db.horasextras.create({
            id_empleado,
            fecha,
            horas,
            motivo,
            aprobado: false
        });

        res.status(201).json({
            message: "Solicitud de horas extras registrada con éxito",
            horaExtra
        });
        
    } catch (error) {
        console.log("Error al registrar las horas extras:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getHorasExtras = async (req, res) => {
    try {
        const horasExtras = await db.horasextras.findAll({
            include: { model: db.empleados, as: "empleado" }
        });
        
        res.status(200).json(horasExtras);
    } catch (error) {
        console.log("Error al obtener las horas extras:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getHoraExtraById = async (req, res) => {
    try {
        const id = req.params.id;
        const horaExtra = await db.horasextras.findByPk(id, {
            include: { model: db.empleados, as: "empleado" }
        });

        if (!horaExtra) {
            return res.status(404).json({ error: 'El registro de hora extra no existe' });
        }

        res.status(200).json(horaExtra);
    } catch (error) {
        console.log("Error al obtener la hora extra:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getHorasExtrasByEmpleado = async (req, res) => {
    try {
        const id_empleado = req.params.id;
        
        // Validate employee exists
        const empleado = await db.empleados.findByPk(id_empleado);
        if (!empleado) {
            return res.status(404).json({ error: 'El empleado no existe' });
        }

        const horasExtras = await db.horasextras.findAll({
            where: { id_empleado }
        });

        res.status(200).json(horasExtras);
    } catch (error) {
        console.log("Error al obtener las horas extras del empleado:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const updateHoraExtra = async (req, res) => {
    try {
        const id = req.params.id;
        const horaExtra = await db.horasextras.findByPk(id);

        if (!horaExtra) {
            return res.status(404).json({ error: 'El registro de hora extra no existe' });
        }

        await horaExtra.update(req.body);
        
        res.status(200).json({
            message: "Horas extras actualizadas con éxito",
            horaExtra
        });
    } catch (error) {
        console.log("Error al actualizar las horas extras:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const aprobarHoraExtra = async (req, res) => {
    try {
        const id = req.params.id;
        const horaExtra = await db.horasextras.findByPk(id);

        if (!horaExtra) {
            return res.status(404).json({ error: 'El registro de hora extra no existe' });
        }

        await horaExtra.update({ aprobado: true });
        
        res.status(200).json({
            message: "Horas extras aprobadas con éxito",
            horaExtra
        });
    } catch (error) {
        console.log("Error al aprobar las horas extras:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const rechazarHoraExtra = async (req, res) => {
    try {
        const id = req.params.id;
        const horaExtra = await db.horasextras.findByPk(id);

        if (!horaExtra) {
            return res.status(404).json({ error: 'El registro de hora extra no existe' });
        }

        await horaExtra.update({ aprobado: false });
        
        res.status(200).json({
            message: "Horas extras rechazadas",
            horaExtra
        });
    } catch (error) {
        console.log("Error al rechazar las horas extras:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = {
    createHoraExtra,
    getHorasExtras,
    getHoraExtraById,
    getHorasExtrasByEmpleado,
    updateHoraExtra,
    aprobarHoraExtra,
    rechazarHoraExtra
};