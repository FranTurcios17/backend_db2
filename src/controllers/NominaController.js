const db = require("../../models/index");

const createNomina = async (req, res) => {
    try {
        const { 
            id_empleado, 
            periodo, 
            bonificaciones, 
            horas_extra, 
            salario_bruto, 
            salario_neto, 
            deduccion_rap, 
            deduccion_ihss 
        } = req.body;
        
        // Validate employee exists
        const empleado = await db.empleados.findByPk(id_empleado);
        if (!empleado) {
            return res.status(404).json({ error: 'El empleado no existe' });
        }

        const nomina = await db.nominas.create({
            id_empleado,
            periodo,
            bonificaciones,
            horas_extra,
            salario_bruto,
            salario_neto,
            deduccion_rap,
            deduccion_ihss,
            fecha_generacion: new Date()
        });

        res.status(201).json({
            message: "Nómina generada con éxito",
            nomina
        });
        
    } catch (error) {
        console.log("Error al generar la nómina:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getNominas = async (req, res) => {
    try {
        const nominas = await db.nominas.findAll({
            include: { model: db.empleados, as: "empleado" }
        });
        
        res.status(200).json(nominas);
    } catch (error) {
        console.log("Error al obtener las nóminas:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getNominaById = async (req, res) => {
    try {
        const id = req.params.id;
        const nomina = await db.nominas.findByPk(id, {
            include: { model: db.empleados, as: "empleado" }
        });

        if (!nomina) {
            return res.status(404).json({ error: 'La nómina no existe' });
        }

        res.status(200).json(nomina);
    } catch (error) {
        console.log("Error al obtener la nómina:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getNominasByEmpleado = async (req, res) => {
    try {
        const id_empleado = req.params.id;
        
        // Validate employee exists
        const empleado = await db.empleados.findByPk(id_empleado);
        if (!empleado) {
            return res.status(404).json({ error: 'El empleado no existe' });
        }

        const nominas = await db.nominas.findAll({
            where: { id_empleado }
        });

        res.status(200).json(nominas);
    } catch (error) {
        console.log("Error al obtener las nóminas del empleado:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getNominasByPeriodo = async (req, res) => {
    try {
        const periodo = req.params.periodo;
        
        const nominas = await db.nominas.findAll({
            where: { periodo },
            include: { model: db.empleados, as: "empleado" }
        });

        res.status(200).json(nominas);
    } catch (error) {
        console.log("Error al obtener las nóminas del periodo:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const updateNomina = async (req, res) => {
    try {
        const id = req.params.id;
        const nomina = await db.nominas.findByPk(id);

        if (!nomina) {
            return res.status(404).json({ error: 'La nómina no existe' });
        }

        await nomina.update(req.body);
        
        res.status(200).json({
            message: "Nómina actualizada con éxito",
            nomina
        });
    } catch (error) {
        console.log("Error al actualizar la nómina:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = {
    createNomina,
    getNominas,
    getNominaById,
    getNominasByEmpleado,
    getNominasByPeriodo,
    updateNomina
};