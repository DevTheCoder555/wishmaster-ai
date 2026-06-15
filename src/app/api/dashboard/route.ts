import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ 
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, credits: true, createdAt: true, avatarUrl: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const wishes = await prisma.wish.findMany({ 
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: { 
        _count: { select: { contributions: true } },
        affiliateLinks: true
      }
    });

    const contributions = await prisma.contribution.findMany({
      where: { userId: session.user.id },
      include: { wish: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Calculate real affiliate stats
    const affiliateStats = await prisma.affiliateLink.aggregate({
      _sum: { clicks: true, earnings: true },
      where: { wish: { userId: session.user.id } }
    });

    const fulfilledWishesCount = wishes.filter(w => w.fulfilledAmount >= w.budget).length;

    return NextResponse.json({
      user,
      wishes,
      contributions,
      stats: {
        activeWishes: wishes.filter(w => w.fulfilledAmount < w.budget).length,
        fulfilledWishes: fulfilledWishesCount,
        affiliateClicks: affiliateStats._sum.clicks || 0,
        affiliateRevenue: affiliateStats._sum.earnings || 0
      }
    });
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}