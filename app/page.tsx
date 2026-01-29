import Link from 'next/link';
import { Code2, Sparkles, Shield, Zap, Brain, TrendingUp, ArrowRight } from 'lucide-react';
import { FloatingIllustration } from '@/components/3d-illustration';
import { Card3D } from '@/components/3d-card';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Lighter Gradient Overlay - More visible background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-purple-50/60 to-white/70" />
      </div>

      {/* Content */}
      <div className="relative z-10">
      {/* Floating Navigation Bar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="bg-white/80 backdrop-blur-xl border-2 border-black rounded-2xl shadow-2xl px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-playfair font-semibold text-gray-900">HackMentor.AI</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/setup-check"
                className="text-sm font-playfair font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                Setup
              </Link>
              <Link
                href="/auth"
                className="text-sm font-playfair font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth"
                className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 font-playfair font-medium text-sm transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Glassy Card */}
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Main Glassy Hero Card */}
          <div className="relative">
            {/* Glassy Card with Black Border */}
            <div className="bg-white/60 backdrop-blur-2xl border-4 border-black rounded-[3rem] shadow-2xl p-12 md:p-16 relative overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-transparent to-blue-100/50 rounded-[3rem]" />
              
              {/* Content */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Text Content */}
                <div>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600/90 backdrop-blur-sm text-white rounded-full text-sm font-playfair font-semibold mb-8 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    <span>Powered by Advanced AI</span>
                  </div>
                  
                  <h1 className="text-7xl md:text-8xl font-playfair mb-8 leading-[0.95] tracking-tight">
                    <span className="font-normal text-gray-900">Your</span>{' '}
                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">AI</span>
                    <br />
                    <span className="font-medium text-gray-900">Pair</span>{' '}
                    <span className="font-semibold text-purple-600">Dev</span>
                  </h1>
                  
                  <p className="text-2xl text-gray-700 mb-12 leading-relaxed font-playfair font-medium">
                    Real-time code analysis, instant feedback,
                    <br />
                    and intelligent mentoring.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/dashboard"
                      className="group px-10 py-5 bg-black text-white rounded-2xl hover:bg-gray-800 font-playfair font-bold text-lg inline-flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-105"
                    >
                      <Code2 className="w-6 h-6" />
                      Start Coding
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/setup-check"
                      className="px-10 py-5 bg-white/80 backdrop-blur-sm border-3 border-gray-300 text-gray-900 rounded-2xl hover:border-purple-400 font-playfair font-bold text-lg transition-all hover:scale-105 shadow-lg"
                    >
                      View Setup
                    </Link>
                  </div>
                </div>

                {/* Right: 3D Illustration */}
                <div className="hidden lg:block">
                  <FloatingIllustration />
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-400 rounded-3xl opacity-20 blur-2xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-400 rounded-3xl opacity-20 blur-2xl" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-7xl mx-auto">
          <Card3D>
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border-3 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
                Real-time Analysis
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg font-playfair">
                AI analyzes your code as you type, providing instant feedback and suggestions.
              </p>
            </div>
          </Card3D>

          <Card3D>
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border-3 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
                Security First
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg font-playfair">
                Detects vulnerabilities, security issues, and best practice violations instantly.
              </p>
            </div>
          </Card3D>

          <Card3D>
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border-3 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
                Learn & Improve
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg font-playfair">
                Track your progress, learn from mistakes, and level up your coding skills.
              </p>
            </div>
          </Card3D>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 max-w-5xl mx-auto">
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-3">10x</div>
            <div className="text-sm font-playfair font-semibold text-gray-600 uppercase tracking-wide">Faster Learning</div>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-3">24/7</div>
            <div className="text-sm font-playfair font-semibold text-gray-600 uppercase tracking-wide">Always Available</div>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-3">100%</div>
            <div className="text-sm font-playfair font-semibold text-gray-600 uppercase tracking-wide">Free to Start</div>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-3">∞</div>
            <div className="text-sm font-playfair font-semibold text-gray-600 uppercase tracking-wide">Patience</div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-32 text-center">
          <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider font-playfair font-semibold">Powered by</p>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-700 font-playfair font-semibold shadow-lg">Groq</span>
            <span className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-700 font-playfair font-semibold shadow-lg">Gemini</span>
            <span className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-700 font-playfair font-semibold shadow-lg">Next.js</span>
            <span className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-700 font-playfair font-semibold shadow-lg">Supabase</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-gray-200 mt-32 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-10">
          <div className="text-center">
            <p className="text-gray-600 font-playfair font-medium">Built for SNOW FEST 2026 by <span className="font-bold text-purple-600">Yashodip More</span></p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
