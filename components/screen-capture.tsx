'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MonitorPlay, Square, Camera, Loader2 } from 'lucide-react';

interface ScreenCaptureProps {
  onCapture: (imageData: string) => void;
  isAnalyzing: boolean;
}

export function ScreenCapture({ onCapture, isAnalyzing }: ScreenCaptureProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCapture = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'window',
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsRecording(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      intervalRef.current = setInterval(() => {
        captureFrame();
      }, 3000);

      mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopCapture();
      });
    } catch (error) {
      console.error('Error starting screen capture:', error);
    }
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    const base64Data = imageData.split(',')[1];

    onCapture(base64Data);
  }, [onCapture, isAnalyzing]);

  const stopCapture = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRecording(false);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-50 rounded-lg overflow-hidden aspect-video border-2 border-gray-200">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />

        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50">
            <div className="text-center">
              <MonitorPlay className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">
                Start screen sharing to begin
              </p>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>Recording</span>
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!isRecording ? (
          <Button
            onClick={startCapture}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            <MonitorPlay className="w-4 h-4 mr-2" />
            Start Session
          </Button>
        ) : (
          <>
            <Button
              onClick={captureFrame}
              variant="outline"
              className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
              disabled={isAnalyzing}
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture Now
            </Button>
            <Button
              onClick={stopCapture}
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center">
        {isRecording
          ? 'AI analyzes your screen every 3 seconds'
          : 'Share your code editor for real-time feedback'}
      </p>
    </div>
  );
}
