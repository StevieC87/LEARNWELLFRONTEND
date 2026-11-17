// app/providers.tsx
'use client';

import ReduxProvider from './ReduxProvider';
import { sendVisitToApi } from '@/lib/api/visitHeader.js';
import { sendPublicTokenToApi } from '@/lib/api/publicToken.js';

// On load, not in an effect: child effects run first, and they are what fetch.
if (typeof window !== 'undefined') {
  sendVisitToApi();
  // A public link's token on every request its pages make (publicToken.js).
  sendPublicTokenToApi();
}

export function Providers({ children }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
