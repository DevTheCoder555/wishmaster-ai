import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, amount, action } = await request.json();
    
    // In a real app, verify the action securely before updating
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
      select: { credits: true }
    });
    
    return NextResponse.json({ credits: updatedUser.credits });
  } catch (error) {
    console.error('Update Credits Error:', error);
    return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
  }
}