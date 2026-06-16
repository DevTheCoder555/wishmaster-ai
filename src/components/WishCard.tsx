'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Heart, MessageCircle, MapPin, CheckCircle, ExternalLink, CreditCard, ShieldCheck } from 'lucide-react';

interface WishCardProps { wish: any; }

export function WishCard({ wish }: WishCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const progress = Math.min((wish.fulfilledAmount / wish.budget) * 100, 100);
  const isFundingComplete = wish.fulfilledAmount >= wish.budget;
  
  // RULE 1 & 6: Check if the logged-in user is the creator of this wish
  const isOwner = session?.user?.id === wish.userId;

  // Step 3: Connect the frontend button to the new API
  const handleRequestFulfillment = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    setIsRequesting(true);
    try {
      const res = await fetch(`/api/wishes/${wish.id}/request-fulfillment`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to request fulfillment');
      } else {
        alert('Fulfillment requested! The admin will review it shortly.');
        router.refresh(); // Refresh to show updated status
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Card className="glass-hover transition-all duration-300 relative">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">{wish.title}</CardTitle>
          <p className="text-sm text-white/60 mt-1">
            by {wish.isAnonymous ? 'Anonymous' : (wish.user?.name || 'User')}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
          {wish.category}
        </span>
      </CardHeader>
      
      <CardContent>
        <p className="text-white/80 mb-4 line-clamp-2">{wish.description}</p>
        
        {/* Affiliate Links Section */}
        {wish.affiliateLinks && wish.affiliateLinks.length > 0 && (
          <div className="mb-4 pt-4 border-t border-white/10">
            <p className="text-sm font-medium text-white/80 mb-2 flex items-center gap-1">
              <ExternalLink className="h-4 w-4 text-secondary" /> Suggested Products (Affiliate)
            </p>
            <div className="space-y-2">
              {wish.affiliateLinks.map((link: any) => (
                <a
                  key={link.id}
                  href={`/api/redirect?id=${link.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-colors group text-left"
                >
                  <div>
                    <p className="font-medium text-white group-hover:text-primary transition-colors">{link.productName}</p>
                    <p className="text-xs text-white/60">{link.clicks} clicks • {link.commissionRate}% commission • Est. ₹{(link.earnings || 0).toFixed(2)} earned</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 text-xs pointer-events-none">
                    View Product
                  </Button>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/60">Progress</span>
            <span className="text-white font-medium">₹{wish.fulfilledAmount} / ₹{wish.budget}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${isFundingComplete ? 'bg-green-500' : 'bg-gradient-to-r from-primary to-secondary'}`} 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
        
        {/* Location (if applicable) */}
        {wish.latitude && wish.longitude && (
          <div className="flex items-center text-white/60 text-sm mb-4">
            <MapPin className="h-4 w-4 mr-1" /> Nearby Location
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-white/60 hover:text-secondary transition-colors">
              <Heart className="h-4 w-4" /> <span className="text-sm">{wish._count?.contributions || 0}</span>
            </button>
            <button className="flex items-center space-x-1 text-white/60 hover:text-primary transition-colors">
              <MessageCircle className="h-4 w-4" /> <span className="text-sm">Comment</span>
            </button>
          </div>
          
          {/* RULE ENFORCEMENT: Different buttons for Owner vs. Non-Owner */}
          {isOwner ? (
            // OWNER VIEW: Cannot contribute, but can request fulfillment if target is met
            isFundingComplete && (wish.status === 'FundingComplete' || wish.status === 'Active') ? (
              <Button 
                size="sm" 
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700" 
                onClick={handleRequestFulfillment}
                disabled={isRequesting}
              >
                {isRequesting ? 'Requesting...' : 'Request Fulfillment'}
              </Button>
            ) : (
              <span className="text-sm text-white/60 px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> 
                Status: {wish.status ? wish.status.replace(/([A-Z])/g, ' $1').trim() : 'Active'}
              </span>
            )
          ) : (
            // NON-OWNER VIEW: Can contribute via QR code, or see "Funding Complete"
            !isFundingComplete ? (
              <Button size="sm" className="flex items-center gap-2" onClick={() => setShowContributeModal(true)}>
                <CreditCard className="h-4 w-4" /> Contribute
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="flex items-center gap-2 text-green-400 border-green-400/30" disabled>
                <CheckCircle className="h-4 w-4" /> Funding Complete
              </Button>
            )
          )}
        </div>

        {/* Contribute Modal - Directs to QR Payment Page per Rule 4 */}
        {showContributeModal && (
          <div className="absolute inset-0 bg-darker/95 backdrop-blur-sm rounded-xl flex items-center justify-center p-6 z-10">
            <div className="w-full max-w-sm space-y-4 text-center">
              <h3 className="text-xl font-bold">Contribute to this Wish</h3>
              <p className="text-sm text-white/60">
                To contribute, please scan the platform QR code and submit your Transaction ID/UTR for admin verification.
              </p>
              <Button className="w-full" onClick={() => { setShowContributeModal(false); router.push('/credits'); }}>
                Go to Payment Page
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setShowContributeModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}