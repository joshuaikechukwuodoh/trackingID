import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user data to request object
    req.user = decoded; // Assumes token payload includes userId or other user data
    next(); // Proceed to the next middleware/route
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token, authorization denied' });
  }
};

export default authMiddleware;