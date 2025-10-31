# Troubleshooting: SessionStorage & Authentication Flow

## Issue: "Missing order information" Error

### Problem
When a customer is redirected to the SaaS signin page and then signs in/up, NextAuth redirects them back to `/complete-order` but **without the original URL parameters** (laundrySlug, apiKey, returnUrl).

### Root Cause
NextAuth's default redirect behavior doesn't preserve custom query parameters through the authentication flow.

### Solution Implemented
Store critical parameters in **sessionStorage** before redirecting to signin, then retrieve them after authentication.

---

## How It Works Now

### Before Signin (User Not Authenticated)
```javascript
// 1. User lands on: /complete-order?laundrySlug=X&apiKey=Y&returnUrl=Z
// 2. Check: status === 'unauthenticated'
// 3. Store in sessionStorage:
sessionStorage.setItem('pendingOrderLaundrySlug', laundrySlug);
sessionStorage.setItem('pendingOrderApiKey', apiKey);
sessionStorage.setItem('pendingOrderReturnUrl', returnUrl);

// 4. Redirect to signin
router.push('/auth/signin?callbackUrl=/complete-order');
```

### After Signin (User Authenticated)
```javascript
// 1. User lands on: /complete-order (no params!)
// 2. Check: status === 'authenticated'
// 3. Try to get from URL params first:
let laundrySlug = searchParams.get('laundrySlug'); // null

// 4. Fallback to sessionStorage:
if (!laundrySlug) {
  laundrySlug = sessionStorage.getItem('pendingOrderLaundrySlug'); // ✓ Found!
}

// 5. Proceed with order creation
// 6. Clear sessionStorage after success
```

---

## SessionStorage Keys Used

**IMPORTANT**: Cart and address data are now passed via URL parameters (base64 encoded) to avoid cross-domain sessionStorage issues.

| Key | Value | Purpose |
|-----|-------|---------|
| `pendingOrderData` | Base64 string | Encoded cart + address + customer data |
| `pendingOrderLaundrySlug` | String | Laundry identifier (e.g., "clean-fresh-laundry") |
| `pendingOrderApiKey` | String | API key for authentication |
| `pendingOrderReturnUrl` | String | Where to redirect after success |

All keys are **cleared** after successful order creation.

### Why Base64 Encoding?

**Problem**: SessionStorage is **domain-specific**. Data stored on `localhost:3001` (laundry website) is **NOT accessible** on `localhost:3000` (SaaS platform).

**Solution**: Encode order data as base64 and pass it as a URL parameter. This allows data to cross domain boundaries:
```
localhost:3001/checkout → 
  Encode data → 
    localhost:3000/complete-order?orderData=eyJjYXJ0IjpbLi4uXX0=
```

---

## Testing the Fix

### Test 1: New Customer Signup
```bash
1. Add products to cart on laundry website
2. Go to checkout → Fill form → Click "Place Order"
3. Redirected to SaaS: /complete-order?laundrySlug=...
4. Open DevTools → Application → Session Storage
5. Should see all 6 keys stored
6. Redirected to: /auth/signin?callbackUrl=/complete-order
7. Fill signup form → Submit
8. After auth, back to: /complete-order (no URL params)
9. Check DevTools → Session Storage still has the 6 keys
10. Order created successfully
11. Check DevTools → All keys cleared ✓
```

### Test 2: Existing Customer Signin
```bash
Same flow as Test 1, but:
- Step 7: Sign in instead of signup
- Result: Should work the same way
```

### Test 3: Browser Refresh During Flow
```bash
1. Start checkout flow
2. Get to signin page: /auth/signin?callbackUrl=/complete-order
3. Refresh the page (F5 or Cmd+R)
4. SessionStorage persists (survives refresh)
5. Sign in
6. Order should still be created successfully ✓
```

---

## Common Issues & Solutions

### Issue 1: "Missing order information" still appearing
**Possible Causes:**
- SessionStorage was cleared before authentication completed
- User opened signin in a different tab/window
- Incognito/private browsing with strict settings

**Solution:**
```javascript
// Check browser console for:
console.log('Cart:', sessionStorage.getItem('pendingOrderCart'));
console.log('Laundry Slug:', sessionStorage.getItem('pendingOrderLaundrySlug'));
console.log('API Key:', sessionStorage.getItem('pendingOrderApiKey'));

// If any are null, the data was lost
// → User must restart from laundry website
```

### Issue 2: SessionStorage cleared unexpectedly
**Cause:** Browser privacy settings or extensions

**Solution:**
- Disable strict privacy settings for testing
- Disable browser extensions that clear storage
- Try in a standard browser window (not incognito)

### Issue 3: Data persists after successful order
**Cause:** Error occurred before cleanup code executed

**Solution:**
```javascript
// Manually clear in browser console:
sessionStorage.removeItem('pendingOrderCart');
sessionStorage.removeItem('pendingOrderAddress');
sessionStorage.removeItem('pendingOrderCustomer');
sessionStorage.removeItem('pendingOrderLaundrySlug');
sessionStorage.removeItem('pendingOrderApiKey');
sessionStorage.removeItem('pendingOrderReturnUrl');
```

---

## Why SessionStorage vs LocalStorage?

| Feature | SessionStorage | LocalStorage |
|---------|---------------|--------------|
| **Persistence** | Tab/window session only | Permanent (until cleared) |
| **Use Case** | Temporary data for current flow | Long-term data (cart) |
| **Security** | Better (auto-clears on tab close) | Risk if not manually cleared |
| **Our Choice** | ✓ Order flow params | ✓ Shopping cart data |

**Cart uses localStorage** because:
- Customer might browse multiple tabs
- Cart should persist across sessions
- Cleared explicitly after order success

**Order params use sessionStorage** because:
- Only needed during checkout flow
- More secure (auto-cleared)
- Shouldn't persist after order completion

---

## Code Reference

**File:** `/Users/macbook/Documents/laundry-saas/src/app/complete-order/page.tsx`

**Key Lines:**
```typescript
// Line ~25: Store params before signin
if (laundrySlug) sessionStorage.setItem('pendingOrderLaundrySlug', laundrySlug);
if (apiKey) sessionStorage.setItem('pendingOrderApiKey', apiKey);
if (returnUrl) sessionStorage.setItem('pendingOrderReturnUrl', returnUrl);

// Line ~35: Retrieve params after signin
if (!laundrySlug) laundrySlug = sessionStorage.getItem('pendingOrderLaundrySlug');
if (!apiKey) apiKey = sessionStorage.getItem('pendingOrderApiKey');
if (!returnUrl) returnUrl = sessionStorage.getItem('pendingOrderReturnUrl');

// Line ~75: Cleanup after success
sessionStorage.removeItem('pendingOrderCart');
sessionStorage.removeItem('pendingOrderAddress');
sessionStorage.removeItem('pendingOrderCustomer');
sessionStorage.removeItem('pendingOrderLaundrySlug');
sessionStorage.removeItem('pendingOrderApiKey');
sessionStorage.removeItem('pendingOrderReturnUrl');
```

---

## Debugging Tips

### 1. Monitor SessionStorage in DevTools
```javascript
// Add this to complete-order/page.tsx for debugging:
console.log('🔍 SessionStorage State:', {
  cart: !!sessionStorage.getItem('pendingOrderCart'),
  address: !!sessionStorage.getItem('pendingOrderAddress'),
  laundrySlug: !!sessionStorage.getItem('pendingOrderLaundrySlug'),
  apiKey: !!sessionStorage.getItem('pendingOrderApiKey'),
  returnUrl: sessionStorage.getItem('pendingOrderReturnUrl')
});
```

### 2. Track Authentication Status
```javascript
console.log('🔐 Auth Status:', status);
console.log('📍 Current URL:', window.location.href);
console.log('🔗 Search Params:', Object.fromEntries(searchParams.entries()));
```

### 3. Test Error Handling
```javascript
// Manually trigger error by clearing data mid-flow:
sessionStorage.clear();
// Then sign in → Should show error message ✓
```

---

## Production Considerations

### 1. Error Recovery
Consider adding a "Return to Website" button in error state that:
- Clears all sessionStorage
- Redirects user back to laundry website
- Shows message to retry checkout

### 2. Session Timeout
If user takes too long to sign in (e.g., 30+ minutes):
- SessionStorage still persists
- But cart might have changed
- Consider adding timestamp validation

### 3. Cross-Domain Issues
If SaaS and laundry website are on different domains:
- SessionStorage won't be shared (by design)
- Current implementation works because:
  - Cart stored BEFORE leaving laundry website
  - Params stored on SaaS domain during redirect
  - All data retrieved from respective domains

---

## Summary

✅ **Problem Solved**: URL params preserved through authentication flow
✅ **Method**: SessionStorage as temporary data bridge
✅ **Security**: Auto-cleared on success or tab close
✅ **User Experience**: Seamless - no data loss during signin
✅ **Testable**: Can verify in browser DevTools

The fix ensures that customers can complete their order even when NextAuth redirects don't preserve custom URL parameters!
