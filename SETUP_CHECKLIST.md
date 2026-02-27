# ✅ POSTGRESQL MIGRATION CHECKLIST

## CURRENT STATUS
- [x] Django backend updated to support PostgreSQL
- [x] psycopg2-binary installed and verified
- [x] Automatic fallback to SQLite configured
- [x] Documentation created and guides provided
- [x] Configuration tested and verified

## YOUR IMMEDIATE ACTIONS (5 minutes)

### 1. Create PostgreSQL Database on Render
- [ ] Go to https://dashboard.render.com
- [ ] Click "New" → "PostgreSQL"
- [ ] Set:
  - Name: `godlywomen-db`
  - Database: `godlywomen_db`
  - User: `godly_user`
  - Region: Ohio (match your backend)
- [ ] Click "Create Database"
- [ ] ⏳ Wait 2-3 minutes for provisioning

### 2. Get Database Connection String
- [ ] Click on your new PostgreSQL database
- [ ] Copy "External Database URL"
- [ ] It looks like: `postgresql://user:password@host:port/dbname`

### 3. Update Backend Service
- [ ] Go to your backend service (`godlywomenn`)
- [ ] Click "Settings" → "Environment"
- [ ] Add environment variable:
  - Key: `DATABASE_URL`
  - Value: `postgresql://...` (paste from step 2)
- [ ] Click "Save"
- [ ] ⏳ Service redeploys automatically (2 min)

### 4. Run Migrations
- [ ] Go to PostgreSQL database → "Shell"
- [ ] Run: `python manage.py migrate`
- [ ] Verify: "All migrations applied" message

### 5. Verify Data Persistence
- [ ] Create a test user in your app
- [ ] Create a test article
- [ ] Wait 5 minutes
- [ ] Refresh and verify data still exists ✓

## AFTER SETUP

### Testing
- [ ] Users can create accounts
- [ ] Users can post articles
- [ ] Users can create prayers
- [ ] Users can list marketplace items
- [ ] Users can send messages
- [ ] Data persists after app restart
- [ ] No more "data disappeared" issues

### Monitoring
- [ ] Check Render dashboard weekly
- [ ] Monitor PostgreSQL CPU usage
- [ ] Monitor connection count
- [ ] Check backups are being created

### Optional: Local PostgreSQL (15 minutes)
If you want to use PostgreSQL locally for development:

- [ ] Install PostgreSQL on your computer
- [ ] Create `.env` file in `backend/`:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=godlywomen_db
  DB_USER=godly_user
  DB_PASSWORD=your_password
  ```
- [ ] Run: `python manage.py migrate`
- [ ] Test locally: `python manage.py runserver`

## REFERENCE DOCUMENTS

Start with these in order:

1. **QUICK_POSTGRES_SETUP.md** ← START HERE (5 minutes)
   - Fast track to fixing data loss
   
2. **POSTGRESQL_VISUAL_GUIDE.txt**
   - Visual diagrams and explanations
   
3. **POSTGRES_PRODUCTION_GUIDE.md**
   - Detailed production setup
   
4. **POSTGRES_SETUP_GUIDE.txt**
   - Comprehensive local setup
   
5. **POSTGRESQL_MIGRATION_SUMMARY.md**
   - Complete overview

## TROUBLESHOOTING

If something goes wrong:

### Error: "could not connect to server"
- [ ] Check DATABASE_URL is set correctly
- [ ] Verify PostgreSQL database exists on Render
- [ ] Wait 5 more minutes for Render to finish provisioning
- [ ] Check service logs

### Error: "database does not exist"
- [ ] Database creation failed
- [ ] Try creating PostgreSQL again on Render

### Data still disappearing
- [ ] Verify DATABASE_URL environment variable is set
- [ ] Check it's using PostgreSQL (not SQLite)
- [ ] Look at service logs for errors
- [ ] Contact Render support if connection issues

### migrations won't run
- [ ] Make sure PostgreSQL database is created
- [ ] Check user permissions
- [ ] Verify database name matches in DATABASE_URL

## SUCCESS INDICATORS ✓

After setup, you should see:
- ✓ Can create user account
- ✓ Can post article
- ✓ Article appears in list
- ✓ Data survives app restart
- ✓ No more "data disappeared" errors
- ✓ Performance is good
- ✓ Multiple users can work simultaneously

## SUPPORT

- **Quick help**: Check QUICK_POSTGRES_SETUP.md
- **Visual guide**: See POSTGRESQL_VISUAL_GUIDE.txt  
- **Detailed guide**: Read POSTGRES_PRODUCTION_GUIDE.md
- **Local setup**: See POSTGRES_SETUP_GUIDE.txt
- **Technical**: Check backend/settings.py

## TIMELINE

| When | Action | Time |
|------|--------|------|
| Now | Read QUICK_POSTGRES_SETUP.md | 2 min |
| Now | Create PostgreSQL on Render | 3 min |
| Now | Set DATABASE_URL | 1 min |
| Now | Run migrations | 1 min |
| Total | **All done!** | **7 minutes** |

## FINAL NOTES

✓ Your backend code is ready
✓ Zero code changes needed in your Next.js frontend
✓ API endpoints stay exactly the same
✓ User experience unchanged
✓ Just need to set up the database

**After these steps, your data loss issue is COMPLETELY SOLVED!**

Data will now persist forever, even if the app restarts multiple times.

---

**Ready? Start with: QUICK_POSTGRES_SETUP.md**
