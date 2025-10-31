'use client'

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface AppContentProps {
  children: React.ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  const { loading } = useAuth();
  const [appReady, setAppReady] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Immediately set app ready when auth loading completes
      setAppReady(true);
    }
  }, [loading]);

  // Show loading indicator only after 300ms to avoid flash for fast loads
  useEffect(() => {
    const loadingDelay = setTimeout(() => {
      if (!appReady) {
        setShowLoading(true);
      }
    }, 300);

    return () => clearTimeout(loadingDelay);
  }, [appReady]);

  // Emergency timeout: Force app ready after 2 seconds max
  useEffect(() => {
    const globalTimeout = setTimeout(() => {
      if (!appReady) {
        console.warn('⚡ Emergency timeout: Forcing app ready after 2 seconds');
        setAppReady(true);
      }
    }, 2000);

    return () => clearTimeout(globalTimeout);
  }, [appReady]);

  // Show loading only if it's taking time
  if (!appReady && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gitam-primary mx-auto"></div>
          <p className="text-gray-600 mt-3 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // For fast loads, render immediately without showing loading
  return <>{children}</>;
}