import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {WishStatus} from '@prisma/client'; // 👈 ADD THIS IMPORT

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { wishId, amount, paymentProof } = await request.json();

    const wish = await prisma.wish.findUnique({ where: { id: wishId }, include: { user: true } });
    if (!wish) return NextResponse.json({ error: 'Wish not found' }, { status: 404 });

    // RULE 1 & 6: Block self-contribution
    if (wish.userId === session.user.id) {
      return NextResponse.json({ error: 'You cannot contribute to your own wish.' }, { status: 403 });
    }

    // RULE 7: Block contributions after target reached (Fixed Type Error)
    if (wish.status === WishStatus.FundingComplete || wish.fulfilledAmount >= wish.budget) {
      return NextResponse.json({ error: 'This wish has already reached its funding target.' }, { status: 400 });
    }

    // Prevent over-contribution
    if (wish.fulfilledAmount + amount > wish.budget) {
      return NextResponse.json({ error: 'Contribution amount exceeds the remaining budget.' }, { status: 400 });
    }

    // RULE 5: Record contribution with pending verification
    await prisma.contribution.create({
      data: {
        wishId,
        userId: session.user.id,
        amount: parseFloat(amount),
        paymentProof: paymentProof || null,
        verificationStatus: 'Pending'
      }
    });

    return NextResponse.json({ success: true, message: 'Contribution submitted for admin verification.' });
  } catch (error) {
    console.error('Contribution Error:', error);
    return NextResponse.json({ error: 'Failed to process contribution' }, { status: 500 });
  }
}