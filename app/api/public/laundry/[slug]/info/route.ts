import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock API endpoint for laundry information
 * This replaces the external SaaS API during development
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  // Mock laundry data
  const laundryInfo = {
    id: '1',
    name: 'Clean & Fresh Laundry',
    address: '123 Rue Mohammed V, Rabat, Morocco',
    phoneNumber: '+212 5XX-XXXXXX',
    slaHours: 48,
    websiteUrl: 'https://cleanfreshlaundry.com',
    logo: null,
    primaryColor: '#3B82F6',
  };

  return NextResponse.json(laundryInfo);
}
