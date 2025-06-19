FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci 

COPY src src 
COPY tsconfig.json tsconfig.json
RUN npm run build

FROM gcr.io/distroless/nodejs22
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/dist dist
ENV PORT=5000

CMD ["dist/index.js"]

