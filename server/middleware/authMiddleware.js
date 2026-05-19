import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_hireform_12345');
    req.user = decoded; // { id, email }
    next();
  } catch (error) {
    console.error('JWT Verification Error', error);
    return res.status(401).json({ message: 'Session expired or invalid token. Please log in again.' });
  }
};

export default authMiddleware;
