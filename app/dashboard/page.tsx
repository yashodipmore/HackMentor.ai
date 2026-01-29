'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ScreenCapture } from '@/components/screen-capture';
import { AIChat } from '@/components/ai-chat';
import { Brain, Code2, Activity, Clock, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function DashboardPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false); // Default OFF
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    codeQuality: 0,
    suggestions: 0,
    sessionTime: 0,
    healthScore: 10,
  });

  // Track last analyzed code hash to avoid duplicates
  const lastCodeHash = useRef<string>('');
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth');
      return;
    }
    
    setUser(JSON.parse(userData));
    setIsLoading(false);
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  }, [router]);

  const handleCapture = useCallback(async (imageData: string) => {
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData }),
      });

      const data = await response.json();

      if (data.success && data.analysis) {
        // Use code hash to detect actual code changes
        const currentHash = data.analysis.code_hash;
        
        // Only add message if code actually changed (different hash)
        if (currentHash && currentHash !== lastCodeHash.current) {
          lastCodeHash.current = currentHash;

          const aiMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.analysis.message,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, aiMessage]);

          setSessionStats((prev) => ({
            ...prev,
            suggestions: prev.suggestions + (data.analysis.issues?.length || 0),
            codeQuality: data.analysis.score || prev.codeQuality,
          }));

          // Speak if voice enabled
          if (voiceEnabled && data.analysis.message) {
            speakMessage(data.analysis.message);
          }
        } else {
          console.log('Same code detected (hash match), skipping duplicate analysis...');
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [voiceEnabled]);

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: messages }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        if (voiceEnabled) {
          speakMessage(data.response);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    }
  }, [messages, voiceEnabled]);

  const speakMessage = (text: string) => {
    // Always stop any ongoing speech first
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Only speak if voice is enabled
    if ('speechSynthesis' in window && voiceEnabled) {
      // Small delay to ensure cancel completed
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Store reference
        speechRef.current = utterance;
        
        // Cleanup on end
        utterance.onend = () => {
          speechRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  const handleToggleVoice = useCallback(() => {
    const newVoiceState = !voiceEnabled;
    
    // If turning OFF, immediately stop all speech
    if (!newVoiceState && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      speechRef.current = null;
    }
    
    setVoiceEnabled(newVoiceState);
  }, [voiceEnabled]);

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 font-playfair">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-playfair font-semibold text-gray-900">HackMentor.AI</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-playfair">
                Welcome, {user.name}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Code2 className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600 font-playfair">Code Quality</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 font-playfair">
              {sessionStats.codeQuality > 0 ? `${sessionStats.codeQuality}/10` : '--'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600 font-playfair">Suggestions</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 font-playfair">
              {sessionStats.suggestions}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600 font-playfair">Session Time</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 font-playfair">
              {Math.floor(sessionStats.sessionTime / 60)}m
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600 font-playfair">Health Score</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 font-playfair">
              {sessionStats.healthScore}/10
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Screen Capture */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-playfair">Screen Share</h2>
            <ScreenCapture onCapture={handleCapture} isAnalyzing={isAnalyzing} />
          </div>

          {/* AI Chat */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <AIChat
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isAnalyzing}
              voiceEnabled={voiceEnabled}
              onToggleVoice={handleToggleVoice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
