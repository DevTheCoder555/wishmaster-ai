import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const link = await prisma.affiliateLink.findUnique({
      where: { id: params.id },
      include: { wish: { select: { userId: true } } }
    });

    if (!link) {
      return NextResponse.json({ error: 'Affiliate link not found' }, { status: 404 });
    }

    // Simulate affiliate earnings: $1.50 per click for demonstration purposes
    const mockEarningPerClick = 1.50;

    const updated = await prisma.affiliateLink.update({
      where: { id: params.id },
      data: {
        clicks: { increment: 1 },
        earnings: { increment: mockEarningPerClick }
      }
    });

    return NextResponse.json({ 
      success: true, 
      clicks: updated.clicks, 
      earnings: updated.earnings 
    });
  } catch (error) {
    console.error('Track Click Error:', error);
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}