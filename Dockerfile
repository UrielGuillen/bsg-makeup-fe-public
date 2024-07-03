FROM node:18.18.2-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .

RUN npm run build-docker

FROM nginx:alpine

COPY --from=build-stage /app/dist/bsg-makeup-fe /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
