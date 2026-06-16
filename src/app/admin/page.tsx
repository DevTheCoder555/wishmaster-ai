'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, CheckCircle, XCircle, Eye } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pendingContributions, setPendingContributions] = useState<any[]>([]);
  const [pendingFulfillments, setPendingFulfillments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') fetchData();
  }, [status, router]);

  const fetchData = async () => {
    // In production, create a dedicated /api/admin/pending route
    // For brevity, assuming you fetch pending contributions and fulfillments here
    setLoading(false);
  };

  const handleVerify = async (type: string, id: string, action: string) => {
    await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id, action })
    });
    fetchData(); // Refresh
  };

  if (loading) return <div className="p-8 text-center">Loading Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contribution Verification */}
        <Card className="glass">
          <CardHeader><CardTitle>Pending Contributions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {pendingContributions.length === 0 ? <p className="text-white/60">No pending contributions.</p> : 
              pendingContributions.map((c: any) => (
                <div key={c.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">₹{c.amount} for "{c.wish.title}"</span>
                    <span className="text-xs text-yellow-400">Pending</span>
                  </div>
                  <p className="text-sm text-white/60 mb-3">Proof: {c.paymentProof || 'None'}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleVerify('contribution', c.id, 'approve')}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => handleVerify('contribution', c.id, 'reject')}>
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>

        {/* Fulfillment Requests */}
        <Card className="glass">
          <CardHeader><CardTitle>Fulfillment Requests</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {pendingFulfillments.length === 0 ? <p className="text-white/60">No pending requests.</p> :
              pendingFulfillments.map((req: any) => (
                <div key={req.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{req.wish.title}</span>
                    <span className="text-xs text-blue-400">{req.status}</span>
                  </div>
                  <p className="text-sm text-white/60 mb-3">Requested by: {req.user.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {req.status === 'Pending' && (
                      <Button size="sm" className="flex-1" onClick={() => handleVerify('fulfillment', req.id, 'approve')}>Approve Request</Button>
                    )}
                    {req.status === 'Approved' && (
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleVerify('fulfillment', req.id, 'order_placed')}>
                        Mark as Ordered (via Affiliate)
                      </Button>
                    )}
                    {req.status === 'Ordered' && (
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleVerify('fulfillment', req.id, 'fulfilled')}>
                        Mark as Fulfilled
                      </Button>
                    )}
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}