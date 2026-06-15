import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-white">WishMaster AI</span>
            </div>
            <p className="text-white/60 max-w-sm">
              The ultimate AI-powered social platform where dreams meet reality. 
              Create wishes, fulfill others, and earn through our affiliate ecosystem.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-white/60">
              <li><Link href="/feed" className="hover:text-primary transition-colors">Wish Feed</Link></li>
              <li><Link href="/map" className="hover:text-primary transition-colors">Nearby Wishes</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-white/60 hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
              <a href="#" className="text-white/60 hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} WishMaster AI. 100% Free & Open Source.
        </div>
      </div>
    </footer>
  );
}