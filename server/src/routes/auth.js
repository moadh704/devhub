import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authRequired, signToken } from '../middleware/auth.js';
import { createError } from '../middleware/error.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  name: z.string().min(1).max(60),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    bio: user.bio,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email.toLowerCase() }, { username: data.username.toLowerCase() }],
      },
    });
    if (existing) {
      throw createError(409, 'Email or username already in use');
    }

    const password = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        username: data.username.toLowerCase(),
        name: data.name.trim(),
        password,
        avatar: `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(data.username)}`,
      },
    });

    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) throw createError(401, 'Invalid email or password');

    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) throw createError(401, 'Invalid email or password');

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authRequired, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw createError(404, 'User not found');
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
