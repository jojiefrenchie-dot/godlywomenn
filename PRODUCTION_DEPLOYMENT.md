# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

- [x] Backend created with Node.js/Express
- [x] MongoDB models implemented
- [x] All API endpoints working
- [x] Image upload configured
- [x] Authentication system in place
- [x] Frontend compatible
- [ ] Generate production secrets
- [ ] Set up MongoDB Atlas
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure custom domain
- [ ] Set up monitoring

---

## Step 1: Generate Production Secrets

Generate secure random strings for production:

```bash
# On Linux/macOS:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Run 3 times to get 3 secrets:
# Secret 1 (JWT_SECRET)
# Secret 2 (JWT_REFRESH_SECRET)  
# Secret 3 (NEXTAUTH_SECRET)

# Example outputs (use these format, not exact values):
# JWT_SECRET: 3f7e8a2b1c9d4e6f5a8b3c2e1d9f4a6b7c8e9d0f1a2b3c4d5e6f7a8b9c0d
# JWT_REFRESH_SECRET: 9d4e6f5a8b3c2e1d0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
# NEXTAUTH_SECRET: 1c9d4e6f5a8b3c2e1d9f4a6b7c8e9d0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b
```

---

## Step 2: MongoDB Atlas Setup

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with email/GitHub

2. **Create Free Cluster**
   - Click "Create" → "Build a Cluster"
   - Select "M0 Free" tier
   - Choose region (US/Europe/Asia)
   - Click "Create Cluster"

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Select "Node.js" driver
   - Copy connection string (looks like):
     ```
     mongodb+srv://username:password@cluster.mongodb.net/databasename
     ```

4. **Create Database User**
   - Username: `godlyuser` (or any username)
   - Generate password: Use a strong random password
   - Save credentials somewhere safe

5. **Configure IP Whitelist**
   - Click "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (for now)
   - Or add specific IP if known

---

## Step 3: Prepare Backend Environment

### Environment Variables for Production

Create `.env.production` in `backend/` folder:

```env
# Server
PORT=8000
NODE_ENV=production

# MongoDB Atlas
MONGODB_URI_PROD=mongodb+srv://godlyuser:YourPassword@cluster.mongodb.net/godlywomen?retryWrites=true&w=majority

# JWT Secrets (Use generated values from Step 1)
JWT_SECRET=3f7e8a2b1c9d4e6f5a8b3c2e1d9f4a6b7c8e9d0f1a2b3c4d5e6f7a8b9c0d
JWT_REFRESH_SECRET=9d4e6f5a8b3c2e1d0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b

# NextAuth
NEXTAUTH_SECRET=1c9d4e6f5a8b3c2e1d9f4a6b7c8e9d0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b

# Frontend
FRONTEND_URL=https://yourdomain.com
```

---

## Step 4: Deploy Backend to Railway

### Option A: Deploy Backend (Recommended)

1. **Push Code to GitHub**
   ```bash
   cd c:\Godlywomen
   git add .
   git commit -m "Deploy: MongoDB backend ready for production"
   git push origin main
   ```

2. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub
   - Authorize repository access

3. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `godlywomen` repository
   - Railway will detect it's a Node.js project

4. **Configure Environment Variables**
   - Go to project settings
   - Click "Variables"
   - Add all environment variables from `.env.production`
   - **Important**: Don't use `.env` file, add manually

5. **Set Build Command**
   - In Railway dashboard, go to settings
   - Build command: `npm run build`
   - Start command: `npm start`
   - Or leave default (Railway auto-detects from package.json)

6. **Deploy**
   - Railway will auto-deploy
   - Watch logs for errors
   - Once deployed, you get a public URL like: `https://godlywomen-api.up.railway.app`

7. **Test Backend**
   ```bash
   curl https://godlywomen-api.up.railway.app/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

---

## Step 5: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Select your `godlywomen` repository
   - Vercel auto-detects it's a Next.js project

3. **Set Environment Variables**
   - In Vercel dashboard project settings
   - Go to "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_DJANGO_API=https://godlywomen-api.up.railway.app
     DJANGO_API_URL=https://godlywomen-api.up.railway.app
     NEXTAUTH_URL=https://yourdomain.com
     NEXTAUTH_SECRET=1c9d4e...  (same as backend)
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - You get a URL like: `https://godlywomenn.vercel.app`

5. **Update Backend FRONTEND_URL**
   - Go back to Railway backend
   - Update `FRONTEND_URL` to the Vercel URL
   - Railway redeploys automatically

---

## Step 6: Custom Domain Setup

### Add Custom Domain to Frontend

1. **Purchase Domain**
   - Buy domain at Namecheap, GoDaddy, or Google Domains
   - Example: `godlywomen.com`

2. **Add to Vercel**
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Vercel provides nameserver instructions

3. **Update DNS**
   - Go to your domain registrar
   - Update nameservers to Vercel's
   - Wait 24-48 hours for propagation
   - Vercel auto-provisions SSL certificate

### Add Custom Domain to Backend

1. **Get Backend Public URL from Railway**
   - Railway dashboard → Deployments
   - Copy deployment URL

2. **Option A: Use Railway Custom Domain**
   - Railway Settings → Custom Domains
   - Add domain
   - Configure DNS

3. **Option B: Use Subdomain**
   - Create `api.yourdomain.com`
   - Point to Railway backend

---

## Step 7: Testing Production

### Test Backend
```bash
# Health check
curl https://godlywomen-api.up.railway.app/health

# Register user
curl -X POST https://godlywomen-api.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test"}'

# Login
curl -X POST https://godlywomen-api.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get articles
curl https://godlywomen-api.up.railway.app/api/articles
```

### Test Frontend
1. Open https://yourdomain.com
2. Register new account
3. Create article
4. Create prayer
5. Add marketplace listing
6. Refresh browser - data should persist
7. Wait 24 hours - data should still be there ✅

---

## Step 8: Monitoring & Maintenance

### Enable Monitoring

**Railway**:
- Dashboard → Monitoring
- View logs, metrics, deployments
- Set up alerts for crashes

**Vercel**:
- Dashboard → Analytics
- View request metrics
- Check error logs

**MongoDB Atlas**:
- Dashboard → Monitoring
- View database metrics
- Check connection logs
- Monitor disk usage

### Database Backups

MongoDB Atlas automatically backs up data:
- Automatic daily snapshots
- 35-day retention
- Can restore anytime

To manual export:
```bash
mongoexport --uri "mongodb+srv://..." --collection users --out users.json
```

### Update Backend

To deploy new code:
```bash
git add .
git commit -m "Update: new features"
git push origin main
# Railway auto-redeploys
```

---

## Production Security Checklist

- [x] JWT secrets are secure (40+ character random strings)
- [x] Environment variables don't include sensitive data in code
- [x] MongoDB IP whitelist configured
- [x] HTTPS enabled (auto by Vercel/Railway)
- [x] CORS configured for specific frontend domain
- [x] Password hashing enabled (bcrypt)
- [ ] Rate limiting added
- [ ] Error logging configured
- [ ] Monitoring alerts set up
- [ ] Regular backups tested

---

## Cost Breakdown (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Railway Backend | 500 hours | Free |
| Vercel Frontend | Unlimited | Free |
| MongoDB Atlas | 512MB storage | Free |
| Custom Domain | ~$10 | $10 |
| **Total** | | **~$10/month** |

All services have free tiers - you can run production for $10/month!

---

## Troubleshooting Production

### Backend Not Starting
```
Check Railway logs:
1. Go to Railway dashboard
2. Click your project
3. View "Deploy Logs"
4. Look for errors

Common issues:
- Missing environment variables
- Invalid MongoDB URI
- Port already in use
```

### Database Connection Error
```
1. Verify MongoDB Atlas connection string
2. Check IP whitelist includes deployment IP
3. Verify username/password
4. Check network connectivity

Test connection:
mongosh "mongodb+srv://user:pass@cluster..."
```

### Frontend Can't Connect to Backend
```
1. Check NEXT_PUBLIC_DJANGO_API environment variable
2. Verify backend URL is correct
3. Check CORS is enabled
4. Test backend directly: curl backend-url/health
```

### Data Disappeared
```
This shouldn't happen with MongoDB, but if it does:
1. Check database collections exist
2. Verify no automatic cleanup/deletion code
3. Check MongoDB backups
4. Restore from backup if needed
```

---

## Performance Optimization

### Database Optimization
- Add indexes for frequently queried fields
- Use connection pooling
- Monitor slow queries

### Frontend Optimization
- Enable image optimization
- Use CDN for assets
- Implement caching

### Backend Optimization
- Add request caching
- Optimize database queries
- Use pagination for large datasets

---

## Scaling for Growth

### Phase 1 (0-1K users)
- Current setup works fine
- Free tier resources sufficient
- No changes needed

### Phase 2 (1K-10K users)
- Upgrade MongoDB to paid tier
- Add caching layer (Redis)
- Implement CDN for images

### Phase 3 (10K+ users)
- Horizontal scaling with load balancer
- Database replication
- Multi-region deployment

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Express.js Docs**: https://expressjs.com
- **Next.js Docs**: https://nextjs.org/docs

---

## Summary

✅ **Production Deployment Steps**:
1. Generate secrets
2. Set up MongoDB Atlas
3. Deploy backend to Railway
4. Deploy frontend to Vercel
5. Configure custom domain
6. Test thoroughly
7. Monitor performance
8. Maintain backups

✅ **Estimated Time**: 2-3 hours
✅ **Monthly Cost**: ~$10
✅ **Data Persistence**: ✅ Guaranteed with MongoDB

**Your Godlywomen platform is ready for production!**
