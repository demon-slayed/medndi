# --- Build the static site ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Same-origin by default: nginx below proxies /api to the backend
ARG VITE_BASE_URL=/api
ENV VITE_BASE_URL=${VITE_BASE_URL}
RUN npm run build

# --- Serve it with nginx ---
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
