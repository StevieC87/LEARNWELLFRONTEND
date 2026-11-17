'use client';
import { useCopy } from '@/hooks/useCopy.js';
import { Copy, Check } from '@/components/ui/icons.jsx';

// A "Copy" beside a command, key or link the user pastes somewhere else. On a
// click the icon turns into a tick and the label into "Copied" for a moment;
// when the browser refuses, it says so instead of looking like it worked.
// The labels sit on top of each other (.ui-swap), so the button keeps the
// width of the longest and nothing beside it moves.
//
// `text` is the text, a function that makes it, or a promise of it. `name`
// says what is copied, for a screen reader, when the text itself is too long
// to read out (a whole file). `iconOnly` leaves the label to the tooltip.
export default function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  name = typeof text === 'string' ? text : '',
  className = 'ui-btn ui-btn-secondary ui-btn-sm',
  iconSize = 14,
  iconOnly = false,
  disabled = false,
}) {
  const { copy, copied, failed } = useCopy();
  const state = copied ? 'copied' : failed ? 'failed' : 'idle';
  const said = { idle: label, copied: copiedLabel, failed: "Couldn't copy" }[state];
  return (
    <>
      <button
        type="button"
        className={className}
        data-copy={state}
        disabled={disabled}
        onClick={() => copy(text)}
        aria-label={name ? `${label}: ${name}` : label}
        title={failed ? 'Your browser blocked the copy. Select the text and copy it.' : iconOnly ? label : undefined}
      >
        {copied
          ? <Check key="done" size={iconSize} className="ui-pop" aria-hidden="true" />
          : <Copy size={iconSize} aria-hidden="true" />}
        {!iconOnly && (
          <span className="ui-swap">
            <span aria-hidden={state !== 'idle'}>{label}</span>
            <span aria-hidden={state !== 'copied'}>{copiedLabel}</span>
            <span aria-hidden={state !== 'failed'}>Couldn&apos;t copy</span>
          </span>
        )}
      </button>
      {/* Pinned to its containing block's corner: left where it falls, this
          absolutely placed span escapes a table's scroll box (whose containing
          block is the page) and widens the whole page on a phone. */}
      <span className="sr-only left-0 top-0" role="status">{state === 'idle' ? '' : state === 'copied' ? `${copiedLabel}.` : `${said}: select the text and copy it.`}</span>
    </>
  );
}
