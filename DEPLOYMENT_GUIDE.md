# Deploy to Render - Complete Step-by-Step Guide

This guide will help you deploy your Nx monorepo to Render. Your project consists of multiple services that need to be deployed separately.

## Project Structure Overview

```
/workspace
├── apps/
│   ├── api-gateway/          # Express.js - Port 8080
│   ├── auth-service/         # Express.js - Port 6001
│   ├── product-service/      # Express.js - Port 7001
│   ├── seller-ui/            # Next.js - Port 3000
│   └── user-ui/              # Next.js - Port 3001
├── packages/                  # Shared packages
└── prisma/                    # Database schema
```

## Deployment Strategy

Since Render deploys one service per web service instance, you'll need to deploy each app separately:

1. **Auth Service** - Backend microservice
2. **Product Service** - Backend microservice  
3. **API Gateway** - Backend proxy service
4. **Seller UI** - Next.js frontend
5. **User UI** - Next.js frontend
6. **PostgreSQL Database** - Managed database for Prisma

---

## Step 1: Prepare Your Repository

### 1.1 Create render.yaml file

Create a `render.yaml` file in your repository root (already created for you). This is a Blueprint that defines all services.

### 1.2 Update package.json scripts

Your root package.json already has the necessary scripts. Ensure these are present:

```json
{
  "scripts": {
    "build": "npx nx run-many --target=build --all",
    "dev": "npx nx run-many --target=serve --all"
  }
}
```

---

## Step 2: Create PostgreSQL Database on Render

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **PostgreSQL**
3. Configure:
   - **Name**: `real-app-db`
   - **Database Name**: `realapp`
   - **Region**: Choose closest to your users
   - **Plan**: Free tier (or paid for production)
4. Click **Create Database**
5. **Save the connection string** - You'll need it for environment variables

The connection string will look like:
```
postgresql://user:password@hostname:5432/realapp
```

---

## Step 3: Deploy Auth Service

### 3.1 Create Web Service

1. In Render Dashboard, click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `auth-service` |
| **Region** | Same as database |
| **Branch** | `main` (or your deployment branch) |
| **Root Directory** | Leave blank |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx nx run auth-service:build` |
| **Start Command** | `npx nx run auth-service:serve` |
| **Plan** | Free or appropriate tier |

### 3.2 Add Environment Variables

Click **Environment** tab and add:

```
PORT=6001
HOST=0.0.0.0
DATABASE_URL=postgresql://user:password@hostname:5432/realapp
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
```

### 3.3 Deploy

Click **Create Web Service** - Render will build and deploy automatically.

---

## Step 4: Deploy Product Service

### 4.1 Create Web Service

1. Click **New** → **Web Service**
2. Connect the same repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `product-service` |
| **Region** | Same as other services |
| **Branch** | `main` |
| **Root Directory** | Leave blank |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx nx run product-service:build` |
| **Start Command** | `npx nx run product-service:serve` |

### 4.2 Add Environment Variables

```
PORT=7001
HOST=0.0.0.0
DATABASE_URL=postgresql://user:password@hostname:5432/realapp
NODE_ENV=production
```

---

## Step 5: Deploy API Gateway

### 5.1 Create Web Service

1. Click **New** → **Web Service**
2. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `api-gateway` |
| **Region** | Same as other services |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx nx run api-gateway:build` |
| **Start Command** | `npx nx run api-gateway:serve` |

### 5.2 Add Environment Variables

```
PORT=8080
HOST=0.0.0.0
AUTH_SERVICE_URL=https://auth-service-your-subdomain.onrender.com
PRODUCT_SERVICE_URL=https://product-service-your-subdomain.onrender.com
NODE_ENV=production
```

**Important**: Replace the URLs with your actual deployed service URLs from Steps 3 & 4.

### 5.3 Update CORS Settings

After deployment, update the CORS configuration in `/apps/api-gateway/src/main.ts`:

```typescript
app.use(cors({
    origin: ['https://seller-ui-your-subdomain.onrender.com', 'https://user-ui-your-subdomain.onrender.com'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
```

---

## Step 6: Deploy Seller UI (Next.js)

### 6.1 Create Web Service

1. Click **New** → **Web Service**
2. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `seller-ui` |
| **Region** | Same as other services |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx nx run seller-ui:build` |
| **Start Command** | `npx nx run seller-ui:serve` |

### 6.2 Add Environment Variables

```
PORT=3000
NEXT_PUBLIC_API_URL=https://api-gateway-your-subdomain.onrender.com
NODE_ENV=production
```

---

## Step 7: Deploy User UI (Next.js)

### 7.1 Create Web Service

1. Click **New** → **Web Service**
2. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `user-ui` |
| **Region** | Same as other services |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx nx run user-ui:build` |
| **Start Command** | `npx nx run user-ui:serve` |

### 7.2 Add Environment Variables

```
PORT=3001
NEXT_PUBLIC_API_URL=https://api-gateway-your-subdomain.onrender.com
NODE_ENV=production
```

---

## Step 8: Run Database Migrations

After deploying the database and services:

### Option A: Using Render Shell

1. Go to your PostgreSQL database in Render
2. Click **Shell** tab
3. Run migrations:

```bash
cd /workspace
npx prisma migrate deploy
npx prisma generate
```

### Option B: Local Migration

```bash
# Set your DATABASE_URL
export DATABASE_URL="postgresql://user:password@hostname:5432/realapp"

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

---

## Step 9: Update Service URLs

After all services are deployed:

1. **Update API Gateway** with actual service URLs:
   - Go to API Gateway service
   - Update `AUTH_SERVICE_URL` and `PRODUCT_SERVICE_URL`
   - Redeploy

2. **Update Frontends** with API Gateway URL:
   - Go to Seller UI and User UI
   - Update `NEXT_PUBLIC_API_URL`
   - Redeploy

3. **Update CORS** in all backend services to allow production domains

---

## Alternative: Using render.yaml (Blueprint)

Instead of manual setup, you can use the `render.yaml` file provided. This automates the entire deployment:

### Push render.yaml to your repository:

```yaml
services:
  # Auth Service
  - type: web
    name: auth-service
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npx nx run auth-service:build
    startCommand: npx nx run auth-service:serve
    envVars:
      - key: PORT
        value: 6001
      - key: HOST
        value: 0.0.0.0
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: real-app-db
          property: connectionString

  # Product Service
  - type: web
    name: product-service
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npx nx run product-service:build
    startCommand: npx nx run product-service:serve
    envVars:
      - key: PORT
        value: 7001
      - key: HOST
        value: 0.0.0.0
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: real-app-db
          property: connectionString

  # API Gateway
  - type: web
    name: api-gateway
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npx nx run api-gateway:build
    startCommand: npx nx run api-gateway:serve
    envVars:
      - key: PORT
        value: 8080
      - key: HOST
        value: 0.0.0.0
      - key: NODE_ENV
        value: production

  # Seller UI
  - type: web
    name: seller-ui
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npx nx run seller-ui:build
    startCommand: npx nx run seller-ui:serve
    envVars:
      - key: PORT
        value: 3000
      - key: NODE_ENV
        value: production

  # User UI
  - type: web
    name: user-ui
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npx nx run user-ui:build
    startCommand: npx nx run user-ui:serve
    envVars:
      - key: PORT
        value: 3001
      - key: NODE_ENV
        value: production

databases:
  - name: real-app-db
    databaseName: realapp
    region: oregon
```

Then in Render Dashboard:
1. Click **New** → **Blueprint**
2. Connect your repository
3. Select the `render.yaml` file
4. Click **Apply**

---

## Troubleshooting

### Build Fails

1. Check build logs in Render dashboard
2. Ensure all dependencies are in package.json
3. Try building locally: `npm run build`

### Service Won't Start

1. Check logs for errors
2. Verify PORT environment variable is set
3. Ensure HOST is set to `0.0.0.0` (not localhost)

### Database Connection Errors

1. Verify DATABASE_URL is correct
2. Ensure migrations are run
3. Check database is in same region as services

### CORS Errors

1. Update CORS origins in backend services
2. Include all frontend URLs
3. Set `credentials: true` if using cookies

### Timeouts on Free Tier

Free tier services spin down after inactivity. First request may take 30-50 seconds. Consider upgrading to paid tier for production.

---

## Post-Deployment Checklist

- [ ] All services are running (green status)
- [ ] Database migrations completed
- [ ] Environment variables configured correctly
- [ ] CORS settings updated for production URLs
- [ ] API Gateway routing to correct service URLs
- [ ] Frontends pointing to correct API Gateway URL
- [ ] Health check endpoints responding
- [ ] SSL certificates active (automatic on Render)

---

## Useful Commands

```bash
# Build specific service
npx nx run auth-service:build
npx nx run product-service:build
npx nx run api-gateway:build
npx nx run seller-ui:build
npx nx run user-ui:build

# Serve specific service locally
npx nx run auth-service:serve
npx nx run product-service:serve
npx nx run api-gateway:serve
npx nx run seller-ui:dev
npx nx run user-ui:dev

# Run all services locally
npm run dev

# Database commands
npx prisma generate
npx prisma migrate dev
npx prisma migrate deploy
npx prisma studio
```

---

## Cost Estimation (Free Tier)

- 5 Web Services (Free): $0/month
- 1 PostgreSQL Database (Free): $0/month
- **Total**: $0/month

**Note**: Free tier services spin down after 15 minutes of inactivity. For production, consider:
- Starter Web Services: $7/month each
- Standard Database: Starting at $7/month

---

## Support

- [Render Documentation](https://render.com/docs)
- [Nx Documentation](https://nx.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
