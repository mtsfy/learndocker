FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci 

FROM gcr.io/distroless/nodejs22
WORKDIR /app
COPY --from=builder /app/node_modules node_modules
COPY src src
ENV PORT=5000

CMD ["src/index.js"]
