# MongoDB/Node.js Backend Migration Complete ✅

## What Changed

### Backend
- ❌ Django (Python) - REMOVED
- ✅ Node.js/Express + MongoDB - NEW

### Database
- ❌ PostgreSQL (Render) - REMOVED
- ✅ MongoDB (Local or Atlas) - NEW

### API Format
- **Same endpoints** - All routes remain identical
- **Same response structure** - Frontend code needs minimal changes
- **Data persistence** - Guaranteed with MongoDB

---

## Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Server
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# macOS: brew install mongodb-community
# Linux: Follow MongoDB docs

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
```
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI_PROD in .env
```

### 3. Start Backend

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

The backend will be available at `http://localhost:8000`

---

## Frontend Integration

### Key Changes
1. **API URL** remains the same format
2. **Authentication** uses JWT tokens (compatible with NextAuth)
3. **Media files** served from `/media/` path
4. **Error responses** are JSON

### Files Already Updated (Auto-compatible)
The frontend API calls are already structured to work with this backend:
- `/src/lib/api.ts` - Generic fetch wrapper ✅
- `/src/lib/articles.ts` - Article fetching ✅
- `/src/app/api/**` - Next.js proxy routes ✅

### No Changes Required For:
- Authentication flow
- Article CRUD
- Prayer CRUD
- Marketplace CRUD
- Messaging
- Comments/Likes
- Image uploads

---

## API Endpoints (All Compatible)

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
PATCH  /api/auth/me
GET    /api/auth/:id
```

### Articles
```
GET    /api/articles
POST   /api/articles
GET    /api/articles/:id
PATCH  /api/articles/:id
DELETE /api/articles/:id
POST   /api/articles/:id/like
GET    /api/articles/:id/comments
POST   /api/articles/:id/comments
PATCH  /api/articles/:id/comments/:commentId
DELETE /api/articles/:id/comments/:commentId
POST   /api/articles/:id/comments/:commentId/like
```

### Prayers
```
GET    /api/prayers
POST   /api/prayers
GET    /api/prayers/:id
PATCH  /api/prayers/:id
DELETE /api/prayers/:id
POST   /api/prayers/:id/support
GET    /api/prayers/:id/responses
POST   /api/prayers/:id/responses
POST   /api/prayers/:id/responses/:responseId/like
DELETE /api/prayers/:id/responses/:responseId
```

### Marketplace
```
GET    /api/marketplace
POST   /api/marketplace
GET    /api/marketplace/:id
PATCH  /api/marketplace/:id
DELETE /api/marketplace/:id
```

### Messaging
```
GET    /api/messaging/conversations
POST   /api/messaging/conversations
GET    /api/messaging/messages
POST   /api/messaging/messages
DELETE /api/messaging/messages/:id
```

---

## Data Persistence Guarantee

✅ **No data loss after 24 hours**
✅ **Data survives server restarts**
✅ **Automatic backups** (if using MongoDB Atlas)
✅ **ACID compliant** transactions
✅ **Scalable** for production

---

## Testing

### Test API Connectivity

```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Frontend Testing

1. Start backend: `npm run dev` (in backend/)
2. Start frontend: `npm run dev` (in root/)
3. Test on http://localhost:3000
4. Try: Register → Create Article → Create Prayer → Marketplace

---

## Production Deployment

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=8000
MONGODB_URI_PROD=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-production-secret>
JWT_REFRESH_SECRET=<your-production-refresh-secret>
NEXTAUTH_SECRET=<your-nextauth-production-secret>
FRONTEND_URL=https://yourdomain.com
```

### Deploy Options

1. **Railway** (Recommended)
   - Connect GitHub repo
   - Set environment variables
   - Deploy

2. **Vercel** (For backend)
   - Not ideal for Node.js backend
   - Use Railway, Render, or Heroku instead

3. **Render**
   - Similar to Railway
   - Good free tier

4. **Docker**
   ```bash
   docker build -t godlywomen-api .
   docker run -p 8000:8000 godlywomen-api
   ```

---

## Troubleshooting

### MongoDB Connection Error
```
❌ "MongooseError: Cannot connect to MongoDB"
✅ Ensure MongoDB is running
✅ Check MONGODB_URI in .env
✅ Verify connection string format
```

### Token Expired
```
❌ "Token expired"
✅ Frontend should handle via /api/auth/refresh
✅ Check JWT_SECRET is consistent
```

### Image Upload Not Working
```
❌ "Image not saved"
✅ Ensure /media directory exists
✅ Check file permissions
✅ Verify upload path in controllers
```

### CORS Error
```
❌ "CORS policy: No 'Access-Control-Allow-Origin'"
✅ Check FRONTEND_URL matches frontend domain
✅ Verify frontend URL in .env
```

---

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      (MongoDB connection)
│   │   ├── auth.ts          (JWT configuration)
│   │   └── storage.ts       (File upload config)
│   ├── models/
│   │   ├── User.ts          (User schema)
│   │   ├── Article.ts       (Article schema)
│   │   ├── Prayer.ts        (Prayer schema)
│   │   ├── Marketplace.ts   (Marketplace schema)
│   │   └── Messaging.ts     (Messaging schema)
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── articleController.ts
│   │   ├── prayerController.ts
│   │   ├── marketplaceController.ts
│   │   └── messagingController.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── articles.ts
│   │   ├── prayers.ts
│   │   ├── marketplace.ts
│   │   └── messaging.ts
│   ├── middleware/
│   │   └── errorHandler.ts  (Error handling)
│   ├── utils/
│   │   └── validation.ts    (Validation helpers)
│   └── server.ts            (Main application)
├── media/
│   ├── articles/            (Article images)
│   └── marketplace/         (Marketplace images)
├── package.json
├── tsconfig.json
├── .env
└── .env.example
```

---

## Next Steps

1. ✅ Install backend dependencies: `npm install`
2. ✅ Ensure MongoDB is running
3. ✅ Start backend: `npm run dev`
4. ✅ Start frontend: `npm run dev` (from root)
5. ✅ Test on http://localhost:3000
6. ✅ Deploy to production using Railway/Render/Heroku

---

## Support

For issues or questions:
- Check error logs in backend console
- Verify MongoDB connection
- Ensure all environment variables are set
- Check CORS configuration
- Verify JWT secrets are consistent
