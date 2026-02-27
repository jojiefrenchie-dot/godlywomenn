# Render Backend Setup with Your PostgreSQL Database

## Current Status
- ✅ PostgreSQL database created on Render (Oregon region)
- ✅ Database connection string ready
- ⏳ Backend needs DATABASE_URL configured
- ⏳ Migrations need to be run

## Your Database Connection

```
postgresql://godly_user:NCNP1mgoTWQQU64XY98wlXvRAIQuzzMd@dpg-d5nah2f5r7bs73dl9mu0-a.oregon-postgres.render.com/godlywomen_db
```

---

## IMMEDIATE ACTION REQUIRED

### 1️⃣ Set DATABASE_URL in Render Backend (2 minutes)

```
Platform: Render Dashboard
Service: godlywomenn (your backend)
→ Settings → Environment
→ Add Environment Variable
→ Key: DATABASE_URL
→ Value: [paste your connection string above]
→ Save
```

**The backend will auto-redeploy. Watch the logs to confirm.**

### 2️⃣ Run Migrations (2 minutes)

After backend is redeployed:

```
Platform: Render Dashboard
Database: [your PostgreSQL database]
→ Shell
→ Run: cd /var/www/backend && python manage.py migrate
```

**Confirm all migrations apply successfully.**

### 3️⃣ Verify Connection (1 minute)

In PostgreSQL Shell:
```bash
cd /var/www/backend && python manage.py shell
```

In Python:
```python
from django.db import connection
connection.ensure_connection()
print("✓ Connected!")
exit()
```

### 4️⃣ Test Data Persistence (5 minutes)

1. Create user account
2. Create article/prayer/listing
3. Wait 5 minutes
4. Refresh page
5. Data should still be there ✅

---

## Detailed Instructions for Render

### Add DATABASE_URL

1. Open Render Dashboard: https://dashboard.render.com
2. Find your backend service: `godlywomenn`
3. Click the service name to open it
4. Go to **Settings** tab (at the top)
5. Scroll to **Environment** section
6. Click **Add Environment Variable**
7. Enter:
   ```
   Key: DATABASE_URL
   Value: postgresql://godly_user:NCNP1mgoTWQQU64XY98wlXvRAIQuzzMd@dpg-d5nah2f5r7bs73dl9mu0-a.oregon-postgres.render.com/godlywomen_db
   ```
8. Click **Save**
9. Service will redeploy automatically
10. Watch **Logs** tab - should see service restarting

### Verify Service is Running

After redeploy completes (2-3 minutes):
1. Go back to your backend service
2. Look for "Your service is live at: https://godlywomenn.onrender.com"
3. Logs should show no errors

### Run Migrations

1. Go to your PostgreSQL database in Render
2. Find the **Shell** tab at the top
3. Paste this command:
   ```bash
   cd /var/www/backend && python manage.py migrate
   ```
4. Press Enter and wait for completion
5. Should show:
   ```
   Running migrations:
     Applying [...multiple migrations...] OK
   [SUCCESS] All migrations applied!
   ```

### Access Your Database Directly

To browse the database or run SQL commands:

1. Stay in PostgreSQL Shell or use an external tool
2. Connect with:
   - Host: dpg-d5nah2f5r7bs73dl9mu0-a.oregon-postgres.render.com
   - Port: 5432
   - Database: godlywomen_db
   - User: godly_user
   - Password: NCNP1mgoTWQQU64XY98wlXvRAIQuzzMd

---

## Common Issues

**Issue:** "could not connect to server"
- Wait 2-3 min for backend to redeploy with DATABASE_URL
- Check Logs tab for connection errors
- Verify DATABASE_URL is set exactly as shown above

**Issue:** Migrations fail with permission errors
- Check PostgreSQL database exists
- Try connecting directly in Shell: `psql [your-connection-string]`
- Reset your backend service if needed

**Issue:** Data still disappears
- Verify DATABASE_URL is in Environment Variables
- Check backend logs show "Using postgresql"
- Ensure migrations completed successfully
- Check database has data in tables

---

## How to Monitor

**Backend Service:**
1. Render Dashboard → godlywomenn service
2. Watch **Logs** tab in real-time
3. Check **Metrics** for CPU/memory usage

**PostgreSQL Database:**
1. Render Dashboard → your PostgreSQL database
2. Click **Connections** to see active connections
3. Click **Metrics** for database performance
4. View **Usage** for storage/CPU

---

## Success Indicators ✅

After setup, you should see:

- [ ] Backend service shows "Your service is live"
- [ ] No errors in backend Logs
- [ ] Migrations completed (all OK)
- [ ] Can create user account
- [ ] Can create article
- [ ] Can create prayer request
- [ ] Can create marketplace listing
- [ ] Data persists after refresh
- [ ] Data persists after container restart

If all checked, **you're done!** 🎉

---

## Quick Status Check

**To verify PostgreSQL is active:**

1. Frontend → Create Account
2. Dashboard → Write Article
3. Check backend logs show database queries
4. Refresh page - article should still be there
5. Wait 5 minutes, refresh again - still there?
6. **SUCCESS!** Data persisting! 🎉

---

## Support

If something doesn't work:

1. Check the error message in Logs
2. Try running migrations again
3. Restart the backend service
4. Check DATABASE_URL is formatted correctly
5. Verify PostgreSQL database is in "Available" state

Your database is ready. Just need to configure the environment variable!
