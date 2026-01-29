'use client';

import { useEffect, useRef } from 'react';

export function FloatingIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xRotation = ((clientY / innerHeight) - 0.5) * 20;
      const yRotation = ((clientX / innerWidth) - 0.5) * -20;
      
      container.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative transition-transform duration-200 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Main Brain/AI Sphere */}
        <div className="relative w-64 h-64">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          
          {/* Main sphere */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-600 to-purple-800 rounded-full shadow-2xl"
            style={{ transform: 'translateZ(50px)' }}
          >
            {/* Inner glow */}
            <div className="absolute inset-4 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
            
            {/* Neural network lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="30" r="3" fill="white" opacity="0.8">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="30" cy="50" r="3" fill="white" opacity="0.8">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="70" cy="50" r="3" fill="white" opacity="0.8">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="70" r="3" fill="white" opacity="0.8">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2.2s" repeatCount="indefinite" />
              </circle>
              
              <line x1="50" y1="30" x2="30" y2="50" stroke="white" strokeWidth="0.5" opacity="0.4" />
              <line x1="50" y1="30" x2="70" y2="50" stroke="white" strokeWidth="0.5" opacity="0.4" />
              <line x1="30" y1="50" x2="50" y2="70" stroke="white" strokeWidth="0.5" opacity="0.4" />
              <line x1="70" y1="50" x2="50" y2="70" stroke="white" strokeWidth="0.5" opacity="0.4" />
            </svg>
          </div>

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `translateZ(${Math.random() * 100}px)`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Orbiting rings */}
        <div 
          className="absolute inset-0 border-2 border-purple-300/30 rounded-full"
          style={{
            width: '350px',
            height: '350px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotateX(75deg)',
            animation: 'spin 20s linear infinite',
          }}
        />
        <div 
          className="absolute inset-0 border-2 border-purple-400/20 rounded-full"
          style={{
            width: '400px',
            height: '400px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotateX(75deg)',
            animation: 'spin 25s linear infinite reverse',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateZ(var(--z));
          }
          50% {
            transform: translateY(-20px) translateZ(var(--z));
          }
        }
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotateX(75deg) rotateZ(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotateX(75deg) rotateZ(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export function CodeBlockIllustration() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center perspective-1000">
      <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
        {/* Code editor window */}
        <div 
          className="w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
          style={{ transform: 'rotateY(-15deg) rotateX(5deg)' }}
        >
          {/* Window header */}
          <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-gray-600 font-mono ml-2">code.tsx</span>
          </div>
          
          {/* Code content */}
          <div className="p-4 font-mono text-sm bg-gray-50">
            <div className="text-purple-600">function <span className="text-blue-600">analyze</span>() {'{'}</div>
            <div className="ml-4 text-gray-600">// AI analyzing...</div>
            <div className="ml-4 text-green-600">return <span className="text-orange-600">"Perfect!"</span>;</div>
            <div className="text-purple-600">{'}'}</div>
          </div>
        </div>

        {/* Floating checkmarks */}
        <div 
          className="absolute -right-8 top-8 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ 
            transform: 'translateZ(50px)',
            animation: 'bounce 2s ease-in-out infinite'
          }}
        >
          ✓
        </div>
        
        <div 
          className="absolute -left-8 bottom-8 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ 
            transform: 'translateZ(30px)',
            animation: 'bounce 2.5s ease-in-out infinite'
          }}
        >
          ⚡
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateZ(50px) translateY(0);
          }
          50% {
            transform: translateZ(50px) translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
