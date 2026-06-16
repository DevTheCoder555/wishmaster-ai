'use client';

import Link from 'next/link';
import { Button } from './ui/Button';
import {
  Sparkles,
  MapPin,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  Shield,
  CreditCard
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              WishMaster AI
            </span>
          </Link>

          {status === 'authenticated' ? (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/feed"
                className="text-white/80 hover:text-white transition-colors"
              >
                Feed
              </Link>

              <Link
                href="/map"
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <MapPin className="h-4 w-4" />
                Nearby
              </Link>

              <Link
                href="/rules"
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <Shield className="h-4 w-4" />
                Rules
              </Link>

              <Link
                href="/credits"
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <CreditCard className="h-4 w-4" />
                Buy Credits
              </Link>

              <Link
                href="/dashboard"
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <User className="h-4 w-4" />
                  <span>{session.user.name}</span>
                </div>

                <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30">
                  {session.user.credits} Credits
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/feed"
                className="text-white/80 hover:text-white transition-colors"
              >
                Feed
              </Link>

              <Link
                href="/map"
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <MapPin className="h-4 w-4" />
                Nearby
              </Link>

              <Link
                href="/rules"
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <Shield className="h-4 w-4" />
                Rules
              </Link>

              <Link
                href="/credits"
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <CreditCard className="h-4 w-4" />
                Buy Credits
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-4 md:hidden">
            {status === 'authenticated' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {status === 'unauthenticated' && (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}