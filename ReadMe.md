# File Processing API

A Node.js/Express-based file processing system using PostgreSQL, BullMQ, and Redis. Upload files, process them in the background, and track progress.

---

## 🚀 How to Run Locally

### Prerequisites

- Node.js >= 18
- PostgreSQL either locally or in a Docker container
- Redis either locally or in a Docker container
- Docker (optional, for running PostgreSQL and Redis)
- (Optional) pnpm/yarn/npm

### 1. Clone the Repo

```bash
git clone https://github.com/Harivansh-coder/file-upload-nodejs.git
cd file-upload-nodejs
```

### 2. Install Dependencies

```bash
# Using npm
npm install
# Using yarn
yarn install
# Using pnpm
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=8080
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb
JWT_SECRET_KEY=your_jwt_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Start PostgreSQL and Redis

You can use Docker to run PostgreSQL and Redis:

```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres
docker run --name redis -d -p 6379:6379 redis
```

### 5. Run Migrations

```bash
# Using npm
npm run migrate
# Using yarn
yarn migrate
# Using pnpm
pnpm migrate
```

### 6. Start the Server

```bash
# Using npm
npm run dev
# Using yarn
yarn dev
# Using pnpm
pnpm dev
```

### 7. Start the Worker

```bash
# Using npm
npm run worker
# Using yarn
yarn worker
# Using pnpm
pnpm worker
```

### 8. Test the API

You can use Postman or any other API testing tool to test the endpoints.

- **Login User**: `POST /api/auth/login`

```
curl --location 'localhost:8080/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email" : "demo@gmail.com",
    "password" : "12345678"
}'
```

- **Register User**: `POST /api/auth/register`

```
curl --location 'localhost:8080/api/auth/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name" : "abc",
    "email": "hello@gmail.com",
    "password": "12345678"
}'
```

- **Upload File**: `POST /api/files/upload`

```
curl --location 'localhost:8080/api/files/upload' \
--header 'Authorization: Bearer token' \
--form 'file=@"path/to/your/file.txt"'
```

- **Get File Status**: `GET /api/files/:id`

```
curl --location 'localhost:8080/api/files/cmaturxz20004u4jwzxszz5ud' \
--header 'Authorization: Bearer token'
```
