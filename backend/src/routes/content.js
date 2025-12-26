import express from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all content (public)
router.get('/', async (req, res) => {
  try {
    const contents = await prisma.content.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    // Transform to include parsed JSON
    const transformed = contents.map(content => ({
      ...content,
      content: {
        en: JSON.parse(content.contentEn || '{}'),
        ar: JSON.parse(content.contentAr || '{}')
      },
      images: content.images ? JSON.parse(content.images) : []
    }));

    res.json(transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get content by section (public)
router.get('/section/:section', async (req, res) => {
  try {
    const content = await prisma.content.findUnique({
      where: { section: req.params.section }
    });

    if (!content) {
      return res.json(null);
    }

    // Transform to include parsed JSON
    const transformed = {
      ...content,
      content: {
        en: JSON.parse(content.contentEn || '{}'),
        ar: JSON.parse(content.contentAr || '{}')
      },
      images: content.images ? JSON.parse(content.images) : []
    };

    res.json(transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create content (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { section, content, images, isActive, order } = req.body;

    const newContent = await prisma.content.create({
      data: {
        section,
        contentEn: JSON.stringify(content?.en || {}),
        contentAr: JSON.stringify(content?.ar || {}),
        images: images ? JSON.stringify(images) : null,
        isActive: isActive ?? true,
        order: order ?? 0
      }
    });

    res.status(201).json({
      ...newContent,
      content: {
        en: JSON.parse(newContent.contentEn),
        ar: JSON.parse(newContent.contentAr)
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upsert content by section (protected) - CREATE OR UPDATE
router.put('/section/:section', authMiddleware, async (req, res) => {
  try {
    const { content, images, isActive, order } = req.body;

    const upsertedContent = await prisma.content.upsert({
      where: { section: req.params.section },
      update: {
        contentEn: JSON.stringify(content?.en || {}),
        contentAr: JSON.stringify(content?.ar || {}),
        images: images ? JSON.stringify(images) : undefined,
        isActive: isActive,
        order: order
      },
      create: {
        section: req.params.section,
        contentEn: JSON.stringify(content?.en || {}),
        contentAr: JSON.stringify(content?.ar || {}),
        images: images ? JSON.stringify(images) : null,
        isActive: isActive ?? true,
        order: order ?? 0
      }
    });

    res.json({
      ...upsertedContent,
      content: {
        en: JSON.parse(upsertedContent.contentEn),
        ar: JSON.parse(upsertedContent.contentAr)
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update content by ID (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { content, images, isActive, order } = req.body;

    const updatedContent = await prisma.content.update({
      where: { id: req.params.id },
      data: {
        contentEn: content?.en ? JSON.stringify(content.en) : undefined,
        contentAr: content?.ar ? JSON.stringify(content.ar) : undefined,
        images: images ? JSON.stringify(images) : undefined,
        isActive: isActive,
        order: order
      }
    });

    res.json({
      ...updatedContent,
      content: {
        en: JSON.parse(updatedContent.contentEn),
        ar: JSON.parse(updatedContent.contentAr)
      }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Delete content (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.content.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
