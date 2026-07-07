import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authOptional } from '../middleware/auth.js';
import { createError } from '../middleware/error.js';
import { projectSelect, shapeProject } from '../utils/project.js';

const router = Router();

router.get('/:username', authOptional, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username.toLowerCase() },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { projects: true, votes: true, comments: true },
        },
      },
    });

    if (!user) throw createError(404, 'User not found');

    const projects = await prisma.project.findMany({
      where: { authorId: user.id },
      select: projectSelect(req.user?.id),
      orderBy: { createdAt: 'desc' },
    });

    const { _count, ...profile } = user;
    res.json({
      user: {
        ...profile,
        projectCount: _count.projects,
        voteCount: _count.votes,
        commentCount: _count.comments,
      },
      projects: projects.map(shapeProject),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
