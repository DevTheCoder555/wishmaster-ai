import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { wishId, amount, isAnonymous } = await request.json();

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits < amount) {
      return NextResponse.json({ error: 'Not enough credits to contribute this amount.' }, { status: 400 });
    }

    const wish = await prisma.wish.findUnique({ where: { id: wishId } });
    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }

    if (wish.fulfilledAmount + amount > wish.budget) {
      return NextResponse.json({ error: 'Contribution amount exceeds the remaining budget.' }, { status: 400 });
    }

    // Process contribution in a transaction
    await prisma.$transaction([
      prisma.contribution.create({
        data: {
          wishId,
          userId: session.user.id,
          amount,
          isAnonymous: isAnonymous || false
        }
      }),
      prisma.wish.update({
        where: { id: wishId },
        data: { fulfilledAmount: { increment: amount } }
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: amount } }
      })
    ]);

    return NextResponse.json({ success: true, message: 'Contribution successful!' });
  } catch (error) {
    console.error('Contribution Error:', error);
    return NextResponse.json({ error: 'Failed to process contribution' }, { status: 500 });
  }
}