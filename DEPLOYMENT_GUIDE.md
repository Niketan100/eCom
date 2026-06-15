# Deploy to Render - Complete Step-by-Step Guide (MongoDB + Prisma)

This guide will help you deploy your Nx monorepo to Render with **MongoDB Atlas** as your database. Your project uses Prisma with MongoDB, and the DATABASE_URL is stored in environment variables.

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
├── prisma/                    # MongoDB schema (schema.prisma)
└── prisma.config.ts           # Prisma configuration
```

## Important: MongoDB Setup Required

Since you're using **MongoDB with Prisma**, you need to set up MongoDB Atlas separately (Render doesn't offer managed MongoDB). The DATABASE_URL from your .env file must be added to Render environment variables.

---

## Step 1: Set Up MongoDB Atlas (If Not Already Done)

### 1.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account or sign in
3. Create a new cluster (Free M0 tier available)

### 1.2 Configure Database Access

1. In Atlas Dashboard, go to **Database Access**
2. Click **Add New Database User**
3. Create username and password (save these!)
4. Grant **Read and write to any database** permission

### 1.3 Configure Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0) for development
   - For production, add specific IPs of Render services
4. Click **Confirm**

### 1.4 Get Connection String

1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database-name>?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. This is your `DATABASE_URL`

---

## Step 2: Prepare Your Repository

### 2.1 Files Already Created

The following files are ready in your repository:

- `render.yaml` - Blueprint configuration for all services
- `DEPLOYMENT_GUIDE.md` - This guide

### 2.2 Verify Prisma Schema

Your `prisma/schema.prisma` is configured for MongoDB:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}
```

### 2.3 Update .gitignore

Ensure `.env` is in your `.gitignore` (never commit database credentials):

```bash
echo ".env" >> .gitignore
```

---

## Step 3: Deploy Using Render Blueprint (Recommended)

### 3.1 Push Code to Git Repository

```bash
git add render.yaml DEPLOYMENT_GUIDE.md
git commit -m "Add Render deployment configuration"
git push origin main
```

### 3.2 Deploy with Blueprint

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Click **Apply**

### 3.3 Add MongoDB Connection String

After Blueprint creates services:

1. Go to each backend service (auth-service, product-service)
2. Click **Environment** tab
3. Add environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your MongoDB Atlas connection string
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/realapp?retryWrites=true&w=majority
   ```
4. Click **Save Changes**
5. Service will automatically redeploy

**Services that need DATABASE_URL:**
- auth-service
- product-service

---

## Step 4: Manual Deployment (Alternative)

If you prefer manual setup:

### 4.1 Deploy Auth Service

1. Click **New** → **Web Service**
2. Connect your repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `auth-service` |
| **Region** | Choose closest to users |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx prisma generate && npx nx run auth-service:build` |
| **Start Command** | `npx nx run auth-service:serve` |
| **Plan** | Free |

4. Add Environment Variables:
```
PORT=6001
HOST=0.0.0.0
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/realapp?retryWrites=true&w=majority
```

5. Click **Create Web Service**

### 4.2 Deploy Product Service

1. Click **New** → **Web Service**
2. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `product-service` |
| **Region** | Same as auth-service |
| **Build Command** | `npm install && npx prisma generate && npx nx run product-service:build` |
| **Start Command** | `npx nx run product-service:serve` |

3. Add Environment Variables:
```
PORT=7001
HOST=0.0.0.0
NODE_ENV=production
DATABASE_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/realapp?retryWrites=true&w=majority
```

### 4.3 Deploy API Gateway

1. Click **New** → **Web Service**
2. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `api-gateway` |
| **Build Command** | `npm install && npx nx run api-gateway:build` |
| **Start Command** | `npx nx run api-gateway:serve` |

3. Add Environment Variables:
```
PORT=8080
HOST=0.0.0.0
NODE_ENV=production
AUTH_SERVICE_URL=https://auth-service-your-subdomain.onrender.com
PRODUCT_SERVICE_URL=https://product-service-your-subdomain.onrender.com
```

### 4.4 Deploy Seller UI (Next.js)

1. Click **New** → **Web Service**
2. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `seller-ui` |
| **Build Command** | `npm install && npx nx run seller-ui:build` |
| **Start Command** | `npx nx run seller-ui:serve` |

3. Add Environment Variables:
```
PORT=3000
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api-gateway-your-subdomain.onrender.com
```

### 4.5 Deploy User UI (Next.js)

1. Click **New** → **Web Service**
2. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `user-ui` |
| **Build Command** | `npm install && npx nx run user-ui:build` |
| **Start Command** | `npx nx run user-ui:serve` |

3. Add Environment Variables:
```
PORT=3001
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api-gateway-your-subdomain.onrender.com
```

---

## Step 5: Run Database Migrations

Since you're using MongoDB with Prisma:

### Option A: Run Locally (Recommended)

```bash
# Copy your MongoDB connection string
export DATABASE_URL="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/realapp?retryWrites=true&w=majority"

# Generate Prisma Client
npx prisma generate

# For MongoDB, indexes are created automatically
# No migrations needed like PostgreSQL
```

### Option B: Using Render Shell

1. Go to any backend service in Render
2. Click **Shell** tab
3. Run:
```bash
npx prisma generate
```

---

## Step 6: Update Service URLs

After all services are deployed:

1. **Get Service URLs** from Render Dashboard
2. **Update API Gateway** environment variables:
   - `AUTH_SERVICE_URL`
   - `PRODUCT_SERVICE_URL`
3. **Update Frontends** environment variables:
   - `NEXT_PUBLIC_API_URL` in both seller-ui and user-ui
4. **Redeploy** services after updating URLs

---

## Step 7: Update CORS Settings

Update CORS configuration in your backend services to allow production domains:

### In `/apps/api-gateway/src/main.ts`:
```typescript
app.use(cors({
    origin: [
        'https://seller-ui-your-subdomain.onrender.com',
        'https://user-ui-your-subdomain.onrender.com'
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
```

### In `/apps/auth-service/src/main.ts` and `/apps/product-service/src/main.ts`:
```typescript
app.use(cors({
    origin: '*', // Or specify your frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## render.yaml File Explanation

Your `render.yaml` includes:

```yaml
services:
  - type: web
    name: auth-service
    buildCommand: npm install && npx prisma generate && npx nx run auth-service:build
    startCommand: npx nx run auth-service:serve
    envVars:
      - key: DATABASE_URL
        sync: false  # Manually set in Render Dashboard
```

**Key Points:**
- `npx prisma generate` in build command generates Prisma Client for MongoDB
- `sync: false` means DATABASE_URL must be manually added in Render Dashboard (for security)
- Each service specifies correct PORT and HOST for containerized deployment

---

## Troubleshooting

### Build Fails with Prisma Errors

```bash
# Ensure Prisma is installed
npm list prisma @prisma/client

# Regenerate Prisma Client locally
npx prisma generate

# Check schema is valid
npx prisma validate
```

### Database Connection Errors

1. Verify MongoDB Atlas connection string is correct
2. Check Network Access allows Render IPs (0.0.0.0/0)
3. Ensure database user has correct permissions
4. Test connection locally with same connection string

### Service Won't Start

1. Check logs in Render dashboard
2. Verify PORT environment variable matches service configuration
3. Ensure HOST is set to `0.0.0.0`
4. Check all dependencies are in package.json

### CORS Errors in Browser

1. Update CORS origins in backend services
2. Include all frontend URLs
3. Clear browser cache and cookies
4. Check network tab for exact error message

### Prisma Client Not Generated

The build command includes `npx prisma generate`. If issues persist:

```bash
# In Render Shell or locally
npx prisma generate --schema=./prisma/schema.prisma
```

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Network Access allows Render IPs
- [ ] DATABASE_URL added to auth-service and product-service
- [ ] All services show green status in Render
- [ ] Prisma Client generated successfully
- [ ] Environment variables configured correctly
- [ ] CORS settings updated for production URLs
- [ ] API Gateway routing to correct service URLs
- [ ] Frontends pointing to correct API Gateway URL
- [ ] Health check endpoints responding
- [ ] SSL certificates active (automatic on Render)

---

## Environment Variables Summary

Based on your actual `.env` files, here's what you need to configure in Render:

### Root .env (Shared across services)
These variables are in your root `.env` file and used by multiple services:

```bash
DATABASE_URL="mongodb+srv://your-app-cluster.mongodb.net/your-db?retryWrites=true&w=majority"
REDIS_HOST="redis-host.example.io"
REDIS_PORT=6379
REDIS_PASSWORD="your-redis-password"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=465
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="noreply@realapp.com"
EMAIL_SERVICE="gmail"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

### Auth Service Specific (.env in apps/auth-service/)
These override the root values for auth-service only:

```bash
PORT=6001
EMAIL_HOST="smtp.gmail.com"           # Can be different from root
EMAIL_USER="niketankumar12345@gmail.com"  # Service-specific email
EMAIL_PASS="twxz bzcy zdsj wkmt"      # App-specific password
EMAIL_FROM="noreply@realapp.com"
EMAIL_SERVICE="gmail"
```

### API Gateway Specific (.env in apps/api-gateway/)
```bash
PORT=8080
# Plus service URLs added after deployment:
AUTH_SERVICE_URL=https://auth-service-xxx.onrender.com
PRODUCT_SERVICE_URL=https://product-service-xxx.onrender.com
```

### Product Service
Uses root `.env` values plus:
```bash
PORT=7001
```

### Frontend Services (seller-ui, user-ui)
```bash
PORT=3000  # seller-ui
PORT=3001  # user-ui
NEXT_PUBLIC_API_URL=https://api-gateway-xxx.onrender.com
```

---

## How to Add Environment Variables in Render

### Method 1: Add After Blueprint Deployment (Recommended)

1. **Deploy the Blueprint first** - It will create all services with placeholder variables
2. **For each service**, go to Environment tab:
   - Click on service → Environment → Add Environment Variable
   - Add variables marked with `sync: false` in render.yaml
   - Use your actual values from `.env` files

### Method 2: Add During Manual Setup

When creating services manually, add all environment variables in the configuration screen before clicking "Create Web Service".

### Important Notes:

- **`sync: false`** means the variable is NOT in render.yaml for security - you must add it manually
- **Auth-service** has specific email credentials that override root values
- **Other services** use root `.env` values unless they have their own `.env` file
- **Never commit** actual passwords/secrets to git

---

## Useful Commands

```bash
# Build specific service
npx nx run auth-service:build
npx nx run product-service:build
npx nx run api-gateway:build
npx nx run seller-ui:build
npx nx run user-ui:build

# Generate Prisma Client
npx prisma generate

# Validate Prisma Schema
npx prisma validate

# Open Prisma Studio (local development)
npx prisma studio

# Run all services locally
npm run dev
```

---

## Cost Estimation

- 5 Web Services (Free Tier): $0/month
- MongoDB Atlas (M0 Free Tier): $0/month
- **Total**: $0/month

**Note**: Free tier services spin down after 15 minutes of inactivity. For production:
- Render Starter Web Services: $7/month each
- MongoDB Atlas M10: Starting at $57/month

---

## Security Best Practices

1. **Never commit .env file** - Contains sensitive DATABASE_URL
2. **Use strong JWT_SECRET** - Use Render's generateValue feature
3. **Restrict MongoDB Network Access** - Add specific IPs in production
4. **Enable MongoDB Authentication** - Always use username/password
5. **Use Environment Variables** - Never hardcode credentials
6. **Regular Backups** - Enable MongoDB Atlas backups

---

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Prisma MongoDB Guide](https://www.prisma.io/docs/reference/database-reference/connection-urls/mongodb)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Nx Documentation](https://nx.dev)
