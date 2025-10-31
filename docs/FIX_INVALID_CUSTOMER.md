# Fix Applied: "Invalid Customer Account" Error

## Problem Identified

### Error Message
```
Invalid customer account
```

### Root Cause

The error occurred because after a customer signed up or signed in from the `/complete-order` page, they were being redirected to `/profile` instead of back to `/complete-order` to complete the order creation.

**The Flow Was Broken:**
```
1. Customer lands on /complete-order (not authenticated)
2. Redirects to /auth/signin?callbackUrl=/complete-order
3. Customer signs up
4. After signup, redirected to /profile ❌ (WRONG!)
5. /complete-order never executes
6. Order never created
```

Additionally, there were cases where:
- The session might not be properly set after registration
- The user role might not be CUSTOMER (e.g., ADMIN trying to place an order)

## Solution Implemented

### 1. Fixed Callback URL Handling (`/auth/signin/page.tsx`)

**Before:**
```typescript
// After registration, always redirected to /profile
if (signInRes?.ok) router.push('/profile');

// After signin, checked role but ignored callbackUrl
if (userData.user?.role === 'SUPER_ADMIN') router.push('/super-admin/dashboard');
else if (userData.user?.role === 'ADMIN') router.push('/admin/dashboard');
else router.push('/profile');
```

**After:**
```typescript
// Get callbackUrl from query parameters
const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const callbackUrl = searchParams?.get('callbackUrl') || '/profile';

// After registration, redirect to callbackUrl
if (signInRes?.ok) router.push(callbackUrl);

// After signin, prioritize callbackUrl for external flows
if (callbackUrl && callbackUrl !== '/profile') {
  router.push(callbackUrl);
} else if (userData.user?.role === 'SUPER_ADMIN') {
  router.push('/super-admin/dashboard');
} else if (userData.user?.role === 'ADMIN') {
  router.push('/admin/dashboard');
} else {
  router.push('/profile');
}
```

### 2. Improved Error Messages (`/api/checkout/authenticated/route.ts`)

**Before:**
```typescript
if (!customer || customer.role !== 'CUSTOMER') {
  return NextResponse.json({ error: 'Invalid customer account' }, { status: 403 });
}
```

**After:**
```typescript
if (!customer) {
  console.error('Customer not found:', session.user.id);
  return NextResponse.json(
    { error: 'Customer account not found. Please try signing in again.' },
    { status: 403 }
  );
}

if (customer.role !== 'CUSTOMER') {
  console.error('User is not a customer:', { id: customer.id, role: customer.role });
  return NextResponse.json(
    { error: `This account is registered as ${customer.role}. Please use a customer account to place orders.` },
    { status: 403 }
  );
}
```

### 3. Added Debugging Logs

**Session Check:**
```typescript
console.log('🔐 Session check:', { 
  hasSession: !!session, 
  hasUser: !!session?.user, 
  userId: session?.user?.id,
  userRole: session?.user?.role,
  userEmail: session?.user?.email
});
```

**Order Creation:**
```typescript
console.log('📦 Creating order...', {
  laundrySlug,
  itemCount: cartItems.length,
  hasAddress: !!addressDetails
});

console.log('📦 Order response:', { 
  status: response.status, 
  ok: response.ok,
  result 
});
```

## How It Works Now

### Complete Flow

```
1. Customer at /complete-order (not authenticated)
   └─ Stores orderData in sessionStorage
   └─ Redirects to: /auth/signin?callbackUrl=/complete-order
   
2. Customer on /auth/signin
   └─ Signs up with email/password
   └─ Auto-signs in with credentials
   └─ Reads callbackUrl from query params
   └─ Redirects to: /complete-order ✓
   
3. Customer back at /complete-order (now authenticated)
   └─ Session available with user.id
   └─ Retrieves orderData from sessionStorage
   └─ Calls /api/checkout/authenticated
   
4. API validates:
   ✓ Session exists
   ✓ User found in database
   ✓ User role is CUSTOMER
   ✓ API key valid
   ✓ Products valid
   
5. Order created successfully!
   └─ Redirects to laundry website success page
```

## Testing the Fix

### Test 1: New Customer Signup
```bash
1. Start both servers
2. Visit laundry website: http://localhost:3001
3. Add products to cart
4. Go to checkout → Fill form
5. Click "Place Order"
6. URL should be: http://localhost:3000/auth/signin?callbackUrl=%2Fcomplete-order
7. Toggle to "Sign Up"
8. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Phone: +212612345678
9. Click "Sign Up"
10. Should redirect to: /complete-order ✓
11. Should see "Processing Your Order" spinner
12. Order created ✓
13. Redirected back to laundry success page
```

### Test 2: Existing Customer Signin
```bash
Same as Test 1, but:
- Step 7: Stay on "Sign In" tab
- Step 8: Enter existing credentials
- Result: Should work the same way
```

### Test 3: Admin Trying to Place Order
```bash
1. Follow Test 1, but sign in as ADMIN
2. Expected: Error message: "This account is registered as ADMIN. Please use a customer account to place orders."
```

## Debugging

If the error persists, check the console logs:

### Browser Console (laundry website)
```javascript
// Should see encoded order data
console.log(new URLSearchParams(window.location.search).get('orderData'));
```

### Browser Console (SaaS /complete-order)
```javascript
// Should see:
// 📦 Creating order... { laundrySlug: 'clean-fresh-laundry', itemCount: 3, hasAddress: true }
// 📦 Order response: { status: 200, ok: true, result: {...} }
```

### Server Terminal (SaaS)
```bash
# Should see:
# 🔐 Session check: { hasSession: true, hasUser: true, userId: 'user_123', userRole: 'CUSTOMER', userEmail: 'test@example.com' }
```

## Common Issues

### Issue 1: "Customer account not found"
**Cause**: Session has user.id but database query failed
**Solution**: Check database connection, verify user exists in database

### Issue 2: "This account is registered as ADMIN"
**Cause**: User signed in with an admin account
**Solution**: Use a customer account or create a new customer account

### Issue 3: Still redirects to /profile after signup
**Cause**: Browser cached old signin page
**Solution**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

## Files Modified

1. **`/src/app/auth/signin/page.tsx`**
   - Added callbackUrl parameter reading
   - Fixed redirect logic after registration
   - Fixed redirect logic after signin
   - Prioritizes callbackUrl for external flows

2. **`/src/app/api/checkout/authenticated/route.ts`**
   - Improved error messages (customer not found vs wrong role)
   - Added session debugging logs
   - Better console logging for troubleshooting

3. **`/src/app/complete-order/page.tsx`**
   - Added order creation debugging logs
   - Better error message display
   - Logs order response for debugging

## Summary

✅ **Problem**: After signup, user redirected to wrong page  
✅ **Solution**: Honor callbackUrl parameter in signin flow  
✅ **Result**: User returns to /complete-order after authentication  
✅ **Benefit**: Order creation completes successfully  
✅ **Debugging**: Added logs at every step for troubleshooting  

The "Invalid customer account" error should now be resolved. Customers can successfully sign up or sign in and have their orders created! 🎉

---

**Status: ✅ READY FOR TESTING**

Follow Test 1 above to verify the complete flow works end-to-end.
