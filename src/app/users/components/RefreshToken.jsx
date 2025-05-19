'use client';
import { useEffect } from 'react';
export default function RefreshToken({ shouldRefresh }) {
  useEffect(() => {
    if (shouldRefresh) {
      fetch('http://localhost:3000/users/refresh-token', {
        method: 'POST',
        credentials: 'include',
      }).catch(console.error);
    }
  }, [shouldRefresh]);
  return null;
}
