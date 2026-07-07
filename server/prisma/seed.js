import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TAGS = [
  'Vue',
  'React',
  'Node',
  'Express',
  'TypeScript',
  'Python',
  'Go',
  'Rust',
  'AI',
  'DevTools',
  'Open Source',
  'Mobile',
  'Design',
  'SaaS',
  'CLI',
  'Game',
];

const projects = [
  {
    title: 'Orbit Notes',
    tagline: 'Spatial notes that orbit around your ideas',
    description:
      'Orbit Notes reimagines personal knowledge as a living constellation. Drop thoughts onto a free-form canvas, link them with gravity lines, and watch related ideas cluster over time. Built for people who think in graphs, not folders.\n\nFeatures include keyboard-first capture, markdown support, and local-first sync that never holds your writing hostage.',
    url: 'https://example.com/orbit-notes',
    repoUrl: 'https://github.com/example/orbit-notes',
    tags: ['Vue', 'Node', 'Open Source'],
    votes: 48,
  },
  {
    title: 'Pulseboard',
    tagline: 'Real-time status pages that actually look good',
    description:
      'Pulseboard turns incident noise into a calm, public status board. Connect monitors, group services, and share a branded page your customers will trust.\n\nIncludes Slack/webhook alerts, historical uptime graphs, and a clean embed widget for marketing sites.',
    url: 'https://example.com/pulseboard',
    repoUrl: 'https://github.com/example/pulseboard',
    tags: ['React', 'TypeScript', 'SaaS'],
    votes: 72,
  },
  {
    title: 'ShipLog',
    tagline: 'Changelog generator from your pull requests',
    description:
      'ShipLog reads merged PRs, clusters them by theme, and drafts a human changelog you can edit in minutes. No more blank Notion pages before launch day.\n\nSupports GitHub and GitLab, custom categories, and one-click publish to Markdown or your docs site.',
    url: 'https://example.com/shiplog',
    repoUrl: 'https://github.com/example/shiplog',
    tags: ['CLI', 'DevTools', 'Go'],
    votes: 35,
  },
  {
    title: 'Palette Lab',
    tagline: 'Generate production-ready color systems',
    description:
      'Stop picking random hex codes. Palette Lab builds accessible color ramps from a single brand hue, exports CSS variables, Tailwind configs, and Figma tokens.\n\nContrast checks are baked in so your UI stays readable in light and dark modes.',
    url: 'https://example.com/palette-lab',
    tags: ['Design', 'DevTools', 'Open Source'],
    votes: 91,
  },
  {
    title: 'Forge CLI',
    tagline: 'Scaffold full-stack apps without the ceremony',
    description:
      'Forge CLI asks a few sharp questions and drops a production-shaped monorepo: API, SPA, auth stubs, Docker, and CI. Opinionated where it helps, flexible where it matters.\n\nTemplates for Vue/Express, React/Fastify, and SvelteKit.',
    url: 'https://example.com/forge-cli',
    repoUrl: 'https://github.com/example/forge-cli',
    tags: ['CLI', 'Vue', 'Express', 'DevTools'],
    votes: 56,
  },
  {
    title: 'Quiet Focus',
    tagline: 'A pomodoro timer that respects deep work',
    description:
      'Quiet Focus pairs ambient soundscapes with blockable sites, session analytics, and gentle streak tracking. No gamified dopamine spam — just space to do the hard thing.\n\nWorks offline as a PWA and syncs stats when you are back online.',
    url: 'https://example.com/quiet-focus',
    tags: ['Vue', 'Mobile', 'SaaS'],
    votes: 29,
  },
  {
    title: 'Tracekit',
    tagline: 'Lightweight distributed tracing for side projects',
    description:
      'Tracekit is OpenTelemetry without the enterprise tax. Drop a tiny SDK into your Express or Fastify app, view spans in a local UI, and export when you outgrow it.\n\nPerfect for debugging slow endpoints before they hit production users.',
    url: 'https://example.com/tracekit',
    repoUrl: 'https://github.com/example/tracekit',
    tags: ['Node', 'Express', 'DevTools', 'Open Source'],
    votes: 41,
  },
  {
    title: 'Pixel Dungeon Tactics',
    tagline: 'Roguelike tactics in the browser',
    description:
      'A turn-based dungeon crawler with procedural floors, party tactics, and pixel art that feels hand-crafted. Play free in the browser or install as a PWA.\n\nBuilt with canvas, TypeScript, and a custom entity component system.',
    url: 'https://example.com/pixel-dungeon',
    repoUrl: 'https://github.com/example/pixel-dungeon',
    tags: ['Game', 'TypeScript', 'Open Source'],
    votes: 64,
  },
  {
    title: 'Inbox Zero AI',
    tagline: 'Triage email with local models, privacy first',
    description:
      'Inbox Zero AI runs ranking and summarization on-device so your mail never leaves the machine. Label, snooze, and draft replies with full control over what gets sent.\n\nSupports Gmail and IMAP, with optional cloud models if you opt in.',
    url: 'https://example.com/inbox-zero-ai',
    tags: ['AI', 'Python', 'SaaS'],
    votes: 83,
  },
  {
    title: 'Rustate',
    tagline: 'Tiny reactive state for WASM UIs',
    description:
      'Rustate brings fine-grained reactivity to Rust + WASM frontends. Signals, derived values, and effects with a footprint small enough for embedded dashboards.\n\nComes with bindings for Leptos-style patterns and a Vue-inspired mental model.',
    url: 'https://example.com/rustate',
    repoUrl: 'https://github.com/example/rustate',
    tags: ['Rust', 'Open Source', 'DevTools'],
    votes: 38,
  },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('Seeding DevHub…');

  await prisma.comment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.project.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alex@devhub.app',
        username: 'alex',
        name: 'Alex Rivera',
        password,
        bio: 'Building tools for indie makers. Coffee-powered.',
        avatar: 'https://api.dicebear.com/9.x/shapes/svg?seed=alex',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sam@devhub.app',
        username: 'sam',
        name: 'Sam Chen',
        password,
        bio: 'Full-stack engineer. Open source enthusiast.',
        avatar: 'https://api.dicebear.com/9.x/shapes/svg?seed=sam',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jordan@devhub.app',
        username: 'jordan',
        name: 'Jordan Lee',
        password,
        bio: 'Designer who ships. Currently deep in side projects.',
        avatar: 'https://api.dicebear.com/9.x/shapes/svg?seed=jordan',
      },
    }),
  ]);

  const tagRecords = {};
  for (const name of TAGS) {
    const tag = await prisma.tag.create({
      data: { name, slug: slugify(name) },
    });
    tagRecords[name] = tag;
  }

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const author = users[i % users.length];
    const daysAgo = projects.length - i;
    const createdAt = new Date(Date.now() - daysAgo * 36e5 * 8);

    const project = await prisma.project.create({
      data: {
        title: p.title,
        slug: slugify(p.title),
        tagline: p.tagline,
        description: p.description,
        url: p.url,
        repoUrl: p.repoUrl || '',
        imageUrl: `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(p.title)}`,
        voteCount: p.votes,
        authorId: author.id,
        createdAt,
        tags: {
          connect: p.tags.map((t) => ({ id: tagRecords[t].id })),
        },
      },
    });

    // Create some votes from users (not exceeding voteCount display)
    const voters = users.filter((u) => u.id !== author.id);
    for (const voter of voters) {
      await prisma.vote.create({
        data: { userId: voter.id, projectId: project.id },
      });
    }

    await prisma.comment.create({
      data: {
        body: 'This is exactly what I needed for my next launch. Great work!',
        userId: users[(i + 1) % users.length].id,
        projectId: project.id,
        createdAt: new Date(createdAt.getTime() + 36e5),
      },
    });

    if (i % 2 === 0) {
      await prisma.comment.create({
        data: {
          body: 'Love the UX. How are you handling rate limits on the free tier?',
          userId: users[(i + 2) % users.length].id,
          projectId: project.id,
          createdAt: new Date(createdAt.getTime() + 72e5),
        },
      });
    }
  }

  console.log('Seed complete.');
  console.log('Demo logins: alex@devhub.app / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
