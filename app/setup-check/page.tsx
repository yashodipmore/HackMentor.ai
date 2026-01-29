'use client';

import { useEffect, useState } from 'react';
import { Brain, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SetupResults {
  success: boolean;
  results: {
    supabase: boolean;
    groq: boolean;
    gemini_vision: boolean;
    voyage: boolean;
    redis: boolean;
    elevenlabs: boolean;
    errors: string[];
  };
  message: string;
}

export default function SetupCheckPage() {
  const [results, setResults] = useState<SetupResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test-setup')
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Setup check failed:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking setup...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to check setup</p>
        </div>
      </div>
    );
  }

  const services = [
    { name: 'Supabase', key: 'supabase', required: true },
    { name: 'Groq AI', key: 'groq', required: true },
    { name: 'Gemini Vision', key: 'gemini_vision', required: false },
    { name: 'Voyage AI', key: 'voyage', required: true },
    { name: 'Redis Cache', key: 'redis', required: false },
    { name: 'ElevenLabs', key: 'elevenlabs', required: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-mono font-bold text-gray-900">HackMentor.AI</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Setup Check</h1>
            <p className="text-gray-600">Verifying all services and configurations</p>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Status</h2>
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  results.success
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {results.message}
              </div>
            </div>

            <div className="space-y-3">
              {services.map((service) => {
                const status = results.results[service.key as keyof typeof results.results];
                const isWorking = typeof status === 'boolean' ? status : false;

                return (
                  <div
                    key={service.key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {isWorking ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300" />
                      )}
                      <span className="font-medium text-gray-900">{service.name}</span>
                      {!service.required && (
                        <span className="text-xs text-gray-500">(Optional)</span>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isWorking ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {isWorking ? 'Working' : 'Not configured'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Errors */}
          {results.results.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Errors</h3>
              <div className="space-y-2">
                {results.results.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-700">
                    • {error.split(':')[0]}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="space-y-3 text-gray-600">
              {!results.results.supabase && (
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-purple-600 mt-0.5" />
                  <span>Set up Supabase database and run migrations</span>
                </div>
              )}
              {!results.results.groq && (
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-purple-600 mt-0.5" />
                  <span>Add GROQ_API_KEY to .env.local</span>
                </div>
              )}
              {!results.results.gemini_vision && (
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-purple-600 mt-0.5" />
                  <span>Add GOOGLE_AI_API_KEY for vision features (optional)</span>
                </div>
              )}
              {results.success && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-green-700 font-medium">
                    All required services are working! Ready to start.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
