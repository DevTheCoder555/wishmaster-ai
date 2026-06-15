'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      email,
      password,
      isSignup: 'false',
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const fillDemoCredentials = () => {
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      (form.elements.namedItem('email') as HTMLInputElement).value = 'demo@wishmaster.ai';
      (form.elements.namedItem('password') as HTMLInputElement).value = 'password123';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-white/60 mt-2">Sign in to your WishMaster AI account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm border border-red-500/30">{error}</div>}
            
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
              <p className="text-sm text-blue-300 mb-2 font-medium">💡 Quick Test:</p>
              <Button type="button" variant="ghost" size="sm" onClick={fillDemoCredentials} className="w-full text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 flex items-center justify-center gap-2">
                <User className="h-4 w-4" /> Auto-fill Demo Account
              </Button>
              <p className="text-xs text-white/50 mt-2 text-center">Or sign up to get 100 free credits!</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input name="email" required type="email" className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input name="password" required type="password" className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="••••••••" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-center text-sm text-white/60 mt-6">
            Don't have an account? <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}