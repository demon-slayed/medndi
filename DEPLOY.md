# Deploying MedNDI

One command starts MongoDB, the API and the web app with Docker Compose.
On first start the database is seeded with the demo hospitals, treatments,
hotels and insurance plans from `backend/data/*.json`.
Later restarts and redeploys never overwrite existing data.

## Server requirements

- Linux server with Docker Engine and the Docker Compose plugin
  (`docker compose version` should work)
- Port 80 open (or, behind your own nginx, any free local port; see below)
- About 2 GB RAM

## Get the code on the server

```sh
git clone <your-repo-url> medndi
cd medndi
```

Everything needed is in this repo: `backend/`, `frontend/`, `docker-compose.yml`
and `deploy.sh`.

## Deploy

```sh
./deploy.sh
```

It creates `.env` with a random login secret (first run only), builds the
images, starts everything and waits until the site responds. Then open
`http://<server-ip>`.

Demo logins:

| Role    | Email                | Password    |
|---------|----------------------|-------------|
| Patient | patient@medndi.test  | Patient@123 |
| Admin   | admin@medndi.test    | Admin@123   |

Change these passwords before sharing the site publicly.

## With your own nginx + Let's Encrypt (recommended)

Before you start, point DNS A records for `medndi.com` and `www.medndi.com` at the server IP.

1. In `.env`, make the app listen only on localhost and enable secure cookies:
   ```
   APP_BIND=127.0.0.1
   APP_PORT=8081
   COOKIE_SECURE=true
   ```
2. Run `./deploy.sh`.
3. Add the site to your host nginx (already set up for medndi.com and www.medndi.com):
   ```sh
   sudo cp nginx-medndi.conf /etc/nginx/sites-available/medndi
   sudo ln -s /etc/nginx/sites-available/medndi /etc/nginx/sites-enabled/medndi
   sudo nginx -t && sudo systemctl reload nginx
   ```
4. Get the certificate (certbot adds HTTPS and the http→https redirect):
   ```sh
   sudo certbot --nginx -d medndi.com -d www.medndi.com
   ```
5. Open `https://medndi.com`.

Only port 443/80 on the host nginx is public; the containers are reachable
from localhost only.

## Emails to users

MedNDI emails users when they sign up, log in, submit a booking and submit a
post-care request, from `info@medndi.com` (GoDaddy Professional Email).

1. Add the mailbox password to `.env` (the other mail settings are already filled in):
   ```
   SMTP_PASS=<password of info@medndi.com>
   ```
2. Apply it: `./deploy.sh`
3. Check the login works: `docker compose exec backend npm run mail:check`
   (prints `SMTP login OK`).
4. Watch sending: `docker compose logs -f backend | grep "\[mail\]"`

If the check times out, the server's provider may block outgoing mail ports;
try `SMTP_PORT=587` in `.env`, then run `./deploy.sh` again.

## Update to new code

```sh
git pull
./deploy.sh
```

Data is kept; only the containers are rebuilt.

## Common tasks

| Task                               | Command                                              |
|------------------------------------|------------------------------------------------------|
| See status                         | `docker compose ps`                                  |
| View API logs                      | `docker compose logs -f backend`                     |
| Reset demo data (wipes bookings)   | `docker compose exec backend npm run seed`           |
| Stop                               | `docker compose down`                                |
| Stop and delete all data           | `docker compose down -v`                             |
| Back up the database               | `docker compose exec mongo mongodump --archive > backup.archive` |

## Settings (`.env`)

- `GEMINI_API_KEY`: enables the medical report analyser.
- `COOKIE_SECURE=true`: set this once the site is served over HTTPS
  (for example behind Caddy, Traefik or a load balancer that terminates TLS).
- `APP_PORT`: the port the site listens on (default 80).
- `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`: optional Cloudinary
  storage for uploads; without them files are kept in a Docker volume.

MongoDB is only reachable from inside the Docker network; it is not exposed
on the server.
