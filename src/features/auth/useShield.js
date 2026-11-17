'use client';
import { useEffect, useRef } from 'react';
import { createShield } from '@/lib/shield';

// Spam protection for our login, sign-up and password reset forms: starts
// the check when the page opens. Put the answer in the request as `shield`
// (await take()). In "checkbox" mode, render <div ref={boxRef} /> where the
// "I'm not a robot" box goes and check ticked() before sending.
export function useShield(mode = 'invisible') {
  const shield = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const s = createShield({
      mode,
      fetchChallenge: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/shield/challenge`, { method: 'POST', credentials: 'include' })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('challenge')))),
    });
    shield.current = s;
    s.start();
    if (mode === 'checkbox' && boxRef.current) boxRef.current.replaceChildren(s.box());
  }, [mode]);

  return {
    boxRef,
    take: () => (shield.current ? shield.current.take() : Promise.resolve('')),
    ticked: () => shield.current?.ticked() ?? false,
    nudge: () => shield.current?.nudge(),
  };
}
