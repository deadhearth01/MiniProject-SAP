'use client'

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface AppContentProps {
  children: React.ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  const { loading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Small delay to ensure everything is settled
      const timer = setTimeout(() => setAppReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // AGGRESSIVE GLOBAL TIMEOUT: Force app ready after 5 seconds max
  useEffect(() => {
    const globalTimeout = setTimeout(() => {
      console.warn('🚨 GLOBAL EMERGENCY: Forcing app ready after 5 seconds');
      setAppReady(true);
    }, 5000);

    return () => clearTimeout(globalTimeout);
  }, []);

  if (!appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gitam-primary mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Initializing application...</p>
          <p className="text-gray-400 text-sm mt-2">If this takes too long, please refresh the page</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gitam-primary text-white rounded-lg hover:bg-gitam-dark transition-colors"
          >
            Force Refresh
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}