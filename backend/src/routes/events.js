import express from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper to transform event for API response
const transformEvent = (event) => ({
  _id: event.id,
  id: event.id,
  title: { en: event.titleEn, ar: event.titleAr },
  description: { en: event.descriptionEn, ar: event.descriptionAr },
  date: event.date,
  location: { en: event.locationEn, ar: event.locationAr },
  image: event.imageUrl ? { url: event.imageUrl } : null,
  isFeatured: event.isFeatured,
  isActive: event.isActive,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt
});

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    
    const where = { isActive: true };
    if (featured === 'true') where.isFeatured = true;

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    res.json(events.map(transformEvent));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single event (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(transformEvent(event));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create event (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, date, location, image, isFeatured, isActive } = req.body;

    const event = await prisma.event.create({
      data: {
        titleEn: title?.en || '',
        titleAr: title?.ar || '',
        descriptionEn: description?.en || '',
        descriptionAr: description?.ar || '',
        date: new Date(date),
        locationEn: location?.en || '',
        locationAr: location?.ar || '',
        imageUrl: image?.url || null,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true
      }
    });

    res.status(201).json(transformEvent(event));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update event (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, date, location, image, isFeatured, isActive } = req.body;

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        titleEn: title?.en,
        titleAr: title?.ar,
        descriptionEn: description?.en,
        descriptionAr: description?.ar,
        date: date ? new Date(date) : undefined,
        locationEn: location?.en,
        locationAr: location?.ar,
        imageUrl: image?.url,
        isFeatured: isFeatured,
        isActive: isActive
      }
    });

    res.json(transformEvent(event));
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Delete event (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.event.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
