# Docker Project with MongoDB, Node.js Backend, and Nginx

This project demonstrates a complete Docker setup with:
- **MongoDB**: Database service running on port 27017
- **Node.js Backend**: Express API service with ES6 modules and MVC architecture
- **Nginx**: Reverse proxy and load balancer on ports 80/443

## Project Structure

```
.
├── docker-compose.yml
├── .env (auto-generated from GitHub secrets)
├── README.md
├── DEPLOYMENT.md
├── backend/
│   ├── Dockerfile
│   ├── package.json (ES6 modules)
│   ├── server.js
│   ├── .dockerignore
│   ├── models/
│   │   └── Item.js
│   ├── controllers/
│   │   ├── itemController.js
│   │   └── healthController.js
│   ├── routes/
│   │   ├── items.js
│   │   └── health.js
│   ├── middleware/
│   │   └── errorHandler.js
│   └── config/
│       └── database.js
├── nginx/
│   ├── default.conf
│   └── ssl/
└── .github/
    └── workflows/
        └── deploy.yml
```

## Prerequisites

- Docker
- Docker Compose
- For VPS deployment: See [DEPLOYMENT.md](DEPLOYMENT.md)

## Quick Start (Local Development)

1. **Clone or download this project**

2. **Create .env file:**
   ```bash
   # MongoDB Configuration
   MONGO_INITDB_ROOT_USERNAME=admin
   MONGO_INITDB_ROOT_PASSWORD=password123

   # Backend Configuration
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://admin:password123@db.ekowlabs.space:27017/?authSource=admin

   # Application Configuration
   APP_NAME=DockerApp
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Check if services are running:**
   ```bash
   docker-compose ps
   ```

5. **View logs:**
   ```bash
   docker-compose logs -f
   ```

## VPS Deployment

For production deployment to your VPS with custom domains:
- **API**: `https://api.ekowlabs.space`
- **Database**: `db.ekowlabs.space`
- **Main VPS**: `gcp.ekowlabs.space`

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete setup instructions.

## Services

### MongoDB
- **Port**: 27017 (host) → 27017 (container)
- **Credentials**: Set via GitHub secrets
- **Data**: Persisted in Docker volume `mongo_data`
- **Domain**: db.ekowlabs.space

### Backend API (ES6 + MVC)
- **Port**: 3000 (internal, exposed via nginx)
- **Framework**: Express.js with ES6 modules
- **Architecture**: MVC pattern with controllers, models, and routes
- **Domain**: api.ekowlabs.space
- **Endpoints**:
  - `GET /` - API info
  - `GET /api/health` - Health check
  - `GET /api/items` - List all items
  - `POST /api/items` - Create new item
  - `GET /api/items/:id` - Get specific item
  - `PUT /api/items/:id` - Update item
  - `DELETE /api/items/:id` - Delete item

### Nginx
- **Ports**: 80 (HTTP) and 443 (HTTPS)
- **Role**: Reverse proxy to backend with SSL termination
- **Health Check**: `GET /health`
- **Domains**: api.ekowlabs.space, db.ekowlabs.space

## API Usage

### Test the API

1. **Check if the API is running:**
   ```bash
   curl https://api.ekowlabs.space/
   ```

2. **Health check:**
   ```bash
   curl https://api.ekowlabs.space/api/health
   ```

3. **Create an item:**
   ```bash
   curl -X POST https://api.ekowlabs.space/api/items \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Item", "description": "This is a test item"}'
   ```

4. **Get all items:**
   ```bash
   curl https://api.ekowlabs.space/api/items
   ```

5. **Update an item:**
   ```bash
   curl -X PUT https://api.ekowlabs.space/api/items/ITEM_ID \
     -H "Content-Type: application/json" \
     -d '{"name": "Updated Item", "description": "Updated description"}'
   ```

6. **Delete an item:**
   ```bash
   curl -X DELETE https://api.ekowlabs.space/api/items/ITEM_ID
   ```

## Environment Variables

The `.env` file is automatically created by GitHub Actions using secrets:

### Required GitHub Secrets:
- `VPS_HOST`: Your VPS IP or domain
- `VPS_USER`: SSH username
- `VPS_SSH_KEY`: Private SSH key

### Environment Variables (GitHub Secrets):
- `MONGO_INITDB_ROOT_USERNAME`: MongoDB root username
- `MONGO_INITDB_ROOT_PASSWORD`: MongoDB root password
- `NODE_ENV`: Node.js environment (production/development)
- `PORT`: Backend port (3000)
- `MONGODB_URI`: MongoDB connection string
- `APP_NAME`: Application name

## Useful Commands

### Docker Compose Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# View logs
docker-compose logs -f [service_name]

# Access MongoDB shell
docker-compose exec mongo mongosh -u admin -p password123

# Access backend container
docker-compose exec backend sh

# Access nginx container
docker-compose exec nginx sh
```

### Database Commands
```bash
# Connect to MongoDB
docker-compose exec mongo mongosh -u admin -p password123

# List databases
show dbs

# Use the default database
use admin

# Show collections
show collections
```

## GitHub Actions Deployment

This project includes automated deployment via GitHub Actions:

1. **Set up repository secrets** (see DEPLOYMENT.md for full list)
2. **Push to main branch** to trigger deployment
3. **Monitor deployment** in GitHub Actions tab

The workflow automatically:
- Creates `.env` file from GitHub secrets
- Deploys to VPS using docker-compose
- Runs health checks

## Backend Architecture

### ES6 Modules Structure:
- **Models**: Data schemas and database interactions
- **Controllers**: Business logic and request handling
- **Routes**: API endpoint definitions
- **Middleware**: Error handling, logging, and utilities
- **Config**: Database and application configuration

### Features:
- ✅ ES6 modules with `import/export`
- ✅ MVC architecture pattern
- ✅ Comprehensive error handling
- ✅ Request logging middleware
- ✅ Input validation
- ✅ Proper HTTP status codes
- ✅ Consistent API responses

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Change the port mapping in `docker-compose.yml`
   - Or stop the service using the port

2. **MongoDB connection issues:**
   - Check if MongoDB container is running: `docker-compose ps`
   - Check MongoDB logs: `docker-compose logs mongo`

3. **Backend not starting:**
   - Check backend logs: `docker-compose logs backend`
   - Ensure all dependencies are installed

4. **Nginx not proxying correctly:**
   - Check nginx logs: `docker-compose logs nginx`
   - Verify nginx configuration syntax

5. **SSL certificate issues:**
   - Check certificate paths in nginx configuration
   - Verify certificate validity

6. **Environment variable issues:**
   - Check if all GitHub secrets are set correctly
   - Verify the `.env` file is created properly on the VPS

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

## Development

### Making Changes

1. **Backend changes:**
   - Edit files in the `backend/` directory
   - Rebuild: `docker-compose up -d --build backend`

2. **Nginx configuration:**
   - Edit `nginx/default.conf`
   - Restart nginx: `docker-compose restart nginx`

3. **Environment variables:**
   - Update GitHub secrets for production
   - For local development, edit `.env` file

## Production Considerations

- Change default passwords in GitHub secrets
- Use proper SSL certificates
- Configure proper logging
- Set up monitoring and health checks
- Use Docker secrets for sensitive data
- Configure proper backup strategies for MongoDB
- Set up automatic SSL certificate renewal
- Configure firewall rules
- Monitor resource usage

## Security

- All HTTP traffic is redirected to HTTPS
- Security headers are configured in nginx
- CORS is configured for specific domains
- MongoDB is not exposed to the internet directly
- Firewall rules are configured
- Environment variables are managed via GitHub secrets

## License

MIT License
