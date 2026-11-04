import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} UrbanFix. Todos los derechos reservados.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Plataforma para reportar problemas urbanos
          </p>
        </div>
      </div>
    </footer>
  );
};
