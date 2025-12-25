import { NextResponse } from 'next/server';

export async function GET() {
  // DryPaper Bridge Data
  const products = [
    { id: "dp_1", name: "Tax Set-Aside Tracker", price: 9, status: "Active" },
    { id: "dp_2", name: "Client Outreach System", price: 19, status: "Active" },
    { id: "dp_3", name: "Invoice & Contract Bundle", price: 15, status: "Active" }
  ];

  return NextResponse.json({ 
    inventory: products 
  });
}

