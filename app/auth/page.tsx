'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Mail, Lock, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup' | 'verify'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('OTP sent to your email! Check your inbox.');
        setMode('verify');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password, name }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white flex items-center justify-center p-6">
      {/* Floating Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-black rounded-full px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <span className="font-playfair font-semibold text-gray-900">HackMentor.AI</span>
          </Link>
        </div>
      </nav>

      {/* Auth Card */}
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm border-4 border-black rounded-[3rem] p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Verify Email'}
            </h1>
            <p className="text-gray-600 font-playfair">
              {mode === 'login' ? 'Login to continue your journey' : mode === 'signup' ? 'Start your AI mentorship' : 'Enter the code we sent'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4">
              <p className="text-red-700 text-sm font-playfair">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-4">
              <p className="text-green-700 text-sm font-playfair">{success}</p>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-playfair text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 border-2 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-playfair text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 border-2 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-playfair"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
              </Button>

              <p className="text-center text-sm text-gray-600 font-playfair">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </form>
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-playfair text-gray-700 mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10 border-2 border-gray-300 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-playfair text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 border-2 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-playfair"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
              </Button>

              <p className="text-center text-sm text-gray-600 font-playfair">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          )}

          {/* OTP Verification Form */}
          {mode === 'verify' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-playfair text-gray-700 mb-2">Verification Code</label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest border-2 border-gray-300 focus:border-purple-500"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 text-center mt-2 font-playfair">
                  Check your email for the 6-digit code
                </p>
              </div>

              <div>
                <label className="block text-sm font-playfair text-gray-700 mb-2">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 border-2 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-playfair"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Create Account'}
              </Button>

              <p className="text-center text-sm text-gray-600 font-playfair">
                Didn&apos;t receive code?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Resend
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
