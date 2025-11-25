# InstaClone - Quick Start Guide

Get started with InstaClone in VSCode in under 5 minutes!

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ VSCode installed
- ✅ Git installed

## Step 1: Clone & Install (2 minutes)

```bash
git clone <repository-url>
cd instaclone
npm install
```

## Step 2: Set Up Environment (2 minutes)

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Instagram access token:
```
VITE_INSTAGRAM_ACCESS_TOKEN=your_token_here
```

**Get your token:** https://developers.instagram.com → Your App → Tools → Graph Explorer → Generate token

## Step 3: Start Development (1 minute)

```bash
npm run dev
```

Open http://localhost:5000 in your browser! 🚀

## Available Commands

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start dev server with live reload |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run check` | Type check TypeScript |
| `npm run db:push` | Sync database schema |

## 🎯 Next Steps

1. **Connect Your Instagram Account**
   - Go to Profile → Connect Instagram
   - Paste your access token
   - Your feed loads automatically!

2. **Explore Features**
   - View your Instagram posts
   - Browse stories
   - Search hashtags
   - Save posts
   - Toggle dark mode

3. **Customize**
   - Edit `client/src/pages/` for pages
   - Modify `client/src/components/` for UI
   - Update `shared/schema.ts` for database

## 📝 VSCode Setup

**Recommended Extensions** (auto-recommended):
- Prettier Code Formatter
- ESLint
- Tailwind CSS IntelliSense
- GitLens
- React Snippets

Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac) → Extensions → Install recommended

## 🆘 Troubleshooting

### Port 5000 Already in Use?
```bash
# macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Instagram Token Invalid?
- Verify token is still valid
- Check permissions: `instagram_basic`, `instagram_graph_user_media`
- Get a fresh token from Meta Developers

### Need PostgreSQL?
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Then set DATABASE_URL in .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/instaclone
```

### Prefer SQLite?
No setup needed! Just enable in `.env.local`:
```
USE_SQLITE=true
```

## 📚 More Info

- Full setup guide: `VSCODE_SETUP.md`
- Architecture: `replit.md`
- Instagram API: `INSTAGRAM_SETUP.md`
- Deployment: `RENDER_DEPLOYMENT.md`

---

**Happy coding!** 🎉 Need help? Check the setup guides or create an issue!
