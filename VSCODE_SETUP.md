# InstaClone - VSCode Setup Guide

This guide will help you set up InstaClone locally in VSCode.

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **VSCode** - [Download](https://code.visualstudio.com/)
- **Git** - [Download](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd instaclone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and fill in:
- `VITE_INSTAGRAM_ACCESS_TOKEN` - Your Instagram access token
- `VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID` - Your Instagram business account ID (optional)

**Get Your Instagram Access Token:**
1. Go to [Instagram for Developers](https://developers.instagram.com)
2. Create an app or use an existing one
3. Go to Roles → Testers and add your account
4. Generate an access token with these permissions:
   - `instagram_basic`
   - `instagram_graph_user_media`

### 4. (Optional) Set Up PostgreSQL Database

If you want to use PostgreSQL for data persistence:

```bash
# Install PostgreSQL
# macOS: brew install postgresql@15
# Ubuntu: sudo apt-get install postgresql postgresql-contrib
# Windows: Download from https://www.postgresql.org/

# Start PostgreSQL
# macOS: brew services start postgresql@15
# Ubuntu: sudo service postgresql start
# Windows: Use PostgreSQL Application

# Create a database
createdb instaclone

# Update .env.local with your PostgreSQL URL
# DATABASE_URL=postgresql://username:password@localhost:5432/instaclone
```

**Or use SQLite (simpler for local development):**

Enable SQLite in `.env.local`:
```bash
USE_SQLITE=true
SQLITE_DB_PATH=./data/sqlite.db
```

SQLite requires no additional setup!

### 5. Run the Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5000`

### 6. VSCode Extensions (Recommended)

Install these extensions in VSCode for better development experience:

- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
- **TypeScript Vue Plugin** - Vue.volar
- **ESLint** - dbaeumer.vscode-eslint
- **Prettier** - esbenp.prettier-vscode

### 7. Project Structure

```
instaclone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities and API functions
│   │   └── index.tsx      # Entry point
│   └── index.html         # HTML template
├── server/                # Express backend
│   ├── app.ts            # Express app setup
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── shared/               # Shared code
│   ├── schema.ts         # Database schema
│   └── db.ts             # Database client
├── package.json          # Dependencies
└── vite.config.ts        # Vite configuration
```

## Usage

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Type checking
npm run check

# Database operations
npm run db:push       # Push schema changes to database
npm run db:studio     # Open Drizzle Studio for database management
```

## Features

✅ Instagram feed display with photos & videos
✅ Multi-account support (connect multiple Instagram accounts)
✅ Stories viewer with navigation
✅ Dark mode toggle
✅ Search & filter by hashtags
✅ Bookmark/save posts
✅ Responsive mobile-first design
✅ Dark mode support

## Connecting Your Instagram Account

1. Get your Instagram access token (see Setup section above)
2. Go to Profile → Connect Instagram
3. Paste your token to authenticate
4. Your Instagram feed will load automatically!

## Troubleshooting

### Port 5000 Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Node Modules Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Instagram API Not Working
- Verify your access token is valid
- Check that your account is added as a tester in the Meta App
- Ensure your token has `instagram_basic` and `instagram_graph_user_media` permissions

### Database Connection Issues
- Check if PostgreSQL is running
- Verify DATABASE_URL in `.env.local`
- For SQLite, ensure `data/` directory has write permissions

## Deployment

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for production deployment instructions.

## Need Help?

- Check [INSTAGRAM_SETUP.md](./INSTAGRAM_SETUP.md) for Instagram API setup details
- Review [replit.md](./replit.md) for architecture and technical details
- Check error logs in VSCode's Debug Console

## License

This project is for educational purposes.

Happy coding! 🚀
