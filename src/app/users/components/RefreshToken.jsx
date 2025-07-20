'use client';
import { useEffect } from 'react';
export default function RefreshToken({ shouldRefresh }) {
  useEffect(() => {
    if (shouldRefresh) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      }).catch(console.error);
    }
  }, [shouldRefresh]);
  return null;
}
