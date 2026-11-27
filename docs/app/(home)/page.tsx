import {
  Boxes,
  Compass,
  Workflow,
  Palette,
  Code2,
  ShieldCheck,
  BookOpen,
  Layers,
  Keyboard,
  KeyRound,
  Database,
  FlaskConical,
} from 'lucide-react';
import { Hero } from '@/components/hero';
import { FeatureGrid } from '@/components/feature-grid';
import { FeatureCard } from '@/components/feature-card';
import { GithubStar } from '@/components/github-star';
import { About } from '@/components/about';

const features = [
  {
    title: 'Expo SDK + Dev Client',
    icon: Boxes,
    body: 'Build the development client to run the template with its native modules, including MMKV and TrueSheet.',
  },
  {
    title: 'Expo Router',
    icon: Compass,
    body: 'Typed routes connect onboarding, sign-in, the Home, Profile and Settings tabs, and individual posts.',
  },
  {
    title: 'GitHub Actions',
    icon: Workflow,
    body: 'Type checks, tests, lint, formatting, version bumps, and EAS Build — all configured and ready to go.',
  },
  {
    title: 'HeroUI Native + Uniwind',
    icon: Palette,
    body: 'A minimal UI kit with the components you need, built on HeroUI Native and styled with Uniwind (Tailwind CSS for React Native).',
  },
  {
    title: 'TS + ESLint + Prettier + Husky',
    icon: Code2,
    body: 'TypeScript, ESLint, Prettier, and Husky keep your code clean and consistent. No more worrying about style or pushing bad code.',
  },
  {
    title: 'Multiple Environments',
    icon: Layers,
    body: 'Development, staging, and production builds with environment variables validated by Zod — switch environments with ease.',
  },
  {
    title: 'Fully Documented',
    icon: BookOpen,
    body: 'A comprehensive set of documentation helps you get started and understand the choices behind every decision.',
  },
  {
    title: 'Form & Keyboard Handling',
    icon: Keyboard,
    body: 'React Hook Form for form management, Zod for validation, and a set of inputs with smooth keyboard handling out of the box.',
  },
  {
    title: 'Auth Flow',
    icon: KeyRound,
    body: 'Sign up and sign in on this device. Zustand tracks the active user and MMKV persists local accounts and the session.',
  },
  {
    title: 'React Query + Axios',
    icon: Database,
    body: 'Data fetching with React Query and Axios — fetch, cache, and update data easily, with VSCode snippets to speed you up.',
  },
  {
    title: 'Unit + E2E Tests',
    icon: FlaskConical,
    body: 'A complete setup for unit and end-to-end tests with Jest, React Native Testing Library, and Maestro.',
  },
  {
    title: 'React Compiler & New Arch',
    icon: ShieldCheck,
    body: 'New Architecture enabled and the experimental React Compiler wired up, so your app is ready for the future of React Native.',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="mb-10 flex flex-col items-center gap-6 text-center">
          <GithubStar />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need, batteries included
          </h2>
        </div>
        <FeatureGrid>
          {features.map((f) => (
            <FeatureCard key={f.title} title={f.title} icon={f.icon}>
              {f.body}
            </FeatureCard>
          ))}
        </FeatureGrid>
        <About title="Built with ❤️">
          In addition to maintaining this starter kit, I&apos;m available for
          custom projects and app development consulting. If you&apos;re looking
          for an experienced React Native developer to bring your app vision to
          life, feel free to{' '}
          <a
            href="https://leanhtuan1994.github.io/contact"
            className="text-fd-primary underline"
          >
            reach out
          </a>
          .
        </About>
      </section>
    </main>
  );
}
