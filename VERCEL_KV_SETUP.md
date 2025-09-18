# Vercel Postgres Setup Guide

Your portfolio application has been updated to use Vercel Postgres for data storage in production, which will fix the "read-only file system" error you were experiencing on Vercel.

## Why This Change Was Needed

Vercel's serverless environment has a read-only file system, which means you can't write files to the local filesystem in production. The original implementation tried to save portfolio data to a local JSON file, which caused the error you saw.

## What's Been Implemented

✅ **Vercel Postgres Integration**: Added `@vercel/postgres` package for cloud database storage
✅ **Smart Fallback**: Uses local JSON file for development, Postgres for production
✅ **Auto Database Setup**: Creates tables and initializes data automatically
✅ **Async API Updates**: All API endpoints now work with async database operations
✅ **Error Handling**: Graceful fallbacks if database is unavailable

## Setup Steps for Vercel Postgres

### 1. Create a Vercel Postgres Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **Postgres** (SQL Database)
5. Choose a name like `portfolio-database`
6. Select your preferred region
7. Click **Create**

### 2. Connect Postgres to Your Project

1. In your Vercel Postgres dashboard, click on your newly created database
2. Go to the **Settings** tab
3. Click **Connect**
4. You'll see environment variables like:
   ```
   POSTGRES_URL
   POSTGRES_PRISMA_URL
   POSTGRES_URL_NO_SSL
   POSTGRES_URL_NON_POOLING
   POSTGRES_USER
   POSTGRES_HOST
   POSTGRES_PASSWORD
   POSTGRES_DATABASE
   ```

### 3. Add Environment Variables to Your Project

**Option A: Via Vercel Dashboard**
1. Go to your project's **Settings** tab
2. Click **Environment Variables**
3. Add the Postgres environment variables from step 2 (at minimum `POSTGRES_URL`)

**Option B: Via Vercel CLI**
```bash
vercel env add POSTGRES_URL
```

### 4. Deploy Your Changes

```bash
# Build and deploy
npm run build
vercel --prod
```

## How It Works

### Development Environment
- Uses the local `data/portfolio.json` file
- Changes are saved locally for testing
- No database configuration needed for development

### Production Environment (Vercel)
- Automatically detects `POSTGRES_URL` environment variable
- Uses Vercel Postgres for all data operations
- Creates `portfolio_items` table automatically on first use
- Data persists across deployments and is shared globally

### Environment Detection
```typescript
// Automatically switches between local file and Postgres
const hasPostgresConfig = process.env.POSTGRES_URL
```

### Database Schema
The system automatically creates this table:
```sql
CREATE TABLE IF NOT EXISTS portfolio_items (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  image TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Testing the Setup

After deploying with Postgres configured:

1. **Test Adding**: Try adding a new portfolio item through your admin dashboard
2. **Test Editing**: Edit an existing portfolio item
3. **Test Deleting**: Delete a portfolio item
4. **Verify Persistence**: Refresh the page to ensure changes persist

## Data Migration

The system automatically handles data initialization:

1. **First deployment**: Creates the database table automatically
2. **Initializes with defaults**: Adds default portfolio items if table is empty
3. **Preserves existing data**: Won't overwrite if data already exists

Your existing custom portfolio items will need to be re-added through the admin interface after the first deployment.

## Pricing

Vercel Postgres has a generous free tier:
- **Hobby Plan**: 512 MB storage, 60 hours compute time per month
- **Pro Plan**: Additional storage and compute as needed

For a portfolio site, the free tier should be more than sufficient.

## Troubleshooting

### Database Not Working in Production
- Verify `POSTGRES_URL` environment variable is set in Vercel project settings
- Check that the Postgres database is created and connected
- Ensure you're deploying to the correct project
- Check Vercel function logs for database connection errors

### Local Development Issues
- Database is not required for local development
- Changes will be saved to the local JSON file (`data/portfolio.json`)
- Use `npm run dev` to test locally

### Data Not Persisting
- Check Vercel deployment logs for database connection errors
- Verify `POSTGRES_URL` environment variable is correct
- Ensure database is in the same region as your deployment
- Check if database has reached storage limits

### Connection Issues
- Verify your Vercel project is connected to the correct database
- Check if database is in "sleeping" state (free tier limitation)
- Ensure network connectivity between your app and database

## Next Steps

1. **Set up Vercel Postgres** following steps 1-3 above
2. **Deploy your project** with `vercel --prod`
3. **Test the admin functionality** to ensure everything works
4. **Monitor usage** in your Vercel Postgres dashboard

Your portfolio will now work seamlessly on Vercel with persistent, reliable database storage!

## Database Management

You can manage your database through:
- **Vercel Dashboard**: View tables, run queries, monitor usage
- **Direct SQL Access**: Use provided connection strings for advanced management
- **Automatic Backups**: Vercel handles backups automatically

The portfolio application will handle all database operations automatically - no manual SQL required!