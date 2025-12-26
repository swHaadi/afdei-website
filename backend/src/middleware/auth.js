import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Please authenticate' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'afdei-secret-key');
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Please authenticate' });
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

export const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};
