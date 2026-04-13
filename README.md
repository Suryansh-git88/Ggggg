# SportStream - Live Sports Streaming App

A complete, production-ready multi-sport live streaming web application powered by the [SportSRC API](https://api.sportsrc.org/).

## Features

- **15+ Sports** — Football, Cricket, Basketball, Tennis, Hockey, MMA, Baseball, Rugby, Golf, Motor Sports, Darts, AFL, Billiards, and more
- **Live Streaming** — Watch live matches with multiple server options (HD/SD)
- **Real-time Updates** — Auto-refresh every 30-60 seconds for live data
- **Dark/Light Theme** — Toggle between dark and light modes
- **Favorites** — Save matches to watch later (localStorage)
- **Search** — Find matches by team name
- **League Standings** — View league tables and standings
- **PWA Support** — Installable as a mobile app
- **Responsive Design** — Works on mobile, tablet, and desktop
- **SEO Optimized** — Open Graph and Twitter Card meta tags

## Tech Stack

- **React 19** with Vite
- **Tailwind CSS v4** for styling
- **React Router v7** for navigation
- **Lucide React** for icons
- **Context API** for state management

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── api/          # API service layer
├── context/      # React Context providers (Theme, Favorites)
├── hooks/        # Custom hooks (useMatches, useMatchDetail, etc.)
├── components/
│   ├── layout/   # Header, Sidebar, Footer, MobileNav
│   ├── common/   # Loader, ErrorBoundary, SearchBar, Badge, EmptyState
│   ├── matches/  # MatchCard, MatchList, MatchFilter, LiveIndicator
│   ├── player/   # StreamPlayer, StreamSourceList
│   ├── sports/   # SportCard, SportGrid
│   └── favorites/# FavoriteButton, FavoritesList
├── pages/        # All route pages
├── utils/        # Constants, date formatting, localStorage helpers
└── styles/       # Global CSS with Tailwind
```

## Routes

| Path | Page |
|------|------|
| `/` | Home — Featured live matches + sport grid |
| `/live` | All currently live matches |
| `/sport/:slug` | All matches for a sport |
| `/match/:sport/:id` | Stream player + match detail |
| `/favorites` | Saved matches |
| `/search` | Search by team name |
| `/standings/:sport` | League standings |

## API

Uses the free [SportSRC API](https://api.sportsrc.org/) — no API key required.

## License

MIT
