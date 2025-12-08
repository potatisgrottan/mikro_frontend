# Steg 1: Bygg React-appen
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Sätt en flagga för att undvika sourcemap-fel om minnet är lågt
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Steg 2: Servera med Nginx
FROM nginx:stable-alpine

# Ta bort standardkonfigurationen
RUN rm /etc/nginx/conf.d/default.conf

# Skapa en ny Nginx-konfiguration direkt i Dockerfile
# Detta säkerställer att vi har rätt fallback för React Router (SPA)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Kopiera byggfilerna från steg 1
COPY --from=build /app/build /usr/share/nginx/html

# Exponera port 80 (standard för Nginx)
EXPOSE 80

# Starta Nginx
CMD ["nginx", "-g", "daemon off;"]