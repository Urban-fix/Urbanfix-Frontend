import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import {
  Highlight,
  HighlightItem,
} from '@animate-ui/react/primitives/effects/highlight';
import {
  Close as DialogClose,
  Content as DialogContent,
  Description as DialogDescription,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
} from '@animate-ui/react/primitives/radix-ui/dialog';
import {
  Content as DropdownContent,
  Item as DropdownItem,
  Portal as DropdownPortal,
  Root as DropdownRoot,
  Separator as DropdownSeparator,
  Trigger as DropdownTrigger,
} from '@animate-ui/react/primitives/radix-ui/dropdown-menu';
import { useAuth } from '../../hooks/useAuth';
import type { Rol } from '../../types/auth.types';
import {
  FileText,
  Map,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  FolderKanban,
  X,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
  roles?: Rol[];
};

const ALL_NAV: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/mis-reportes', label: 'Mis Reportes', icon: FolderKanban },
  { path: '/informes', label: 'Informes', icon: FileText },
  { path: '/mapa', label: 'Mapa', icon: Map },
  { path: '/perfil', label: 'Perfil', icon: User },
  {
    path: '/admin',
    label: 'Admin',
    icon: Shield,
    roles: ['ADMIN_MUNICIPAL'],
  },
];

function navForRole(rol?: Rol): NavItem[] {
  return ALL_NAV.filter(
    (item) => !item.roles || (rol != null && item.roles.includes(rol)),
  );
}

function rolLabel(rol?: Rol): string {
  if (!rol) return '';
  if (rol === 'CIUDADANO') return 'Ciudadano';
  if (rol === 'ADMIN_MUNICIPAL') return 'Admin municipal';
  return rol.replace('_', ' ');
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  title,
  subtitle,
  action,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  const navItems = React.useMemo(() => navForRole(user?.rol), [user?.rol]);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const initials =
    `${user?.nombre?.[0] ?? ''}${user?.apellido?.[0] ?? ''}`.toUpperCase() ||
    user?.nombre?.[0]?.toUpperCase() ||
    'U';

  const activeNav = navItems.find((item) => isActive(item.path));

  const NavLinks = ({
    onNavigate,
    compact,
  }: {
    onNavigate?: () => void;
    compact?: boolean;
  }) => (
    <Highlight
      hover
      className="auth-nav-highlight flex-1 p-3"
      defaultValue={activeNav?.path ?? '/dashboard'}
    >
      <nav className="space-y-1" aria-label="Navegación principal">
        {navItems.map((item) => (
          <HighlightItem key={item.path} value={item.path}>
            <Link
              to={item.path}
              onClick={onNavigate}
              title={item.label}
              className={`
                auth-nav-link relative z-10 flex items-center gap-3 rounded px-3 py-3
                transition-colors duration-200
                ${compact ? 'justify-center px-2' : ''}
                ${
                  isActive(item.path)
                    ? 'text-accent-ink'
                    : 'text-text-muted hover:text-text'
                }
              `}
              data-active={isActive(item.path) || undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden />
              {!compact && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {compact && <span className="sr-only">{item.label}</span>}
            </Link>
          </HighlightItem>
        ))}
      </nav>
    </Highlight>
  );

  return (
    <div className="auth-shell flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside
        className={`
          auth-sidebar relative z-30 hidden shrink-0 flex-col lg:flex
          transition-[width] duration-200 ease-out
          ${collapsed ? 'w-[4.5rem]' : 'w-64'}
        `}
      >
        <div className="flex h-full flex-col">
          <div
            className={`flex items-center border-b border-line/70 ${
              collapsed ? 'justify-center p-4' : 'justify-between p-5'
            }`}
          >
            {!collapsed && (
              <Link
                to="/dashboard"
                className="font-heading text-xl font-bold uppercase tracking-tight text-text"
              >
                Urban<span className="text-accent">Fix</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="rounded p-2 text-text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              {collapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
          </div>

          <NavLinks compact={collapsed} />
        </div>
      </aside>

      {/* Mobile sheet */}
      <DialogRoot open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm lg:hidden" />
          <DialogContent
            data-side="left"
            className="fixed inset-y-0 left-0 z-50 flex h-full w-[min(100%,18rem)] flex-col border-r border-line bg-surface p-0 outline-none lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-line p-5">
              <DialogTitle className="font-heading text-xl font-bold uppercase tracking-tight text-text">
                Urban<span className="text-accent">Fix</span>
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
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </DialogContent>
        </DialogPortal>
      </DialogRoot>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-md">
          <div className="container flex items-center justify-between gap-3 py-3 md:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded p-2 text-text transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="min-w-0">
                <nav
                  className="mb-1 hidden items-center gap-1 text-xs text-text-muted sm:flex"
                  aria-label="Breadcrumb"
                >
                  <Link
                    to="/dashboard"
                    className="transition-colors hover:text-text"
                  >
                    Panel
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  <span className="truncate text-text-secondary">{title}</span>
                </nav>
                <Effect fade slide={{ direction: 'up', offset: 8 }}>
                  <div>
                    <h1 className="font-heading text-xl font-bold uppercase tracking-tight text-text md:text-2xl">
                      {title}
                    </h1>
                    {subtitle && (
                      <p className="truncate text-sm text-text-secondary">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </Effect>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {action && <div className="hidden md:block">{action}</div>}

              <DropdownRoot>
                <DropdownTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded border border-line bg-surface px-2 py-1.5 transition-colors duration-200 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Menú de usuario"
                  >
                    <span className="auth-avatar auth-avatar-sm">{initials}</span>
                    <span className="hidden min-w-0 text-left sm:block">
                      <span className="block truncate text-sm font-medium text-text">
                        {user?.nombre}
                      </span>
                      <span className="block truncate text-xs text-text-muted">
                        {rolLabel(user?.rol)}
                      </span>
                    </span>
                  </button>
                </DropdownTrigger>
                <DropdownPortal>
                  <DropdownContent
                    align="end"
                    sideOffset={8}
                    className="z-50 min-w-[12rem] rounded border border-line bg-surface p-1 text-text shadow-elevated outline-none"
                  >
                    <DropdownItem asChild>
                      <Link
                        to="/perfil"
                        className="flex cursor-pointer items-center gap-2 rounded px-3 py-2.5 text-sm text-text-secondary outline-none transition-colors hover:bg-surface-2 hover:text-text"
                      >
                        <User className="h-4 w-4" />
                        Perfil
                      </Link>
                    </DropdownItem>
                    <DropdownSeparator className="my-1 h-px bg-line" />
                    <DropdownItem
                      onSelect={handleLogout}
                      className="flex cursor-pointer items-center gap-2 rounded px-3 py-2.5 text-sm text-error outline-none transition-colors hover:bg-error/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </DropdownItem>
                  </DropdownContent>
                </DropdownPortal>
              </DropdownRoot>
            </div>
          </div>
        </header>

        <main className="auth-main flex-1 overflow-auto">
          <Effect
            key={location.pathname}
            fade
            slide={{ direction: 'up', offset: 10 }}
            className="container py-6 md:py-8"
          >
            {children}
          </Effect>
        </main>
      </div>
    </div>
  );
};
