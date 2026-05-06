FAWZ FIREBASE PRODUCT-ID BUILD
==============================

This ZIP is code-only. It deliberately excludes the images folder.
Copy these files over your existing project folder that already contains images/.

What was changed:
- Existing HTML links and image paths were preserved.
- Firebase scripts were injected into each HTML head.
- Pricing logic was moved into fawz-firebase-pricing.js.
- Front-end deterrents were moved into fawz-security.js.

Firebase requirements:
1. Edit firebase-config.js and add your Firebase config.
2. Each logged-in user needs a document:
   users/{uid}
   { tier: "tier_1" }  // or tier_2, tier_3, tier_4, tier_5

3. Product prices go here:
   product_mirror/{productId}
   {
     name: "Product Name",
     tier_1: 100,
     tier_2: 95,
     tier_3: 90,
     tier_4: 85,
     tier_5: 80
   }

4. Use FIREBASE_PRODUCT_PRICE_TEMPLATE.csv as your starting point.

Important:
- If your CSV product_id values match the template, no HTML editing is required.
- If you want custom product IDs, edit fawz-product-id-map.js instead of touching HTML image paths.
- Browser code cannot fully hide source/database paths. Use Firebase Security Rules for real protection.
