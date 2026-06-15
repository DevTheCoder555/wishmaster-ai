'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, MapPin, DollarSign, Tag, Plus, Check } from 'lucide-react';

export default function CreateWishPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [generatedWish, setGeneratedWish] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setGeneratedWish(data);
      setSelectedProducts([]); // Reset selected products on new generation
    } catch (err) {
      setError('Failed to generate wish. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleProduct = (product: any) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.name === product.name);
      if (exists) return prev.filter(p => p.name !== product.name);
      return [...prev, product];
    });
  };

  const handlePublish = async () => {
    if (!session?.user) return;
    setIsPublishing(true);
    setError('');
    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedWish.title,
          description: generatedWish.description,
          category: generatedWish.category,
          budget: parseFloat(generatedWish.budget),
          affiliateLinks: selectedProducts
        })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to publish');
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Wish</h1>
      {error && <div className="mb-4 p-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">{error}</div>}
      
      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Wish Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/60 mb-4">Describe what you want. Our local AI will generate a structured wish with affiliate products you can add.</p>
          <textarea
            value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: I want a gaming laptop for college that can handle coding and some light gaming. My budget is around $1500."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4"
          />
          <Button onClick={handleGenerate} disabled={isGenerating || !prompt} className="w-full flex items-center justify-center gap-2">
            {isGenerating ? (<><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>) : (<><Sparkles className="h-4 w-4" /> Generate Wish with AI</>)}
          </Button>
        </CardContent>
      </Card>

      {generatedWish && (
        <Card className="glass border-primary/30">
          <CardHeader><CardTitle>Generated Wish Preview</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Title</label>
              <input type="text" defaultValue={generatedWish.title} onChange={(e) => setGeneratedWish({...generatedWish, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
              <textarea defaultValue={generatedWish.description} onChange={(e) => setGeneratedWish({...generatedWish, description: e.target.value})} className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1 flex items-center gap-1"><Tag className="h-4 w-4" /> Category</label>
                <input type="text" defaultValue={generatedWish.category} onChange={(e) => setGeneratedWish({...generatedWish, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1 flex items-center gap-1"><DollarSign className="h-4 w-4" /> Budget</label>
                <input type="number" defaultValue={generatedWish.budget} onChange={(e) => setGeneratedWish({...generatedWish, budget: parseFloat(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                AI Suggested Affiliate Products 
                <span className="text-xs text-white/50 font-normal">({selectedProducts.length} selected)</span>
              </h4>
              <div className="space-y-3">
                {generatedWish.products.map((product: any, i: number) => {
                  const isSelected = selectedProducts.find(p => p.name === product.name);
                  return (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isSelected ? 'bg-primary/20 border-primary/50' : 'bg-white/5 border-white/10'}`}>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-white/60">${product.price} • {product.commission} commission</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant={isSelected ? 'primary' : 'outline'} 
                        onClick={() => toggleProduct(product)}
                        className="flex items-center gap-2"
                      >
                        {isSelected ? <><Check className="h-4 w-4" /> Added</> : <><Plus className="h-4 w-4" /> Add</>}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setGeneratedWish(null)}>Cancel</Button>
              <Button disabled={isPublishing} className="flex-1" onClick={handlePublish}>
                {isPublishing ? 'Publishing...' : `Publish Wish (${session.user.credits >= 10 ? '-10 Credits' : 'Not enough credits'})`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}