# Vercel Deployment Checklist

## ✅ Pre-Deployment

- [ ] Code is working locally with mock data
- [ ] All debug console.log removed
- [ ] .gitignore updated
- [ ] Committed and pushed to GitHub

## 🔑 Get SaaS Platform Credentials

- [ ] SaaS Platform URL: _________________
- [ ] Laundry Slug: _________________
- [ ] API Key: _________________

## 🌐 Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. [ ] Go to [vercel.com/new](https://vercel.com/new)
2. [ ] Import your GitHub repository
3. [ ] Add environment variables:
   ```
   NEXT_PUBLIC_SAAS_URL=https://your-saas-platform.com
   NEXT_PUBLIC_LAUNDRY_SLUG=clean-fresh-laundry
   NEXT_PUBLIC_LAUNDRY_API_KEY=your_api_key
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   ```
4. [ ] Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🧪 Test Deployment

- [ ] Visit your Vercel URL
- [ ] Homepage loads with correct laundry info
- [ ] Services page shows products
- [ ] Cart functionality works
- [ ] No console errors

## 🔧 Configure SaaS Platform

- [ ] Add Vercel domain to CORS whitelist
- [ ] Verify laundry is registered in SaaS
- [ ] Test API key permissions

## 🎯 Post-Deployment

- [ ] Set up custom domain (optional)
- [ ] Update NEXT_PUBLIC_SITE_URL if using custom domain
- [ ] Enable Vercel Analytics
- [ ] Monitor error logs

## 📝 Notes

Vercel URL: ________________________________

Custom Domain: ________________________________

Deployed: ____/____/______

## 🆘 Troubleshooting

If deployment fails:
1. Check build logs in Vercel dashboard
2. Verify environment variables are correct
3. Ensure SaaS platform is accessible
4. Check CORS settings on SaaS platform

## 📧 Support

- Vercel Support: https://vercel.com/support
- Project Issues: https://github.com/SoufianeMouajjeh/pressingrabat/issues
