const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    // Get the token from the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Acceso denegado', 
        message: 'Token de autenticación no proporcionado' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWTPASSWORD);
    
    // Add user info to the request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.log('Error de autenticación:', error);
    return res.status(401).json({ 
      error: 'Token inválido', 
      message: 'La sesión ha expirado o el token es inválido' 
    });
  }
};

module.exports = { verifyToken };