'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QrCode, CreditCard, Upload } from 'lucide-react';
import Image from 'next/image';

export default function CreditsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [amount, setAmount] = useState('');
  const [proof, setProof] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return router.push('/login');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountINR: parseFloat(amount), paymentProof: proof })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      alert('Purchase request submitted! Admin will verify and add credits shortly.');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card className="glass">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <CreditCard className="h-6 w-6 text-primary" /> Purchase Credits / Contribute
          </CardTitle>
          <p className="text-white/60 mt-2">Scan the QR code below to pay. Then submit your Transaction ID / UTR for verification.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center p-6 bg-white rounded-xl">
            {/* Ensure you copied the QR code to public/qr-code.jpeg */}
            <Image src="/qr-code.jpeg" alt="Payment QR Code" width={250} height={250} className="rounded-lg" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm border border-red-500/30">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Amount (INR)</label>
              <input 
                type="number" 
                required 
                min="10"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                placeholder="e.g., 500"
              />
              <p className="text-xs text-white/50 mt-1">1 Credit = ₹1 (Example ratio)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1 flex items-center gap-1">
                <Upload className="h-4 w-4" /> Transaction ID / UTR / Payment Proof
              </label>
              <input 
                type="text" 
                required 
                value={proof} 
                onChange={(e) => setProof(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                placeholder="e.g., UPI Ref: 1234567890"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}