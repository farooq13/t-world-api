# T-World Mini API

A RESTful backend API for a mobile learning + profiles client, built with **Node.js**, **Express 5**, **TypeScript**, and **MongoDB Atlas**.

## Features

- JWT-based authentication (register / login)
- CRUD operations for learning items
- Save / unsave items to user profiles
- Input validation with `express-validator`
- Centralized error handling
- Rate limiting & security middleware (`helmet`, `cors`, `express-mongo-sanitize`)
- Structured logging with `winston`

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JSON Web Tokens (bcryptjs + jsonwebtoken) |
| Validation | express-validator |
| Testing | Jest + Supertest |
| CI | GitHub Actions |

## Project Structure

```
src/
├── config/        # Environment variable loader
├── controllers/   # Route handlers
├── db/            # MongoDB connection
├── middleware/     # Auth, error handler, rate limiter, validation
├── models/        # Mongoose schemas (User, Item, SavedItem)
├── routes/        # Express route definitions
├── scripts/       # Database seed script
├── services/      # Business logic
└── utils/         # AppError class, logger
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Yarn** (or npm)
- A **MongoDB Atlas** cluster (or local MongoDB instance)

### Installation

```bash
# Clone the repository
git clone https://github.com/farooq13/t-world-api.git
cd t-world-api

# Install dependencies
yarn install

# Create your environment file
cp .env.example .env
# Then open .env and fill in your MongoDB URI and JWT secret
```

### Running Locally

```bash
# Start the dev server (auto-restarts on file changes)
yarn dev

# Seed the database with sample items
yarn seed
```

The API will be available at `http://localhost:3000`.

### Building for Production

```bash
yarn build
yarn start
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGO_URI` | Yes | — | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | — | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | No | `1d` | Token expiry duration (e.g. `1d`, `2h`) |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | `development` / `production` / `test` |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window in ms (15 min) |
| `RATE_LIMIT_MAX` | No | `100` | Max requests per window per IP |

## Database Schema

### `users`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `email` | String | Unique, lowercase, indexed |
| `password` | String | Hashed with bcrypt, excluded from queries by default |
| `createdAt` | Date | Auto-managed by Mongoose |
| `updatedAt` | Date | Auto-managed by Mongoose |

### `items`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `title` | String | Required, max 200 chars |
| `description` | String | Required |
| `category` | String | Required, lowercase, **indexed** |
| `imageUrl` | String | Optional |
| `createdAt` | Date | Auto-managed |
| `updatedAt` | Date | Auto-managed |

### `saved_items`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `userId` | ObjectId | Ref → `users` |
| `itemId` | ObjectId | Ref → `items` |
| `savedAt` | Date | Defaults to `Date.now` |

**Indexes:** Compound unique index on `(userId, itemId)` to prevent duplicate saves.

## API Endpoints

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Returns `{ status: "ok" }` |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive a JWT |

### Items

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/items` | Public | List items (paginated, filterable by category) |
| `GET` | `/items/:id` | Public | Get a single item by ID |
| `POST` | `/items/:id/save` | Bearer | Save an item to your profile |
| `DELETE` | `/items/:id/save` | Bearer | Remove a saved item |

### User Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/me/saved` | Bearer | Get your saved items |

## curl Examples

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "testing123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "testing123"}'
```

### Get Items (with pagination & category filter)

```bash
curl "http://localhost:3000/items?page=1&limit=5&category=programming"
```

### Get Single Item

```bash
curl http://localhost:3000/items/<item_id>
```

### Save an Item (requires token)

```bash
curl -X POST http://localhost:3000/items/<item_id>/save \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Remove a Saved Item

```bash
curl -X DELETE http://localhost:3000/items/<item_id>/save \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Get My Saved Items

```bash
curl http://localhost:3000/me/saved \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start dev server with hot-reload |
| `yarn build` | Compile TypeScript to `dist/` |
| `yarn start` | Run compiled production build |
| `yarn seed` | Populate database with sample items |
| `yarn test` | Run Jest test suite |
| `yarn lint` | Lint and auto-fix with ESLint |

## License

MIT
