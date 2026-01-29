# Plinth

A decision-quality system for senior leaders operating in complex environments.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase (Postgres + Auth)
- **AI**: OpenAI GPT-4o, Vercel AI SDK, Firecrawl
- **Infrastructure**: Vercel, Edge Functions

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript checks

## Project Structure

See [FOLDER_STRUCTURE.md](docs/architecture/FOLDER_STRUCTURE.md) for detailed documentation of the project organization.

## Documentation

- [Technical Architecture](docs/architecture/TECHNICAL_ARCHITECTURE.md)
- [API Contracts](docs/specs/API_CONTRACTS.md)
- [Decision Flow](docs/specs/DECISION_FLOW.md)
- [Security](docs/specs/SECURITY.md)

## License

Copyright © 2026 Paul Butcher. All rights reserved.
