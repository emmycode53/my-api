const jwt = require('jsonwebtoken');
const JWT_key = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
     console.log('extracted token',token);
  try {
    const decoded = jwt.verify(token, JWT_key );
    console.log('decoded payload', decoded)
    req.user = decoded; 
    console.log('✅ Decoded user:', req.user);

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;

