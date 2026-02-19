# TODO: Implement Merchant Authentication and Dashboard

- [ ] Update types.ts: Add password to Merchant, add merchantId to Product and DeliveryPerson
- [ ] Update database/schema.sql: Add password column to merchants, add merchant_id to products and delivery_people
- [ ] Update services/merchantService.ts: Add loginMerchant function, update registerMerchant to include password
- [ ] Update services/productService.ts: Update createProduct to include merchantId, add getProductsByMerchant
- [ ] Update services/deliveryService.ts: Update createDeliveryPerson to include merchantId, add getDeliveryPeopleByMerchant
- [ ] Create components/MerchantLogin.tsx
- [ ] Create components/MerchantDashboard.tsx with forms for adding products and delivery boys
- [ ] Update App.tsx: Add merchant login state, new views for login and dashboard
- [ ] Update components/Header.tsx: Add login/logout for merchant view
- [ ] Update components/MerchantRegistration.tsx: Add password field
- [ ] Update database/seed.sql if needed
- [ ] Test the complete flow
