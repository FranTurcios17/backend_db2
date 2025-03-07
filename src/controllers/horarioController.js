const db = require("../../models/index")
//import empleados from "../../models/empleados";
//import { empleados } from "../../models/index";
//import { encryptPassword} from "../services/userServices";

const createHorario = async (req, res) =>{
    try {
        
        
        const {hora_entrada, hora_salida, dias_semana} = req.body;
    
        const horario = await db.horarios.create({hora_entrada, hora_salida, dias_semana})

        if(!horario){
            
            console.log("hubo un error al guardar la informacion del horario")
            return res.status(404).json({error: 'hubo un error al guardar la informacion del horario'});
        }

        
        res.status(200).json({message: "horario registrado con exito", horario})
    } catch (error) {
        console.log("no se pudo registrar el horario")   
        res.status(500).json({error: 'error en el servidor'}) 
    }
        
}

const getHorarios = async (req, res) => {
   
    try {
        const horarios = await db.horarios.findAll();

        if(!horarios){
            console.log("no se pudieron obtener los horarios")
            return res.status(404).json({error: 'no se pudieron cargar los horarios'});
        }
        res.status(200).json(horarios)
    } catch (error) {
        console.log("error al encontrar los horarios")
        res.status(500).json({error: 'error en el servidor'})
    }
    
}





module.exports = {createHorario, getHorarios};
