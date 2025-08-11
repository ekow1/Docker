# Docker MongoDB + Hono Backend

A complete stack with MongoDB running in Docker and a Node.js backend built with Hono framework.

## 🚀 Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd docker-mongo
   ```

2. **Set up environment variables:**
   ```bash
   cp backend/env.example backend/.env
   ```
   
   Edit `backend/.env` with your preferred values:
   ```env
   MONGO_USER=admin
   MONGO_PASSWORD=password
   MONGO_DB=myapp
   MONGO_PORT=27017
   PORT=3000
   NODE_ENV=development
   ```

3. **Start the entire stack with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **Access your application:**
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/
   - Users API: http://localhost:3000/api/users

## 🏗️ Architecture

```
docker-mongo/
├── docker-compose.yml          # Main orchestration
├── backend/                    # Node.js + Hono application
│   ├── src/
│   │   ├── config/database.js  # MongoDB connection
│   │   ├── models/user.js      # User model
│   │   ├── routes/users.js     # API routes
│   │   └── index.js            # Main app
│   ├── Dockerfile              # Backend container
│   ├── package.json            # Dependencies
│   └── README.md               # Backend docs
└── README.md                   # This file
```

## 🐳 Services

### MongoDB
- **Container:** `mongo_container`
- **Port:** 27017 (configurable via `MONGO_PORT`)
- **Database:** Configurable via `MONGO_DB`
- **Credentials:** Configurable via `MONGO_USER` and `MONGO_PASSWORD`

### Backend API
- **Container:** `backend_container`
- **Port:** 3000 (configurable via `BACKEND_PORT`)
- **Framework:** Hono (fast, lightweight web framework)
- **Database:** MongoDB

## 📡 API Endpoints

### Health Check
```bash
GET http://localhost:3000/
```

### Users API
```bash
# Get all users
GET http://localhost:3000/api/users

# Get user by ID
GET http://localhost:3000/api/users/:id

# Create user
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

# Update user
PUT http://localhost:3000/api/users/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

# Delete user
DELETE http://localhost:3000/api/users/:id
```

## 🛠️ Development

### Running Backend Locally (without Docker)
```bash
cd backend
npm install
npm run dev
```

### Running MongoDB Locally (without Docker)
```bash
# Start MongoDB container only
docker-compose up mongo -d

# Then run backend locally
cd backend
npm run dev
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f mongo
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_USER` | MongoDB username | `admin` |
| `MONGO_PASSWORD` | MongoDB password | `password` |
| `MONGO_DB` | Database name | `myapp` |
| `MONGO_PORT` | MongoDB port | `27017` |
| `BACKEND_PORT` | Backend API port | `3000` |
| `NODE_ENV` | Environment | `development` |

### Docker Compose Override

You can create a `docker-compose.override.yml` file for development-specific settings:

```yaml
version: '3.8'
services:
  backend:
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

## 🧪 Testing the API

### Using curl
```bash
# Health check
curl http://localhost:3000/

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'

# Get all users
curl http://localhost:3000/api/users
```

### Using a REST client
Import these endpoints into Postman, Insomnia, or your preferred REST client:

```json
{
  "name": "Docker MongoDB + Hono API",
  "baseUrl": "http://localhost:3000",
  "endpoints": [
    {
      "name": "Health Check",
      "method": "GET",
      "url": "/"
    },
    {
      "name": "Get Users",
      "method": "GET",
      "url": "/api/users"
    },
    {
      "name": "Create User",
      "method": "POST",
      "url": "/api/users",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

## 🚀 Production Deployment

For production, consider:

1. **Security:**
   - Use strong passwords
   - Enable MongoDB authentication
   - Use environment-specific configs
   - Add rate limiting

2. **Monitoring:**
   - Add health checks
   - Set up logging
   - Monitor performance

3. **Scaling:**
   - Use MongoDB replica sets
   - Add load balancing
   - Consider microservices architecture

## 📚 Resources

- [Hono Framework](https://hono.dev/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own applications!
