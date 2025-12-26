import express from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper to transform project for API response
const transformProject = (project) => ({
  _id: project.id,
  id: project.id,
  name: { en: project.nameEn, ar: project.nameAr },
  description: { en: project.descriptionEn, ar: project.descriptionAr },
  objectives: {
    en: JSON.parse(project.objectivesEn || '[]'),
    ar: JSON.parse(project.objectivesAr || '[]')
  },
  benefits: {
    en: project.benefitsEn ? JSON.parse(project.benefitsEn) : [],
    ar: project.benefitsAr ? JSON.parse(project.benefitsAr) : []
  },
  images: project.images ? JSON.parse(project.images) : [],
  isFeatured: project.isFeatured,
  isActive: project.isActive,
  order: project.order,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt
});

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    
    const where = { isActive: true };
    if (featured === 'true') where.isFeatured = true;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    res.json(projects.map(transformProject));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(transformProject(project));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, objectives, benefits, images, isFeatured, isActive, order } = req.body;

    const project = await prisma.project.create({
      data: {
        nameEn: name?.en || '',
        nameAr: name?.ar || '',
        descriptionEn: description?.en || '',
        descriptionAr: description?.ar || '',
        objectivesEn: JSON.stringify(objectives?.en || []),
        objectivesAr: JSON.stringify(objectives?.ar || []),
        benefitsEn: benefits?.en ? JSON.stringify(benefits.en) : null,
        benefitsAr: benefits?.ar ? JSON.stringify(benefits.ar) : null,
        images: images ? JSON.stringify(images) : null,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true,
        order: order ?? 0
      }
    });

    res.status(201).json(transformProject(project));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update project (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, objectives, benefits, images, isFeatured, isActive, order } = req.body;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        nameEn: name?.en,
        nameAr: name?.ar,
        descriptionEn: description?.en,
        descriptionAr: description?.ar,
        objectivesEn: objectives?.en ? JSON.stringify(objectives.en) : undefined,
        objectivesAr: objectives?.ar ? JSON.stringify(objectives.ar) : undefined,
        benefitsEn: benefits?.en ? JSON.stringify(benefits.en) : undefined,
        benefitsAr: benefits?.ar ? JSON.stringify(benefits.ar) : undefined,
        images: images ? JSON.stringify(images) : undefined,
        isFeatured: isFeatured,
        isActive: isActive,
        order: order
      }
    });

    res.json(transformProject(project));
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Delete project (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
