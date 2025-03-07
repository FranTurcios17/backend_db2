//const { where } = require("sequelize");
const db = require("../../models/index")
//import empleados from "../../models/empleados";
//import { empleados } from "../../models/index";
//import { encryptPassword} from "../services/userServices";

const createEntrada = async (req, res) =>{
    const { dni, hora_entrada, fecha } = req.body;
    try {
        
        const empleado = await db.empleados.findOne({where: {DNI: dni}})

        if(!empleado){
            return res.status(404).json({message: "no encontrado"})
        }

        const asistencia = await db.asistencia.create({
            id_empleado: empleado.id_empleado,
            fecha,
            hora_entrada,
            hora_salida: null 
        });

        res.json({ message: 'Entrada registrada con éxito', asistencia });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar entrada', error });
    }
        

}

const createSalida = async (req, res) =>{
    const { dni, hora_salida, fecha } = req.body;
    try {
        const empleado = await db.empleados.findOne({where: {DNI: dni}})

        if(!empleado){
            return res.status(404).json({message: "no encontrado"})
        }

        const asistido = await db.asistencia.findOne({ where: { id_empleado: empleado.id_empleado, fecha } });

        if (!asistido){
            return res.status(404).json({ message: 'No se encontró registro de entrada' });
        }

        //asistencia.hora_salida = hora_salida;
        await asistido.update({hora_salida});

        res.json({ message: 'Salida registrada con éxito', asistido });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al registrar salida', error });
    }   
        

}

const getAsistencias = async (req, res) => {
   
    try {
        const asistencias = await db.asistencia.findAll({include: {model: db.empleados, as: "empleado"}});
        res.status(200).json(asistencias);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener el registro de asistencia', error });
    }
    
}

const getAsistenciaPorEmpleado = async (req, res) =>{
    try {
        const id = req.params.id;
        const asistencias = await db.asistencia.findAll({where: {id_empleado: id}});
        res.status(200).json(asistencias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el registro de asistencia', error });
    }
}

const updateAsistencia = async (res, req) =>{
    try {

        const id = req.params.id;
        
        const asistencia = await db.asistencia.findByPk(id);
        if (!asistencia) {
            return res.status(404).json({ message: 'no existe el registro' });
        }

        await asistencia.update(req.body);
        res.status(200).json({ message: 'registro actualizado con éxito', asistencia });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el registro'});
    }
}


module.exports = {createEntrada, createSalida, getAsistencias,getAsistenciaPorEmpleado, updateAsistencia};