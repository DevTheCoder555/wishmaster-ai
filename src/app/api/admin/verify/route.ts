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

    // Note: In production, add a check here like: if (!session.user.isAdmin) return 403;

    const { type, id, action, notes } = await request.json(); 
    // type: 'contribution' | 'fulfillment' | 'credit'
    // action: 'approve' | 'reject' | 'order_placed' | 'fulfilled'

    // ---------------------------------------------------------
    // 1. HANDLE CONTRIBUTION VERIFICATION
    // ---------------------------------------------------------
    if (type === 'contribution') {
      const contribution = await prisma.contribution.findUnique({ 
        where: { id }, 
        include: { wish: true } 
      });
      
      if (!contribution) {
        return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
      }

      const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
      
      await prisma.$transaction(async (tx) => {
        // Step A: Update contribution status
        await tx.contribution.update({ 
          where: { id }, 
          data: { verificationStatus: newStatus } 
        });
        
        // Step B: If approved, update the wish's fulfilled amount and status
        if (action === 'approve') {
          const newFulfilledAmount = contribution.wish.fulfilledAmount + contribution.amount;
          
          // Determine new wish status based on funding completion
          let newWishStatus = contribution.wish.status;
          if (newFulfilledAmount >= contribution.wish.budget) {
            newWishStatus = 'FundingComplete';
          }

          await tx.wish.update({
            where: { id: contribution.wishId },
            data: { 
              fulfilledAmount: newFulfilledAmount, 
              status: newWishStatus as any // 'as any' prevents TS enum errors
            }
          });
        }
      });

      return NextResponse.json({ success: true, message: `Contribution ${newStatus.toLowerCase()}.` });
    } 
    
    // ---------------------------------------------------------
    // 2. HANDLE FULFILLMENT REQUEST VERIFICATION
    // ---------------------------------------------------------
    else if (type === 'fulfillment') {
      // FIX: Fetch the request BEFORE the transaction to safely get the wishId
      const fulfillmentRequest = await prisma.fulfillmentRequest.findUnique({ 
        where: { id } 
      });

      if (!fulfillmentRequest) {
        return NextResponse.json({ error: 'Fulfillment request not found' }, { status: 404 });
      }

      const statusMap: any = {
        'approve': 'Approved',
        'order_placed': 'Ordered',
        'fulfilled': 'Fulfilled',
        'reject': 'Rejected'
      };

      const newRequestStatus = statusMap[action];
      if (!newRequestStatus) {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }

      const newWishStatus = action === 'reject' ? 'Active' : newRequestStatus;

      // Now the transaction array only contains Prisma promises, no 'await' inside
      await prisma.$transaction([
        prisma.fulfillmentRequest.update({
          where: { id },
          data: { 
            status: newRequestStatus as any, 
            adminNotes: notes || null 
          }
        }),
        prisma.wish.update({
          where: { id: fulfillmentRequest.wishId }, // Safely using the pre-fetched ID
          data: { status: newWishStatus as any }
        })
      ]);

      return NextResponse.json({ success: true, message: `Fulfillment request ${newRequestStatus.toLowerCase()}.` });
    } 
    
    // ---------------------------------------------------------
    // 3. HANDLE CREDIT PURCHASE VERIFICATION
    // ---------------------------------------------------------
    else if (type === 'credit') {
      const purchase = await prisma.creditPurchase.findUnique({ 
        where: { id } 
      });
      
      if (!purchase) {
        return NextResponse.json({ error: 'Credit purchase not found' }, { status: 404 });
      }

      if (action === 'approve') {
        await prisma.$transaction([
          prisma.creditPurchase.update({ 
            where: { id }, 
            data: { verificationStatus: 'Approved' } 
          }),
          prisma.user.update({ 
            where: { id: purchase.userId }, 
            data: { credits: { increment: purchase.creditsGranted } } 
          })
        ]);
        return NextResponse.json({ success: true, message: 'Credits granted successfully.' });
      } else {
        await prisma.creditPurchase.update({ 
          where: { id }, 
          data: { verificationStatus: 'Rejected' } 
        });
        return NextResponse.json({ success: true, message: 'Credit purchase rejected.' });
      }
    }

    return NextResponse.json({ error: 'Invalid verification type' }, { status: 400 });

  } catch (error) {
    console.error('Admin Verify Error:', error);
    return NextResponse.json({ error: 'Failed to verify' }, { status: 500 });
  }
}