const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function normalizeImageUrl(fotoUrl: string | null | undefined): string | null {
  if (!fotoUrl) return null;
  
  // Si ya es una URL completa con el dominio actual, usarla tal cual
  if (fotoUrl.startsWith(API_URL)) {
    return fotoUrl;
  }
  
  // Si es una URL completa con dominio antiguo, extraer el UUID y reconstruir
  if (fotoUrl.startsWith('http://') || fotoUrl.startsWith('https://')) {
    const match = fotoUrl.match(/\/uploads\/(.+)$/);
    if (match) {
      return `${API_URL}/uploads/${match[1]}`;
    }
  }
  
  // Si es solo el nombre del archivo, construir la URL completa
  if (!fotoUrl.startsWith('http')) {
    return `${API_URL}/uploads/${fotoUrl}`;
  }
  
  return fotoUrl;
}
