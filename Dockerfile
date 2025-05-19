FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

# Run migrations at container start so DATABASE_URL is available
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
