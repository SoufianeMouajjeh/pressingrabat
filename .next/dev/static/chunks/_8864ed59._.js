(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Configuration for Clean & Fresh Laundry Website
 * Connected to the main SaaS platform
 */ __turbopack_context__.s([
    "laundryConfig",
    ()=>laundryConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const laundryConfig = {
    // Laundry identification
    slug: ("TURBOPACK compile-time value", "clean-fresh-laundry") || 'clean-fresh-laundry',
    apiKey: ("TURBOPACK compile-time value", "wp_2hmoc70526zqpwdqc3keo") || '',
    // SaaS platform URLs
    saasUrl: ("TURBOPACK compile-time value", "https://laundry-saas-seven.vercel.app") || '',
    siteUrl: ("TURBOPACK compile-time value", "https://pressingrabat.vercel.app") || 'http://localhost:3001',
    // Branding (will be fetched from API)
    name: 'Clean & Fresh Laundry',
    logo: null,
    primaryColor: '#3B82F6'
};
// Debug logging
console.log('⚙️ Config loaded:', {
    slug: laundryConfig.slug,
    hasApiKey: !!laundryConfig.apiKey,
    saasUrl: laundryConfig.saasUrl || '(empty - using local routes)',
    siteUrl: laundryConfig.siteUrl
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/saas-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Client for communicating with the SaaS platform
 * All requests include the API key for authentication
 */ __turbopack_context__.s([
    "createOrder",
    ()=>createOrder,
    "fetchLaundryInfo",
    ()=>fetchLaundryInfo,
    "fetchProducts",
    ()=>fetchProducts,
    "getCheckoutUrl",
    ()=>getCheckoutUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-client] (ecmascript)");
;
// Known invalid image domains that should be replaced with placeholders
const INVALID_IMAGE_DOMAINS = [
    'laundry-app.com',
    'example.com'
];
/**
 * Sanitize image URL - returns null for invalid domains
 * This handles cases where the API returns URLs for non-existent domains
 */ const sanitizeImageUrl = (url)=>{
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        // Check if the hostname matches any invalid domain
        for (const invalidDomain of INVALID_IMAGE_DOMAINS){
            if (urlObj.hostname.endsWith(invalidDomain)) {
                console.log(`⚠️ Filtering out invalid image URL: ${url}`);
                return null;
            }
        }
        return url;
    } catch  {
        // If URL is relative or malformed, return as-is
        return url;
    }
};
// Helper function to build full URL
const getFullUrl = (path)=>{
    console.log('🔍 DEBUG - Building URL:', {
        path,
        saasUrl: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].saasUrl,
        hasWindow: ("TURBOPACK compile-time value", "object") !== 'undefined'
    });
    // If saasUrl is set, use it as base (remove trailing slash if present)
    if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].saasUrl) {
        const baseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].saasUrl.replace(/\/$/, ''); // Remove trailing slash
        const fullUrl = `${baseUrl}${path}`;
        console.log('✅ Using saasUrl:', fullUrl);
        return fullUrl;
    }
    // For server-side calls without saasUrl, construct full URL
    // This works in development when the API routes are in the same Next.js app
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // For client-side calls, use relative path (works with same-origin API routes)
    console.log('🌐 Client-side relative path:', path);
    return path;
};
const fetchLaundryInfo = async ()=>{
    const url = getFullUrl(`/api/public/laundry/${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].slug}/info`);
    console.log('🏢 Fetching laundry info from:', url);
    try {
        const response = await fetch(url, {
            headers: {
                'x-api-key': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].apiKey,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });
        console.log('📡 Response status:', response.status, response.statusText);
        if (!response.ok) {
            const errorText = await response.text().catch(()=>'Unable to read error');
            console.error('❌ API Error:', {
                status: response.status,
                error: errorText
            });
            throw new Error(`Failed to fetch laundry info: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('✅ Successfully fetched laundry info');
        // Sanitize logo URLs to filter out invalid domains
        return {
            ...data,
            logo: sanitizeImageUrl(data.logo),
            logoUrl: sanitizeImageUrl(data.logoUrl)
        };
    } catch (error) {
        console.error('❌ Fetch error:', error);
        throw error;
    }
};
/**
 * Map service name from SaaS API to expected service type
 */ const mapServiceNameToType = (serviceName)=>{
    const lowerName = serviceName.toLowerCase();
    if (lowerName.includes('repassage') || lowerName.includes('iron')) {
        return 'REPASSAGE';
    }
    if (lowerName.includes('sec') || lowerName.includes('dry')) {
        return 'NETTOYAGE_A_SEC';
    }
    // Default to NETTOYAGE for washing, lavage, cleaning, etc.
    return 'NETTOYAGE';
};
const fetchProducts = async ()=>{
    const url = getFullUrl(`/api/public/laundry/${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].slug}/products`);
    console.log('📦 Fetching products from:', url);
    try {
        const response = await fetch(url, {
            headers: {
                'x-api-key': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].apiKey,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });
        console.log('📡 Products response status:', response.status, response.statusText);
        if (!response.ok) {
            const errorText = await response.text().catch(()=>'Unable to read error');
            console.error('❌ Products API Error:', {
                status: response.status,
                error: errorText
            });
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('📦 Raw API response:', JSON.stringify(data).substring(0, 500));
        // Handle both old format (array) and new format (object with products array)
        let rawProducts;
        if (Array.isArray(data)) {
            // Old format: direct array of products
            rawProducts = data;
        } else if (data.products && Array.isArray(data.products)) {
            // New format: { laundry, products, totalProducts, totalServices }
            rawProducts = data.products;
        } else {
            console.error('❌ Unexpected API response format:', data);
            return [];
        }
        // Transform products to expected format
        const products = rawProducts.map((item)=>{
            // Transform services to expected format
            const services = (item.services || []).map((svc)=>({
                    id: svc.id,
                    productId: item.id,
                    service: svc.service || mapServiceNameToType(svc.name || ''),
                    serviceType: svc.service || mapServiceNameToType(svc.name || ''),
                    name: svc.name || svc.service,
                    price: svc.price || item.price || 0
                }));
            // Get the first service price as default product price
            const defaultPrice = services.length > 0 ? services[0].price : item.price || 0;
            // Sanitize image URLs to filter out invalid domains
            const sanitizedImage = sanitizeImageUrl(item.image || item.imageUrl);
            return {
                id: item.id,
                name: item.name,
                description: item.description || null,
                category: item.category || 'GENERAL',
                image: sanitizedImage,
                imageUrl: sanitizedImage,
                status: item.status || 'ACTIVE',
                price: defaultPrice,
                services
            };
        });
        console.log('✅ Successfully transformed', products.length, 'products');
        return products;
    } catch (error) {
        console.error('❌ Fetch products error:', error);
        throw error;
    }
};
const createOrder = async (cartItems, customerInfo, specialInstructions, pickupScheduledAt)=>{
    try {
        const url = getFullUrl('/api/checkout');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                laundrySlug: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].slug,
                cartItems: cartItems.map((item)=>({
                        productId: item.productId,
                        serviceType: item.serviceType,
                        quantity: item.quantity
                    })),
                customerInfo,
                specialInstructions,
                pickupScheduledAt
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.error || 'Failed to create order');
        }
        return response.json();
    } catch (error) {
        throw new Error(error.message || 'Failed to create order');
    }
};
const getCheckoutUrl = (cartItems, customerInfo)=>{
    const returnUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].siteUrl}/order-success`;
    const params = new URLSearchParams({
        laundrySlug: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].slug,
        returnUrl,
        cart: JSON.stringify(cartItems),
        customer: JSON.stringify(customerInfo)
    });
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laundryConfig"].saasUrl}/checkout?${params.toString()}`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/cart-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shopping Cart Store using Zustand
 * Persists to localStorage
 */ __turbopack_context__.s([
    "useCartStore",
    ()=>useCartStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
// Known invalid image domains that should be filtered out
const INVALID_IMAGE_DOMAINS = [
    'laundry-app.com',
    'example.com'
];
/**
 * Sanitize image URL - returns undefined for invalid domains
 */ const sanitizeImageUrl = (url)=>{
    if (!url) return undefined;
    try {
        const urlObj = new URL(url);
        for (const invalidDomain of INVALID_IMAGE_DOMAINS){
            if (urlObj.hostname.endsWith(invalidDomain)) {
                return undefined;
            }
        }
        return url;
    } catch  {
        return url;
    }
};
const useCartStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        items: [],
        addItem: (newItem)=>{
            // Sanitize image URLs before storing
            const sanitizedItem = {
                ...newItem,
                image: sanitizeImageUrl(newItem.image),
                imageUrl: sanitizeImageUrl(newItem.imageUrl)
            };
            set((state)=>{
                // Check if item already exists
                const existingIndex = state.items.findIndex((item)=>item.productId === sanitizedItem.productId && item.serviceType === sanitizedItem.serviceType);
                if (existingIndex >= 0) {
                    // Update quantity
                    const updatedItems = [
                        ...state.items
                    ];
                    updatedItems[existingIndex].quantity += sanitizedItem.quantity;
                    return {
                        items: updatedItems
                    };
                }
                // Add new item
                return {
                    items: [
                        ...state.items,
                        sanitizedItem
                    ]
                };
            });
        },
        removeItem: (productId, serviceType)=>{
            set((state)=>({
                    items: state.items.filter((item)=>!(item.productId === productId && item.serviceType === serviceType))
                }));
        },
        updateQuantity: (productId, serviceType, quantity)=>{
            set((state)=>{
                if (quantity <= 0) {
                    // Remove item if quantity is 0
                    return {
                        items: state.items.filter((item)=>!(item.productId === productId && item.serviceType === serviceType))
                    };
                }
                const updatedItems = state.items.map((item)=>item.productId === productId && item.serviceType === serviceType ? {
                        ...item,
                        quantity
                    } : item);
                return {
                    items: updatedItems
                };
            });
        },
        clearCart: ()=>{
            set({
                items: []
            });
        },
        getTotalItems: ()=>{
            return get().items.reduce((total, item)=>total + item.quantity, 0);
        },
        getTotalPrice: ()=>{
            return get().items.reduce((total, item)=>total + item.price * item.quantity, 0);
        }
    }), {
    name: 'clean-fresh-cart',
    // Migrate existing items to sanitize image URLs
    onRehydrateStorage: ()=>(state)=>{
            if (state) {
                // Sanitize image URLs in existing cart items
                const sanitizedItems = state.items.map((item)=>({
                        ...item,
                        image: sanitizeImageUrl(item.image),
                        imageUrl: sanitizeImageUrl(item.imageUrl)
                    }));
                state.items = sanitizedItems;
            }
        }
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/services/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ServicesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$saas$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/saas-api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cart-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// Known invalid image domains
const INVALID_IMAGE_DOMAINS = [
    'laundry-app.com',
    'example.com'
];
const isValidImageUrl = (url)=>{
    if (!url) return false;
    try {
        const urlObj = new URL(url);
        return !INVALID_IMAGE_DOMAINS.some((domain)=>urlObj.hostname.endsWith(domain));
    } catch  {
        return true; // Relative URLs are fine
    }
};
function ServicesPage() {
    _s();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [laundryInfo, setLaundryInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedServices, setSelectedServices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [addedToCart, setAddedToCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const { addItem, items } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ServicesPage.useEffect": ()=>{
            const loadData = {
                "ServicesPage.useEffect.loadData": async ()=>{
                    try {
                        setLoading(true);
                        const [productsData, laundryData] = await Promise.all([
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$saas$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProducts"])(),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$saas$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLaundryInfo"])()
                        ]);
                        setProducts(productsData);
                        setLaundryInfo(laundryData);
                        // Set default service for each product
                        const defaults = {};
                        productsData.forEach({
                            "ServicesPage.useEffect.loadData": (product)=>{
                                if (product.services && product.services.length > 0) {
                                    defaults[product.id] = product.services[0].id;
                                }
                            }
                        }["ServicesPage.useEffect.loadData"]);
                        setSelectedServices(defaults);
                    } catch (err) {
                        setError(err instanceof Error ? err.message : 'Failed to load products');
                    } finally{
                        setLoading(false);
                    }
                }
            }["ServicesPage.useEffect.loadData"];
            loadData();
        }
    }["ServicesPage.useEffect"], []);
    // Get display name for a service - prefer actual name over type
    const getServiceDisplayName = (service)=>{
        // If service has a name field, use it
        if (service.name) {
            return service.name;
        }
        // Fallback to mapping the service type
        const names = {
            'NETTOYAGE': 'Lavage',
            'REPASSAGE': 'Repassage',
            'NETTOYAGE_A_SEC': 'Nettoyage à sec'
        };
        return names[service.service] || service.service || 'Service';
    };
    const handleAddToCart = (product)=>{
        const serviceId = selectedServices[product.id];
        const service = product.services?.find((s)=>s.id === serviceId);
        if (!service) {
            alert('Please select a service');
            return;
        }
        addItem({
            productId: product.id,
            productName: product.name,
            serviceId: service.id,
            serviceName: getServiceDisplayName(service),
            serviceType: service.service || 'NETTOYAGE',
            price: service.price || product.price,
            quantity: 1,
            imageUrl: product.image || undefined
        });
        // Show "Added to Cart" feedback
        setAddedToCart((prev)=>({
                ...prev,
                [product.id]: true
            }));
        setTimeout(()=>{
            setAddedToCart((prev)=>({
                    ...prev,
                    [product.id]: false
                }));
        }, 2000);
    };
    const getTotalItems = ()=>{
        return items.reduce((sum, item)=>sum + item.quantity, 0);
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"
                    }, void 0, false, {
                        fileName: "[project]/app/services/page.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-gray-600",
                        children: "Chargement des services..."
                    }, void 0, false, {
                        fileName: "[project]/app/services/page.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/services/page.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/services/page.tsx",
            lineNumber: 110,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-600 text-xl",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/services/page.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "mt-4 inline-block text-blue-600 hover:underline",
                        children: "Retour à l'accueil"
                    }, void 0, false, {
                        fileName: "[project]/app/services/page.tsx",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/services/page.tsx",
                lineNumber: 122,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/services/page.tsx",
            lineNumber: 121,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white shadow-sm sticky top-0 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "flex items-center space-x-3",
                                children: [
                                    laundryInfo?.logoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: laundryInfo.logoUrl,
                                        alt: laundryInfo.name,
                                        width: 40,
                                        height: 40,
                                        className: "rounded-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/app/services/page.tsx",
                                        lineNumber: 140,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xl font-bold text-gray-900",
                                        children: laundryInfo?.name || 'Pressing Rabat'
                                    }, void 0, false, {
                                        fileName: "[project]/app/services/page.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/services/page.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/",
                                        className: "text-gray-700 hover:text-blue-600 transition",
                                        children: "Accueil"
                                    }, void 0, false, {
                                        fileName: "[project]/app/services/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/services",
                                        className: "text-blue-600 font-semibold",
                                        children: "Services"
                                    }, void 0, false, {
                                        fileName: "[project]/app/services/page.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/cart",
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-6 h-6 text-gray-700 hover:text-blue-600 transition",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/services/page.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/services/page.tsx",
                                                lineNumber: 161,
                                                columnNumber: 17
                                            }, this),
                                            getTotalItems() > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center",
                                                children: getTotalItems()
                                            }, void 0, false, {
                                                fileName: "[project]/app/services/page.tsx",
                                                lineNumber: 165,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/services/page.tsx",
                                        lineNumber: 160,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/services/page.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/services/page.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/services/page.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/services/page.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-blue-600 text-white py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl font-bold mb-4",
                            children: "Nos Services"
                        }, void 0, false, {
                            fileName: "[project]/app/services/page.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl text-blue-100",
                            children: "Services professionnels de pressing et nettoyage à sec"
                        }, void 0, false, {
                            fileName: "[project]/app/services/page.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/services/page.tsx",
                    lineNumber: 177,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/services/page.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
                children: [
                    products.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 text-lg",
                            children: "Aucun service disponible pour le moment."
                        }, void 0, false, {
                            fileName: "[project]/app/services/page.tsx",
                            lineNumber: 189,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/services/page.tsx",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                        children: products.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow",
                                children: [
                                    isValidImageUrl(product.image) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative h-48 bg-gray-200",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: product.image,
                                            alt: product.name,
                                            fill: true,
                                            className: "object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/app/services/page.tsx",
                                            lineNumber: 198,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/services/page.tsx",
                                        lineNumber: 197,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-20 h-20 text-white opacity-50",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/services/page.tsx",
                                                lineNumber: 208,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/services/page.tsx",
                                            lineNumber: 207,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/services/page.tsx",
                                        lineNumber: 206,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-bold text-gray-900 mb-2",
                                                children: product.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/services/page.tsx",
                                                lineNumber: 215,
                                                columnNumber: 19
                                            }, this),
                                            product.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-600 text-sm mb-4",
                                                children: product.description
                                            }, void 0, false, {
                                                fileName: "[project]/app/services/page.tsx",
                                                lineNumber: 217,
                                                columnNumber: 21
                                            }, this),
                                            product.services && product.services.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Choisir un service:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/services/page.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: selectedServices[product.id] || '',
                                                        onChange: (e)=>setSelectedServices((prev)=>({
                                                                    ...prev,
                                                                    [product.id]: e.target.value
                                                                })),
                                                        className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                        children: product.services.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: service.id,
                                                                children: [
                                                                    getServiceDisplayName(service),
                                                                    " - ",
                                                                    (service.price || product.price).toFixed(2),
                                                                    " MAD"
                                                                ]
                                                            }, service.id, true, {
                                                                fileName: "[project]/app/services/page.tsx",
                                                                lineNumber: 235,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/services/page.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/services/page.tsx",
                                                lineNumber: 222,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleAddToCart(product),
                                                disabled: addedToCart[product.id],
                                                className: `w-full py-3 px-4 rounded-lg font-semibold transition ${addedToCart[product.id] ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`,
                                                children: addedToCart[product.id] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center justify-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-5 h-5 mr-2",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M5 13l4 4L19 7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/services/page.tsx",
                                                                lineNumber: 256,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/services/page.tsx",
                                                            lineNumber: 255,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Ajouté au panier!"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/services/page.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 23
                                                }, this) : 'Ajouter au panier'
                                            }, void 0, false, {
                                                fileName: "[project]/app/services/page.tsx",
                                                lineNumber: 244,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/services/page.tsx",
                                        lineNumber: 214,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, product.id, true, {
                                fileName: "[project]/app/services/page.tsx",
                                lineNumber: 194,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/services/page.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this),
                    getTotalItems() > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-12 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/cart",
                            className: "inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-5 h-5 mr-2",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    }, void 0, false, {
                                        fileName: "[project]/app/services/page.tsx",
                                        lineNumber: 278,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/services/page.tsx",
                                    lineNumber: 277,
                                    columnNumber: 15
                                }, this),
                                "Voir le panier (",
                                getTotalItems(),
                                " ",
                                getTotalItems() === 1 ? 'article' : 'articles',
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/services/page.tsx",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/services/page.tsx",
                        lineNumber: 272,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/services/page.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "bg-gray-800 text-white py-8 mt-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "© ",
                            new Date().getFullYear(),
                            " ",
                            laundryInfo?.name || 'Pressing Rabat',
                            ". Tous droits réservés."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/services/page.tsx",
                        lineNumber: 289,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/services/page.tsx",
                    lineNumber: 288,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/services/page.tsx",
                lineNumber: 287,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/services/page.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_s(ServicesPage, "MLQk48wN7Npcn79j1vWyh5DEC0A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"]
    ];
});
_c = ServicesPage;
var _c;
__turbopack_context__.k.register(_c, "ServicesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_8864ed59._.js.map