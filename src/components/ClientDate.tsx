'use client';

import { useEffect, useState } from 'react';

export default function ClientDate() {
  // Use state to ensure it matches on hydration or handles client-side only
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    // Determine user's local date
    setDateStr(new Date().toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }));
  }, []);

  if (!dateStr) return null; // Avoid hydration mismatch by rendering nothing initially

  return (
    <span>{dateStr}</span>
  );
}
