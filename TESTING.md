# Testing Guide - Clean & Fresh Laundry Website

## ✅ Testing Complete Flow

### Prerequisites
- SaaS platform running on `http://localhost:3000`
- Laundry website running on `http://localhost:3001`

### Step-by-Step Test

#### 1. Homepage Test
- [ ] Visit `http://localhost:3001`
- [ ] Verify laundry name displays: "Clean & Fresh Laundry"
- [ ] Verify logo displays (if available in database)
- [ ] Click "Browse Services" button
- [ ] Verify navigation to services page

#### 2. Services/Products Page Test
- [ ] Visit `http://localhost:3001/services`
- [ ] Verify products load from SaaS API
- [ ] Check product images display
- [ ] Select different service types (Washing, Ironing, Dry Cleaning)
- [ ] Click "Add to Cart" button
- [ ] Verify "Added to Cart!" confirmation appears
- [ ] Check cart badge updates with item count
- [ ] Add multiple products to cart

#### 3. Shopping Cart Test
- [ ] Click cart icon or "View Cart" button
- [ ] Visit `http://localhost:3001/cart`
- [ ] Verify all cart items display correctly
- [ ] Test quantity increase (+) button
- [ ] Test quantity decrease (-) button
- [ ] Verify item subtotals calculate correctly
- [ ] Test remove item (trash icon) button
- [ ] Verify total price updates correctly
- [ ] Click "Proceed to Checkout" button

#### 4. Checkout Page Test
- [ ] Visit `http://localhost:3001/checkout`
- [ ] Verify order summary displays correctly
- [ ] Fill in customer information:
  - Name: "John Doe"
  - Email: "john@example.com"
  - Phone: "+212 6 12 34 56 78"
- [ ] Fill in delivery address:
  - Street: "123 Main Street"
  - City: "Rabat"
  - Postal Code: "10000"
  - Address Type: "HOME"
- [ ] Verify form validation works (try submitting empty form)
- [ ] Click "Place Order" button
- [ ] Verify loading state appears
- [ ] Wait for order creation

#### 5. Order Success Page Test
- [ ] Verify redirect to `/order-success?orderId=xxx`
- [ ] Check order ID displays correctly
- [ ] Verify success checkmark icon shows
- [ ] Read "What happens next" section
- [ ] Check contact information displays
- [ ] Test "Place Another Order" button
- [ ] Test "Return to Home" button

#### 6. Cart Persistence Test
- [ ] Add items to cart
- [ ] Close browser tab
- [ ] Open new tab and visit site
- [ ] Verify cart items persist (localStorage)
- [ ] Complete checkout
- [ ] Verify cart clears after order

#### 7. Empty States Test
- [ ] Visit `/cart` with empty cart
- [ ] Verify empty state message shows
- [ ] Click "Browse Services" button
- [ ] Add items and continue

### Backend Verification (SaaS)

#### Check Order in Database
```bash
cd /Users/macbook/Documents/laundry-saas
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const orders = await prisma.order.findMany({
    where: { laundryId: 'clean-fresh-laundry-id' },
    include: {
      customer: true,
      items: { include: { product: true } },
      address: true
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  console.log('Recent Orders:', JSON.stringify(orders, null, 2));
  await prisma.\$disconnect();
})();
"
```

#### Check Customer Creation
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const customers = await prisma.customer.findMany({
    where: { email: 'john@example.com' },
    include: { addresses: true }
  });
  
  console.log('Customer:', JSON.stringify(customers, null, 2));
  await prisma.\$disconnect();
})();
"
```

### API Testing

#### Test Laundry Info API
```bash
curl -X GET 'http://localhost:3000/api/public/laundry/clean-fresh-laundry/info' \
  -H 'x-api-key: wp_2hmoc70526zqpwdqc3keo'
```

Expected response:
```json
{
  "id": "...",
  "name": "Clean & Fresh Laundry",
  "address": "...",
  "phoneNumber": "...",
  "slaHours": 24,
  "logo": "...",
  "primaryColor": "#3B82F6"
}
```

#### Test Products API
```bash
curl -X GET 'http://localhost:3000/api/public/laundry/clean-fresh-laundry/products' \
  -H 'x-api-key: wp_2hmoc70526zqpwdqc3keo'
```

Expected: Array of products with services

#### Test Checkout API
```bash
curl -X POST 'http://localhost:3000/api/checkout' \
  -H 'x-api-key: wp_2hmoc70526zqpwdqc3keo' \
  -H 'Content-Type: application/json' \
  -d '{
    "laundrySlug": "clean-fresh-laundry",
    "cartItems": [{
      "productId": "product-id-here",
      "serviceType": "NETTOYAGE",
      "quantity": 2
    }],
    "customerInfo": {
      "name": "Test Customer",
      "email": "test@example.com",
      "phone": "+212612345678",
      "addressDetails": {
        "street": "123 Test St",
        "city": "Rabat",
        "postalCode": "10000",
        "type": "HOME"
      }
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "orderId": "...",
  "message": "Order created successfully"
}
```

## 🐛 Known Issues / Edge Cases

### To Test:
- [ ] What happens if SaaS is offline?
- [ ] What happens if API key is invalid?
- [ ] What happens if product has no services?
- [ ] What happens if product has no image?
- [ ] Form validation with invalid email format
- [ ] Form validation with missing required fields
- [ ] Network timeout during checkout
- [ ] Duplicate order submission (double-click prevention)

### Error Handling:
- [ ] API connection errors show user-friendly message
- [ ] Invalid form data shows validation errors
- [ ] Failed order creation shows error message
- [ ] Cart persists even after page refresh

## 📊 Performance Checks

- [ ] Homepage loads in < 3 seconds
- [ ] Services page loads products in < 2 seconds
- [ ] Cart operations are instant (localStorage)
- [ ] Checkout submission responds in < 3 seconds
- [ ] Images lazy load properly
- [ ] No console errors in browser DevTools

## 🎨 UI/UX Checks

- [ ] All pages are responsive (test mobile, tablet, desktop)
- [ ] Cart badge updates in real-time
- [ ] "Added to Cart" animation works
- [ ] Loading spinners appear during API calls
- [ ] Hover states work on all buttons
- [ ] Links navigate correctly
- [ ] Footer displays on all pages
- [ ] Header is sticky on scroll

## ✅ Test Results

Date: ___________
Tester: ___________

| Test Case | Status | Notes |
|-----------|--------|-------|
| Homepage | ✅ PASS | |
| Services Page | ✅ PASS | |
| Add to Cart | ✅ PASS | |
| Shopping Cart | ✅ PASS | |
| Checkout Form | ✅ PASS | |
| Order Creation | ✅ PASS | |
| Success Page | ✅ PASS | |
| Cart Persistence | ✅ PASS | |
| API Integration | ✅ PASS | |
| Error Handling | 🔨 TODO | |
| Mobile Responsive | 🔨 TODO | |

## 🚀 Production Readiness

Before deploying to production:
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] All images optimized
- [ ] Environment variables set correctly
- [ ] API keys secured
- [ ] Analytics added (if needed)
- [ ] SEO meta tags verified
- [ ] Performance optimized (Lighthouse score > 90)
- [ ] Cross-browser testing complete

---

**Website Status**: ✅ READY FOR TESTING

**Dev Server**: http://localhost:3001
**SaaS Backend**: http://localhost:3000
