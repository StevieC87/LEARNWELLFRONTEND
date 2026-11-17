'use client';
import { useState } from 'react';

// Checks a field the way a payment form does: not while the first characters
// go in, but once the person leaves the field (or sends the form). From then
// on it checks on every keystroke, so the message goes the moment the value
// is right. `problem(value)` returns what is wrong, or '' (lib/fieldChecks.js).
//
// Spread `input` on the <input> and show `error` under it; `check()` before
// sending says whether it may go, and shows the message if not.
export function useFieldCheck(value, problem) {
  const [shown, setShown] = useState(false);
  const found = problem(value);
  const error = shown ? found : '';
  return {
    error,
    check: () => { setShown(true); return !found; },
    input: {
      onBlur: () => setShown(true),
      'aria-invalid': error ? true : undefined,
    },
  };
}
