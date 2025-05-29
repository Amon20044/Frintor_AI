// app/test-form/page.tsx
'use client';
import TestForm from '@/components/TestForm';
import { useEffect, useState } from 'react';

export default function Page() {
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('uuid');
    setUuid(stored);
  }, []);

  if (!uuid) return <div>Loading...</div>;

  return <TestForm params={{uuid}} />;
}
