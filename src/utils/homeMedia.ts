/** Imágenes curadas (Unsplash) para el HOME — civismo urbano, estética profesional. */
const unsplash = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const homeImages = {
  baches: unsplash('photo-1515162816999-a0c47dc192f7'),
  bachesObra: unsplash('photo-1680206491409-bc73fce33707'),
  alumbrado: unsplash('photo-1519501025264-65ba15a82390'),
  alumbradoCalle: unsplash('photo-1719772202084-2c9779a8d66a'),
  basura: unsplash('photo-1762187547870-83fbeef1afcf'),
  areasVerdes: unsplash('photo-1441974231531-c6227db76b6e'),
  parqueUrbano: unsplash('photo-1761053370990-6f35286aa7fd'),
  senales: unsplash('photo-1672717070890-9a2d9bd7bdba'),
  agua: unsplash('photo-1719413920768-5e19f462eb05'),
} as const;

export const heroSlides = [
  {
    title: 'Reporta baches',
    subtitle: 'Mejora las calles de tu ciudad',
    image: homeImages.baches,
    alt: 'Bache con reflejo urbano en el asfalto',
  },
  {
    title: 'Alumbrado roto',
    subtitle: 'Iluminación para todos',
    image: homeImages.alumbrado,
    alt: 'Calle de la ciudad iluminada de noche',
  },
  {
    title: 'Basura acumulada',
    subtitle: 'Ciudad limpia',
    image: homeImages.basura,
    alt: 'Contenedores de basura desbordados en la vía pública',
  },
  {
    title: 'Áreas verdes',
    subtitle: 'Más espacios naturales',
    image: homeImages.areasVerdes,
    alt: 'Sendero entre árboles en un área verde',
  },
  {
    title: 'Señales dañadas',
    subtitle: 'Seguridad vial',
    image: homeImages.senales,
    alt: 'Semáforo y señal de tránsito en la ciudad',
  },
] as const;

export const reportCategories = [
  {
    id: 'baches',
    title: 'Baches',
    description: 'Reporta baches en calles y aceras para mejorar la transitabilidad',
    image: homeImages.bachesObra,
    alt: 'Obra vial y excavación en una calle céntrica',
    featured: true,
  },
  {
    id: 'alumbrado',
    title: 'Alumbrado',
    description: 'Luces dañadas o faltantes en tu barrio',
    image: homeImages.alumbradoCalle,
    alt: 'Farola iluminando una calle histórica de noche',
    featured: false,
  },
  {
    id: 'basura',
    title: 'Basura',
    description: 'Acumulación de residuos en espacios públicos',
    image: homeImages.basura,
    alt: 'Contenedores desbordados junto a un edificio',
    featured: false,
  },
  {
    id: 'agua',
    title: 'Agua',
    description: 'Fugas y problemas en la red de agua potable',
    image: homeImages.agua,
    alt: 'Calle inundada reflejando la luz urbana',
    featured: false,
  },
  {
    id: 'areas-verdes',
    title: 'Áreas verdes',
    description: 'Parques y jardines que necesitan mantenimiento',
    image: homeImages.parqueUrbano,
    alt: 'Fuente y área verde en un parque urbano',
    featured: false,
  },
] as const;
