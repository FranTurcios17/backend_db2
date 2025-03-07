const db = require("../../models/index")
//import empleados from "../../models/empleados";
//import { empleados } from "../../models/index";
const crypt = require("../services/userServices")

const createEmpleado = async (req, res) =>{
    const trs = await db.sequelize.transaction()
    try {
      
        const {nombre, apellido, dni, sexo, telefono, telefono_emergencia, email, fecha_contratacion, rol, id_horario
        } = req.body;

    
        const empleado = await db.empleados.create({nombre, apellido, DNI: dni, sexo, telefono, telefono_emergencia, email, fecha_contratacion, activo: true, id_horario}, {transaction: trs})

        if(!empleado){
            await trs.rollback()
            console.log("hubo un error al guardar la informacion del empleado")
            return res.status(404).json({error: 'hubo un error al guardar la informacion del empleado'});
        }

        const nombre_usuario = dni;
        
        const contrasena = process.env.DEFAULT_PASSWORD || 123456;
        const contraseña_hash = await crypt.encryptPassword(contrasena)
        
        const user = await db.usuarios.create({id_empleado: empleado.id_empleado, nombre_usuario, contraseña_hash, rol}, {transaction: trs})

        if(!user){
            await trs.rollback()
            console.log("hubo un error al guardar la informacion del usuario")
            return res.status(404).json({error: 'hubo un error al guardar la informacion del usuario'});
        }

        

        await trs.commit();
        res.status(200).json({
            message: "Empleado registrado con exito", 
            info_empleado: empleado 
        })

    } catch (error) {
        trs.rollback()
        console.log("no se pudo registrar el empleado", error)   
        res.status(500).json({error: 'error en el servidor'}) 
    }
        

}

const getEmpleados = async (req, res) => {
   
    try {
        const empleados = await db.empleados.findAll({ include: { model: db.horarios, as:  "horario"}});
        res.status(200).json(empleados);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener empleados', error });
    }
    
}

const getEmpleadoById = async(req, res) =>{
    const id = req.params.id;

    try {
        const empleado = await db.empleados.findByPk(id, {include: {model: db.horarios, as:  "id_horario_horario"}});

        if(!empleado){
            console.log("no se pudo obtener el empleado")
            return res.status(404).json({error: 'el empleado no existe'});
        }
        res.status(200).json(empleado)
    } catch (error) {
        console.log("error al encontrar los usuarios get by id")
        res.status(500).json({error: 'error en el servidor'})
    }
}


const updateEmpleados = async (req, res) =>{
    const id = req.params.id;

    try {

        console.log(id)
        
        const empleado = await db.empleados.findByPk(id);
        if (!empleado) {
            return res.status(404).json({ message: 'el empleado no existe' });
        }

        await empleado.update(req.body);
        res.json({ message: 'Empleado actualizado con éxito', empleado });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar empleado'});
    }
}


module.exports = {createEmpleado, getEmpleados, getEmpleadoById, updateEmpleados};