'use client';

import React, { useEffect, useState } from 'react';
import VedicHoroscopeAnalysis from "@/components/VedicHoroscope";

function Page() {
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    const storedUuid = localStorage.getItem('uuid');
    console.log('UUID from localStorage:', storedUuid);
    setUuid(storedUuid);
  }, []);

  return (
    <div>
      {uuid ? <VedicHoroscopeAnalysis uuid={uuid} /> : <p>Loading...</p>}
    </div>
  );
}

export default Page;
