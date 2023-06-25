import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      whiteboards: true,
      sharedBoards: true,
    },
  });
  res.json(users);
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      whiteboards: true,
      sharedBoards: true,
    },
  });
  res.json(user);
});

// Create a user (this might be removed or modified based on your Google OAuth setup)
router.post('/', async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.json(user);
});

export default router;
