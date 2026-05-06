/*
  Optional product ID map.
  ------------------------------------------------------------
  You can leave this file as-is if your CSV uses the auto-generated IDs
  from FIREBASE_PRODUCT_PRICE_TEMPLATE.csv.

  To force a specific Firestore document ID without touching HTML image paths,
  add entries like:

  window.FAWZ_PRODUCT_ID_MAP = {
      "beadsAndKits.html": {
          "Pearl Beads + Pins": "pearl_beads_pins"
      },
      "biasBinding.html": {
          "13mm": "bias_binding_13mm",
          "18mm": "bias_binding_18mm",
          "25mm": "bias_binding_25mm"
      }
  };
*/
window.FAWZ_PRODUCT_ID_MAP = window.FAWZ_PRODUCT_ID_MAP || {};
