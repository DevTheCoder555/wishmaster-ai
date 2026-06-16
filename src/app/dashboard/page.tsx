'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Wallet, Gift, TrendingUp, Plus, History } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetchDashboard();
    }
  }, [status, router]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="h-8 w-48 bg-white/10 rounded animate-pulse mx-auto mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-white/60 mt-1">Welcome back, {data.user.name}</p>
        </div>
        <Link href="/create-wish">
          <Button className="mt-4 md:mt-0 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create New Wish
          </Button>
        </Link>
      </div>

      {/* REMOVED AFFILIATE STATS. Now shows 3 clean, user-focused cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-white/60 text-sm">Total Credits</p>
              <p className="text-3xl font-bold mt-1">{data.user.credits}</p>
            </div>
            <Wallet className="h-10 w-10 text-primary opacity-80" />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-white/60 text-sm">Active Wishes</p>
              <p className="text-3xl font-bold mt-1">{data.stats.activeWishes}</p>
            </div>
            <Gift className="h-10 w-10 text-secondary opacity-80" />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-white/60 text-sm">Fulfilled Wishes</p>
              <p className="text-3xl font-bold mt-1">{data.stats.fulfilledWishes}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-400 opacity-80" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="glass h-full">
            <CardHeader><CardTitle>My Wishes</CardTitle></CardHeader>
            <CardContent>
              {data.wishes.length === 0 ? (
                <p className="text-white/60 text-center py-8">You haven't created any wishes yet.</p>
              ) : (
                <div className="space-y-4">
                  {data.wishes.map((wish: any) => (
                    <div key={wish.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <h4 className="font-medium">{wish.title}</h4>
                        <p className="text-sm text-white/60">{wish.category} • {wish._count.contributions} contributions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{wish.fulfilledAmount} / ₹{wish.budget}</p>
                        <p className={`text-sm ${wish.fulfilledAmount >= wish.budget ? 'text-green-400' : 'text-primary'}`}>
                          {wish.fulfilledAmount >= wish.budget ? 'Fulfilled' : 'In Progress'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass h-full">
            <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Recent Activity</CardTitle></CardHeader>
            <CardContent>
              {data.contributions.length === 0 ? (
                <p className="text-white/60 text-center py-8">No recent activity.</p>
              ) : (
                <div className="space-y-3">
                  {data.contributions.map((contrib: any) => (
                    <div key={contrib.id} className="flex justify-between text-sm p-3 rounded bg-white/5 border border-white/10">
                      <div>
                        <p className="font-medium text-white/80">Contributed to: {contrib.wish.title}</p>
                        <p className="text-xs text-white/50">{new Date(contrib.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-green-400 font-medium">-{contrib.amount} cr</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}