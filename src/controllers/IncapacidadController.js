const db = require("../../models/index");

const createIncapacidad = async (req, res) => {
  try {
    const {
      id_empleado,
      fecha_inicio,
      fecha_fin,
      motivo,
      archivo_adjunto,
      estado = "pendiente",
    } = req.body;

    const empleado = await db.empleados.findByPk(id_empleado);
    if (!empleado) {
      return res.status(404).json({ error: "El empleado no existe" });
    }

    const incapacidad = await db.incapacidades.create({
      id_empleado,
      fecha_inicio,
      fecha_fin,
      motivo,
      archivo_adjunto,
      estado: estado.toLowerCase(),
    });

    res.status(201).json({
      message: "Incapacidad registrada con éxito",
      incapacidad,
    });
  } catch (error) {
    console.log("Error al registrar la incapacidad:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const getIncapacidades = async (req, res) => {
  try {
    const incapacidades = await db.incapacidades.findAll({
      include: { model: db.empleados, as: "empleado" },
    });

    // Normalizar estado a minúsculas para consistencia
    const incapacidadesNormalizadas = incapacidades.map((incapacidad) => {
      const incapacidadJSON = incapacidad.toJSON();

      delete incapacidadJSON.aprobado;

      return incapacidadJSON;
    });

    res.status(200).json(incapacidadesNormalizadas);
  } catch (error) {
    console.log("Error al obtener las incapacidades:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const getIncapacidadById = async (req, res) => {
  try {
    const id = req.params.id;
    const incapacidad = await db.incapacidades.findByPk(id, {
      include: { model: db.empleados, as: "empleado" },
    });

    if (!incapacidad) {
      return res.status(404).json({ error: "La incapacidad no existe" });
    }

    const incapacidadJSON = incapacidad.toJSON();

    delete incapacidadJSON.aprobado;

    res.status(200).json(incapacidadJSON);
  } catch (error) {
    console.log("Error al obtener la incapacidad:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const getIncapacidadesByEmpleado = async (req, res) => {
  try {
    const id_empleado = req.params.id;

    const empleado = await db.empleados.findByPk(id_empleado);
    if (!empleado) {
      return res.status(404).json({ error: "El empleado no existe" });
    }

    const incapacidades = await db.incapacidades.findAll({
      where: { id_empleado },
      include: { model: db.empleados, as: "empleado" },
    });

    const incapacidadesNormalizadas = incapacidades.map((incapacidad) => {
      const incapacidadJSON = incapacidad.toJSON();

      delete incapacidadJSON.aprobado;

      return incapacidadJSON;
    });

    res.status(200).json(incapacidadesNormalizadas);
  } catch (error) {
    console.log("Error al obtener las incapacidades del empleado:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const updateIncapacidad = async (req, res) => {
  try {
    const id = req.params.id;
    const incapacidad = await db.incapacidades.findByPk(id);

    if (!incapacidad) {
      return res.status(404).json({ error: "La incapacidad no existe" });
    }

    const updateData = { ...req.body };
    if (updateData.estado) {
      updateData.estado = updateData.estado.toLowerCase();
    }

    await incapacidad.update(updateData);

    const incapacidadActualizada = incapacidad.toJSON();

    res.status(200).json({
      message: "Incapacidad actualizada con éxito",
      incapacidad: incapacidadActualizada,
    });
  } catch (error) {
    console.log("Error al actualizar la incapacidad:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Nuevas funciones para aprobar y rechazar incapacidades directamente
const aprobarIncapacidad = async (req, res) => {
  try {
    const id = req.params.id;
    const incapacidad = await db.incapacidades.findByPk(id);

    if (!incapacidad) {
      return res.status(404).json({ error: "La incapacidad no existe" });
    }

    // Guardar en minúsculas para consistencia
    await incapacidad.update({
      estado: "aprobado",
      comentario_revision: req.body.comentario_revision || "Solicitud aprobada",
    });

    res.status(200).json({
      message: "Incapacidad aprobada con éxito",
      incapacidad: {
        ...incapacidad.toJSON(),
        estado: "aprobado",
      },
    });
  } catch (error) {
    console.log("Error al aprobar la incapacidad:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const rechazarIncapacidad = async (req, res) => {
  try {
    const id = req.params.id;
    const incapacidad = await db.incapacidades.findByPk(id);

    if (!incapacidad) {
      return res.status(404).json({ error: "La incapacidad no existe" });
    }

    await incapacidad.update({
      estado: "rechazado",
      comentario_revision:
        req.body.comentario_revision || "Solicitud rechazada",
    });

    res.status(200).json({
      message: "Incapacidad rechazada",
      incapacidad: {
        ...incapacidad.toJSON(),
        estado: "rechazado",
      },
    });
  } catch (error) {
    console.log("Error al rechazar la incapacidad:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  createIncapacidad,
  getIncapacidades,
  getIncapacidadById,
  getIncapacidadesByEmpleado,
  updateIncapacidad,
  aprobarIncapacidad,
  rechazarIncapacidad,
};
