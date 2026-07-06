'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to track whether the component has mounted on the client.
 * Useful for avoiding hydration mismatches when rendering content
 * that depends on client-side state (e.g., wallet connection, localStorage).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
