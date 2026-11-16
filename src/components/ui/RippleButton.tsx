import React, { useRef, useState, useCallback } from 'react';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  rippleColor?: string;
  rippleDuration?: number;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  rippleDuration = 600,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  const addRipple = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const size = Math.max(rect.width, rect.height);

      const newRipple = {
        id: Date.now(),
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
      }, rippleDuration);
    },
    [disabled, rippleDuration]
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(event);
    onClick?.(event);
  };

  const { type: buttonType = 'button', ...restProps } = props;

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      disabled={disabled}
      type={buttonType}
      {...restProps}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
            animation: `ripple ${rippleDuration}ms ease-out forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};
