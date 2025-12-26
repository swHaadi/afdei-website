import express from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
        isRead: false
      }
    });

    res.status(201).json({ message: 'Message sent successfully', id: submission.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all submissions (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single submission (protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const submission = await prisma.contactSubmission.findUnique({
      where: { id: req.params.id }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Mark as read
    if (!submission.isRead) {
      await prisma.contactSubmission.update({
        where: { id: req.params.id },
        data: { isRead: true }
      });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete submission (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.contactSubmission.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
