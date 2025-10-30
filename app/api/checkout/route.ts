import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock API endpoint for checkout/order creation
 * This replaces the external SaaS API during development
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { laundrySlug, cartItems, customerInfo, specialInstructions, pickupScheduledAt } = body;

    // Validate required fields
    if (!laundrySlug || !cartItems || !customerInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a mock order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate total (mock calculation)
    let totalAmount = 0;
    cartItems.forEach((item: any) => {
      // In a real implementation, you'd look up the price from the database
      totalAmount += item.quantity * 20; // Mock price
    });

    // Mock successful order creation
    const orderResponse = {
      success: true,
      orderId,
      message: 'Order created successfully',
      order: {
        id: orderId,
        laundrySlug,
        customerId: `CUST-${Date.now()}`,
        totalAmount,
        status: 'PENDING',
        items: cartItems,
        customerInfo,
        specialInstructions,
        pickupScheduledAt,
        createdAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(orderResponse);
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
