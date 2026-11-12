import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { ShimmeringText } from '@animate-ui/react/primitives/texts/shimmering';
import {
  SwappingText,
} from '@animate-ui/react/primitives/texts/swapping';

const StarsBackground = lazy(() =>
  import('../animate-ui/backgrounds/stars').then((mod) => ({
    default: mod.StarsBackground,
  })),
);

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReducedMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return (
    <div className="auth-page relative min-h-screen overflow-hidden bg-bg">
      {!prefersReducedMotion && (
        <Suspense fallback={null}>
          <StarsBackground
            className="auth-page-stars pointer-events-none absolute inset-0 lg:w-7/12"
            starColor="color-mix(in srgb, var(--color-accent) 50%, white)"
            pointerEvents={false}
            speed={80}
            factor={0.02}
          />
        </Suspense>
      )}

      {/* Desktop: Split layout */}
      <div className="relative z-10 hidden min-h-screen lg:grid lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-7">
          <div className="border-b border-line p-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-text-secondary transition-colors duration-200 hover:text-accent"
            >
              ← Volver al inicio
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center p-8">
            <Effect
              fade
              slide={{ direction: 'up', offset: 18 }}
              className="auth-card w-full max-w-md"
            >
              <h1 className="mb-2 font-heading text-4xl font-bold uppercase tracking-tight text-text text-center">
                <ShimmeringText
                  text={title}
                  duration={3}
                  color="var(--color-text)"
                  shimmeringColor="var(--color-accent-glow)"
                />
              </h1>
              {subtitle && (
                <p className="mb-8 text-text-secondary text-center">{subtitle}</p>
              )}
              {children}
            </Effect>
          </div>
        </div>

        <div className="auth-visual flex items-center justify-center p-12 lg:col-span-5">
          <div className="max-w-sm text-center">
            <p className="auth-visual-kicker">UrbanFix</p>
            <h2 className="mb-4 font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tight text-on-panel">
              {prefersReducedMotion ? (
                <>
                  TU CIUDAD
                  <br />
                  REPORTADA
                </>
              ) : (
                <>
                  TU CIUDAD
                  <br />
                  <span className="inline-grid justify-items-start text-on-panel">
                    {['REPORTADA'].map((word) => (
                      <span
                        key={word}
                        aria-hidden="true"
                        className="invisible col-start-1 row-start-1"
                      >
                        {word}
                      </span>
                    ))}
                    <span className="col-start-1 row-start-1 w-0 whitespace-nowrap">
                      <SwappingText
                        text={['REPORTADA']}
                        direction="up"
                        stagger={0.07}
                        duration={2000}
                      />
                    </span>
                  </span>
                </>
              )}
            </h2>
            <p className="text-lg leading-relaxed text-on-panel-muted">
              Reporta problemas urbanos y mejora tu comunidad
            </p>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="relative z-10 flex min-h-screen flex-col lg:hidden">
        <div className="border-b border-line p-4">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-text-secondary transition-colors duration-200 hover:text-accent"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center p-6">
          <Effect
            fade
            slide={{ direction: 'up', offset: 16 }}
            className="auth-card w-full max-w-md"
          >
            <h1 className="mb-2 font-heading text-3xl font-bold uppercase tracking-tight text-text text-center">
              <ShimmeringText
                text={title}
                duration={3}
                color="var(--color-text)"
                shimmeringColor="var(--color-accent-glow)"
              />
            </h1>
            {subtitle && (
              <p className="mb-8 text-text-secondary text-center">{subtitle}</p>
            )}
            {children}
          </Effect>
        </div>
      </div>
    </div>
  );
};
