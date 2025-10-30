module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/public/laundry/[slug]/products/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request, context) {
    const { slug } = await context.params;
    // Mock products data with different categories and services
    const products = [
        {
            id: '1',
            name: 'Chemise',
            description: 'Nettoyage et repassage de chemises',
            category: 'VETEMENTS',
            image: null,
            status: 'ACTIVE',
            price: 15.00,
            services: [
                {
                    id: '1-1',
                    productId: '1',
                    service: 'NETTOYAGE',
                    price: 15.00
                },
                {
                    id: '1-2',
                    productId: '1',
                    service: 'REPASSAGE',
                    price: 10.00
                },
                {
                    id: '1-3',
                    productId: '1',
                    service: 'NETTOYAGE_A_SEC',
                    price: 25.00
                }
            ]
        },
        {
            id: '2',
            name: 'Pantalon',
            description: 'Nettoyage et repassage de pantalons',
            category: 'VETEMENTS',
            image: null,
            status: 'ACTIVE',
            price: 20.00,
            services: [
                {
                    id: '2-1',
                    productId: '2',
                    service: 'NETTOYAGE',
                    price: 20.00
                },
                {
                    id: '2-2',
                    productId: '2',
                    service: 'REPASSAGE',
                    price: 12.00
                },
                {
                    id: '2-3',
                    productId: '2',
                    service: 'NETTOYAGE_A_SEC',
                    price: 30.00
                }
            ]
        },
        {
            id: '3',
            name: 'Robe',
            description: 'Nettoyage et repassage de robes',
            category: 'VETEMENTS',
            image: null,
            status: 'ACTIVE',
            price: 25.00,
            services: [
                {
                    id: '3-1',
                    productId: '3',
                    service: 'NETTOYAGE',
                    price: 25.00
                },
                {
                    id: '3-2',
                    productId: '3',
                    service: 'REPASSAGE',
                    price: 15.00
                },
                {
                    id: '3-3',
                    productId: '3',
                    service: 'NETTOYAGE_A_SEC',
                    price: 40.00
                }
            ]
        },
        {
            id: '4',
            name: 'Costume',
            description: 'Nettoyage professionnel de costumes',
            category: 'VETEMENTS',
            image: null,
            status: 'ACTIVE',
            price: 35.00,
            services: [
                {
                    id: '4-1',
                    productId: '4',
                    service: 'NETTOYAGE',
                    price: 35.00
                },
                {
                    id: '4-2',
                    productId: '4',
                    service: 'NETTOYAGE_A_SEC',
                    price: 50.00
                }
            ]
        },
        {
            id: '5',
            name: 'Couette',
            description: 'Nettoyage de couettes et édredons',
            category: 'LINGE_DE_MAISON',
            image: null,
            status: 'ACTIVE',
            price: 45.00,
            services: [
                {
                    id: '5-1',
                    productId: '5',
                    service: 'NETTOYAGE',
                    price: 45.00
                },
                {
                    id: '5-2',
                    productId: '5',
                    service: 'NETTOYAGE_A_SEC',
                    price: 60.00
                }
            ]
        },
        {
            id: '6',
            name: 'Rideau',
            description: 'Nettoyage de rideaux',
            category: 'LINGE_DE_MAISON',
            image: null,
            status: 'ACTIVE',
            price: 30.00,
            services: [
                {
                    id: '6-1',
                    productId: '6',
                    service: 'NETTOYAGE',
                    price: 30.00
                },
                {
                    id: '6-2',
                    productId: '6',
                    service: 'NETTOYAGE_A_SEC',
                    price: 40.00
                }
            ]
        }
    ];
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(products);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__59e8df5e._.js.map