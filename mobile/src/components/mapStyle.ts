/** Estilo oscuro para Google Maps (Android) a juego con la paleta carbón. iOS usa userInterfaceStyle dark. */
export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242424' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#A8A8A4' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1A1A1A' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#2B2B2B' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#2a3320' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#363636' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#4A4A4A' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2B2B2B' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#141a1f' }] },
];
