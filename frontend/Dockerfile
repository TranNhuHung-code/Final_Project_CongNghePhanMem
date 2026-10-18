
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

COPY --from=build /app/assets/ /usr/share/nginx/html/assets/
COPY --from=build /app/*.html /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
