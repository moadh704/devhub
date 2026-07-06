import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authOptional, authRequired } from '../middleware/auth.js';
import { createError } from '../middleware/error.js';
import { makeSlug, projectSelect, shapeProject } from '../utils/project.js';

const router = Router();

const createSchema = z.object({
  title: z.string().min(2).max(80),
  tagline: z.string().min(8).max(140),
  description: z.string().min(20).max(5000),
  url: z.string().url(),
  repoUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string().min(1).max(24)).max(8).default([]),
});

function hotScore(project) {
  const hours = (Date.now() - new Date(project.createdAt).getTime()) / 36e5;
  return project.voteCount / Math.pow(hours + 2, 1.5);
}

router.get('/', authOptional, async (req, res, next) => {
  try {
    const sort = ['hot', 'new', 'top'].includes(req.query.sort) ? req.query.sort : 'hot';
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const tag = typeof req.query.tag === 'string' ? req.query.tag.trim().toLowerCase() : '';
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const userId = req.user?.id;

    const where = {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q } },
                { tagline: { contains: q } },
                { description: { contains: q } },
              ],
            }
          : {},
        tag
          ? {
              tags: {
                some: { slug: tag },
              },
            }
          : {},
      ],
    };

    let projects = await prisma.project.findMany({
      where,
      select: projectSelect(userId),
      orderBy: sort === 'new' ? { createdAt: 'desc' } : { voteCount: 'desc' },
      take: sort === 'hot' ? 200 : limit,
      skip: sort === 'hot' ? 0 : skip,
    });

    if (sort === 'hot') {
      projects = projects
        .map((p) => ({ ...p, _hot: hotScore(p) }))
        .sort((a, b) => b._hot - a._hot)
        .slice(skip, skip + limit)
        .map(({ _hot, ...p }) => p);
    }

    const total = await prisma.project.count({ where });

    res.json({
      projects: projects.map(shapeProject),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', authOptional, async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      select: projectSelect(req.user?.id),
    });
    if (!project) throw createError(404, 'Project not found');
    res.json({ project: shapeProject(project) });
  } catch (err) {
    next(err);
  }
});

router.post('/', authRequired, async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const slug = makeSlug(data.title);

    const tagNames = [...new Set(data.tags.map((t) => t.trim()).filter(Boolean))];
    const tags = [];
    for (const name of tagNames) {
      const tagSlug = name.toLowerCase().replace(/\s+/g, '-');
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name, slug: tagSlug },
      });
      tags.push({ id: tag.id });
    }

    const project = await prisma.project.create({
      data: {
        title: data.title.trim(),
        slug,
        tagline: data.tagline.trim(),
        description: data.description.trim(),
        url: data.url,
        repoUrl: data.repoUrl || '',
        imageUrl:
          data.imageUrl ||
          `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(slug)}`,
        authorId: req.user.id,
        tags: tags.length ? { connect: tags } : undefined,
      },
      select: projectSelect(req.user.id),
    });

    res.status(201).json({ project: shapeProject(project) });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/vote', authRequired, async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) throw createError(404, 'Project not found');

    const existing = await prisma.vote.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: project.id,
        },
      },
    });

    let hasVoted;
    let voteCount;

    if (existing) {
      await prisma.$transaction([
        prisma.vote.delete({ where: { id: existing.id } }),
        prisma.project.update({
          where: { id: project.id },
          data: { voteCount: { decrement: 1 } },
        }),
      ]);
      hasVoted = false;
      voteCount = Math.max(0, project.voteCount - 1);
    } else {
      await prisma.$transaction([
        prisma.vote.create({
          data: { userId: req.user.id, projectId: project.id },
        }),
        prisma.project.update({
          where: { id: project.id },
          data: { voteCount: { increment: 1 } },
        }),
      ]);
      hasVoted = true;
      voteCount = project.voteCount + 1;
    }

    res.json({ hasVoted, voteCount });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/comments', async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) throw createError(404, 'Project not found');

    const comments = await prisma.comment.findMany({
      where: { projectId: project.id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true, name: true, avatar: true },
        },
      },
    });

    res.json({ comments });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/comments', authRequired, async (req, res, next) => {
  try {
    const bodySchema = z.object({
      body: z.string().min(1).max(2000),
    });
    const { body } = bodySchema.parse(req.body);

    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) throw createError(404, 'Project not found');

    const comment = await prisma.comment.create({
      data: {
        body: body.trim(),
        userId: req.user.id,
        projectId: project.id,
      },
      include: {
        user: {
          select: { id: true, username: true, name: true, avatar: true },
        },
      },
    });

    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
});

export default router;
