'use client'
import { useRef, useState } from "react";

const BOXES = 6;
const EMPTY = Array(BOXES).fill('');

// Six boxes for a code, sent by itself once the last one is filled. `onComplete`
// gets the code and answers true if it was taken: the boxes stay locked for
// whatever comes next. Anything else empties them for another go.
export default function CodeBoxes({ onComplete, autoFocus }) {
  const boxRefs = useRef([]);
  const [digits, setDigits] = useState(EMPTY);
  // A second code sent during the first would spend one of the few tries.
  const [sending, setSending] = useState(false);

  const focusBox = (idx) => boxRefs.current[Math.max(0, Math.min(idx, BOXES - 1))]?.focus();

  const send = async (code) => {
    setSending(true);
    if (await onComplete(code)) return;
    setSending(false);
    setDigits(EMPTY);
    focusBox(0);
  };

  const changeDigits = (next) => {
    if (sending) return;
    setDigits(next);
    if (next.every(Boolean)) send(next.join(''));
  };

  const setDigitAt = (idx, value) => changeDigits(digits.map((digit, i) => (i === idx ? value : digit)));

  // More than one digit at once fills from this box on, and clears what's after it.
  const fillFrom = (idx, text) => {
    const pasted = text.replace(/\D/g, '').slice(0, BOXES - idx);
    if (!pasted) return;
    changeDigits(digits.map((digit, i) => (i < idx ? digit : pasted[i - idx] || '')));
    focusBox(idx + pasted.length);
  };

  const handlePaste = (e, idx) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    // A whole code starts at the first box wherever it lands, and wins over any
    // other numbers pasted with it ("valid 10 minutes: 123456").
    const code = text.match(/\d{6}/)?.[0];
    if (code) fillFrom(0, code);
    else fillFrom(idx, text);
  };

  // Android keyboards and code autofill often send no usable key, so the keydown
  // below can't see the digit. Everywhere else it has already stopped this firing.
  const onBoxChange = (e, idx) => {
    const typed = e.target.value.replace(/\D/g, '');
    // What was added can land on either side of the digit already there.
    const added = digits[idx] ? typed.replace(digits[idx], '') : typed;
    if (added.length >= BOXES) {
      fillFrom(0, added);
    } else if (added.length > 1) {
      fillFrom(idx, added);
    } else if (added) {
      setDigitAt(idx, added);
      focusBox(idx + 1);
    } else if (!e.target.value) {
      setDigitAt(idx, '');
    }
  };

  const Keyboardpress = (e, idx) => {
    const key = e.key;

    // Shortcuts stay the browser's: Ctrl+V and Cmd+V paste, Ctrl+A selects.
    if (e.ctrlKey || e.metaKey || e.altKey || sending) {
      return;
    }
    if (key === 'Backspace') {
      e.preventDefault();
      if (digits[idx]) {
        setDigitAt(idx, '');
      } else if (idx > 0) {
        setDigitAt(idx - 1, '');
        focusBox(idx - 1);
      }
      return;
    }
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      e.preventDefault();
      focusBox(key === 'ArrowLeft' ? idx - 1 : idx + 1);
      return;
    }
    // Tab, Enter, Delete and the rest aren't characters, so they carry on as usual.
    if (key.length > 1) {
      return;
    }
    e.preventDefault();
    if (/^[0-9]$/.test(key)) {
      setDigitAt(idx, key);
      focusBox(idx + 1);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center" aria-busy={sending}>
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(box) => { boxRefs.current[idx] = box; }}
          className={`verifinput min-w-0${sending ? ' opacity-60' : ''}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={idx === 0 ? 'one-time-code' : 'off'}
          autoFocus={idx === 0 && Boolean(autoFocus)}
          aria-label={`Digit ${idx + 1} of ${BOXES}`}
          readOnly={sending}
          value={digit}
          onChange={(e) => onBoxChange(e, idx)}
          onKeyDown={(e) => Keyboardpress(e, idx)}
          onPaste={(e) => handlePaste(e, idx)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
