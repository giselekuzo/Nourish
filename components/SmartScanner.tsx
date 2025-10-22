
import React, { useRef, useEffect, useState } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import type { FoodAnalysisResponse } from '../services/geminiService';
import { CameraIcon } from './icons/CameraIcon';

interface SmartScannerProps {
  onScanSuccess: (data: FoodAnalysisResponse) => void;
  onCancel: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
);

export const SmartScanner: React.FC<SmartScannerProps> = ({ onScanSuccess, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Could not access camera. Please check permissions.");
      }
    }
    setupCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsLoading(true);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    
    try {
        const result = await analyzeFoodImage(base64Image);
        onScanSuccess(result);
    } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="p-6 pt-0 flex flex-col items-center">
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white">
                <LoadingSpinner />
                <p className="mt-4 font-semibold">Analyzing...</p>
            </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex w-full gap-4">
        <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
        >
            Cancel
        </button>
        <button
            onClick={handleCapture}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
            <CameraIcon className="w-5 h-5"/>
            Scan
        </button>
      </div>
    </div>
  );
};
