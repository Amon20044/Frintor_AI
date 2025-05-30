'use client';

import React, { useEffect, useState } from 'react';
import VedicHoroscopeAnalysis from "@/components/VedicHoroscope";
import { Loader2 } from 'lucide-react';

function Page() {
  const [uuid, setUuid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUuid = localStorage.getItem('uuid');
    console.log('UUID from localStorage:', storedUuid);
    
    if (!storedUuid) {
      console.error('No UUID found in localStorage');
      // Redirect to dashboard if no UUID
      window.location.href = '/student/dashboard';
      return;
    }
    
    setUuid(storedUuid);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading your horoscope...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {uuid ? <VedicHoroscopeAnalysis uuid={uuid} /> : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">Unable to load horoscope</p>
            <button 
              onClick={() => window.location.href = '/student/dashboard'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
