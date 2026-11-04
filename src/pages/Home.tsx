import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TypingText,
  TypingTextCursor,
} from '@animate-ui/react/primitives/texts/typing';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import { HighlightText } from '@animate-ui/react/primitives/texts/highlight';
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
import { Accordion } from '../components/ui/Accordion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../components/ui/carousel';
import { useReportes } from '../hooks/useReportes';
import { ReporteList } from '../components/common/ReporteList';
import { heroSlides, reportCategories } from '../utils/homeMedia';
import { ArrowRight } from 'lucide-react';

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'baches', label: 'Baches' },
  { id: 'alumbrado', label: 'Alumbrado' },
  { id: 'basura', label: 'Basura' },
  { id: 'agua', label: 'Agua' },
] as const;

const howItWorksPanels = [
  {
    id: 'reportar',
    title: '1 · Reportar',
    content: (
      <p>
        Envía el problema con foto y ubicación. Toma menos de un minuto y queda
        registrado para tu comunidad.
      </p>
    ),
  },
  {
    id: 'mapa',
    title: '2 · Ver en el mapa',
    content: (
      <p>
        Tu reporte aparece en el mapa público para que vecinos y autoridades
        puedan ubicarlo con claridad.
      </p>
    ),
  },
  {
    id: 'seguimiento',
    title: '3 · Seguimiento',
    content: (
      <p>
        Recibe actualizaciones del estado: reportado, en proceso, resuelto o
        rechazado, sin perder el hilo.
      </p>
    ),
  },
  {
    id: 'resultado',
    title: '4 · Resultado',
    content: (
      <p>
        Cuando se atiende, lo verificas en la plataforma y ayudas a cerrar el
        ciclo de mejora urbana.
      </p>
    ),
  },
];

export const Home: React.FC = () => {
  const { reportes, isLoading } = useReportes();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>('todos');

  const openReports = reportes.filter((r) => r.estadoActual === 'REPORTADO').length;
  const resolvedToday = reportes.filter((r) => r.estadoActual === 'RESUELTO').length;
  const hasStats = openReports > 0 || resolvedToday > 0;

  const filteredReportes = useMemo(() => {
    const base = reportes.slice(0, 12);
    if (activeFilter === 'todos') return base.slice(0, 6);
    return base
      .filter((r) =>
        (r.categoria?.nombre ?? '').toLowerCase().includes(activeFilter),
      )
      .slice(0, 6);
  }, [reportes, activeFilter]);

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

  return (
    <div className="home-page min-h-screen bg-bg">
      {/* Hero */}
      <section className="section home-hero-band">
        <div className="hero">
          <div className="hero-copy">
            <p className="hero-kicker">UrbanFix</p>
            <h1 className="font-heading font-bold uppercase tracking-tight text-text mb-6">
              TU CIUDAD
              <br />
              <span className="hero-typing-line">
                <TypingText
                  text={['REPORTADA', 'MEJORADA', 'ACTIVA']}
                  loop
                  duration={80}
                  holdDelay={2200}
                  className="inline"
                >
                  <TypingTextCursor className="ml-1 bg-accent" />
                </TypingText>
              </span>
            </h1>
            <p className="hero-lead text-text-muted mb-8 max-w-md min-h-[3.2rem]">
              <TypingText
                text="Reporta problemas urbanos y mejora tu comunidad"
                delay={400}
                duration={35}
              >
                <TypingTextCursor className="ml-0.5 bg-text-muted" />
              </TypingText>
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/reportes/crear">
                <button type="button" className="btn-primary font-semibold">
                  Reportar un problema
                </button>
              </Link>
              <Link to="/mapa">
                <button type="button" className="btn-secondary font-semibold">
                  Ver mapa de reportes
                </button>
              </Link>
            </div>

            {(isLoading || hasStats) && (
              <div className="hero-stats">
                <div className="hero-stat">
                  {isLoading ? (
                    <div className="h-8 w-14 bg-surface-2 rounded animate-pulse mx-auto mb-2" />
                  ) : (
                    <CountingNumber
                      number={openReports}
                      className="hero-stat-value"
                      inView
                    />
                  )}
                  <p className="hero-stat-label">Reportes abiertos</p>
                </div>
                <div className="hero-stats-divider" aria-hidden />
                <div className="hero-stat">
                  {isLoading ? (
                    <div className="h-8 w-14 bg-surface-2 rounded animate-pulse mx-auto mb-2" />
                  ) : (
                    <CountingNumber
                      number={resolvedToday}
                      className="hero-stat-value"
                      inView
                    />
                  )}
                  <p className="hero-stat-label">Resueltos hoy</p>
                </div>
              </div>
            )}
          </div>

          <div className="hero-carousel overflow-visible">
            <Carousel
              setApi={setCarouselApi}
              opts={{
                loop: true,
                align: 'center',
                scale: 0.8,
                visible: 3,
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
                <CarouselCounter
                  className="font-heading text-sm uppercase tracking-wide text-text"
                  format={(current, count) => (
                    <>
                      {current}
                      <span className="mx-1 text-text-muted">/</span>
                      {count}
                    </>
                  )}
                />
                <CarouselDots className="text-accent" />
              </div>

              <CarouselContent className="-ml-4">
                {heroSlides.map((slide, index) => (
                  <CarouselItem key={slide.title} className="basis-[40%] pl-4">
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
                          <h3 className="font-heading text-lg font-bold uppercase leading-tight text-text">
                            {slide.title}
                          </h3>
                          <p className="mt-1 text-sm text-text-muted">
                            {slide.subtitle}
                          </p>
                        </div>
                      </article>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-0 border-line bg-surface/90 text-text shadow-lg backdrop-blur-sm hover:bg-accent hover:text-accent-ink" />
              <CarouselNext className="right-0 border-line bg-surface/90 text-text shadow-lg backdrop-blur-sm hover:bg-accent hover:text-accent-ink" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Qué puedes reportar */}
      <section className="section section-band">
        <div className="container">
          <Effect fade slide={{ direction: 'up', offset: 24 }} inView className="section-intro">
            <h2 className="section-title">Qué puedes reportar</h2>
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
                className={category.featured ? 'is-featured-wrap' : undefined}
              >
                <article
                  className={`report-category-card${category.featured ? ' is-featured' : ''}`}
                >
                  <div className="report-category-media">
                    <img
                      src={category.image}
                      alt={category.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="report-category-body">
                    <h3 className="font-heading font-semibold text-lg uppercase text-text mb-2">
                      {category.title}
                    </h3>
                    <p className="text-text-muted text-sm">{category.description}</p>
                  </div>
                </article>
              </Effect>
            ))}
          </div>
        </div>
      </section>

      {/* Promesa */}
      <section className="section section-band-muted">
        <div className="container">
          <Effect fade blur slide={{ direction: 'up', offset: 18 }} inView className="promise-block">
            <h2 className="section-title section-title-center">
              Tu voz{' '}
              <HighlightText
                text="importa"
                className="text-accent"
                inView
              />
            </h2>
            <p className="section-subtitle section-subtitle-center max-w-3xl mx-auto">
              Cada reporte cuenta. Cuando señalas un problema, ayudas a que se
              priorice y mejoras la calidad de vida de tu comunidad.
            </p>
          </Effect>
        </div>
      </section>

      {/* Reportes recientes */}
      <section className="section section-band">
        <div className="container">
          <Effect fade slide={{ direction: 'up', offset: 20 }} inView className="section-intro section-intro-left">
            <h2 className="section-title">Reportes recientes</h2>
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

          <ReporteList
            reportes={filteredReportes}
            isLoading={isLoading}
            error={null}
          />

          <div className="text-center mt-10">
            <Link to="/reportes">
              <Button variant="secondary">Ver todos los reportes</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="section section-band-muted">
        <div className="container">
          <Effect fade slide={{ direction: 'up', offset: 20 }} inView className="section-intro">
            <h2 className="section-title section-title-center">Cómo funciona</h2>
            <p className="section-subtitle section-subtitle-center">
              Cuatro pasos claros desde que reportas hasta que se resuelve.
            </p>
          </Effect>

          <Effect fade slide={{ direction: 'up', offset: 16 }} delay={0.1} inView>
            <Accordion
              panels={howItWorksPanels}
              defaultPanel="reportar"
              variant="horizontal"
              className="home-accordion"
            />
          </Effect>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-band-cta">
        <div className="container">
          <Effect fade zoom={{ initialScale: 0.98, scale: 1 }} inView className="cta-block">
            <h2 className="cta-title">Empieza ahora</h2>
            <p className="cta-copy">
              Crea tu cuenta y comienza a reportar. Juntos hacemos la ciudad más
              visible y más cuidada.
            </p>
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto inline-flex items-center justify-center">
                Crear cuenta y reportar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </Effect>
        </div>
      </section>
    </div>
  );
};
