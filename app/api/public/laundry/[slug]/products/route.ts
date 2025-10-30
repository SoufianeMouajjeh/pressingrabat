import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock API endpoint for laundry products and services
 * This replaces the external SaaS API during development
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
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
          price: 15.00,
        },
        {
          id: '1-2',
          productId: '1',
          service: 'REPASSAGE',
          price: 10.00,
        },
        {
          id: '1-3',
          productId: '1',
          service: 'NETTOYAGE_A_SEC',
          price: 25.00,
        },
      ],
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
          price: 20.00,
        },
        {
          id: '2-2',
          productId: '2',
          service: 'REPASSAGE',
          price: 12.00,
        },
        {
          id: '2-3',
          productId: '2',
          service: 'NETTOYAGE_A_SEC',
          price: 30.00,
        },
      ],
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
          price: 25.00,
        },
        {
          id: '3-2',
          productId: '3',
          service: 'REPASSAGE',
          price: 15.00,
        },
        {
          id: '3-3',
          productId: '3',
          service: 'NETTOYAGE_A_SEC',
          price: 40.00,
        },
      ],
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
          price: 35.00,
        },
        {
          id: '4-2',
          productId: '4',
          service: 'NETTOYAGE_A_SEC',
          price: 50.00,
        },
      ],
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
          price: 45.00,
        },
        {
          id: '5-2',
          productId: '5',
          service: 'NETTOYAGE_A_SEC',
          price: 60.00,
        },
      ],
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
          price: 30.00,
        },
        {
          id: '6-2',
          productId: '6',
          service: 'NETTOYAGE_A_SEC',
          price: 40.00,
        },
      ],
    },
  ];

  return NextResponse.json(products);
}
