# Authentication-Based Order Flow

## Overview

Customers now **must sign in or sign up** on the SaaS platform before their order is placed. This ensures:
- Orders are associated with authenticated customer accounts
- Customers can track their orders in their profile
- Admins see orders in their dashboard with proper customer info

## User Flow

```
1. Customer browses laundry website (e.g., pressingrabat)
   └─> Adds products to cart

2. Customer clicks "Checkout"
   └─> Fills out delivery address form
   
3. Customer clicks "Place Order"
   └─> Redirected to SaaS signin/signup page
   └─> Cart data stored in sessionStorage
   
4. Customer signs in or creates account on SaaS
   └─> After authentication: Redirected to /complete-order
   
5. SaaS creates order with authenticated customer
   └─> Order appears in customer's "Active Orders"
   └─> Order appears in admin's "New Orders" dashboard
   
6. Customer redirected back to laundry website
   └─> Shows order success page with order ID
   └─> Cart is cleared
```

## Technical Implementation

### 1. Laundry Website (pressingrabat)

**File: `app/checkout/page.tsx`**
- Validates form input (name, email, phone, address)
- Stores cart and address in `sessionStorage`:
  - `pendingOrderCart` - Array of cart items
  - `pendingOrderAddress` - Delivery address details
  - `pendingOrderCustomer` - Customer basic info
- Redirects to SaaS: `{SAAS_URL}/complete-order?laundrySlug=...&apiKey=...&returnUrl=...&email=...`

**File: `app/order-success/page.tsx`**
- Receives `orderId` and `status=success` from URL
- Clears cart and sessionStorage
- Shows order confirmation

### 2. SaaS Platform (laundry-saas)

**File: `src/app/complete-order/page.tsx`**
- Checks if user is authenticated
  - If NOT: Stores laundrySlug, apiKey, returnUrl in `sessionStorage`, then redirects to `/auth/signin`
  - If YES: Proceeds to create order
- Reads order data from `sessionStorage`:
  - `pendingOrderCart` - Cart items
  - `pendingOrderAddress` - Delivery address
  - `pendingOrderLaundrySlug` - Laundry identifier
  - `pendingOrderApiKey` - API authentication
  - `pendingOrderReturnUrl` - Where to redirect after success
- Calls `/api/checkout/authenticated` to create order
- Clears all pending data from sessionStorage
- Redirects back to laundry website with order ID

**File: `src/app/api/checkout/authenticated/route.ts`**
- **Requires NextAuth session** (customer must be signed in)
- Validates API key from laundry
- Associates order with authenticated customer (`session.user.id`)
- Creates order with status `NEW_ORDER`
- Returns order ID

**File: `src/app/auth/signin/page.tsx`** (existing)
- Handles both signin and signup
- After successful auth, NextAuth session is created
- User is redirected to original destination (`/complete-order`)

## Database

Orders created through this flow:
- **customerId**: Authenticated user's ID
- **status**: `NEW_ORDER`
- **ourceChannel**: `WORDPRESS` (external website)
- Associated with customer's user account
- Visible in:
  - Customer's profile → Active Orders
  - Admin dashboard → New Orders tab

## Environment Variables

**Laundry Website (.env.local)**
```env
NEXT_PUBLIC_SAAS_URL=http://localhost:3000
NEXT_PUBLIC_LAUNDRY_SLUG=clean-fresh-laundry
NEXT_PUBLIC_LAUNDRY_API_KEY=wp_2hmoc70526zqpwdqc3keo
```

**SaaS Platform (.env)**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=your-database-url
```

## API Endpoints

### POST `/api/checkout/authenticated` (SaaS)
**Authentication**: NextAuth session required
**Headers**: `x-api-key` (laundry's API key)
**Body**:
```json
{
  "laundrySlug": "clean-fresh-laundry",
  "cartItems": [
    {
      "productId": "prod_123",
      "serviceType": "WASH_IRON",
      "quantity": 2
    }
  ],
  "addressDetails": {
    "street": "123 Main St",
    "city": "Rabat",
    "postalCode": "10000",
    "type": "HOME"
  }
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "order_abc123",
  "message": "Order created successfully",
  "order": {
    "id": "order_abc123",
    "status": "NEW_ORDER",
    "totalPrice": 150,
    "createdAt": "2025-10-31T12:00:00Z"
  }
}
```

## Testing the Flow

1. **Start both servers**:
   ```bash
   # Terminal 1: SaaS
   cd /Users/macbook/Documents/laundry-saas
   npm run dev

   # Terminal 2: Laundry Website
   cd /Users/macbook/Documents/pressingrabat
   npm run dev
   ```

2. **Test as new customer**:
   - Visit http://localhost:3001
   - Browse products → Add to cart
   - Go to checkout → Fill address form
   - Click "Place Order"
   - Should redirect to SaaS signin
   - Create new account (name, email, password, phone)
   - Should auto-create order and redirect back
   - Check order in customer profile: http://localhost:3000/profile

3. **Test as existing customer**:
   - Visit http://localhost:3001
   - Add products to cart
   - Go to checkout → Fill form
   - Click "Place Order"
   - Sign in with existing credentials
   - Should create order and redirect back
   - Check order in profile

4. **Verify admin dashboard**:
   - Sign in as admin: http://localhost:3000/auth/signin
   - Go to admin dashboard: http://localhost:3000/admin/dashboard
   - Check "New Orders" tab
   - Should see the order with customer info

## Security Features

✅ **API Key Validation**: Each laundry has unique API key
✅ **Authentication Required**: Orders only created for authenticated users
✅ **Server-Side Price Validation**: Prevents price tampering
✅ **Product Validation**: Ensures products belong to the laundry
✅ **CORS Protection**: Only accepts requests from registered laundry websites
✅ **Session Security**: NextAuth with httpOnly cookies

## Future Enhancements

- Email confirmation after order creation
- SMS notification to customer
- Real-time order updates via WebSocket
- Order tracking page on laundry website
- Customer order history on laundry website (with SaaS session)
