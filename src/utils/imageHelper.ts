const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function normalizeImageUrl(fotoUrl: string | null | undefined, reporteId?: number): string | null {
  if (!fotoUrl) {
    console.log('[IMAGEHELPER] URL vacía o nula', reporteId ? `para reporte ${reporteId}` : '');
    return null;
  }
  
  // Si ya es una URL completa con el dominio actual, usarla tal cual
  if (fotoUrl.startsWith(API_URL)) {
    console.log('[IMAGEHELPER] URL ya con dominio actual:', reporteId ? `reporte ${reporteId}` : '', fotoUrl);
    return fotoUrl;
  }
  
  // Si es una URL completa con cualquier dominio (antiguo o externo), extraer la ruta y reconstruir
  if (fotoUrl.startsWith('http://') || fotoUrl.startsWith('https://')) {
    try {
      const url = new URL(fotoUrl);
      const pathname = url.pathname;
      const domain = url.hostname;
      
      console.log('[IMAGEHELPER] URL completa detectada:', reporteId ? `reporte ${reporteId}` : '', 'dominio:', domain, 'pathname:', pathname);
      
      // Si la ruta contiene /uploads/, extraer el nombre del archivo y reconstruir con el dominio actual
      if (pathname.includes('/uploads/')) {
        const match = pathname.match(/\/uploads\/(.+)$/);
        if (match) {
          const newUrl = `${API_URL}/uploads/${match[1]}`;
          console.log('[IMAGEHELPER] URL reconstruida:', reporteId ? `reporte ${reporteId}` : '', fotoUrl, '->', newUrl);
          return newUrl;
        }
      }
      
      // Si no es /uploads/, devolver la URL original (puede ser una imagen externa válida)
      console.log('[IMAGEHELPER] URL externa, no se modifica:', reporteId ? `reporte ${reporteId}` : '', fotoUrl);
      return fotoUrl;
    } catch (e) {
      console.error('[IMAGEHELPER] Error al parsear URL:', reporteId ? `reporte ${reporteId}` : '', fotoUrl, e);
      return fotoUrl;
    }
  }
  
  // Si es solo el nombre del archivo, construir la URL completa
  if (!fotoUrl.startsWith('http')) {
    const newUrl = `${API_URL}/uploads/${fotoUrl}`;
    console.log('[IMAGEHELPER] Ruta relativa detectada:', reporteId ? `reporte ${reporteId}` : '', fotoUrl, '->', newUrl);
    return newUrl;
  }
  
  console.log('[IMAGEHELPER] URL no modificada:', reporteId ? `reporte ${reporteId}` : '', fotoUrl);
  return fotoUrl;
}
