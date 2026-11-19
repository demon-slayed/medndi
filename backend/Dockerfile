FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# bcrypt ships prebuilt binaries for alpine; build tools are only a fallback
RUN apk add --no-cache --virtual .build-deps python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev && apk del .build-deps

COPY . .
RUN mkdir -p uploads

EXPOSE 8080

# Seed demo data only on a fresh database, then start the API
CMD ["sh", "-c", "node scripts/seed.js --if-empty && node server.js"]
