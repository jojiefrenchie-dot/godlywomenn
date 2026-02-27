# PostgreSQL Setup - Your Connection Ready ✅

## Your Database Details

**Connection String (External):**
```
postgresql://godly_user:NCNP1mgoTWQQU64XY98wlXvRAIQuzzMd@dpg-d5nah2f5r7bs73dl9mu0-a.oregon-postgres.render.com/godlywomen_db
```

**Host:** dpg-d5nah2f5r7bs73dl9mu0-a.oregon-postgres.render.com
**Port:** 5432
**Database:** godlywomen_db
**User:** godly_user
**Region:** Oregon

---

## STEP 1: Add DATABASE_URL to Render Backend

1. Go to https://dashboard.render.com
2. Click on your backend service: **`godlywomenn`**
3. Click **Settings** → **Environment**
4. Click **Add Environment Variable**
5. Fill in:
   - **Key:** `DATABASE_URL`
   - **Value:** 
   ```
   postgresql://godly_user:NCNP1mgoTWQQU64XY98wlXvRAIQuzzMd@dpg-d5nah2f5r7bs73dl9mu0-a.oregon-postgres.render.com/godlywomen_db
   ```
6. Click **Save**
7. ⏳ Service will auto-redeploy (2-3 minutes)

**Watch the "Logs" tab to confirm successful restart**

---

## STEP 2: Run Migrations

After service finishes redeploying:

1. Go to your **PostgreSQL database** in Render
2. Click the **Shell** tab at the top
3. Paste this command:
```bash
cd /var/www/backend && python manage.py migrate
```
4. Press Enter
5. ✅ You should see migrations applying:
   ```
   Running migrations:
     Applying contenttypes.0001_initial... OK
     Applying auth.0001_initial... OK
     ...
     Applying articles.0008_create_default_categories... OK
   ```

---

## STEP 3: Verify Database Connection

In the PostgreSQL Shell, run:
```bash
cd /var/www/backend && python manage.py shell
```

Then in Python shell:
```python
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute("SELECT 1")
    print("✓ PostgreSQL connected successfully!")
exit()
```

---

## STEP 4: Test Data Persistence

### Create Test Data:

1. Go to your frontend: https://godlywomenn.vercel.app
2. Sign up for a new account (or use existing)
3. Create an article:
   - Go to Dashboard → Articles → New Article
   - Fill in title, excerpt, content, category
   - Add an image
   - Click "Publish Article"
4. Create a prayer:
   - Go to Prayers
   - Click "Share a Prayer"
   - Fill details
   - Submit

### Verify Data Persists:

1. Wait 5-10 minutes
2. Trigger a backend redeploy (make any change in code, or just wait)
3. Refresh the frontend
4. **Data should STILL BE THERE** ✅

---

## What This Means

✅ **Before:** Data disappeared on restart
✅ **After:** Data persists forever

Your application is now **production-ready**!

---

## Monitoring

To check database status anytime:

1. Go to Render Dashboard
2. Click your PostgreSQL database
3. View:
   - **Status:** Should show "Available"
   - **Metrics:** CPU, Memory, Storage usage
   - **Logs:** Any connection issues

---

## Troubleshooting

### "ERROR: could not connect to server"
- Wait 2-3 minutes for service to redeploy
- Check DATABASE_URL is set in Environment Variables
- Check service logs for connection errors

### "permission denied" error
- Verify password in DATABASE_URL is correct
- Check database URL format is exact

### Migrations fail
- Check PostgreSQL Shell shows connection working
- Verify migrations ran without errors

---

## Database Ready! 🎉

Your PostgreSQL database is now connected and ready.
Data will persist across all restarts and restarts.

**Next:** Verify with the steps above and enjoy your persistent database!
