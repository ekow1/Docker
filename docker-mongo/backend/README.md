# Docker MongoDB + Hono Backend

A simple Node.js backend built with Hono framework that connects to a MongoDB database running in Docker.

## Features

- 🚀 Fast Hono web framework
- 🍃 MongoDB integration with Docker
- 👥 User CRUD operations
- 🔒 CORS enabled
- 📝 Request logging
- 🛡️ Error handling
- ⚡ ES modules support

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- MongoDB running in Docker (see root `docker-compose.yml`)

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your MongoDB credentials:
   ```env
   MONGO_USER=admin
   MONGO_PASSWORD=password
   MONGO_DB=myapp
   MONGO_PORT=27017
   PORT=3000
   NODE_ENV=development
   ```

3. **Start MongoDB (from root directory):**
   ```bash
   docker-compose up -d
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /` - Server health check

### Users API
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Example Usage

### Create a user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Get all users
```bash
curl http://localhost:3000/api/users
```

### Get user by ID
```bash
curl http://localhost:3000/api/users/USER_ID_HERE
```

### Update user
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'
```

### Delete user
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID_HERE
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── models/
│   │   └── user.js          # User model
│   ├── routes/
│   │   └── users.js         # User routes
│   └── index.js             # Main application
├── package.json
├── env.example
└── README.md
```

## Development

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_USER` | MongoDB username | `admin` |
| `MONGO_PASSWORD` | MongoDB password | `password` |
| `MONGO_DB` | Database name | `myapp` |
| `MONGO_PORT` | MongoDB port | `27017` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
