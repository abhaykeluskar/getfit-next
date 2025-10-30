# Get Fit - Workout & Lifestyle Tracker

A mobile-first, offline-capable Progressive Web App (PWA) for tracking workouts and daily lifestyle habits.

## Features

- 🏋️ Workout Logger: Track exercises, sets, reps, and weights
- 📊 Lifestyle Logger: Log sleep, stress, diet, and more
- 📱 PWA: Install on mobile and desktop
- 🔄 Offline-First: Works without internet connection
- ☁️ Cloud Sync: Automatic synchronization across devices
- 🔒 Private: Self-hosted with complete data ownership

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: IndexedDB (Dexie.js) + PocketBase
- **Deployment**: Docker, Docker Compose

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start PocketBase (in a separate terminal):
```bash
# Download PocketBase for your OS from https://pocketbase.io/docs/
./pocketbase serve
```

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:3000

### Docker Development

```bash
docker-compose up -d
```

Access:
- App: http://localhost:3000
- PocketBase Admin: http://localhost:8090/_/

## Deployment to TrueNAS

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
get-fit-next/
├── app/              # Next.js App Router pages
├── components/       # React components
├── contexts/         # React contexts
├── hooks/            # Custom React hooks
├── lib/              # Core libraries (DB, sync, auth)
├── public/           # Static assets
├── pb_migrations/    # PocketBase migrations
└── pb_hooks/         # PocketBase hooks
```

## License

Private - All Rights Reserved
