import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');

    let query: any = {
      include: { 
        user: { select: { name: true, email: true, credits: true, createdAt: true, id: true, avatarUrl: true } },
        affiliateLinks: true,
        _count: { select: { contributions: true } }
      },
      orderBy: { createdAt: 'desc' }
    };

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      query.where = {
        latitude: { gte: lat - 0.1, lte: lat + 0.1 },
        longitude: { gte: lng - 0.1, lte: lng + 0.1 }
      };
    }

    const wishes = await prisma.wish.findMany(query);
    return NextResponse.json({ wishes });
  } catch (error) {
    console.error('Fetch Wishes Error:', error);
    return NextResponse.json({ error: 'Failed to fetch wishes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits < 10) {
      return NextResponse.json({ error: 'Not enough credits. You need 10 credits to create a wish.' }, { status: 400 });
    }

    const { title, description, category, budget, latitude, longitude, affiliateLinks } = await request.json();
    
    const [wish] = await prisma.$transaction([
      prisma.wish.create({
        data: {
          userId: session.user.id,
          title,
          description,
          category,
          budget: parseFloat(budget),
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          affiliateLinks: affiliateLinks && affiliateLinks.length > 0 ? {
            create: affiliateLinks.map((link: any) => ({
              productName: link.name,
              url: link.url,
              commissionRate: parseFloat(link.commission) || 0
            }))
          } : undefined
        },
        include: { user: true, affiliateLinks: true }
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 10 } }
      })
    ]);

    return NextResponse.json({ wish });
  } catch (error) {
    console.error('Create Wish Error:', error);
    return NextResponse.json({ error: 'Failed to create wish' }, { status: 500 });
  }
}