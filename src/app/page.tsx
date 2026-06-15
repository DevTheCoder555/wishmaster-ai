import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Sparkles, Gift, MapPin, TrendingUp, Users, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative">
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-primary/30 text-primary mb-6">
              <Sparkles className="h-4 w-4 mr-2" /> <span className="text-sm font-medium">100% Free & Open Source</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Make Your Wishes Come True with AI
            </h1>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              WishMaster AI is the ultimate social platform where dreams meet reality. 
              Create wishes, get AI-powered suggestions, and let the community help you fulfill them.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup"><Button size="lg" className="w-full sm:w-auto">Start Making Wishes</Button></Link>
              <Link href="/feed"><Button variant="outline" size="lg" className="w-full sm:w-auto">Explore Wishes</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-darker/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose WishMaster AI?</h2>
            <p className="text-white/60 max-w-2xl mx-auto">We combine cutting-edge AI with a supportive community, completely free.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: 'AI Wish Creator', desc: 'Just describe your wish and our AI will generate the perfect title, description, and product suggestions.' },
              { icon: Gift, title: 'Community Fulfillment', desc: 'Get help from others through partial contributions, group funding, or anonymous gifts.' },
              { icon: MapPin, title: 'GPS Nearby Wishes', desc: 'Discover and fulfill wishes in your local area with our privacy-first, free OpenStreetMap integration.' },
              { icon: TrendingUp, title: 'Affiliate Earnings', desc: 'Earn commissions by sharing affiliate links for products that fulfill wishes.' },
              { icon: Users, title: 'Social Feed', desc: 'Follow users, like, comment, and share wishes in a familiar social media experience.' },
              { icon: Shield, title: 'Secure & Private', desc: 'Local-first architecture with optional anonymous fulfillment and strict privacy controls.' },
            ].map((feature, i) => (
              <Card key={i} className="glass-hover transition-all duration-300">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 text-center p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Wish?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already making their dreams come true. 
              New users get 100 free credits to boost their first wish!
            </p>
            <Link href="/signup"><Button size="lg">Create Your First Wish</Button></Link>
          </Card>
        </div>
      </section>
    </div>
  );
}