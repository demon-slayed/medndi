# MedNDI

Medical-tourism platform for treatment in India: patients browse hospitals and
treatments across Delhi NCR, Bengaluru and Pune, book a treatment with hotel,
travel and insurance options, and track their application. Admins manage
hospitals, treatments, hotels and application status.

## Repository layout

| Path | What it is |
|------|------------|
| `backend/` | Express + MongoDB API (`/api/...`), seed script and demo data in `backend/data/` |
| `frontend/` | React + Vite + Tailwind web app |
| `docker-compose.yml`, `deploy.sh` | One-command production deploy (MongoDB + API + web) |
| `DEPLOY.md` | Server setup, including nginx + Let's Encrypt for medndi.com |

## Run locally

Requires Node 20+ and MongoDB running on `localhost:27017`.

```sh
# API on http://localhost:8080
cd backend
cp .env.example .env          # then set JWT_SECRET_KEY
npm install
npm run seed                  # loads hospitals, treatments, hotels and demo users
npm run server

# Web app on http://localhost:5173 (in a second terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

Demo logins:

| Role    | Email               | Password    |
|---------|---------------------|-------------|
| Patient | patient@medndi.test | Patient@123 |
| Admin   | admin@medndi.test   | Admin@123   |

## Deploy

See [DEPLOY.md](DEPLOY.md). In short, on a server with Docker:

```sh
git clone <your-repo-url> medndi && cd medndi
./deploy.sh
```
