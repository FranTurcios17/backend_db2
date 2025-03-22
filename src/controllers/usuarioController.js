const db = require("../../models/index")
const crypt = require("../services/userServices")
const jwt = require('jsonwebtoken')

const loginUser = async (req, res) =>{
    const {nombre_usuario, contraseña} = req.body;

    try {
        const usuario = await db.usuarios.findOne({where: {nombre_usuario}})

        if(!usuario){
            return res.status(404).json({message: "Acceso denegado, Usuario incorrecto"})
        }

        const valida = await crypt.comparePassword(contraseña, usuario.contraseña_hash)

        if(!valida){
            return res.status(404).json({message: "Acceso denegado, Contraseña incorrecta"})
        }

        const token = jwt.sign({
            id_usuario: usuario.id_usuario,
            rol: usuario.rol,
            id_empleado: usuario.id_empleado
        }, process.env.JWTPASSWORD, {expiresIn: '24h'})
        return res.status(200).json({message: "Inicio de sesion exitoso", token, usuario: {
            id_usuario: usuario.id_usuario,
            rol: usuario.rol,
            id_empleado: usuario.id_empleado
        }})


    } catch (error) {
        return res.status(404).json({message: "Error en el inicio de sesion"})
    }
}

const cambiarContrasena = async (req, res)=>{
    
    try {
        const id = req.params.id;
        const {actual, nueva}= req.body;
        const usuario = await db.usuarios.findOne({where: {id_usuario: id}})

        if(!usuario){
            return res.status(404).json({message: "Acceso denegado, Usuario incorrecto"})
        }

        const valida = await crypt.comparePassword(actual, usuario.contraseña_hash)

        if(!valida){
            return res.status(404).json({message: "Contraseña actual incorrecta"})
        }

        const nueva_hash = await crypt.encryptPassword(nueva)

        await usuario.update({contraseña_hash: nueva_hash})

        return res.status(200).json({message: "Contraseña actualizada con exito"})
        
    } catch (error) {
        return res.status(404).json({message: "Error en el cambio de contraseña"})
    }

    
}

module.exports = {loginUser, cambiarContrasena}