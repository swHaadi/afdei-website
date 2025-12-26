import express from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all settings (public for some, protected for others)
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();
    
    // Transform to key-value object
    const settingsObj = {};
    settings.forEach(s => {
      try {
        settingsObj[s.key] = JSON.parse(s.value);
      } catch {
        settingsObj[s.key] = s.value;
      }
    });

    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single setting
router.get('/:key', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: req.params.key }
    });

    if (!setting) {
      return res.json({ value: null });
    }

    try {
      res.json({ key: setting.key, value: JSON.parse(setting.value) });
    } catch {
      res.json({ key: setting.key, value: setting.value });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings (protected)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const settings = req.body;

    for (const [key, value] of Object.entries(settings)) {
      await prisma.settings.upsert({
        where: { key },
        update: { value: typeof value === 'string' ? value : JSON.stringify(value) },
        create: { key, value: typeof value === 'string' ? value : JSON.stringify(value) }
      });
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update single setting (protected)
router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const { value } = req.body;

    await prisma.settings.upsert({
      where: { key: req.params.key },
      update: { value: typeof value === 'string' ? value : JSON.stringify(value) },
      create: { key: req.params.key, value: typeof value === 'string' ? value : JSON.stringify(value) }
    });

    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
