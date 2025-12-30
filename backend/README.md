Django backend for Godlywomen (minimal local dev)

Quickstart (PowerShell, from project root):

# 1. Create and activate venv
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run migrations
python manage.py makemigrations
python manage.py migrate

# 4. Create superuser (optional)
python manage.py createsuperuser

# 5. Run server
python manage.py runserver 8000

API endpoints:
- POST /api/auth/register/  -> { name, email, password }
- POST /api/auth/token/     -> { email, password }  (returns access + refresh tokens)
- GET  /api/auth/me/        -> auth required
- GET/POST /api/articles/   -> list or create article (create requires auth header 'Authorization: Bearer <token>')

Notes:
- This uses sqlite for local dev. If you want Postgres, update DATABASES in backend_project/settings.py and install psycopg2-binary.
- CORS is wide-open for development.
