# MongoDB/Node.js Backend for Godlywomen

API Server built with Express, TypeScript, and MongoDB

## Setup

```bash
npm install
```

## Environment Variables

Create `.env`:
```
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/godlywomen
MONGODB_URI_PROD=your-mongodb-atlas-connection-string
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
```

## Running

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## API Documentation

See `/docs` for API specification

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/refresh` - Refresh JWT token
- POST `/api/auth/logout` - Logout user

### Articles
- GET `/api/articles` - List articles
- POST `/api/articles` - Create article
- GET `/api/articles/:id` - Get article
- PATCH `/api/articles/:id` - Update article
- DELETE `/api/articles/:id` - Delete article

### Prayers
- GET `/api/prayers` - List prayers
- POST `/api/prayers` - Create prayer
- GET `/api/prayers/:id` - Get prayer
- PATCH `/api/prayers/:id` - Update prayer
- DELETE `/api/prayers/:id` - Delete prayer

### Marketplace
- GET `/api/marketplace` - List items
- POST `/api/marketplace` - Create listing
- GET `/api/marketplace/:id` - Get listing
- PATCH `/api/marketplace/:id` - Update listing
- DELETE `/api/marketplace/:id` - Delete listing

### Messaging
- GET `/api/messaging/conversations` - List conversations
- POST `/api/messaging/conversations` - Create conversation
- GET `/api/messaging/messages` - List messages
- POST `/api/messaging/messages` - Send message
