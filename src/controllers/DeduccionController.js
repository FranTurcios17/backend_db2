const db = require('../../models');

// Obtener todas las deducciones
const getDeducciones = async (req, res) => {
  try {
    const deducciones = await db.deducciones.findAll();
    res.status(200).json(deducciones);
  } catch (error) {
    console.log("Error al obtener deducciones:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Crear una nueva deducción
const createDeduccion = async (req, res) => {
  try {
    const { nombre, descripcion, porcentaje } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    
    const nuevaDeduccion = await db.deducciones.create({
      nombre,
      descripcion,
      porcentaje
    });
    
    res.status(201).json({
      message: 'Deducción creada exitosamente',
      deduccion: nuevaDeduccion
    });
  } catch (error) {
    console.log("Error al crear deducción:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener las deducciones de un empleado
const getDeduccionesEmpleado = async (req, res) => {
  try {
    const id_empleado = req.params.id;
    
    const empleadoDeducciones = await db.empleado_deducciones.findAll({
      where: { 
        id_empleado, 
        activo: true 
      },
      include: [{ 
        model: db.deducciones, 
        as: "deduccion" 
      }]
    });
    
    res.status(200).json(empleadoDeducciones);
  } catch (error) {
    console.log("Error al obtener deducciones del empleado:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Asignar deducción a empleado
const asignarDeduccion = async (req, res) => {
  try {
    const { id_empleado, id_deduccion } = req.body;
    
    if (!id_empleado || !id_deduccion) {
      return res.status(400).json({ 
        error: 'Se requieren id_empleado e id_deduccion' 
      });
    }
    
    // Verificar si ya existe esta asignación
    const deduccionExistente = await db.empleado_deducciones.findOne({
      where: { id_empleado, id_deduccion }
    });
    
    if (deduccionExistente) {
      if (deduccionExistente.activo) {
        return res.status(400).json({ 
          error: 'Esta deducción ya está asignada al empleado' 
        });
      } else {
        // Si existe pero está inactiva, la reactivamos
        await deduccionExistente.update({ activo: true });
        return res.status(200).json({
          message: 'Deducción reactivada para el empleado',
          empleadoDeduccion: deduccionExistente
        });
      }
    }
    
    // Crear nueva asignación
    const nuevaAsignacion = await db.empleado_deducciones.create({
      id_empleado,
      id_deduccion,
      activo: true
    });
    
    res.status(201).json({
      message: 'Deducción asignada exitosamente',
      empleadoDeduccion: nuevaAsignacion
    });
  } catch (error) {
    console.log("Error al asignar deducción:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Desactivar deducción de empleado
const desactivarDeduccion = async (req, res) => {
  try {
    const id = req.params.id;
    
    const empleadoDeduccion = await db.empleado_deducciones.findByPk(id);
    
    if (!empleadoDeduccion) {
      return res.status(404).json({ error: 'Relación no encontrada' });
    }
    
    await empleadoDeduccion.update({ activo: false });
    
    res.status(200).json({
      message: 'Deducción desactivada exitosamente',
      empleadoDeduccion
    });
  } catch (error) {
    console.log("Error al desactivar deducción:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  getDeducciones,
  createDeduccion,
  getDeduccionesEmpleado,
  asignarDeduccion,
  desactivarDeduccion
};