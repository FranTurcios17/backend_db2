//const bcrypt = require('bcryptjs')

const bcrypt = require('bcryptjs');

const encryptPassword = async (password) =>{

    const hashedPassword = await bcrypt.hash(password, 3)
    return hashedPassword
}

const comparePassword = async (pass1, pass2) =>{
    const result = await bcrypt.compare(pass1, pass2)
    return result
}

module.exports = {encryptPassword, comparePassword}

