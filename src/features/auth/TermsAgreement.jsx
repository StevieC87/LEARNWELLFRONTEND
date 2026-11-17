'use client';

// The links stay here so the sign-up form and the page after a first Google
// or GitHub sign-in point at the same documents. Their versions are in the backend's
// legalTerms.js. Unticked by default: `input` is the checkbox's own props.
// `note: false` leaves out the emails/privacy line, for a page that shows it
// elsewhere (the sign-up form puts it under its button).
export default function TermsAgreement({ input, error, note = true }) {
  return (
    <div>
      <label className="ui-check">
        <input type="checkbox" {...input} />
        <span>
          I agree to the <a href="/terms" target="_blank" rel="noopener" className="underline">Terms of Service</a>, including
          the <a href="/dpa" target="_blank" rel="noopener" className="underline">Data Processing Agreement</a>.
        </span>
      </label>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      {note && <p className="ui-help mt-2">We&apos;ll send a few emails to help you get set up. You can turn them off any time. How we handle your own data is in our <a href="/privacy" target="_blank" rel="noopener" className="underline">privacy policy</a>.</p>}
    </div>
  );
}
