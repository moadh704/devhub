# DevHub

**Discover. Launch. Upvote.** A Product Hunt–style platform for side projects.

Built with **Vue 3** + **Express** + **Prisma** + **SQLite**.

## Features

- Hot / New / Top project feeds with ranking
- Submit projects with tags, links, and cover images
- Upvotes (one per user, toggle)
- Threaded comments on project pages
- Search & filter by stack tags
- JWT auth (register / login)
- User profiles with submitted projects
- Seeded demo data so you can explore instantly
- Polished dark UI with a distinctive design system

## Tech stack

| Layer    | Stack                                      |
|----------|--------------------------------------------|
| Frontend | Vue 3, Vite, Pinia, Vue Router, Tailwind   |
| Backend  | Express, JWT, bcrypt, Zod validation       |
| Database | Prisma + SQLite                            |
| Upload   | Multer (local cover images)                |

## Quick start

```bash
# from repo root
npm run setup

# then start both apps
npm run dev
```

- Client: http://localhost:5173  
- API:    http://localhost:4000  

### Demo accounts (after seed)

| Email              | Password  |
|--------------------|-----------|
| alex@devhub.app    | password123 |
| sam@devhub.app     | password123 |
| jordan@devhub.app  | password123 |

## Project structure

```
devhub/
├── client/          # Vue 3 SPA
├── server/          # Express API
├── package.json     # root scripts
└── README.md
```

## API overview

| Method | Path                        | Description        |
|--------|-----------------------------|--------------------|
| POST   | /api/auth/register          | Create account     |
| POST   | /api/auth/login             | Login              |
| GET    | /api/auth/me                | Current user       |
| GET    | /api/projects               | List / filter      |
| POST   | /api/projects               | Submit (auth)      |
| GET    | /api/projects/:slug         | Project detail     |
| POST   | /api/projects/:id/vote      | Toggle upvote      |
| GET    | /api/projects/:id/comments  | List comments      |
| POST   | /api/projects/:id/comments  | Add comment        |
| GET    | /api/tags                   | All tags           |
| GET    | /api/users/:username        | Public profile     |

## License

MIT
