// app/providers.tsx
'use client';

import ReduxProvider from './ReduxProvider';

export function Providers({ children }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
