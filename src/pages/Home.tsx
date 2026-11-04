import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useReportes } from '../hooks/useReportes';
import { ReporteList } from '../components/common/ReporteList';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const { reportes, isLoading } = useReportes();
  const openReports = reportes.filter(r => r.estadoActual === 'REPORTADO').length;
  const resolvedToday = reportes.filter(r => r.estadoActual === 'RESUELTO').length;
  const hasStats = openReports > 0 || resolvedToday > 0;
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: 'Reporta baches', subtitle: 'Mejora las calles de tu ciudad' },
    { title: 'Alumbrado roto', subtitle: 'Iluminación para todos' },
    { title: 'Basura acumulada', subtitle: 'Ciudad limpia' },
    { title: 'Áreas verdes', subtitle: 'Más espacios naturales' },
    { title: 'Señales dañadas', subtitle: 'Seguridad vial' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="section">
        <div className="hero">
          <div>
            <h1 className="font-heading font-bold uppercase tracking-tight text-text mb-8">
              TU CIUDAD<br />
              REPORTADA
            </h1>
            <p className="text-lg text-text-muted mb-8 max-w-md">
              Reporta problemas urbanos y mejora tu comunidad
            </p>
            <div className="flex flex-row gap-4 mb-8">
              <Link to="/reportes/crear">
                <button className="btn-primary font-semibold">
                  Reportar un problema
                </button>
              </Link>
              <Link to="/mapa">
                <button className="btn-secondary font-semibold">
                  Ver mapa de reportes
                </button>
              </Link>
            </div>
            
            {!isLoading && hasStats && (
              <div className="p-4 bg-panel-light rounded border border-line">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-heading font-bold text-text">{openReports}</p>
                    <p className="text-xs text-text-muted uppercase tracking-wider">Reportes Abiertos</p>
                  </div>
                  <div className="h-8 w-px bg-line"></div>
                  <div className="text-center">
                    <p className="text-2xl font-heading font-bold text-text">{resolvedToday}</p>
                    <p className="text-xs text-text-muted uppercase tracking-wider">Resueltos Hoy</p>
                  </div>
                </div>
              </div>
            )}
            {isLoading && (
              <div className="p-4 bg-panel-light rounded border border-line">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="h-8 w-16 bg-surface-2 rounded animate-pulse mx-auto mb-2"></div>
                    <p className="text-xs text-text-muted uppercase tracking-wider">Reportes Abiertos</p>
                  </div>
                  <div className="h-8 w-px bg-line"></div>
                  <div className="text-center">
                    <div className="h-8 w-16 bg-surface-2 rounded animate-pulse mx-auto mb-2"></div>
                    <p className="text-xs text-text-muted uppercase tracking-wider">Resueltos Hoy</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="hero-card rounded p-8 border border-line">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-xl uppercase">
                {slides[currentSlide].title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="mb-4">{slides[currentSlide].subtitle}</p>
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-150 ${
                    index === currentSlide ? 'bg-accent-ink' : 'bg-line hover:bg-accent hover:scale-125'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
            <div className="mt-6 h-48 bg-surface rounded flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop" 
                alt="Bache en la calle" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Qué se puede reportar */}
      <section className="section">
        <div className="container">
          <h2 className="font-heading font-bold uppercase tracking-tight text-text mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Qué puedes reportar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 lg:col-span-2 bg-surface rounded p-6 border border-line">
              <div className="h-48 bg-surface-2 rounded mb-4 flex items-center justify-center">
                <span className="text-text-muted text-sm">Imagen de baches</span>
              </div>
              <h3 className="font-heading font-semibold text-lg uppercase text-text mb-2">Baches</h3>
              <p className="text-text-muted text-sm">Reporta baches en calles y aceras para mejorar la transitabilidad</p>
            </div>
            <div className="bg-surface rounded p-6 border border-line">
              <div className="h-32 bg-surface-2 rounded mb-4 flex items-center justify-center">
                <span className="text-text-muted text-sm">Imagen alumbrado</span>
              </div>
              <h3 className="font-heading font-semibold text-lg uppercase text-text mb-2">Alumbrado</h3>
              <p className="text-text-muted text-sm">Luces dañadas o faltantes en tu barrio</p>
            </div>
            <div className="bg-surface rounded p-6 border border-line">
              <div className="h-32 bg-surface-2 rounded mb-4 flex items-center justify-center">
                <span className="text-text-muted text-sm">Imagen basura</span>
              </div>
              <h3 className="font-heading font-semibold text-lg uppercase text-text mb-2">Basura</h3>
              <p className="text-text-muted text-sm">Acumulación de residuos en espacios públicos</p>
            </div>
            <div className="bg-surface rounded p-6 border border-line">
              <div className="h-32 bg-surface-2 rounded mb-4 flex items-center justify-center">
                <span className="text-text-muted text-sm">Imagen agua</span>
              </div>
              <h3 className="font-heading font-semibold text-lg uppercase text-text mb-2">Agua</h3>
              <p className="text-text-muted text-sm">Fugas y problemas en la red de agua potable</p>
            </div>
            <div className="bg-surface rounded p-6 border border-line">
              <div className="h-32 bg-surface-2 rounded mb-4 flex items-center justify-center">
                <span className="text-text-muted text-sm">Imagen áreas verdes</span>
              </div>
              <h3 className="font-heading font-semibold text-lg uppercase text-text mb-2">Áreas verdes</h3>
              <p className="text-text-muted text-sm">Parques y jardines que necesitan mantenimiento</p>
            </div>
          </div>
        </div>
      </section>

      {/* El problema y la promesa */}
      <section className="section bg-surface-2">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading font-bold uppercase tracking-tight text-text mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Tu voz importa
            </h2>
            <p className="text-xl text-text-muted">
              Cada reporte cuenta. Cuando reportas un problema, ayudas a que las autoridades lo resuelvan y mejoras la calidad de vida de toda tu comunidad.
            </p>
          </div>
        </div>
      </section>

      {/* Reportes recientes con chips */}
      <section className="section">
        <div className="container">
          <h2 className="font-heading font-bold uppercase tracking-tight text-text mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Reportes Recientes
          </h2>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <button className="px-4 py-2 bg-accent text-accent-ink rounded font-medium text-sm">
              Todos
            </button>
            <button className="px-4 py-2 bg-surface text-text-muted hover:text-text rounded font-medium text-sm transition-colors">
              Baches
            </button>
            <button className="px-4 py-2 bg-surface text-text-muted hover:text-text rounded font-medium text-sm transition-colors">
              Alumbrado
            </button>
            <button className="px-4 py-2 bg-surface text-text-muted hover:text-text rounded font-medium text-sm transition-colors">
              Basura
            </button>
            <button className="px-4 py-2 bg-surface text-text-muted hover:text-text rounded font-medium text-sm transition-colors">
              Agua
            </button>
          </div>
          
          <ReporteList reportes={reportes.slice(0, 6)} isLoading={isLoading} error={null} />
          
          <div className="text-center mt-8">
            <Link to="/reportes">
              <Button variant="secondary">Ver Todos los Reportes</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona - Acordeón vertical */}
      <section className="section bg-surface-2">
        <div className="container">
          <h2 className="font-heading font-bold uppercase tracking-tight text-center text-text mb-12" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Cómo funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-accent text-accent-ink rounded p-6">
              <h3 className="font-heading font-bold text-lg uppercase mb-2">Reportar</h3>
              <p className="text-sm">Envía tu reporte con foto y ubicación</p>
            </div>
            <div className="bg-panel-white text-text rounded p-6">
              <h3 className="font-heading font-bold text-lg uppercase mb-2">Mapa</h3>
              <p className="text-sm text-text-muted">Visualiza todos los reportes en el mapa</p>
            </div>
            <div className="bg-panel-light text-text rounded p-6">
              <h3 className="font-heading font-bold text-lg uppercase mb-2">Seguimiento</h3>
              <p className="text-sm text-text-muted">Rastrea el estado de tu reporte</p>
            </div>
            <div className="bg-surface text-text rounded p-6">
              <h3 className="font-heading font-bold text-lg uppercase mb-2">Resultados</h3>
              <p className="text-sm text-text-muted">Verifica cuando se resuelva</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flujo del reporte en 4 pasos */}
      <section className="section">
        <div className="container">
          <h2 className="font-heading font-bold uppercase tracking-tight text-center text-text mb-12" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Flujo del reporte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded flex items-center justify-center mx-auto mb-4 text-accent font-heading font-bold text-2xl">
                1
              </div>
              <h3 className="font-heading font-semibold mb-2 text-text uppercase">Reportas</h3>
              <p className="text-text-muted text-sm">Envías el problema con foto y ubicación</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded flex items-center justify-center mx-auto mb-4 text-accent font-heading font-bold text-2xl">
                2
              </div>
              <h3 className="font-heading font-semibold mb-2 text-text uppercase">Se verifica</h3>
              <p className="text-text-muted text-sm">El municipio revisa tu reporte</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded flex items-center justify-center mx-auto mb-4 text-accent font-heading font-bold text-2xl">
                3
              </div>
              <h3 className="font-heading font-semibold mb-2 text-text uppercase">Se atiende</h3>
              <p className="text-text-muted text-sm">Se asigna al equipo correspondiente</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded flex items-center justify-center mx-auto mb-4 text-accent font-heading font-bold text-2xl">
                4
              </div>
              <h3 className="font-heading font-semibold mb-2 text-text uppercase">Se resuelve</h3>
              <p className="text-text-muted text-sm">El problema es solucionado</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section bg-panel-light">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-bold uppercase tracking-tight text-text mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Empieza ahora
            </h2>
            <p className="text-lg text-text-muted mb-8">
              Crea tu cuenta y comienza a reportar problemas en tu ciudad. Juntos podemos hacerla mejor.
            </p>
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Crear cuenta y reportar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
