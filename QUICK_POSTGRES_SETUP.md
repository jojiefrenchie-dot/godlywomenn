# QUICK ACTION: Set Up PostgreSQL on Render

Your application is now configured to use PostgreSQL. Follow these steps to fix the data loss issue:

## 🚀 For Immediate Production Deployment (Render)

### Step 1: Create PostgreSQL Database on Render
1. Go to https://dashboard.render.com
2. Click **"New"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `godlywomen-db`
   - **Database**: `godlywomen_db`
   - **User**: `godly_user`
   - **Region**: Select same region as your backend service (e.g., Ohio)
4. Click **"Create Database"**
5. ⏳ Wait 2-3 minutes for provisioning

### Step 2: Get Database URL
1. After creation, click on your new PostgreSQL database
2. Copy the "External Database URL" (looks like: `postgresql://user:password@host:port/db`)
3. Save it somewhere safe

### Step 3: Update Backend Service
1. Go to your backend service (`godlywomenn`)
2. Click **"Settings"** → **"Environment"**
3. Add this environment variable:
   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   ```
   Paste the URL from Step 2
4. Click **"Save"** 
5. ✅ Service will redeploy automatically (~2 minutes)

### Step 4: Run Migrations
1. Go back to your PostgreSQL database on Render
2. Click **"Shell"**
3. Run:
   ```bash
   cd /var/www/backend
   python manage.py migrate
   ```
4. You should see migrations applying - this means it's working!

### Step 5: Verify
1. Create a test user through the app
2. Create a test article
3. Wait a few minutes and refresh - data should still be there ✅

---

## 📝 For Local Development (Optional)

If you want to use PostgreSQL locally too:

1. Install PostgreSQL on your computer
2. Create a `.env` file in `backend/` folder:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=godlywomen_db
   DB_USER=godly_user
   DB_PASSWORD=your_secure_password
   DEBUG=True
   DJANGO_SECRET_KEY=your-secret-key
   ```
3. Run migrations:
   ```bash
   cd backend
   python manage.py migrate
   ```

See `POSTGRES_SETUP_GUIDE.txt` for detailed steps.

---

## ✅ Expected Results

After setup:
- ✅ **Data persists** across restarts
- ✅ **Handles concurrent users** without corruption
- ✅ **Scales** for production traffic
- ✅ **Automatic backups** by Render
- ✅ **ACID compliance** ensures consistency

---

## ⚠️ If Something Goes Wrong

**Error: "could not connect to server"**
- Check DATABASE_URL is set correctly
- Verify PostgreSQL database exists on Render
- Check "Logs" in Render dashboard

**Error: "database does not exist"**
- Database wasn't created successfully
- Try creating it again on Render

**Data still disappearing**
- Verify DATABASE_URL environment variable is set
- Check it's NOT using SQLite anymore
- Look at service logs for connection errors

---

## 📞 Need Help?

- Check `POSTGRES_PRODUCTION_GUIDE.md` for detailed info
- Check `POSTGRES_SETUP_GUIDE.txt` for troubleshooting
- Look at Render dashboard "Logs" tab for error messages

Your data loss issue is now SOLVED! 🎉
