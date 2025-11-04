# Environment Variables Setup

## For Local Development (Mock Data)

Create `.env.local` file:

```bash
# Leave SAAS_URL empty to use local mock API routes
NEXT_PUBLIC_SAAS_URL=
NEXT_PUBLIC_LAUNDRY_SLUG=clean-fresh-laundry
NEXT_PUBLIC_LAUNDRY_API_KEY=dev_key
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

## For Vercel Production Deployment

Set these environment variables in Vercel Dashboard:

```bash
# Your production SaaS platform URL
NEXT_PUBLIC_SAAS_URL=https://your-saas-platform.com

# Get these from your SaaS platform admin
NEXT_PUBLIC_LAUNDRY_SLUG=clean-fresh-laundry
NEXT_PUBLIC_LAUNDRY_API_KEY=prod_xxxxxxxxxxxxx

# Your Vercel deployment URL
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

## How to Get Production Credentials

1. Login to your SaaS platform admin panel
2. Navigate to **Laundries** section
3. Find or create "Clean & Fresh Laundry"
4. Copy the **Slug** and **API Key**
5. Use the platform's production URL

## Testing Connection

After setting environment variables:

```bash
# Test locally
npm run dev

# Test API endpoints
curl http://localhost:3001/api/public/laundry/clean-fresh-laundry/info
```

## Important Notes

- **Never commit** `.env.local` or `.env.production` to Git
- All variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Restart dev server after changing environment variables
- In Vercel, redeploy after updating environment variables
