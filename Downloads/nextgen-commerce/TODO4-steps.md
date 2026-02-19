# TODO4 Implementation Steps

- [x] Update database/seed.sql: Add password to merchants
- [x] Update services/merchantService.ts: Add registerMerchant and loginMerchant functions
- [x] Update services/productService.ts: Update createProduct to include merchantId, add getProductsByMerchant
- [x] Update services/deliveryService.ts: Update createDeliveryPerson to include merchantId, add getDeliveryPeopleByMerchant
- [x] Create components/MerchantLogin.tsx
- [x] Create components/MerchantDashboard.tsx
- [x] Update App.tsx: Add merchant login state and new views
- [x] Update components/Header.tsx: Add login/logout for merchant view
- [x] Update components/MerchantRegistration.tsx: Add password field
- [x] Test the complete flow
