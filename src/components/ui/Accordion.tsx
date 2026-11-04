import React, { useState } from 'react';

interface Panel {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  panels: Panel[];
  defaultPanel?: string;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export const Accordion: React.FC<AccordionProps> = ({
  panels,
  defaultPanel,
  className = '',
  variant = 'horizontal',
}) => {
  const [activePanel, setActivePanel] = useState(defaultPanel || panels[0]?.id);

  const getPanelStyle = (panelId: string) => {
    if (variant === 'horizontal') {
      if (panelId === activePanel) {
        return 'bg-accent text-accent-ink border-accent shadow-[0_12px_32px_rgba(212,245,140,0.22)]';
      }
      // Sobre fondos oscuros del HOME: superficie oscura + texto claro
      return 'bg-surface text-text border-line hover:border-accent/50';
    }
    return activePanel === panelId
      ? 'bg-accent text-accent-ink'
      : 'bg-surface text-text border border-line';
  };

  return (
    <div className={className}>
      {variant === 'horizontal' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {panels.map((panel) => {
            const isActive = activePanel === panel.id;
            return (
              <button
                key={panel.id}
                type="button"
                onClick={() => setActivePanel(panel.id)}
                className={`
                  rounded p-6 text-left border transition-all duration-200
                  hover:-translate-y-0.5
                  ${getPanelStyle(panel.id)}
                `}
                aria-expanded={isActive}
                aria-controls={`panel-${panel.id}`}
              >
                <h3
                  className={`font-heading font-bold text-lg uppercase mb-2 ${
                    isActive ? 'text-accent-ink' : 'text-text'
                  }`}
                >
                  {panel.title}
                </h3>
                {isActive && (
                  <div
                    id={`panel-${panel.id}`}
                    className="text-sm leading-relaxed text-accent-ink/85"
                  >
                    {panel.content}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {panels.map((panel) => (
            <div key={panel.id}>
              <button
                type="button"
                onClick={() => setActivePanel(panel.id)}
                className={`
                  w-full rounded p-4 transition-all duration-200 text-left border
                  ${getPanelStyle(panel.id)}
                `}
                aria-expanded={activePanel === panel.id}
                aria-controls={`panel-${panel.id}`}
              >
                <h3 className="font-heading font-bold uppercase">
                  {panel.title}
                </h3>
              </button>
              {activePanel === panel.id && (
                <div
                  id={`panel-${panel.id}`}
                  className="p-4 bg-surface-2 text-text-muted rounded mt-2"
                >
                  {panel.content}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
