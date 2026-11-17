'use client';

import { safeNext } from './safeNext';
import { SIGN_IN_PROVIDERS, signInUrl } from './signInProviders';

export default function SocialLoginButtons({ verb = 'Sign in' }) {
  // Read at the click, so the page renders the same on the server. A plan
  // picked on the pricing page travels in `next`.
  const keepNext = (event) => {
    const next = safeNext(new URLSearchParams(window.location.search).get('next'));
    event.currentTarget.search = next ? `?next=${encodeURIComponent(next)}` : '';
  };

  return (
    <div className="social-logins">
      {/* Plain <a>s, never next/link: the API shares the site's origin in
          production, so <Link> would prefetch these and fetch them as pages,
          minting a fresh sign-in state each time and chasing the redirect to
          Google or GitHub in the background. Only a real browser navigation goes there. */}
      {SIGN_IN_PROVIDERS.map(({ key, label, Mark }) => (
        <a key={key} className="ui-btn ui-btn-secondary" href={signInUrl(key)} onClick={keepNext}>
          <Mark />
          {/* One string: React would otherwise send "Sign in", " with " and
              "Google" apart, and the probe's keyword (pinging PLATFORM_CHECKS,
              "Sign in with Google") would no longer find the page. */}
          {`${verb} with ${label}`}
        </a>
      ))}
    </div>
  );
}
