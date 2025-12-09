# Deployment Guide to Vercel

This guide will help you deploy your Real Estate Platform to Vercel.

## Prerequisites

- GitHub account with this repository
- Vercel account (sign up at https://vercel.com)
- All code committed and pushed to GitHub

## Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose your `realestate` repository
4. Click "Import"

## Step 2: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

### Required Environment Variables:

```
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=generate-a-secure-random-string-here
```

**Important Notes:**

- For `NEXTAUTH_SECRET`, generate a secure random string:
  ```bash
  openssl rand -base64 32
  ```
- Replace `your-project.vercel.app` with your actual Vercel domain
- SQLite works for MVP but for production, consider PostgreSQL:
  - Use Vercel Postgres, Supabase, or Neon
  - Update DATABASE_URL accordingly

## Step 3: Configure Build Settings

Vercel should automatically detect Next.js. Verify these settings:

- **Framework Preset:** Next.js
- **Build Command:** `prisma generate && next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 1-3 minutes)
3. Once deployed, you'll get a URL like `https://realestate-xxxxx.vercel.app`

## Step 5: Set Up Database for Production

### Option A: Use Vercel Postgres (Recommended for Production)

1. In Vercel Dashboard, go to Storage → Create Database
2. Select "Postgres"
3. Copy the `DATABASE_URL` connection string
4. Update your environment variable
5. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
6. Redeploy

### Option B: Use Supabase

1. Go to https://supabase.com and create a project
2. Get the connection string from Settings → Database
3. Update `DATABASE_URL` in Vercel
4. Update Prisma schema to use postgresql
5. Run migrations
6. Redeploy

### Option C: Keep SQLite (MVP Only)

- SQLite works for testing but has limitations
- Data is ephemeral on Vercel (resets on deploys)
- Not recommended for production

## Step 6: Run Database Migrations

After deploying with PostgreSQL:

```bash
# Locally, with production DATABASE_URL
npx prisma migrate deploy
```

Or use Vercel CLI:

```bash
vercel env pull
npx prisma migrate deploy
```

## Step 7: Test Your Deployment

1. Visit your Vercel URL
2. Test creating a property listing
3. Test browsing properties
4. Verify all images load correctly

## Troubleshooting

### Build Errors

- Check Vercel build logs
- Ensure all environment variables are set
- Verify Prisma schema is correct

### Database Connection Issues

- Double-check DATABASE_URL format
- Ensure database is accessible from Vercel
- Check firewall/security settings

### Image Upload Issues

- Base64 images have size limits
- For production, integrate Cloudinary or AWS S3
- Update the upload logic in `/app/properties/new/page.tsx`

## Production Upgrades

For a production-ready application, consider:

1. **Database:** Migrate to PostgreSQL
2. **Image Storage:** Use Cloudinary or AWS S3
3. **Authentication:** Add OAuth providers (Google, GitHub)
4. **Search:** Add advanced search and filters
5. **Maps:** Integrate Google Maps API
6. **Email:** Set up email notifications
7. **Analytics:** Add Google Analytics or Vercel Analytics
8. **Monitoring:** Use Sentry for error tracking

## Continuous Deployment

Vercel automatically deploys:
- **main branch** → Production
- **other branches** → Preview deployments

Every push triggers a new deployment.

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update NEXTAUTH_URL environment variable

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

---

Good luck with your deployment! 🚀
