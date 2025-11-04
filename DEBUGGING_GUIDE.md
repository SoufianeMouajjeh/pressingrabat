# 🔍 DEBUGGING THE "FAILED TO FETCH" ERROR

## Step-by-Step Debugging Process

### Step 1: Check Environment Variables
Visit this URL in your browser: **http://localhost:3001/debug-env**

This will show you EXACTLY what environment variables are loaded in your app.

**What you should see:**
- ✅ NEXT_PUBLIC_SAAS_URL = `http://localhost:3000` (in GREEN)
- ✅ NEXT_PUBLIC_LAUNDRY_SLUG = `clean-fresh-laundry`
- ✅ NEXT_PUBLIC_LAUNDRY_API_KEY = `wp_2hmoc7...` (truncated)
- ✅ NEXT_PUBLIC_SITE_URL = `http://localhost:3001`

**If NEXT_PUBLIC_SAAS_URL is empty or in RED:**
→ The server needs to be restarted! Go to Step 2.

---

### Step 2: Properly Restart the Server

**Important:** Simply pressing Ctrl+C and restarting might not be enough if there are cached processes!

#### Option A: Clean Restart (Recommended)
```bash
# 1. Kill any processes on port 3001
lsof -ti:3001 | xargs kill -9

# 2. Navigate to the project
cd /Users/macbook/Documents/pressingrabat

# 3. Clear Next.js cache
rm -rf .next

# 4. Start fresh
npm run dev
```

#### Option B: Simple Restart
```bash
# 1. In the terminal running the server, press Ctrl+C
# 2. Wait for it to fully stop
# 3. Run again
npm run dev
```

---

### Step 3: Check Browser Console
After restart, go to: **http://localhost:3001**

Open Browser DevTools (F12 or Cmd+Option+I), then check the **Console** tab.

**Look for debug logs:**
```
🔍 getFullUrl - saasUrl: http://localhost:3000
✅ Using saasUrl - Full URL: http://localhost:3000/api/public/laundry/clean-fresh-laundry/info
🏢 fetchLaundryInfo - Starting...
🏢 Final URL to fetch: http://localhost:3000/api/public/laundry/clean-fresh-laundry/info
🏢 Response status: 200
🏢 Successfully fetched laundry info: {...}
```

**If you see:**
```
⚠️ Client-side with no saasUrl - Using relative path: /api/public/...
```
→ This means the environment variable is STILL not loaded! Server needs restart.

---

### Step 4: Verify SaaS Server is Running
Make sure the SaaS server is running on port 3000:

```bash
lsof -i:3000
```

Should show a Node process. If not:
```bash
cd /Users/macbook/Documents/laundry-saas
npm run dev
```

---

### Step 5: Test API Directly
Test if the SaaS API is responding:

**In terminal:**
```bash
curl -H "x-api-key: wp_2hmoc70526zqpwdqc3keo" \
     http://localhost:3000/api/public/laundry/clean-fresh-laundry/info
```

**Expected response:**
```json
{
  "id": "...",
  "name": "Clean & Fresh Laundry",
  "address": "...",
  "phoneNumber": "...",
  "slaHours": 48,
  "websiteUrl": "http://localhost:3001",
  "logo": null,
  "primaryColor": "#3B82F6"
}
```

**If you get an error:**
- Check if the laundry exists in the database
- Check if the API key is correct
- Check if the slug matches

---

## 🎯 Quick Troubleshooting Checklist

Run through this list in order:

- [ ] **SaaS server running?** → `lsof -i:3000` should show process
- [ ] **Laundry server running?** → `lsof -i:3001` should show process
- [ ] **Environment variables loaded?** → Visit http://localhost:3001/debug-env
- [ ] **SAAS_URL is set correctly?** → Should be `http://localhost:3000` (GREEN)
- [ ] **Server was restarted after .env.local change?** → Must restart to load new env vars
- [ ] **No .next cache issues?** → Try `rm -rf .next` and restart
- [ ] **Browser console shows debug logs?** → Should see 🔍 and 🏢 emoji logs
- [ ] **API responds to curl?** → Test with curl command above
- [ ] **No CORS errors?** → Check browser console for CORS messages

---

## 🚨 Common Issues and Solutions

### Issue 1: "NEXT_PUBLIC_SAAS_URL is empty"
**Cause:** Server not restarted after .env.local change  
**Solution:** 
```bash
lsof -ti:3001 | xargs kill -9
cd /Users/macbook/Documents/pressingrabat
rm -rf .next
npm run dev
```

### Issue 2: "Failed to fetch" but env vars are correct
**Cause:** CORS issue or SaaS server not running  
**Solution:**
1. Check if SaaS is running: `lsof -i:3000`
2. Check browser console for CORS errors
3. Test API with curl (see Step 5)

### Issue 3: "Relative path being used"
**Cause:** saasUrl is empty string (not loaded from env)  
**Solution:** Same as Issue 1 - restart server

### Issue 4: "API returns 404"
**Cause:** Laundry doesn't exist in database or slug is wrong  
**Solution:**
1. Check slug in .env.local matches database
2. Check if laundry is ACTIVE status
3. Run database query to verify laundry exists

---

## 📊 What Success Looks Like

After completing all steps, you should see:

1. **Debug page (http://localhost:3001/debug-env):**
   - All env vars shown (SAAS_URL in green)

2. **Browser console:**
   - Debug logs with emoji (🔍 🏢 ✅)
   - "Successfully fetched laundry info"
   - No errors

3. **Home page (http://localhost:3001):**
   - Products display
   - No "Failed to fetch" error
   - Page loads completely

4. **Network tab:**
   - Request to `http://localhost:3000/api/public/laundry/.../info` shows 200 status
   - Response contains laundry data

---

## 💡 Still Not Working?

If you've tried everything and it still doesn't work, share:

1. **Screenshot of http://localhost:3001/debug-env**
2. **Browser console logs** (full output)
3. **Output of:** `lsof -i:3000 && lsof -i:3001`
4. **Output of curl test** (from Step 5)
5. **Contents of .env.local:** `cat /Users/macbook/Documents/pressingrabat/.env.local`

This will help identify the exact issue!
