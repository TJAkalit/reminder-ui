# SPA served by nginx; /api is proxied to the backend.
#   docker run -p 8080:80 -e API_UPSTREAM=http://api:8000 IMAGE
# API_UPSTREAM is a base URL without a path: the /api/... path is passed through as is.

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build \
    # The MSW worker is only for `npm run dev:mock`.
    && rm -f dist/mockServiceWorker.js


FROM nginx:1.29-alpine
LABEL org.opencontainers.image.source="https://github.com/TJAkalit/reminder-ui" \
      org.opencontainers.image.description="Reminder habit tracker: web UI"

ENV API_UPSTREAM=http://api:8000
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
