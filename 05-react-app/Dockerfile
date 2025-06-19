FROM node:22-alpine AS builder 

WORKDIR /app 

COPY package*.json . 
RUN npm ci 

COPY . .
RUN npm run build

FROM nginx:1.27.0

COPY --from=builder /app/build /usr/share/nginx/html 

