'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Heart, MessageCircle, Share2, MapPin, Gift, CheckCircle, ExternalLink } from 'lucide-react';

interface WishCardProps { wish: any; }

export function WishCard({ wish }: WishCardProps) {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [contributing, setContributing] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributeAmount, setContributeAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [trackingClicks, setTrackingClicks] = useState<Record<string, boolean>>({});

  const progress = Math.min((wish.fulfilledAmount / wish.budget) * 100, 100);
  const remaining = wish.budget - wish.fulfilledAmount;
  const isFulfilled = remaining <= 0;

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/login');
      return;
    }
    
    const amount = parseFloat(contributeAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (amount > remaining) {
      setError(`Amount exceeds remaining budget ($${remaining})`);
      return;
    }

    setContributing(true);
    setError('');
    try {
      const res = await fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishId: wish.id, amount, isAnonymous: false })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setSuccess('Contribution successful!');
      setContributing(false);
      setShowContributeModal(false);
      setContributeAmount('');
      await updateSession();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setContributing(false);
    }
  };

  const handleAffiliateClick = async (linkId: string, url: string) => {
    // Track click in background
    setTrackingClicks(prev => ({ ...prev, [linkId]: true }));
    fetch(`/api/affiliate/${linkId}/click`, { method: 'POST' }).catch(console.error);
    
    // Open link in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Reset tracking state after a delay
    setTimeout(() => {
      setTrackingClicks(prev => ({ ...prev, [linkId]: false }));
      router.refresh(); // Refresh to show updated click counts if owner is viewing
    }, 1000);
  };

  return (
    <Card className="glass-hover transition-all duration-300 relative">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">{wish.title}</CardTitle>
          <p className="text-sm text-white/60 mt-1">by {wish.isAnonymous ? 'Anonymous' : (wish.user?.name || 'User')}</p>
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
                <button
                  key={link.id}
                  onClick={() => handleAffiliateClick(link.id, link.url)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-colors group text-left"
                >
                  <div>
                    <p className="font-medium text-white group-hover:text-primary transition-colors">{link.productName}</p>
                    <p className="text-xs text-white/60">{link.clicks} clicks • {link.commissionRate}% commission • Est. ${link.earnings?.toFixed(2) || '0.00'} earned</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {trackingClicks[link.id] && <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    <Button size="sm" variant="outline" className="h-8 text-xs">View</Button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/60">Progress</span>
            <span className="text-white font-medium">${wish.fulfilledAmount} / ${wish.budget}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all duration-500 ${isFulfilled ? 'bg-green-500' : 'bg-gradient-to-r from-primary to-secondary'}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
        
        {wish.latitude && wish.longitude && (
          <div className="flex items-center text-white/60 text-sm mb-4">
            <MapPin className="h-4 w-4 mr-1" /> Nearby Location
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-white/60 hover:text-secondary transition-colors">
              <Heart className="h-4 w-4" /> <span className="text-sm">{wish._count?.contributions || 0}</span>
            </button>
            <button className="flex items-center space-x-1 text-white/60 hover:text-primary transition-colors">
              <MessageCircle className="h-4 w-4" /> <span className="text-sm">Comment</span>
            </button>
          </div>
          {isFulfilled ? (
            <Button size="sm" variant="outline" className="flex items-center gap-2 text-green-400 border-green-400/30" disabled>
              <CheckCircle className="h-4 w-4" /> Fulfilled
            </Button>
          ) : (
            <Button size="sm" className="flex items-center gap-2" onClick={() => setShowContributeModal(true)}>
              <Gift className="h-4 w-4" /> Fulfill
            </Button>
          )}
        </div>

        {showContributeModal && (
          <div className="absolute inset-0 bg-darker/95 backdrop-blur-sm rounded-xl flex items-center justify-center p-6 z-10">
            <form onSubmit={handleContribute} className="w-full max-w-sm space-y-4">
              <h3 className="text-xl font-bold text-center">Fulfill this Wish</h3>
              <p className="text-sm text-white/60 text-center">Remaining: ${remaining} • Your Credits: {session?.user?.credits || 0}</p>
              {error && <p className="text-sm text-red-400 text-center">{error}</p>}
              {success && <p className="text-sm text-green-400 text-center">{success}</p>}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Amount to contribute (in credits)</label>
                <input 
                  type="number" 
                  value={contributeAmount} 
                  onChange={(e) => setContributeAmount(e.target.value)}
                  max={remaining}
                  min={1}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  placeholder={`Max: ${remaining}`}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowContributeModal(false)}>Cancel</Button>
                <Button type="submit" disabled={contributing} className="flex-1">
                  {contributing ? 'Processing...' : 'Confirm Contribution'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}