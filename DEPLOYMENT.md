# Deployment Guide - Clean & Fresh Laundry Website

## 🚀 Quick Deploy Summary

This guide covers deploying the Clean & Fresh Laundry website to production with Vercel.

## 📋 Pre-Deployment Checklist

- [x] All pages built and tested locally
- [x] No TypeScript errors
- [x] API integration working
- [x] Cart functionality working
- [x] Checkout flow working
- [ ] SaaS backend deployed to production
- [ ] Production API keys generated
- [ ] Domain name registered (optional)

## 🌐 Deploying to Vercel

### Step 1: Push to GitHub

```bash
cd /Users/macbook/Documents/pressingrabat

# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Clean & Fresh Laundry website"

# Create GitHub repository and push
gh repo create pressingrabat --public --source=. --push
# OR manually create repo on GitHub and:
git remote add origin https://github.com/YOUR_USERNAME/pressingrabat.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `pressingrabat`
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

```env
NEXT_PUBLIC_SAAS_URL=https://laundry-saas-dyali.vercel.app
NEXT_PUBLIC_LAUNDRY_SLUG=clean-fresh-laundry
NEXT_PUBLIC_LAUNDRY_API_KEY=wp_2hmoc70526zqpwdqc3keo
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

**Important**: 
- Use the production SaaS URL (not localhost)
- Update `NEXT_PUBLIC_SITE_URL` with your actual Vercel domain
- Keep API key secure (don't commit to git)

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Test the deployment:
   - Visit your Vercel URL
   - Test all pages
   - Verify API calls work

## 🔧 Post-Deployment Configuration

### Update SaaS Database

Add the production website URL to the laundry record:

```bash
cd /Users/macbook/Documents/laundry-saas

node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  await prisma.laundry.update({
    where: { slug: 'clean-fresh-laundry' },
    data: { 
      websiteUrl: 'https://your-vercel-domain.vercel.app',
      status: 'ACTIVE'
    }
  });
  console.log('✅ Website URL updated in database');
  await prisma.\$disconnect();
})();
"
```

### Enable CORS on SaaS

Ensure your SaaS API routes have CORS headers for the production domain:

```typescript
// In laundry-saas/src/app/api/public/laundry/[slug]/*/route.ts
const headers = {
  'Access-Control-Allow-Origin': 'https://your-vercel-domain.vercel.app',
  // OR allow all (less secure):
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'x-api-key, Content-Type',
};
```

## 🎯 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel project settings → Domains
2. Add your domain: `cleanfreshlaundry.com`
3. Configure DNS records as instructed by Vercel
4. Update environment variable:

```env
NEXT_PUBLIC_SITE_URL=https://cleanfreshlaundry.com
```

### Update Database

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  await prisma.laundry.update({
    where: { slug: 'clean-fresh-laundry' },
    data: { websiteUrl: 'https://cleanfreshlaundry.com' }
  });
  await prisma.\$disconnect();
})();
"
```

## 🔒 Security Checklist

- [ ] API keys stored in Vercel environment variables (not in code)
- [ ] CORS properly configured on SaaS backend
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] No sensitive data in localStorage
- [ ] Rate limiting configured on SaaS APIs
- [ ] Input validation on all forms
- [ ] XSS protection enabled

## 📊 Monitoring & Analytics

### Add Google Analytics (Optional)

1. Create Google Analytics property
2. Add tracking code to `app/layout.tsx`:

```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Vercel Analytics

Enable Vercel Analytics in project settings for:
- Page views
- User sessions
- Performance metrics
- Web vitals

## 🧪 Production Testing

After deployment, test everything:

```bash
# Test laundry info API
curl -X GET 'https://laundry-saas-dyali.vercel.app/api/public/laundry/clean-fresh-laundry/info' \
  -H 'x-api-key: wp_2hmoc70526zqpwdqc3keo'

# Test products API
curl -X GET 'https://laundry-saas-dyali.vercel.app/api/public/laundry/clean-fresh-laundry/products' \
  -H 'x-api-key: wp_2hmoc70526zqpwdqc3keo'

# Test website
curl -I https://your-vercel-domain.vercel.app
```

### Manual Testing Checklist

- [ ] Homepage loads
- [ ] Products page fetches data
- [ ] Cart adds/removes items
- [ ] Checkout form submits
- [ ] Order creates in database
- [ ] Success page displays
- [ ] Mobile responsive
- [ ] All images load
- [ ] No console errors

## 🔄 Continuous Deployment

Vercel automatically deploys on git push:

```bash
# Make changes locally
# ...edit files...

# Commit and push
git add .
git commit -m "Update homepage design"
git push origin main

# Vercel will automatically:
# 1. Detect the push
# 2. Build the project
# 3. Deploy to production
# 4. Update the live site
```

### Preview Deployments

Every pull request gets a preview URL:
1. Create a branch: `git checkout -b feature/new-feature`
2. Make changes and push: `git push origin feature/new-feature`
3. Create pull request on GitHub
4. Vercel creates preview deployment
5. Test preview URL before merging

## 🐛 Troubleshooting

### Build Fails

**Error**: "Module not found"
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error**: "Environment variable undefined"
```bash
# Solution: Check Vercel environment variables
# Make sure all NEXT_PUBLIC_* variables are set
```

### API Connection Fails

**Error**: "Failed to fetch"
```bash
# Check:
# 1. SaaS backend is deployed and running
# 2. NEXT_PUBLIC_SAAS_URL is correct
# 3. API key is valid
# 4. CORS headers are configured
```

### Images Not Loading

**Error**: Invalid src prop
```bash
# Solution: Add domain to next.config.js
# images: {
#   domains: ['your-image-domain.com'],
# }
```

## 📱 SEO Optimization

### Add Meta Tags

Update `app/layout.tsx`:

```typescript
export const metadata = {
  title: 'Clean & Fresh Laundry - Professional Laundry Services',
  description: 'Premium laundry and dry cleaning services with free pickup and delivery. Quality guaranteed within 24 hours.',
  keywords: 'laundry, dry cleaning, washing, ironing, Rabat',
  openGraph: {
    title: 'Clean & Fresh Laundry',
    description: 'Professional laundry services',
    url: 'https://your-domain.com',
    siteName: 'Clean & Fresh Laundry',
    images: ['/logo.png'],
    type: 'website',
  },
}
```

### Add Sitemap

Create `app/sitemap.ts`:

```typescript
export default function sitemap() {
  return [
    {
      url: 'https://your-domain.com',
      lastModified: new Date(),
    },
    {
      url: 'https://your-domain.com/services',
      lastModified: new Date(),
    },
  ]
}
```

## 🎉 Launch Checklist

Final steps before announcing:

- [ ] All pages working in production
- [ ] SSL certificate active (HTTPS)
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking
- [ ] Error monitoring setup
- [ ] Performance optimized (Lighthouse score > 90)
- [ ] Mobile responsive verified
- [ ] Contact info correct
- [ ] Social media links added
- [ ] Terms & Privacy pages (if needed)

---

## 🚀 You're Live!

Your Clean & Fresh Laundry website is now deployed and ready for customers!

**Production URL**: https://your-vercel-domain.vercel.app

**Next Steps**:
1. Share the URL with customers
2. Add to Google My Business
3. Share on social media
4. Monitor orders in SaaS dashboard
5. Collect customer feedback

**Support**: Check Vercel dashboard for logs and analytics
