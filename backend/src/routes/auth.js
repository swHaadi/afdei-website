import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'afdei-secret-key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout (client-side token removal)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Create initial admin user (setup endpoint)
router.post('/setup', async (req, res) => {
  try {
    const adminExists = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (adminExists) {
      return res.json({ message: 'Admin user already exists. Login with: admin@afdei.org / admin123' });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@afdei.org',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      }
    });

    res.json({ message: 'Admin user created successfully. Login with: admin@afdei.org / admin123' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
