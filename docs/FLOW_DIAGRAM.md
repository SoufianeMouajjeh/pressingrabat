# Order Flow Diagram

## Complete Customer Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LAUNDRY WEBSITE (Port 3001)                      │
│                     pressingrabat.com                               │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ 1. Browse Products
                                │    http://localhost:3001/services
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Customer adds       │
                    │   products to cart    │
                    │   (Zustand + localStorage) │
                    └───────────────────────┘
                                │
                                │ 2. Go to Cart
                                │    http://localhost:3001/cart
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Review cart items   │
                    │   Update quantities   │
                    └───────────────────────┘
                                │
                                │ 3. Proceed to Checkout
                                │    http://localhost:3001/checkout
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Fill delivery form: │
                    │   • Name              │
                    │   • Email             │
                    │   • Phone             │
                    │   • Address           │
                    └───────────────────────┘
                                │
                                │ 4. Click "Place Order"
                                │    Store cart in sessionStorage
                                │
                                ▼
                    ┌───────────────────────┐
                    │  window.location.href │
                    │  Redirect to SaaS     │
                    └───────────────────────┘
                                │
                                │
┌───────────────────────────────┼───────────────────────────────────┐
│                               │                                   │
│            SAAS PLATFORM (Port 3000)                             │
│            your-saas-domain.com                                  │
│                               │                                   │
│                               ▼                                   │
│               ┌─────────────────────────┐                        │
│               │  /complete-order        │                        │
│               │  ?laundrySlug=...       │                        │
│               │  &apiKey=...            │                        │
│               │  &returnUrl=...         │                        │
│               └─────────────────────────┘                        │
│                               │                                   │
│                               │ 5. Check Authentication           │
│                               │    useSession()                   │
│                               │                                   │
│                   ┌───────────┴──────────┐                       │
│                   │                      │                        │
│            NOT AUTHENTICATED      AUTHENTICATED                   │
│                   │                      │                        │
│                   ▼                      ▼                        │
│       ┌─────────────────────┐  ┌──────────────────────┐         │
│       │  Redirect to        │  │  Read sessionStorage:│         │
│       │  /auth/signin       │  │  • pendingOrderCart  │         │
│       │  (with params)      │  │  • pendingOrderAddress│        │
│       └─────────────────────┘  └──────────────────────┘         │
│                   │                      │                        │
│                   │ 6. Sign In/Sign Up   │ 7. Create Order       │
│                   │                      │                        │
│                   ▼                      ▼                        │
│       ┌─────────────────────┐  ┌──────────────────────┐         │
│       │  /auth/signin       │  │ POST /api/checkout/  │         │
│       │  • Existing: Sign In│  │      authenticated   │         │
│       │  • New: Sign Up     │  │ • Validate API key   │         │
│       │  • NextAuth creates │  │ • Validate session   │         │
│       │    session          │  │ • Validate products  │         │
│       └─────────────────────┘  │ • Calculate price    │         │
│                   │             │ • Create order       │         │
│                   │             │ • Link to customer   │         │
│                   │             └──────────────────────┘         │
│                   │                      │                        │
│                   │ After auth success   │ Order created         │
│                   │ redirect back to     │                        │
│                   │ /complete-order      │                        │
│                   │                      │                        │
│                   └───────────┬──────────┘                        │
│                               │                                   │
│                               │ 8. Order saved in DB:             │
│                               │    • customerId (authenticated)   │
│                               │    • status: NEW_ORDER            │
│                               │    • items with prices            │
│                               │    • delivery address             │
│                               │                                   │
│                               ▼                                   │
│               ┌─────────────────────────┐                        │
│               │  Clear sessionStorage   │                        │
│               │  Redirect to returnUrl  │                        │
│               │  with orderId           │                        │
│               └─────────────────────────┘                        │
│                               │                                   │
└───────────────────────────────┼───────────────────────────────────┘
                                │
                                │ 9. Redirect back
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                    LAUNDRY WEBSITE (Port 3001)                    │
│                     pressingrabat.com                             │
│                               │                                   │
│                               ▼                                   │
│               ┌─────────────────────────┐                        │
│               │  /order-success         │                        │
│               │  ?orderId=xxx           │                        │
│               │  &status=success        │                        │
│               └─────────────────────────┘                        │
│                               │                                   │
│                               │ 10. Success Page                  │
│                               │                                   │
│                               ▼                                   │
│               ┌─────────────────────────┐                        │
│               │  ✓ Order Confirmed      │                        │
│               │  • Show order ID        │                        │
│               │  • Clear cart           │                        │
│               │  • Clear sessionStorage │                        │
│               └─────────────────────────┘                        │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                         AFTER ORDER PLACED                          │
└─────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────┐    ┌─────────────────────────────┐
    │   CUSTOMER VIEW             │    │   ADMIN VIEW                │
    │   /profile                  │    │   /admin/dashboard          │
    │                             │    │                             │
    │   Active Orders:            │    │   New Orders:               │
    │   ┌─────────────────────┐   │    │   ┌─────────────────────┐   │
    │   │ Order #cly123abc    │   │    │   │ Order #cly123abc    │   │
    │   │ Status: NEW_ORDER   │   │    │   │ Customer: John Doe  │   │
    │   │ Total: 150.00 DH    │   │    │   │ Phone: +212...      │   │
    │   │ Items: Shirt, Pants │   │    │   │ Email: john@...     │   │
    │   │ [View Details]      │   │    │   │ Total: 150.00 DH    │   │
    │   └─────────────────────┘   │    │   │ [View] [Update]     │   │
    │                             │    │   └─────────────────────┘   │
    └─────────────────────────────┘    └─────────────────────────────┘
```

## Key Points

### Security
- ✅ Authentication required via NextAuth
- ✅ API key validated for each laundry
- ✅ Server-side price validation
- ✅ Product ownership validation
- ✅ httpOnly session cookies

### Data Flow
1. **Cart data**: localStorage (persistent across browser sessions)
2. **Pending order**: sessionStorage (cleared after order completion)
3. **Order record**: Database (permanent, linked to customer)
4. **Session**: NextAuth cookies (secure, httpOnly)

### User Experience
- Customer browses on familiar laundry website
- Quick authentication on SaaS (one-time setup)
- Seamless redirect back to website
- Can track all orders in SaaS profile
- Admin sees all customer info immediately

### Why This Flow?
1. **Centralized Auth**: One account for all laundries
2. **Customer Tracking**: Orders linked to accounts
3. **Better Data**: Admin sees real customer info
4. **Security**: Authentication prevents fraud
5. **Scalability**: Same pattern for all laundries
