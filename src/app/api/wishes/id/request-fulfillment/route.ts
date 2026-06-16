import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wish = await prisma.wish.findUnique({ where: { id: params.id } });
    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }

    // RULE 8: Only creator can request
    if (wish.userId !== session.user.id) {
      return NextResponse.json({ error: 'Only the wish creator can request fulfillment.' }, { status: 403 });
    }

    // RULE 7 & 8: Must be funding complete
    if (wish.fulfilledAmount < wish.budget) {
      return NextResponse.json({ error: 'Target amount has not been reached yet.' }, { status: 400 });
    }

    // Check for duplicate requests (Using string comparison to avoid TS enum errors)
    const existingRequest = await prisma.fulfillmentRequest.findFirst({
      where: { 
        wishId: params.id, 
      }
    });
    
    if (existingRequest && (existingRequest.status === 'Pending' || existingRequest.status === 'Approved')) {
      return NextResponse.json({ error: 'Fulfillment already requested or approved.' }, { status: 400 });
    }

    // Execute transaction: Create request and update wish status
    await prisma.$transaction([
      prisma.fulfillmentRequest.create({
        data: { 
          wishId: params.id, 
          userId: session.user.id, 
          status: 'Pending' as any // 'as any' prevents TS enum errors if Prisma client isn't fully generated yet
        }
      }),
      prisma.wish.update({
        where: { id: params.id },
        data: { status: 'FulfillmentRequested' as any }
      })
    ]);

    return NextResponse.json({ success: true, message: 'Fulfillment requested successfully. Waiting for admin approval.' });
  } catch (error) {
    console.error('Request Fulfillment Error:', error);
    return NextResponse.json({ error: 'Failed to request fulfillment' }, { status: 500 });
  }
}