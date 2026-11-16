import React, { useState } from 'react';

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  delay?: number;
  fillHeight?: number;
  tapScale?: number;
  fillColor?: string;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  delay = 0.3,
  fillHeight = 3,
  tapScale = 0.97,
  fillColor = 'var(--color-accent)',
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(event);
  };

  const { type: buttonType = 'button', ...restProps } = props;

  return (
    <button
      className={`relative overflow-hidden transition-transform duration-150 ${className}`}
      style={{
        transform: isPressed ? `scale(${tapScale})` : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      disabled={disabled}
      type={buttonType}
      {...restProps}
    >
      <span className="relative z-10">{children}</span>
      <span
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: `${fillHeight}px`,
          backgroundColor: fillColor,
          transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform ${delay}s ease-out`,
        }}
      />
      <style>{`
        @keyframes liquidFill {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </button>
  );
};
