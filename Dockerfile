# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY myapp/package.json myapp/package-lock.json* ./
RUN npm ci --ignore-scripts

COPY myapp/ .

ARG VITE_API_URL
ARG VITE_APP_COOKIE_DOMAIN
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_COOKIE_DOMAIN=${VITE_APP_COOKIE_DOMAIN}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

RUN npm run build

# Stage 2: Production
FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
