import React from 'react';
import { Link } from 'react-router-dom';
import {
  Close as DialogClose,
  Content as DialogContent,
  Description as DialogDescription,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
} from '@animate-ui/react/primitives/radix-ui/dialog';
import { X } from 'lucide-react';

interface MobileNavLink {
  path: string;
  label: string;
}

interface MobileNavSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated: boolean;
  userName?: string;
  authLinks: MobileNavLink[];
  onLogout: () => void;
}

export const MobileNavSheet: React.FC<MobileNavSheetProps> = ({
  open,
  onOpenChange,
  isAuthenticated,
  userName,
  authLinks,
  onLogout,
}) => {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-bg/70 backdrop-blur-sm" />
        <DialogContent
          data-side="right"
          className="fixed inset-y-0 right-0 z-50 flex h-full w-[min(100%,22rem)] flex-col border-l border-line bg-surface p-6 shadow-2xl outline-none"
          aria-describedby={undefined}
        >
          <div className="mb-8 flex items-center justify-between">
            <DialogTitle className="font-heading text-xl font-bold uppercase tracking-tight text-text">
              UrbanFix
            </DialogTitle>
            <DialogDescription className="sr-only">
              Menú de navegación
            </DialogDescription>
            <DialogClose
              className="rounded p-2 text-text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </DialogClose>
          </div>

          <nav className="flex flex-col gap-2">
            {isAuthenticated &&
              authLinks.map((item) => (
                <DialogClose key={item.path} asChild>
                  <Link
                    to={item.path}
                    className="rounded px-3 py-3 text-base font-medium text-text-secondary transition-colors duration-200 hover:bg-surface-2 hover:text-text"
                  >
                    {item.label}
                  </Link>
                </DialogClose>
              ))}
          </nav>

          <div className="mt-auto space-y-3 border-t border-line pt-6">
            {isAuthenticated ? (
              <>
                {userName && (
                  <p className="text-sm text-text-muted">Hola, {userName}</p>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full rounded border border-line px-4 py-3 text-sm font-semibold text-text-secondary transition-colors duration-200 hover:border-error hover:text-error"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <DialogClose asChild>
                  <Link to="/login" className="btn-secondary block w-full text-center text-sm font-semibold">
                    Iniciar sesión
                  </Link>
                </DialogClose>
                <DialogClose asChild>
                  <Link to="/register" className="btn-primary block w-full text-center text-sm font-semibold">
                    Registrarse
                  </Link>
                </DialogClose>
              </>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};
