import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AppShell } from '../components/layout/AppShell';
import { User, Mail, Shield } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (!user) {
    return (
      <AppShell title="Perfil" subtitle="Información de tu cuenta">
        <div className="text-center py-12">
          <p className="text-text-muted">No hay usuario autenticado</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Perfil" subtitle="Información de tu cuenta">
      <Card className="max-w-2xl mx-auto bg-surface border-line">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-accent" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl uppercase text-text">
              {user.nombre}
            </h2>
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded text-sm font-medium mt-2 uppercase tracking-wider">
              {user.rol.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-surface-2 rounded">
            <Mail className="w-5 h-5 text-text-muted" />
            <div>
              <p className="text-sm text-text-muted">Email</p>
              <p className="font-medium text-text">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-surface-2 rounded">
            <Shield className="w-5 h-5 text-text-muted" />
            <div>
              <p className="text-sm text-text-muted">Rol</p>
              <p className="font-medium text-text">{user.rol.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-line">
          <Button
            variant="danger"
            onClick={handleLogout}
            className="w-full"
          >
            Cerrar Sesión
          </Button>
        </div>
      </Card>
    </AppShell>
  );
};
