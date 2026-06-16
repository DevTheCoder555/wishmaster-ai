'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tag, DollarSign, Link as LinkIcon, FileText, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CreateWishPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  
  // State for the mandatory rules checkbox
  const [agreedToRules, setAgreedToRules] = useState(false);
  
  const [formData, setFormData] = useState({
    productName: '',
    category: 'Technology',
    description: '',
    price: '',
    amazonLink: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      router.push('/login');
      return;
    }

    // RULE: Mandatory checkbox validation
    if (!agreedToRules) {
      setError('You must read and agree to the Wish Creation Rules before proceeding.');
      return;
    }
    
    if (session.user.credits < 10) {
      setError('You need at least 10 credits to create a wish. Please purchase more credits.');
      return;
    }

    setIsPublishing(true);
    setError('');

    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.productName,
          description: formData.description,
          category: formData.category,
          budget: parseFloat(formData.price),
          amazonLink: formData.amazonLink
        })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to publish wish');
      }

      await updateSession(); // Refresh credits in navbar
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to create a wish</h1>
        <Button onClick={() => router.push('/login')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Create a New Wish</h1>
        <Link href="/rules" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 underline">
          <ShieldCheck className="h-4 w-4" /> View Rules
        </Link>
      </div>
      <p className="text-white/60 mb-8">Tell us what you need. We'll help the community find it for you.</p>
      
      {error && <div className="mb-6 p-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> {error}</div>}
      
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" /> Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Product Name</label>
              <div className="relative">
                <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input 
                  name="productName" 
                  required 
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="e.g., Sony WH-1000XM5 Headphones" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <select 
                  name="category" 
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                >
                  <option value="Technology" className="bg-darker">Technology</option>
                  <option value="Fashion" className="bg-darker">Fashion</option>
                  <option value="Home & Kitchen" className="bg-darker">Home & Kitchen</option>
                  <option value="Books & Education" className="bg-darker">Books & Education</option>
                  <option value="Sports & Fitness" className="bg-darker">Sports & Fitness</option>
                  <option value="Other" className="bg-darker">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                <textarea 
                  name="description" 
                  required 
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Why do you want this? Any specific details, color, or size preferences?" 
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Price (in ₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input 
                    name="price" 
                    required 
                    type="number" 
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 24999" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Amazon Product Link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input 
                    name="amazonLink" 
                    required 
                    type="url" 
                    value={formData.amazonLink}
                    onChange={handleChange}
                    placeholder="https://www.amazon.in/dp/..." 
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                </div>
              </div>
            </div>

            {/* MANDATORY RULES CHECKBOX */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <input 
                type="checkbox" 
                id="rules" 
                checked={agreedToRules} 
                onChange={(e) => setAgreedToRules(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/30 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <label htmlFor="rules" className="text-sm text-white/80 leading-relaxed cursor-pointer">
                I have read and agree to the <Link href="/rules" className="text-primary hover:underline font-medium">Wish Creation Rules</Link>. 
                I understand that I cannot fulfill my own wish, contributions are non-refundable, and fulfillment occurs only through admin-approved affiliate purchases.
              </label>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-white/60">Cost to publish: <span className="text-primary font-bold">10 Credits</span></p>
              <Button type="submit" disabled={isPublishing || !agreedToRules} className="w-full sm:w-auto px-8">
                {isPublishing ? 'Publishing...' : 'Publish Wish'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}