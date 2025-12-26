import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Get all media (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload media (protected)
router.post('/upload', authMiddleware, async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filepath = path.join(uploadsDir, filename);

    await file.mv(filepath);

    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${filename}`,
        alt: null
      }
    });

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete media (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const media = await prisma.media.findUnique({
      where: { id: req.params.id }
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete file from disk
    const filepath = path.join(uploadsDir, media.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await prisma.media.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
