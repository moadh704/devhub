import slugify from 'slugify';

export function makeSlug(title) {
  const base = slugify(title, { lower: true, strict: true, trim: true }) || 'project';
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export function projectSelect(userId) {
  return {
    id: true,
    title: true,
    slug: true,
    tagline: true,
    description: true,
    url: true,
    repoUrl: true,
    imageUrl: true,
    voteCount: true,
    createdAt: true,
    updatedAt: true,
    author: {
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
      },
    },
    tags: {
      select: { id: true, name: true, slug: true },
    },
    _count: {
      select: { comments: true },
    },
    ...(userId
      ? {
          votes: {
            where: { userId },
            select: { id: true },
            take: 1,
          },
        }
      : {}),
  };
}

export function shapeProject(project) {
  if (!project) return null;
  const { votes, _count, ...rest } = project;
  return {
    ...rest,
    commentCount: _count?.comments ?? 0,
    hasVoted: Array.isArray(votes) ? votes.length > 0 : false,
  };
}
