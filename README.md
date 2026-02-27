# Godly Women Platform

A modern full-stack web application for a Christian women's community platform.

## Tech Stack

### Frontend
- Next.js 15.5.12
- React 19.1.0
- TypeScript 5.9.3
- Tailwind CSS 3.4.3
- Zustand (state management)
- Axios (HTTP client)

### Backend
- Node.js
- Express 4.18.2
- TypeScript 5.2.2
- PostgreSQL
- JWT Authentication
- Bcrypt for password hashing

## Project Structure

```
godlywomenn/
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/       # Next.js app directory
│   │   ├── components/
│   │   ├── lib/       # Utilities and API functions
│   │   └── store/     # Zustand stores
│   └── package.json
├── backend/           # Express.js backend API
│   ├── src/
│   │   ├── config/    # Database and auth config
│   │   ├── routes/    # API routes
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── server.ts  # Main server file
│   └── package.json
└── package.json       # Root package.json
```

## Features

- **User Authentication**: JWT-based authentication with email and password
- **Articles**: Community members can write and share articles
- **Prayers**: Share prayer requests and prayer support
- **Marketplace**: Sell and buy resources
- **Messaging**: Direct messaging between community members
- **User Profiles**: User management and profiles

## Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd godlywomenn
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run dev:frontend    # Frontend only
   npm run dev:backend     # Backend only
   npm run dev             # Both (with concurrently)
   ```

3. **Setup Environment Variables**

   **Backend** - Create `backend/.env`:
   ```env
   NODE_ENV=development
   PORT=8000
   DATABASE_URL=postgresql://user:password@localhost:5432/godlywomenn
   JWT_SECRET=your-secret-key-change-in-production
   JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend** - Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_API=http://localhost:8000
   ```

4. **Setup PostgreSQL Database**
   ```bash
   createdb godlywomenn
   ```

### Running the Application

**Development mode** (from project root):
```bash
npm run dev
```

This starts both frontend (http://localhost:3000) and backend (http://localhost:8000).

**Production build**:
```bash
npm run build
npm run start:backend
npm run start:frontend
```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run build` - Build both frontend and backend
- `npm run build:frontend` - Build frontend only
- `npm run build:backend` - Build backend only
- `npm run start` - Start backend (production)
- `npm run start:frontend` - Start frontend (production)
- `npm run start:backend` - Start backend (production)

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user  
- `GET /api/auth/me` - Get current user profile

### Articles Endpoints
- `GET /api/articles` - Get all articles
- `GET /api/articles/:slug` - Get article by slug
- `POST /api/articles` - Create article (authenticated)
- `PUT /api/articles/:id` - Update article (authenticated)
- `DELETE /api/articles/:id` - Delete article (authenticated)

### Prayers Endpoints
- `GET /api/prayers` - Get all prayers
- `POST /api/prayers` - Create prayer (authenticated)

### Marketplace Endpoints
- `GET /api/marketplace` - Get all items
- `POST /api/marketplace` - Create item (authenticated)

### Messages Endpoints
- `GET /api/messages` - Get user messages (authenticated)
- `POST /api/messages` - Send message (authenticated)

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variable: `NEXT_PUBLIC_BACKEND_API`
4. Deploy

### Backend (Render)
1. Push to GitHub
2. Create new Web Service on Render
3. Configure environment variables
4. Deploy

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to origin
5. Create a Pull Request

## License

© 2026 Godly Women. All rights reserved.
