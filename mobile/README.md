# UrbanFix Mobile (Expo)

Versión móvil de UrbanFix para iOS y Android, con el mismo diseño del frontend web
(fondo carbón `#1A1A1A`, superficies `#2B2B2B`, acento lima `#D4F58C`, títulos en **Anton** y texto en **Inter**).

- Expo SDK 58 · React Native 0.88 · Expo Router (rutas en `src/app/`)
- Consume el mismo backend Spring Boot (`/api/v1/...`)

## Cómo correrlo

```bash
npm install
cp .env.example .env      # pon la IP de tu PC donde corre el backend
npx expo start            # escanea el QR con Expo Go o pulsa a / i
```

> En el celular `localhost` es el propio celular: usa la IP de tu PC en la red
> (o `10.0.2.2` en el emulador de Android). El backend debe escuchar en `0.0.0.0`.

## Pantallas

| Web | Móvil |
| --- | --- |
| Login / Register / PasswordReset | `(auth)/login`, `register`, `password-reset` |
| Dashboard | pestaña **Inicio** |
| Informes (ReporteList) | pestaña **Informes** (filtros por estado, categoría, zona y búsqueda) |
| ReporteCreate | pestaña **+** (cámara, galería o URL; ubicación por GPS o tocando el mapa) |
| Mapa | pestaña **Mapa** (pines por estado + leyenda) |
| Perfil + MisReportes | pestaña **Perfil** (editar / eliminar reportes, cerrar sesión) |
| ReporteDetail / ReporteEdit | `reportes/[id]`, `reportes/[id]/editar` |

## Autenticación

El web usa cookies HttpOnly; en móvil no hay navegador que las maneje, así que el
`accessToken` y `refreshToken` del login se guardan cifrados con `expo-secure-store`
y se envían como `Authorization: Bearer …` (el `JwtAuthenticationFilter` ya lo acepta).
Si el token expira, se llama a `/auth/refresh` enviando el refresh token en el header `Cookie`.

## Estructura

```
src/
  app/                 rutas (Expo Router)
    (auth)/            login, registro, recuperar contraseña
    (app)/(tabs)/      inicio, informes, crear, mapa, perfil
    (app)/reportes/    detalle y edición
  api/                 axios + endpoints + almacenamiento de tokens
  components/          UI reutilizable (Button, Input, Select, StatusBadge, ReporteCard…)
  context/             AuthContext
  hooks/               carga de datos
  theme/tokens.ts      colores/tipografía copiados de src/index.css del web
```

## Notas

- **Google Maps en Android (build propio):** en Expo Go funciona tal cual. Para un APK con
  `eas build` hay que añadir una API key de Google Maps en `app.json` (`android.config.googleMaps.apiKey`).
- En web el mapa se muestra como un placeholder (`Map.web.tsx`); la app está pensada para iOS/Android.
