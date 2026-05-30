# Safar E Arabia - Deployment Guide

This guide details how to deploy the migrated Safar E Arabia Next.js application to a production environment.

## Prerequisites
- A MongoDB cluster (e.g., MongoDB Atlas) loaded with the migrated data.
- A Node.js server (v18.17+) or a Vercel account.
- Google OAuth credentials for social login.

## Environment Variables
Before deploying, ensure you configure the following variables in your production environment (e.g., Vercel Environment Variables settings or a `.env.local` file on your server).

```env
# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/safarearabia?retryWrites=true&w=majority

# Authentication Secrets
NEXTAUTH_SECRET=your_super_secret_string_here
NEXTAUTH_URL=https://www.safarearabia.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application URL (used for SEO and absolute routing)
NEXT_PUBLIC_APP_URL=https://www.safarearabia.com
```

## Deployment Options

### Option 1: Deploying to Vercel (Recommended)
Vercel is the creator of Next.js and provides the most seamless hosting experience.

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to [Vercel](https://vercel.com/) and click "Add New Project".
3. Import your repository.
4. Open the "Environment Variables" section and add all the variables listed above.
5. Click **Deploy**. Vercel will automatically build and start the application.

### Option 2: Self-Hosting (Node.js Server / VPS)
If you prefer to host it on a DigitalOcean Droplet, AWS EC2, or a cPanel server that supports Node.js.

1. Clone your repository onto the server.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the production application:
   ```bash
   npm run build
   ```
4. Start the server (you may use a process manager like PM2 to keep it running):
   ```bash
   npm install -g pm2
   pm2 start npm --name "safarearabia" -- start
   ```
5. Set up a reverse proxy (e.g., Nginx or Apache) to forward traffic from port 80/443 to the Node.js application (default runs on port 3000).

## Post-Deployment Checklist
- [ ] Visit the homepage and ensure all styles load perfectly.
- [ ] Verify that Google Login and standard email login work correctly.
- [ ] Check `https://yourdomain.com/sitemap.xml` to ensure it generates correctly for SEO.
- [ ] Monitor the application logs for any missed edge-case MongoDB connection issues.
