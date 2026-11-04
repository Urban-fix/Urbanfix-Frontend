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
  variant = 'horizontal'
}) => {
  const [activePanel, setActivePanel] = useState(defaultPanel || panels[0]?.id);

  const getPanelStyle = (panelId: string) => {
    if (variant === 'horizontal') {
      if (panelId === activePanel) {
        return 'bg-accent text-accent-ink';
      }
      const index = panels.findIndex(p => p.id === panelId);
      const styles = [
        'bg-panel-white text-text',
        'bg-panel-light text-text',
        'bg-surface text-text',
      ];
      return styles[index % styles.length];
    }
    return activePanel === panelId 
      ? 'bg-accent text-accent-ink' 
      : 'bg-surface text-text';
  };

  return (
    <div className={className}>
      {variant === 'horizontal' ? (
        // Horizontal accordion (panel signature style)
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {panels.map((panel) => (
            <button
              key={panel.id}
              onClick={() => setActivePanel(panel.id)}
              className={`
                rounded p-6 transition-all duration-200
                ${getPanelStyle(panel.id)}
              `}
              aria-expanded={activePanel === panel.id}
              aria-controls={`panel-${panel.id}`}
            >
              <h3 className="font-heading font-bold text-lg uppercase mb-2">
                {panel.title}
              </h3>
              {activePanel === panel.id && (
                <div className="text-sm">
                  {panel.content}
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        // Vertical accordion
        <div className="space-y-2">
          {panels.map((panel) => (
            <div key={panel.id}>
              <button
                onClick={() => setActivePanel(panel.id)}
                className={`
                  w-full rounded p-4 transition-all duration-200 text-left
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
                  className="p-4 bg-surface-2 rounded mt-2"
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
