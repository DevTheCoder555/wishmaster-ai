'use client';
import { useState, useEffect } from 'react';
import { WishCard } from '@/components/WishCard';
import { Button } from '@/components/ui/Button';
import { Filter, TrendingUp, RefreshCw } from 'lucide-react';

export default function FeedPage() {
  const [wishes, setWishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wishes');
      const data = await res.json();
      setWishes(data.wishes || []);
    } catch (err) {
      console.error('Failed to fetch wishes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Wish Feed</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={fetchWishes}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-xl p-6 h-48 animate-pulse" />
          ))}
        </div>
      ) : wishes.length === 0 ? (
        <div className="text-center py-20 glass rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No wishes yet</h3>
          <p className="text-white/60 mb-6">Be the first to create a wish!</p>
          <Button onClick={() => window.location.href = '/create-wish'}>Create Wish</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {wishes.map((wish) => <WishCard key={wish.id} wish={wish} />)}
        </div>
      )}
    </div>
  );
}