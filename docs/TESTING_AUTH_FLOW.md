# Testing the Authentication-Based Order Flow

## Prerequisites

✅ Both servers running:
- SaaS: http://localhost:3000
- Laundry Website: http://localhost:3001

✅ Database has:
- Laundry: "Clean & Fresh Laundry" (slug: clean-fresh-laundry)
- API Key: wp_2hmoc70526zqpwdqc3keo
- Products with services configured

## Test Scenario 1: New Customer Sign-Up Flow

### Steps:
1. **Browse Products** (Laundry Website)
   ```
   URL: http://localhost:3001/services
   Action: Add 2-3 products to cart with different services
   Expected: Cart badge shows correct count
   ```

2. **View Cart**
   ```
   URL: http://localhost:3001/cart
   Expected: See all items with correct prices
   Action: Verify quantities, remove/add items if needed
   ```

3. **Go to Checkout**
   ```
   URL: http://localhost:3001/checkout
   Action: Fill out form:
   - Name: Test Customer
   - Email: testcustomer@example.com (NEW email)
   - Phone: +212612345678
   - Street: 123 Test Street
   - City: Rabat
   - Postal Code: 10000
   ```

4. **Click "Place Order"**
   ```
   Expected: Redirect to SaaS complete-order page
   URL should be: http://localhost:3000/complete-order?laundrySlug=...&apiKey=...
   Expected: Then auto-redirect to signin (not authenticated yet)
   ```

5. **Sign Up on SaaS**
   ```
   URL: http://localhost:3000/auth/signin
   Expected: Email field pre-filled with testcustomer@example.com
   Action: Toggle to "Sign Up" mode
   Fill:
   - Name: Test Customer
   - Email: testcustomer@example.com (pre-filled)
   - Password: password123
   - Phone: +212612345678
   
   Click "Sign Up"
   ```

6. **Order Created Automatically**
   ```
   Expected: After signup, redirect to /complete-order
   Expected: "Processing Your Order" spinner shows briefly
   Expected: Order created in database
   Expected: Redirect back to laundry website success page
   URL: http://localhost:3001/order-success?orderId=order_xxx&status=success
   ```

7. **Verify Order Success Page**
   ```
   URL: http://localhost:3001/order-success?orderId=...
   Expected:
   - ✅ Green checkmark icon
   - ✅ "Order Placed Successfully!" message
   - ✅ Order ID displayed (e.g., cly123abc)
   - ✅ Cart badge shows 0 (cart cleared)
   ```

8. **Verify in Customer Profile**
   ```
   URL: http://localhost:3000/profile
   Expected:
   - Customer is signed in
   - "Active Orders" section shows the new order
   - Order status: "NEW_ORDER" or "New Order"
   - Correct total price
   - All items listed
   ```

9. **Verify in Admin Dashboard**
   ```
   URL: http://localhost:3000/auth/signin
   Action: Sign in as admin (admin user for Clean & Fresh Laundry)
   Then: http://localhost:3000/admin/dashboard
   Expected:
   - "New Orders" tab shows the order
   - Customer name: Test Customer
   - Customer email: testcustomer@example.com
   - All items with quantities
   - Correct total price
   ```

---

## Test Scenario 2: Existing Customer Sign-In Flow

### Steps:
1. **Sign Out** (if signed in)
   ```
   URL: http://localhost:3000/profile
   Action: Click "Sign Out"
   ```

2. **Browse & Add to Cart** (Laundry Website)
   ```
   URL: http://localhost:3001/services
   Action: Add different products to cart
   ```

3. **Checkout with Existing Email**
   ```
   URL: http://localhost:3001/checkout
   Fill form with:
   - Email: testcustomer@example.com (EXISTING email from Test 1)
   - Different address if desired
   ```

4. **Click "Place Order"**
   ```
   Expected: Redirect to SaaS signin
   ```

5. **Sign In with Existing Account**
   ```
   URL: http://localhost:3000/auth/signin
   Action: Stay in "Sign In" mode
   Fill:
   - Email: testcustomer@example.com
   - Password: password123
   
   Click "Sign In"
   ```

6. **Order Created & Redirected**
   ```
   Expected: Same flow as Test 1
   - Order created
   - Redirect to success page
   - Order visible in profile
   ```

7. **Verify Multiple Orders in Profile**
   ```
   URL: http://localhost:3000/profile
   Expected: See BOTH orders (from Test 1 and Test 2)
   ```

---

## Test Scenario 3: Error Handling

### Test 3A: Invalid Product (Product Deleted)
```
1. Add products to cart
2. Manually delete one product from database (or set status to INACTIVE)
3. Try to checkout
Expected: Error message about invalid/unavailable products
```

### Test 3B: Missing SessionStorage Data
```
1. Start checkout flow
2. Open Browser DevTools → Application → Session Storage
3. Delete "pendingOrderCart" entry
4. Complete authentication
Expected: Error message about missing order information
```

### Test 3C: Invalid API Key
```
1. Edit laundry website .env.local
2. Change NEXT_PUBLIC_LAUNDRY_API_KEY to wrong value
3. Try to checkout
Expected: Error about invalid API key
```

---

## Verification Checklist

After completing tests, verify:

### Database:
- [ ] New customer created in `User` table (role: CUSTOMER)
- [ ] Orders created in `Order` table (status: NEW_ORDER)
- [ ] Order items created in `OrderItem` table
- [ ] Addresses created in `Address` table
- [ ] Activity logs created in `ActivityLog` table (action: ORDER_CREATED)

### SaaS Customer Profile:
- [ ] Customer can see all their orders
- [ ] Order details are correct (items, prices, address)
- [ ] Order status visible

### SaaS Admin Dashboard:
- [ ] Admin sees orders in "New Orders" tab
- [ ] Customer information visible (name, email, phone)
- [ ] Can view order details
- [ ] Can update order status

### Laundry Website:
- [ ] Cart persists during checkout process
- [ ] Cart clears after successful order
- [ ] SessionStorage clears after order
- [ ] Success page shows order ID
- [ ] Can place another order after first one

---

## Common Issues & Troubleshooting

### Issue: "Network Error" when creating order
**Solution**: Check that SaaS server is running on port 3000

### Issue: Redirect loop between signin and complete-order
**Solution**: Clear browser cookies and sessionStorage, try again

### Issue: Order not appearing in admin dashboard
**Solution**: 
- Check admin is logged in with correct laundry association
- Verify order.laundryId matches admin's laundry
- Check order status filter in dashboard

### Issue: Cart not cleared after order
**Solution**: Check browser console for errors, verify localStorage key matches

### Issue: Email not pre-filled on signin page
**Solution**: Check URL params include `email=...`

---

## Performance Expectations

- Redirect to SaaS: < 500ms
- Authentication: < 2s
- Order creation: < 1s
- Redirect back to website: < 500ms
- **Total flow time: ~5-10 seconds**

---

## Next Steps After Testing

1. ✅ Test all 3 scenarios successfully
2. 📝 Document any bugs found
3. 🚀 Deploy to production (follow DEPLOYMENT.md)
4. 📧 Add email confirmations
5. 📱 Add SMS notifications
6. 🔔 Add real-time WebSocket updates
