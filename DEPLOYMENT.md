# Deployment Guide for VPS

This guide explains how to deploy the Docker project to your VPS using GitHub Actions without Docker Hub.

## Prerequisites

- A VPS with Ubuntu/Debian
- Domain names pointing to your VPS:
  - `api.ekowlabs.space` → Backend API
  - `db.ekowlabs.space` → MongoDB Database
  - `gcp.ekowlabs.space` → Main VPS
- SSL certificates for your domains
- GitHub repository with your code

## VPS Setup

### 1. Initial VPS Configuration

SSH into your VPS and run these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
rm get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install git -y

# Create project directory
sudo mkdir -p /opt/docker-project
sudo chown $USER:$USER /opt/docker-project
```

### 2. Clone Repository

```bash
cd /opt/docker-project
git clone https://github.com/yourusername/your-repo-name.git .
```

### 3. SSL Certificates

Add your SSL certificates to the `nginx/ssl/` directory:

```bash
mkdir -p nginx/ssl
# Copy your certificates:
# - api.ekowlabs.space.crt
# - api.ekowlabs.space.key
# - db.ekowlabs.space.crt
# - db.ekowlabs.space.key
# - gcp.ekowlabs.space.crt
# - gcp.ekowlabs.space.key
```

### 4. Environment Configuration

The `.env` file will be automatically created by GitHub Actions using secrets. For manual deployment, create it:

```bash
cat > .env << 'EOF'
# MongoDB Configuration
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123

# Backend Configuration
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://admin:password123@db.ekowlabs.space:27017/?authSource=admin

# Application Configuration
APP_NAME=DockerApp
EOF
```

### 5. Firewall Setup

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 27017/tcp
sudo ufw allow 27018/tcp
sudo ufw --force enable
```

## GitHub Actions Setup

### 1. Repository Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

#### Required Secrets:
- `VPS_SSH_KEY`: Your private SSH key content (id_ed25519 key)
- `SSH_PASSPHRASE`: Your SSH key passphrase (if your key has one)

**Note**: The workflow is configured for:
- VPS Host: `gcp.ekowlabs.space`
- VPS User: `ekowfirmino`
- SSH Key: `id_ed25519`

#### Environment Variables (Secrets):
- `MONGO_INITDB_ROOT_USERNAME`: MongoDB root username (e.g., "admin")
- `MONGO_INITDB_ROOT_PASSWORD`: MongoDB root password (e.g., "your-secure-password")
- `NODE_ENV`: Node.js environment (e.g., "production")
- `PORT`: Backend port (e.g., "3000")
- `MONGODB_URI`: MongoDB connection string (e.g., "mongodb://admin:your-secure-password@db.ekowlabs.space:27017/?authSource=admin")
- `APP_NAME`: Application name (e.g., "DockerApp")

### 2. SSH Key Setup

Generate an SSH key pair if you don't have one:

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@yourdomain.com"
```

**Important**: For GitHub Actions, it's recommended to generate a key **without a passphrase**:

```bash
# Generate key without passphrase (recommended for GitHub Actions)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_actions_key -N ""

# Or if you want to use an existing key, remove the passphrase:
ssh-keygen -p -f ~/.ssh/id_rsa
```

Add the public key to your VPS:

```bash
# On your local machine
cat ~/.ssh/id_rsa.pub
# OR if you created a separate key:
cat ~/.ssh/github_actions_key.pub

# On your VPS
echo "your-public-key-here" >> ~/.ssh/authorized_keys
```

Add the private key to GitHub secrets as `VPS_SSH_KEY`.

**Note**: If your SSH key has a passphrase, the GitHub Actions workflow will handle it automatically, but it's recommended to use a key without a passphrase for automated deployments.

### 3. Test SSH Connection

Test the SSH connection from GitHub Actions:

```bash
ssh your-user@your-vps-ip "echo 'SSH connection successful'"
```

## Deployment Process

### Manual Deployment

For manual deployment:

```bash
cd /opt/docker-project
git pull origin main
docker-compose down
docker-compose up -d --build
docker image prune -f
```

### Automated Deployment

The GitHub Actions workflow will automatically:

1. Checkout the code
2. Create `.env` file using GitHub secrets
3. Connect to your VPS via SSH
4. Copy the `.env` file to the VPS
5. Pull the latest changes
6. Build and deploy the Docker containers using docker-compose.yaml
7. Run health checks

## Domain Configuration

### DNS Records

Configure your DNS records:

```
Type    Name    Value
A       api     your-vps-ip
A       db      your-vps-ip
A       gcp     your-vps-ip
```

### SSL Certificates

You can use Let's Encrypt for free SSL certificates:

```bash
# Install Certbot
sudo apt install certbot -y

# Get certificates for all domains
sudo certbot certonly --standalone -d api.ekowlabs.space
sudo certbot certonly --standalone -d db.ekowlabs.space
sudo certbot certonly --standalone -d gcp.ekowlabs.space

# Copy certificates to nginx/ssl/
sudo cp /etc/letsencrypt/live/api.ekowlabs.space/fullchain.pem nginx/ssl/api.ekowlabs.space.crt
sudo cp /etc/letsencrypt/live/api.ekowlabs.space/privkey.pem nginx/ssl/api.ekowlabs.space.key
sudo cp /etc/letsencrypt/live/db.ekowlabs.space/fullchain.pem nginx/ssl/db.ekowlabs.space.crt
sudo cp /etc/letsencrypt/live/db.ekowlabs.space/privkey.pem nginx/ssl/db.ekowlabs.space.key
sudo cp /etc/letsencrypt/live/gcp.ekowlabs.space/fullchain.pem nginx/ssl/gcp.ekowlabs.space.crt
sudo cp /etc/letsencrypt/live/gcp.ekowlabs.space/privkey.pem nginx/ssl/gcp.ekowlabs.space.key
```

## Monitoring and Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f nginx
docker-compose logs -f mongo
```

### Health Checks

```bash
# API health
curl https://api.ekowlabs.space/api/health

# Database health
curl https://db.ekowlabs.space/health

# VPS health
curl https://gcp.ekowlabs.space/health

# Nginx health
curl https://api.ekowlabs.space/health
```

### Backup MongoDB

```bash
# Create backup
docker-compose exec mongo mongodump --out /data/backup/$(date +%Y%m%d_%H%M%S)

# Restore backup
docker-compose exec mongo mongorestore /data/backup/backup_folder/
```

### Update SSL Certificates

Set up automatic renewal:

```bash
# Add to crontab
sudo crontab -e

# Add this line for monthly renewal
0 0 1 * * certbot renew --quiet && docker-compose restart nginx
```

## Troubleshooting

### Common Issues

1. **SSL Certificate Errors**
   - Check certificate paths in nginx configuration
   - Verify certificate validity: `openssl x509 -in nginx/ssl/api.ekowlabs.space.crt -text -noout`

2. **Docker Permission Issues**
   - Add user to docker group: `sudo usermod -aG docker $USER`
   - Logout and login again

3. **Port Already in Use**
   - Check what's using the port: `sudo netstat -tulpn | grep :80`
   - Stop conflicting services

4. **MongoDB Connection Issues**
   - Check MongoDB logs: `docker-compose logs mongo`
   - Verify network connectivity: `docker-compose exec backend ping mongo`

5. **Environment Variable Issues**
   - Check if all GitHub secrets are set correctly
   - Verify the `.env` file is created properly on the VPS
   - Check backend logs for environment variable errors

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v
docker system prune -a -f

# Start fresh
docker-compose up -d --build
```

## Security Considerations

1. **Change default passwords** in GitHub secrets
2. **Use strong MongoDB passwords**
3. **Enable firewall** (already configured in setup script)
4. **Regular security updates**
5. **Monitor logs** for suspicious activity
6. **Backup data regularly**
7. **Keep GitHub secrets secure** and rotate them regularly

## Performance Optimization

1. **Enable Docker build cache**
2. **Use multi-stage builds** for smaller images
3. **Configure nginx caching**
4. **Monitor resource usage**
5. **Scale services as needed**
