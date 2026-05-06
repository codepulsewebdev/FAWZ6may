/*
  FAWZ FIREBASE PRICING LAYER
  ------------------------------------------------------------
  This file is intentionally separate from the HTML pages so image paths,
  page links, card links, CSS paths and existing modal layouts stay untouched.

  Firebase product document path:
    product_mirror/{productId}

  Product document example:
    {
      name: "Bias Binding 13mm",
      tier_1: 100,
      tier_2: 95,
      tier_3: 90,
      tier_4: 85,
      tier_5: 80
    }

  User tier document example:
    users/{uid}
    {
      tier: "tier_3"
    }

  Product ID priority:
    1. data-product-id on clicked card / selected option
    2. window.FAWZ_PRODUCT_ID_MAP from fawz-product-id-map.js
    3. Auto slug fallback based on page + product/option text
*/

import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.userTier = window.userTier || "tier_1";
window.fawzCurrentProductId = window.fawzCurrentProductId || "";
window.fawzCurrentProductName = window.fawzCurrentProductName || "";
window.fawzCurrentUnitPrice = window.fawzCurrentUnitPrice || 0;
window.FAWZ_PRODUCT_ID_MAP = window.FAWZ_PRODUCT_ID_MAP || {};

const pageKey = location.pathname.split("/").pop() || "home.html";
const PRICE_COLLECTION = "product_mirror";
const USER_COLLECTION = "users";

function slugify(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function getMappedProductId(label, fallbackPrefix = "") {
    const pageMap = window.FAWZ_PRODUCT_ID_MAP?.[pageKey] || {};
    if (label && pageMap[label]) return pageMap[label];

    const globalMap = window.FAWZ_PRODUCT_ID_MAP?.["*"] || {};
    if (label && globalMap[label]) return globalMap[label];

    const fallback = [fallbackPrefix, label].filter(Boolean).join(" ");
    return slugify(fallback || label || pageKey.replace(/\.html?$/i, ""));
}

function ensurePriceElement() {
    let el = document.getElementById("price") || document.getElementById("totalPrice") || document.getElementById("priceAmt");
    if (el) return el;

    const qty = document.getElementById("qty") || document.querySelector('input[type="number"]');
    const button = document.querySelector('.btn-add, button[onclick*="addToCart"], button');
    el = document.createElement("p");
    el.id = "price";
    el.style.fontSize = "2em";
    el.style.fontWeight = "900";
    el.style.margin = "20px 0";
    el.textContent = "Select product";

    if (qty && qty.parentNode) {
        qty.insertAdjacentElement("afterend", el);
    } else if (button && button.parentNode) {
        button.parentNode.insertBefore(el, button);
    } else {
        document.body.appendChild(el);
    }
    return el;
}

function setPriceText(text) {
    const main = ensurePriceElement();
    if (main) main.textContent = text;

    const priceAmt = document.getElementById("priceAmt");
    const totalPrice = document.getElementById("totalPrice");
    if (priceAmt && priceAmt !== main) priceAmt.textContent = text.replace(/^R\s*/i, "");
    if (totalPrice && totalPrice !== main) totalPrice.textContent = text;
}

function selectedOptionLabel() {
    const selects = [
        document.getElementById("size"),
        document.getElementById("binding-size"),
        document.getElementById("opt-sel"),
        document.getElementById("col-sel"),
        document.getElementById("main-select"),
        document.getElementById("bra-size"),
        document.getElementById("bra-type"),
        document.getElementById("bra-color")
    ].filter(Boolean);

    const labels = [];
    for (const sel of selects) {
        if (!sel.value) continue;
        const opt = sel.options?.[sel.selectedIndex];
        const productId = opt?.getAttribute("data-product-id") || sel.getAttribute("data-product-id");
        if (productId) {
            window.fawzCurrentProductId = productId;
            return opt?.textContent?.trim() || sel.value;
        }
        labels.push(opt?.textContent?.trim() || sel.value);
    }
    return labels.filter(Boolean).join(" ").trim();
}

function detectProductFromDOM() {
    const label = selectedOptionLabel()
        || document.getElementById("product-label")?.textContent?.trim()
        || document.getElementById("modal-title")?.textContent?.trim()
        || document.querySelector("h2,h3,strong")?.textContent?.trim()
        || pageKey.replace(/\.html?$/i, "");

    if (!window.fawzCurrentProductId) {
        window.fawzCurrentProductId = getMappedProductId(label, pageKey.replace(/\.html?$/i, ""));
    }
    window.fawzCurrentProductName = label;
    return { productId: window.fawzCurrentProductId, label };
}

async function loadUserTier(user) {
    if (!user) {
        window.userTier = window.userTier || "tier_1";
        return;
    }

    try {
        const userRef = doc(db, USER_COLLECTION, user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            window.userTier = data.tier || "tier_1";
        } else {
            window.userTier = "tier_1";
        }
    } catch (error) {
        console.warn("Fawz: could not load user tier. Defaulting to tier_1.", error);
        window.userTier = "tier_1";
    }

    if (typeof window.updatePrice === "function") window.updatePrice();
}

onAuthStateChanged(auth, loadUserTier);

window.fawzFetchTierPrice = async function(productId) {
    if (!productId) throw new Error("No productId selected.");

    const productRef = doc(db, PRICE_COLLECTION, productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        throw new Error("No Firestore product found for productId: " + productId);
    }

    const data = productSnap.data();
    const tier = window.userTier || "tier_1";
    const rawPrice = data[tier];

    if (rawPrice === undefined || rawPrice === null || rawPrice === "") {
        throw new Error("Missing price field " + tier + " for productId: " + productId);
    }

    const price = Number(rawPrice);
    if (Number.isNaN(price)) {
        throw new Error("Price field " + tier + " is not numeric for productId: " + productId);
    }

    return price;
};

const originalOpenModal = window.openModal;
if (typeof originalOpenModal === "function") {
    window.openModal = function(...args) {
        window.fawzCurrentProductId = "";
        window.fawzCurrentProductName = "";

        const first = args[0];
        if (first?.dataset?.productId) {
            window.fawzCurrentProductId = first.dataset.productId;
            window.fawzCurrentProductName = first.dataset.name || first.textContent?.trim() || "";
        } else if (typeof first === "string") {
            window.fawzCurrentProductName = first;
            window.fawzCurrentProductId = getMappedProductId(first, pageKey.replace(/\.html?$/i, ""));
        }

        const result = originalOpenModal.apply(this, args);

        setTimeout(() => {
            window.fawzCurrentProductId = "";
            detectProductFromDOM();
            if (typeof window.updatePrice === "function") window.updatePrice();
        }, 0);

        return result;
    };
}

window.updatePrice = async function() {
    const qtyInput = document.getElementById("qty") || document.querySelector('input[type="number"]');
    const qty = Math.max(parseInt(qtyInput?.value || "1", 10) || 1, 1);
    const { productId } = detectProductFromDOM();

    if (!productId) {
        window.fawzCurrentUnitPrice = 0;
        setPriceText("Select product");
        return;
    }

    try {
        setPriceText("Loading...");
        const unitPrice = await window.fawzFetchTierPrice(productId);
        const total = unitPrice * qty;
        window.fawzCurrentUnitPrice = unitPrice;
        setPriceText("R " + total.toFixed(2));
    } catch (error) {
        window.fawzCurrentUnitPrice = 0;
        setPriceText("Price unavailable");
        console.warn("Fawz Firebase pricing error:", error);
    }
};

document.addEventListener("change", event => {
    const target = event.target;
    if (!target) return;

    if (target.matches("select, input[type='number'], #qty")) {
        window.fawzCurrentProductId = "";
        setTimeout(() => window.updatePrice(), 0);
    }
}, true);

document.addEventListener("input", event => {
    if (event.target?.matches("input[type='number'], #qty")) {
        window.updatePrice();
    }
}, true);

/*
  Patch addToCart lightly so cart lines can carry productId/unitPrice without
  changing the original image/link behaviour.
*/
const originalAddToCart = window.addToCart;
if (typeof originalAddToCart === "function") {
    window.addToCart = function(...args) {
        detectProductFromDOM();
        const before = JSON.parse(localStorage.getItem("cart") || "[]");
        const result = originalAddToCart.apply(this, args);
        const after = JSON.parse(localStorage.getItem("cart") || "[]");
        if (after.length > before.length) {
            const last = after[after.length - 1];
            last.productId = last.productId || window.fawzCurrentProductId;
            last.unitPrice = last.unitPrice || window.fawzCurrentUnitPrice;
            last.tier = last.tier || window.userTier || "tier_1";
            const qty = Number(last.qty || 1);
            if (!last.total && window.fawzCurrentUnitPrice) last.total = window.fawzCurrentUnitPrice * qty;
            localStorage.setItem("cart", JSON.stringify(after));
        }
        return result;
    };
}
