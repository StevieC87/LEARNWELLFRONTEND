'use client';
import { useState } from 'react';
import './twofactor.css';
import CopyButton from '@/components/ui/CopyButton.jsx';

// Shown once, right after they're made: the server keeps only their hashes.
// `onSaved` is what brings the page's way back, so nobody clicks past them.
export default function RecoveryCodes({ codes, onSaved }) {
  const [saved, setSaved] = useState(false);
  if (!codes?.length) return null;

  const text = codes.join('\n');

  const download = () => {
    const url = URL.createObjectURL(new Blob([`SiteGoose recovery codes\n\n${text}\n`], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitegoose-recovery-codes.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tfa-recovery">
      <h4>Save your recovery codes</h4>
      <p className="ui-help">
        If you lose your phone, each of these gets you in once. Keep them somewhere safe, away
        from your phone. You won&apos;t see them again.
      </p>
      <ul className="tfa-recovery-list">
        {codes.map((code) => <li key={code}><code>{code}</code></li>)}
      </ul>
      <div className="ui-actions">
        <CopyButton text={text} name="your recovery codes" />
        <button type="button" className="ui-btn ui-btn-secondary ui-btn-sm" onClick={download}>Download</button>
      </div>
      <label className="tfa-recovery-saved">
        <input
          type="checkbox"
          checked={saved}
          disabled={saved}
          onChange={() => { setSaved(true); onSaved(); }}
        />
        I&apos;ve saved these codes
      </label>
    </div>
  );
}
