'use client';

import { useState } from 'react';
import { Eye, EyeOff } from '@/components/ui/icons.jsx';

// A password field with a show/hide button. `input` is react-hook-form's
// register() result, so the form's rules stay where they are.
export default function PasswordInput({ id, input, invalid, ...rest }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="auth-password">
      <input
        id={id}
        type={shown ? 'text' : 'password'}
        className={`auth-input${invalid ? ' is-invalid' : ''}`}
        {...rest}
        {...input}
      />
      <button
        type="button"
        className="auth-reveal"
        onClick={() => setShown((value) => !value)}
        aria-label={shown ? 'Hide password' : 'Show password'}
        aria-pressed={shown}
      >
        {shown ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
