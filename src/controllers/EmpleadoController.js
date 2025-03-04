const db = require("../../models/index")
//import empleados from "../../models/empleados";
//import { empleados } from "../../models/index";
//import { encryptPassword} from "../services/userServices";

const createEmpleado = async (req, res) =>{
    try {
        
        const trs = await db.sequelize.transaction()
        const {nombre, apellido, dni, sexo, telefono, telefono_emergencia, email, fecha_contratacion, rol} = req.body;
    
        const empleado = await db.empleados.create({nombre, apellido, dni, sexo, telefono, telefono_emergencia, email, fecha_contratacion,usuario, contrasena, rol}, {transaction: trs})

        if(!empleado){
            await trs.rollback()
            console.log("hubo un error al guardar la informacion del empleado")
            return res.status(404).json({error: 'hubo un error al guardar la informacion del empleado'});
        }

        const nombre_usuario = dni;
        const contrasena = process.env.DEFAULT_PASSWORD || 123456;
        const contrasena_hash = await encryptPassword(contrasena)
        
        const user = await db.usuarios.create({nombre_usuario, contrasena_hash, rol}, {transaction: trs})

        if(!user){
            await trs.rollback()
            console.log("hubo un error al guardar la informacion del usuario")
            return res.status(404).json({error: 'hubo un error al guardar la informacion del usuario'});
        }

        await trs.commit();
        res.status(200).json(empleado)

    } catch (error) {
        console.log("no se pudo registrar el empleado")   
        res.status(500).json({error: 'error en el servidor'}) 
    }
        

}

const getEmpleados = async (req, res) => {
   
    try {
        const empleados = await db.empleados.findAll();

        if(!empleados){
            console.log("no se pudieron obtener los empleados")
            return res.status(404).json({error: 'no se pudieron cargar los empleados'});
        }
        res.status(200).json(empleados)
    } catch (error) {
        console.log("error al encontrar los usuarios")
        res.status(500).json({error: 'error en el servidor'})
    }
    
}

const getEmpleadoById = async(req, res) =>{
    const id = req.params.id;

    try {
        const empleado = await db.empleados.findByPk(id);

        if(!empleado){
            console.log("no se pudo obtener el empleado")
            return res.status(404).json({error: 'el empleado no existe'});
        }
        res.status(200).json(empleados)
    } catch (error) {
        console.log("error al encontrar los usuarios get by id")
        res.status(500).json({error: 'error en el servidor'})
    }
}



module.exports = {createEmpleado, getEmpleados, getEmpleadoById};