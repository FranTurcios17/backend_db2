const db = require("../../models/index")

const createPermiso = async (req, res) => {
    try {
        const { id_empleado, tipo_permiso, fecha_inicio, fecha_fin, motivo } = req.body;
        
        // Validate employee exists
        const empleado = await db.empleados.findByPk(id_empleado);
        if (!empleado) {
            return res.status(404).json({ error: 'El empleado no existe' });
        }

        const permiso = await db.permisos.create({
            id_empleado,
            tipo_permiso,
            fecha_inicio,
            fecha_fin,
            motivo,
            aprobado: false
        });

        res.status(201).json({
            message: "Solicitud de permiso registrada con éxito",
            permiso
        });
        
    } catch (error) {
        console.log("Error al registrar el permiso:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getPermisos = async (req, res) => {
    try {
        const permisos = await db.permisos.findAll({
            include: { model: db.empleados, as: "empleado" }
        });
        
        res.status(200).json(permisos);
    } catch (error) {
        console.log("Error al obtener los permisos:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getPermisoById = async (req, res) => {
    try {
        const id = req.params.id;
        const permiso = await db.permisos.findByPk(id, {
            include: { model: db.empleados, as: "empleado" }
        });

        if (!permiso) {
            return res.status(404).json({ error: 'El permiso no existe' });
        }

        res.status(200).json(permiso);
    } catch (error) {
        console.log("Error al obtener el permiso:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getPermisosByEmpleado = async (req, res) => {
    try {
        const id_empleado = req.params.id;
        
        // Validate employee exists
        const empleado = await db.empleados.findByPk(id_empleado);
        if (!empleado) {
            return res.status(404).json({ error: 'El empleado no existe' });
        }

        const permisos = await db.permisos.findAll({
            where: { id_empleado }
        });

        res.status(200).json(permisos);
    } catch (error) {
        console.log("Error al obtener los permisos del empleado:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const updatePermiso = async (req, res) => {
    try {
        const id = req.params.id;
        const permiso = await db.permisos.findByPk(id);

        if (!permiso) {
            return res.status(404).json({ error: 'El permiso no existe' });
        }

        await permiso.update(req.body);
        
        res.status(200).json({
            message: "Permiso actualizado con éxito",
            permiso
        });
    } catch (error) {
        console.log("Error al actualizar el permiso:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const aprobarPermiso = async (req, res) => {
    try {
        const id = req.params.id;
        const permiso = await db.permisos.findByPk(id);

        if (!permiso) {
            return res.status(404).json({ error: 'El permiso no existe' });
        }

        await permiso.update({ aprobado: true });
        
        res.status(200).json({
            message: "Permiso aprobado con éxito",
            permiso
        });
    } catch (error) {
        console.log("Error al aprobar el permiso:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const rechazarPermiso = async (req, res) => {
    try {
        const id = req.params.id;
        const permiso = await db.permisos.findByPk(id);

        if (!permiso) {
            return res.status(404).json({ error: 'El permiso no existe' });
        }

        await permiso.update({ aprobado: false });
        
        res.status(200).json({
            message: "Permiso rechazado",
            permiso
        });
    } catch (error) {
        console.log("Error al rechazar el permiso:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = {
    createPermiso,
    getPermisos,
    getPermisoById,
    getPermisosByEmpleado,
    updatePermiso,
    aprobarPermiso,
    rechazarPermiso
};