import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShimmeringText } from '@animate-ui/react/primitives/texts/shimmering';
import {
  TypingText,
  TypingTextCursor,
} from '@animate-ui/react/primitives/texts/typing';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import {
  CarouselCounter,
  CarouselDots,
} from '@animate-ui/react/primitives/carousel';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import {
  Highlight,
  HighlightItem,
} from '@animate-ui/react/primitives/effects/highlight';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../components/ui/carousel';
import { useReportesPublic } from '../hooks/useReportesPublic';
import { heroSlides, reportCategories } from '../utils/homeMedia';
import { ArrowRight, Camera, Users, Route } from 'lucide-react';

const StarsBackground = lazy(() =>
  import('../components/animate-ui/backgrounds/stars').then((mod) => ({
    default: mod.StarsBackground,
  })),
);

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'baches', label: 'Baches' },
  { id: 'alumbrado', label: 'Alumbrado' },
  { id: 'basura', label: 'Basura' },
  { id: 'agua', label: 'Agua' },
] as const;

const howItWorksSteps = [
  {
    id: 'reporta',
    icon: Camera,
    title: 'Reporta',
    description:
      'Envía el problema con foto y ubicación. En menos de un minuto queda registrado para tu comunidad.',
  },
  {
    id: 'valida',
    icon: Users,
    title: 'Valida la comunidad',
    description:
      'Otros vecinos confirman el reporte. Más validaciones, más prioridad para actuar.',
  },
  {
    id: 'seguimiento',
    icon: Route,
    title: 'Seguimiento hasta resolver',
    description:
      'Sigue el estado: pendiente, en progreso o resuelto, sin perder el hilo del caso.',
  },
] as const;

export const Home: React.FC = () => {
  const { reportes, isLoading } = useReportesPublic();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReducedMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;

    const syncActive = () => setActiveSlide(carouselApi.selectedScrollSnap());
    syncActive();
    carouselApi.on('select', syncActive);
    carouselApi.on('reInit', syncActive);

    return () => {
      carouselApi.off('select', syncActive);
      carouselApi.off('reInit', syncActive);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || prefersReducedMotion || isHoveringCarousel) return;

    const id = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 4500);

    return () => window.clearInterval(id);
  }, [carouselApi, prefersReducedMotion, isHoveringCarousel]);

  const totalReportes = reportes.length;
  const resueltos = reportes.filter((r) => r.estadoActual === 'RESUELTO').length;
  const zonasActivas = new Set(
    reportes
      .map((r) => r.zona?.nombre || ('zonaNombre' in r ? String((r as { zonaNombre?: string }).zonaNombre ?? '') : ''))
      .filter(Boolean),
  ).size;
  const showMetrics = !isLoading && totalReportes > 0;

  return (
    <div className="home-page min-h-screen bg-bg">
      {/* Hero */}
      <section className="section home-hero-band relative overflow-hidden">
        {!prefersReducedMotion && (
          <Suspense fallback={null}>
            <StarsBackground
              className="home-hero-stars pointer-events-none absolute inset-0"
              starColor="color-mix(in srgb, var(--color-accent) 65%, white)"
              pointerEvents={false}
              speed={70}
              factor={0.05}
            />
          </Suspense>
        )}

        <div className="hero relative z-10">
          <div className="hero-copy">
            <p className="hero-kicker">PLATAFORMA CIUDADANA</p>
            <h1 className="font-heading font-bold uppercase tracking-tight text-text mb-6 flex flex-col">
              <ShimmeringText
                text="TU CIUDAD"
                duration={3}
                color="var(--color-text)"
                shimmeringColor="var(--color-accent-glow)"
                className="block whitespace-nowrap overflow-visible"
              />
              <span className="hero-typing-line block">
                {prefersReducedMotion ? (
                  <span className="text-text">MEJORADA</span>
                ) : (
                  <TypingText
                    text={['REPORTADA', 'MEJORADA', 'ACTIVA', 'MOTIVADA']}
                    loop
                    duration={80}
                    holdDelay={2000}
                    className="text-text"
                  >
                    <TypingTextCursor className="ml-1 bg-accent" />
                  </TypingText>
                )}
              </span>
            </h1>
            <p className="hero-lead text-text-secondary mb-8 max-w-lg h-[6rem] overflow-hidden leading-relaxed">
              {prefersReducedMotion ? (
                'Reporta problemas urbanos y mejora tu comunidad con evidencia clara, mapa público y seguimiento hasta la resolución'
              ) : (
                <TypingText
                  text="Reporta problemas urbanos y mejora tu comunidad con evidencia clara, mapa público y seguimiento hasta la resolución"
                  loop={false}
                  duration={30}
                  holdDelay={0}
                  className="text-text-secondary"
                >
                  <TypingTextCursor className="ml-1 bg-accent" />
                </TypingText>
              )}
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/reportes/crear">
                <button type="button" className="btn-primary font-semibold">
                  Reportar un problema
                </button>
              </Link>
            </div>

            {showMetrics && (
              <div className="hero-stats" aria-label="Métricas de la comunidad">
                <div className="hero-stat">
                  <CountingNumber
                    number={totalReportes}
                    className="hero-stat-value"
                    inView
                  />
                  <span className="hero-stat-label">Reportes</span>
                </div>
                <div className="hero-stats-divider" />
                <div className="hero-stat">
                  <CountingNumber
                    number={resueltos}
                    className="hero-stat-value"
                    inView
                  />
                  <span className="hero-stat-label">Resueltos</span>
                </div>
                <div className="hero-stats-divider" />
                <div className="hero-stat">
                  <CountingNumber
                    number={zonasActivas}
                    className="hero-stat-value"
                    inView
                  />
                  <span className="hero-stat-label">Zonas</span>
                </div>
              </div>
            )}
          </div>

          <div
            className="hero-carousel overflow-visible"
            onMouseEnter={() => setIsHoveringCarousel(true)}
            onMouseLeave={() => setIsHoveringCarousel(false)}
            onFocusCapture={() => setIsHoveringCarousel(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setIsHoveringCarousel(false);
              }
            }}
          >
            <Carousel
              setApi={setCarouselApi}
              opts={{
                loop: true,
                align: 'center',
                scale: 0.86,
                visible: 2.2,
              }}
              className="w-full"
              onMouseOver={(event) => {
                const target = (event.target as HTMLElement).closest(
                  '[data-slide-index]',
                );
                if (!target || !carouselApi) return;
                const index = Number(target.getAttribute('data-slide-index'));
                if (
                  Number.isNaN(index) ||
                  carouselApi.selectedScrollSnap() === index
                ) {
                  return;
                }
                carouselApi.scrollTo(index);
              }}
            >
              <div className="mb-5 flex items-center justify-between gap-3 px-2">
                <div className="flex items-center gap-3">
                  <CarouselPrevious className="left-0" />
                  <CarouselCounter
                    className="font-heading text-sm uppercase tracking-wide text-text"
                    format={(current, count) => (
                      <>
                        {current}
                        <span className="mx-1 text-text-muted">/</span>
                        {count || heroSlides.length}
                      </>
                    )}
                  />
                  <CarouselDots className="text-accent" />
                  <CarouselNext className="right-0" />
                </div>
              </div>

              <CarouselContent className="-ml-4">
                {heroSlides.map((slide, index) => (
                  <CarouselItem
                    key={slide.title}
                    className="basis-[85%] pl-4 sm:basis-[70%] lg:basis-[65%]"
                  >
                    <div data-slide-index={index} className="py-3">
                      <article
                        data-active={activeSlide === index}
                        className="hero-report-card group cursor-pointer"
                      >
                        <div className="hero-report-media">
                          <img
                            src={slide.image}
                            alt={slide.alt}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                          />
                        </div>
                        <div className="hero-report-body">
                          <h3 className="font-heading text-lg font-bold uppercase leading-tight text-text sm:text-xl">
                            {slide.title}
                          </h3>
                          <p className="mt-1 text-sm text-text-secondary sm:text-base">
                            {slide.subtitle}
                          </p>
                        </div>
                      </article>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Qué puedes reportar */}
      <section className="section section-band">
        <div className="container">
          <Effect
            fade
            slide={{ direction: 'up', offset: 24 }}
            inView
            className="section-intro"
          >
            <h2 className="section-title">
              <ShimmeringText
                text="Qué puedes reportar"
                duration={3}
                color="var(--color-text)"
                shimmeringColor="var(--color-accent-glow)"
              />
            </h2>
            <p className="section-subtitle">
              Elige la categoría que mejor describe el problema. Cada reporte
              suma evidencia para actuar más rápido.
            </p>
          </Effect>

          <div className="report-categories">
            {reportCategories.map((category, index) => (
              <Effect
                key={category.id}
                fade
                slide={{ direction: 'up', offset: 20 }}
                delay={0.05 * index}
                inView
              >
                <Link
                  to="/reportes/crear"
                  className="report-category-card-link"
                >
                  <article className="report-category-card">
                    <div className="report-category-media">
                      <img
                        src={category.image}
                        alt={category.alt}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="report-category-body">
                      <h3 className="font-heading text-base font-semibold uppercase text-text sm:text-lg">
                        {category.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-[0.9375rem]">
                        {category.description}
                      </p>
                      <span className="mt-4 inline-flex items-center text-sm font-semibold text-accent">
                        Reportar
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </span>
                    </div>
                  </article>
                </Link>
              </Effect>
            ))}
          </div>
        </div>
      </section>

      {/* Promesa */}
      <section className="section section-band-muted">
        <div className="container">
          <Effect
            fade
            blur={!prefersReducedMotion}
            slide={{ direction: 'up', offset: 18 }}
            inView
            className="promise-block"
          >
            <h2 className="section-title section-title-center">
              <ShimmeringText
                text="Tu voz importa"
                duration={3}
                color="var(--color-text)"
                shimmeringColor="var(--color-accent-glow)"
              />
            </h2>
            <p className="section-subtitle section-subtitle-center mx-auto max-w-3xl">
              Cada reporte cuenta. Cuando señalas un problema, ayudas a que se
              priorice y mejoras la calidad de vida de tu comunidad.
            </p>
          </Effect>
        </div>
      </section>

      {/* Reportes recientes */}
      <section className="section section-band">
        <div className="container">
          <Effect
            fade
            slide={{ direction: 'up', offset: 20 }}
            inView
            className="section-intro section-intro-left"
          >
            <h2 className="section-title">
              <ShimmeringText
                text="Reportes recientes"
                duration={3}
                color="var(--color-text)"
                shimmeringColor="var(--color-accent-glow)"
              />
            </h2>
            <p className="section-subtitle">
              Lo último que la comunidad está reportando cerca de ti.
            </p>
          </Effect>

          <Highlight
            hover
            className="home-filter-highlight mb-8"
            defaultValue={activeFilter}
          >
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <HighlightItem key={filter.id} value={filter.id}>
                  <button
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={`home-filter-chip${
                      activeFilter === filter.id ? ' is-active' : ''
                    }`}
                    aria-pressed={activeFilter === filter.id}
                  >
                    {filter.label}
                  </button>
                </HighlightItem>
              ))}
            </div>
          </Highlight>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {isLoading
              ? [1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="overflow-hidden border-line bg-surface"
                  >
                    <div className="h-48 animate-pulse rounded-t-lg bg-surface-2" />
                    <div className="space-y-3 p-6">
                      <div className="h-4 animate-pulse rounded bg-surface-2" />
                      <div className="h-3 w-3/4 animate-pulse rounded bg-surface-2" />
                    </div>
                  </Card>
                ))
              : reportes.slice(0, 3).map((reporte) => (
                  <Card
                    key={reporte.id}
                    className="overflow-hidden border-line bg-surface transition-shadow duration-200 hover:shadow-lg"
                  >
                    {reporte.fotoUrl ? (
                      <img
                        src={reporte.fotoUrl}
                        alt={reporte.titulo}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 w-full items-center justify-center bg-surface-2">
                        <span className="text-sm text-text-muted">
                          Sin imagen
                        </span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="mb-3 line-clamp-2 font-heading text-lg font-semibold uppercase text-text">
                        {reporte.titulo}
                      </h3>
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                        {reporte.descripcion}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded bg-surface-2 px-3 py-1.5 text-xs text-text-muted">
                          {reporte.categoria?.nombre}
                        </span>
                        <span className="rounded bg-surface-2 px-3 py-1.5 text-xs text-text-muted">
                          {reporte.zona?.nombre}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="section section-band-muted">
        <div className="container">
          <Effect
            fade
            slide={{ direction: 'up', offset: 20 }}
            inView
            className="section-intro"
          >
            <h2 className="section-title section-title-center">
              <ShimmeringText
                text="Cómo funciona"
                duration={3}
                color="var(--color-text)"
                shimmeringColor="var(--color-accent-glow)"
              />
            </h2>
            <p className="section-subtitle section-subtitle-center">
              Tres pasos claros desde que reportas hasta que se resuelve.
            </p>
          </Effect>

          <div className="how-steps">
            {howItWorksSteps.map((step, index) => (
              <Effect
                key={step.id}
                fade
                slide={{ direction: 'up', offset: 16 }}
                delay={0.06 * index}
                inView
              >
                <article className="how-step-card">
                  <div className="how-step-icon">
                    <step.icon className="h-5 w-5 text-accent" />
                  </div>
                  <p className="how-step-index">0{index + 1}</p>
                  <h3 className="font-heading text-xl uppercase text-text">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
                    {step.description}
                  </p>
                </article>
              </Effect>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-band-cta">
        <div className="container">
          <Effect
            fade
            zoom={
              prefersReducedMotion
                ? false
                : { initialScale: 0.98, scale: 1 }
            }
            inView
            className="cta-block"
          >
            <h2 className="cta-title">
              <ShimmeringText
                text="Empieza ahora"
                duration={3}
                color="var(--color-on-panel)"
                shimmeringColor="var(--color-accent)"
                className="font-heading uppercase"
              />
            </h2>
            <p className="cta-copy">
              Crea tu cuenta y comienza a reportar. Juntos hacemos la ciudad más
              visible y más cuidada.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="inline-flex w-full items-center justify-center sm:w-auto"
              >
                Crear cuenta y reportar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Effect>
        </div>
      </section>
    </div>
  );
};
