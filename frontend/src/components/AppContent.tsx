'use client'

import { useAuth } from "@/contexts/AuthContext";

interface AppContentProps {
  children: React.ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  const { loading } = useAuth();

  // Simple: show loading only while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gitam-primary mx-auto"></div>
          <p className="text-gray-600 mt-3 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Once loaded, show content immediately
  return <>{children}</>;
}