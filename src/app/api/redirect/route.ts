// src/app/api/redirect/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // If no ID is provided, redirect to home
  if (!id) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // 1. Track the click in the database
    await prisma.affiliateLink.update({
      where: { id },
      data: {
        clicks: { increment: 1 },
        // Optional: Add a tiny estimated earning per click for gamification
        // Remove this line if you only want to track raw clicks
        earnings: { increment: 0.10 } 
      }
    });

    // 2. Fetch the real destination URL from the database
    const link = await prisma.affiliateLink.findUnique({ 
      where: { id } 
    });
    
    // 3. Redirect the user to the real affiliate link
    if (link && link.url) {
      return NextResponse.redirect(link.url);
    }
    
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Affiliate Redirect Error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}