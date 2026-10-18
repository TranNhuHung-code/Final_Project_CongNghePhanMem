
# Giai đoạn 1: Biên dịch Pug thành HTML
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY views ./views
COPY assets ./assets

RUN npm run build

# Giai đoạn 2: Chạy website bằng Nginx
FROM nginx:alpine

ENV BACKEND_HOST=backend

COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=build /app/assets/ /usr/share/nginx/html/assets/
COPY --from=build /app/*.html /usr/share/nginx/html/

EXPOSE 80
