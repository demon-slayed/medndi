#!/usr/bin/env sh
# One-command deploy for MedNdi: builds and starts MongoDB, the API and the web app.
# Safe to re-run after pulling new code; data is kept in Docker volumes.
set -eu

cd "$(dirname "$0")"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed. Install it first: https://docs.docker.com/engine/install/" >&2
  exit 1
fi
if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose v2 is required (the 'docker compose' command)." >&2
  exit 1
fi

for dir in backend frontend; do
  if [ ! -d "$dir" ]; then
    echo "Missing ./$dir next to this script. See DEPLOY.md for the folder layout." >&2
    exit 1
  fi
done

if [ ! -f .env ]; then
  echo "Creating .env with a fresh JWT secret..."
  cp .env.example .env
  secret=$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')
  sed -i.bak "s/^JWT_SECRET_KEY=.*/JWT_SECRET_KEY=$secret/" .env && rm -f .env.bak
fi

echo "Building and starting containers (first run takes a few minutes)..."
docker compose up -d --build

port=$(grep -E '^APP_PORT=' .env | cut -d= -f2)
port=${port:-80}

echo "Waiting for the app to come up..."
i=0
until curl -fsS "http://localhost:$port/api/hospitals" >/dev/null 2>&1; do
  i=$((i + 1))
  if [ "$i" -ge 60 ]; then
    echo "The app did not respond in time. Check: docker compose logs backend" >&2
    exit 1
  fi
  sleep 3
done

echo ""
bind=$(grep -E '^APP_BIND=' .env | cut -d= -f2)
if [ "${bind:-0.0.0.0}" = "127.0.0.1" ]; then
  echo "MedNdi is running on 127.0.0.1:$port. Point your nginx site at it (see nginx-medndi.conf)."
else
  echo "MedNdi is running on port $port (http://<this-server-ip>:$port)"
fi
echo "Demo logins:  patient@medndi.test / Patient@123   admin@medndi.test / Admin@123"
echo "Reset demo data:  docker compose exec backend npm run seed"
