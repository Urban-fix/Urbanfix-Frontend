# Urbanfix-Frontend

**Deploy en Vercel:** https://urbanfix-frontend.vercel.app/
**Link repositorio mobile:** https://github.com/Urban-fix/Urbanfix-Mobile


## Resumen

Urbanfix es una plataforma web para la gestión de reportes ciudadanos en áreas urbanas. Permite a los usuarios reportar problemas en su ciudad (como baches, iluminación defectuosa, basura acumulada, etc.), hacer seguimiento al estado de sus reportes, y a los administradores municipales gestionar y resolver estos incidentes de manera eficiente.

El frontend está construido con React, TypeScript y Vite, utilizando una arquitectura moderna con componentes reutilizables, gestión de estado con React Context, y una interfaz de usuario responsiva y accesible. El proyecto está administrado con **Supabase** para la gestión de base de datos y autenticación.

## Requerimientos

### Requisitos Previos

- **Node.js** (v18 o superior)
- **npm** (v9 o superior) o **yarn** (v1.22 o superior)
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Dependencias del Proyecto

Las dependencias principales se instalan automáticamente al ejecutar `npm install`. Algunas de las más relevantes:

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de build y desarrollo
- **React Router DOM** - Enrutamiento
- **React Hook Form** - Gestión de formularios
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones
- **Leaflet** - Mapas interactivos

## Cómo Ejecutar

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Urbanfix-Frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```bash
cp .env.example .env
```

Editar el archivo `.env` con las configuraciones necesarias:

```env
VITE_API_URL=http://localhost:8080
```

### 4. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Build para Producción

```bash
npm run build
```

Los archivos compilados se generan en la carpeta `dist/`.

### 6. Preview del Build de Producción

```bash
npm run preview
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter (ESLint)

## Estructura del Proyecto

```
src/
├── api/              # Clientes API (axios)
├── components/       # Componentes reutilizables
│   ├── layout/      # Layouts (AppShell, AuthLayout)
│   ├── map/         # Componentes de mapas
│   └── ui/          # Componentes UI (Input, Button, etc.)
├── hooks/           # Custom React hooks
├── pages/           # Páginas de la aplicación
├── types/           # Definiciones de TypeScript
├── utils/           # Utilidades y helpers
└── main.tsx         # Punto de entrada
```

## Coevaluación de Participación

### Integrantes del Proyecto

| Nombre                        | Porcentaje de Participación|
|-------------------------------|----------------------------|
| Marco Antonio Sabino Guardian |      100%                  |
| Rodolfo Elard Huaroc Enciso   |      100%                  |
| Edmundo Andre Centti Torres   |      100%                  |  

### Distribución de Tareas

- **Frontend Development**: Implementación de componentes, páginas y lógica de UI
- **Integración con Backend**: Conexión con APIs y gestión de estado
- **Testing y QA**: Pruebas funcionales y corrección de bugs
- **Documentación**: Documentación técnica y README

## Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Estilos**: Tailwind CSS
- **Mapas**: Leaflet
- **Gestión de Estado**: React Context API
- **Formularios**: React Hook Form
- **HTTP Client**: Axios
- **Enrutamiento**: React Router DOM
- **Iconos**: Lucide React
- **Notificaciones**: React Hot Toast


