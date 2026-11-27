import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { dependencies } from '../../package.json';

const expoSdk = dependencies.expo.split('.')[0];
const REPO = 'https://github.com/leanhtuan1994/react-native-caracal';

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

/** Bold, dark-first marketing hero with gradient mesh + grid backdrop. */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="brand-mesh absolute inset-0 -z-10" aria-hidden />
      <div className="brand-grid absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 px-6 py-24 text-center sm:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card/60 px-4 py-1.5 text-xs font-medium text-fd-muted-foreground">
          {`Expo SDK ${expoSdk} · React Native ${dependencies['react-native']} · New Architecture`}
        </span>
        <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-7xl">
          Perfect React Native
          <br />
          <span className="brand-gradient-text">App Kickstart</span>
        </h1>
        <p className="max-w-2xl text-balance text-lg text-fd-muted-foreground">
          Your All-in-One Solution for Building Outstanding React Native/Expo
          Apps. From editor setup to store submission, we&apos;ve got you
          covered.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-fd-primary px-6 py-3 font-semibold text-fd-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Get Started
            <ArrowRight className="size-4" />
          </Link>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-fd-border bg-fd-card/60 px-6 py-3 font-semibold text-fd-foreground transition-colors hover:border-fd-primary"
          >
            <GithubMark className="size-4" />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
