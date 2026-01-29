'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Send, Mic, MicOff, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

export function AIChat({
  messages,
  onSendMessage,
  isLoading,
  voiceEnabled,
  onToggleVoice,
}: AIChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Mentor</h3>
            <p className="text-xs text-gray-500">
              {isLoading ? 'Thinking...' : 'Ready to help'}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleVoice}
          className={voiceEnabled ? 'text-purple-600' : 'text-gray-400'}
        >
          {voiceEnabled ? (
            <Mic className="w-4 h-4" />
          ) : (
            <MicOff className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">Hi! I&apos;m your AI Mentor</p>
            <p className="text-sm text-gray-500 mb-6">
              Share your screen or paste code for instant feedback
            </p>
            <div className="space-y-2 max-w-sm mx-auto">
              <div className="text-xs text-gray-400 text-left">Try asking:</div>
              <div className="text-sm bg-white p-3 rounded-lg border border-gray-200 text-left">
                &quot;Review this code: [paste code]&quot;
              </div>
              <div className="text-sm bg-white p-3 rounded-lg border border-gray-200 text-left">
                &quot;Explain async/await&quot;
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-purple-200' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your code..."
            className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
