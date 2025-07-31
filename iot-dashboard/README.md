# Dashboard IoT - Monitoreo de Sensores ESP32

Dashboard React para monitorear sensores DHT11 conectados a dispositivos ESP32, con datos servidos desde una API REST desplegada en Railway.

## 🚀 Características

- **Tiempo Real**: Actualización automática cada 30 segundos
- **3 Sensores**: Monitoreo de temperatura y humedad de 3 ubicaciones
- **Gráficas Interactivas**: Charts.js con líneas de tiempo para temperatura y humedad
- **Responsive**: Diseño adaptable para desktop, tablet y móvil
- **Estados de Error**: Manejo robusto de errores y loading states
- **Colores Consistentes**: Color único por sensor en todo el dashboard

## 🛠️ Tecnologías

- **React 18** - Framework frontend
- **Vite** - Build tool y desarrollo
- **TailwindCSS** - Estilos y responsive design
- **Chart.js** - Gráficas interactivas
- **Lucide React** - Iconos
- **Axios** - Cliente HTTP para API calls

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- API REST funcionando en Railway

## 🔧 Instalación

1. **Clonar e instalar dependencias:**
```bash
cd iot-dashboard
npm install
```

2. **Configurar API:**
La URL de la API está configurada en `src/config/api.js`:
```javascript
const API_BASE_URL = 'https://mi-servidor-iot-production.up.railway.app';
```

3. **Ejecutar en desarrollo:**
```bash
npm run dev
```

4. **Build para producción:**
```bash
npm run build
npm run preview
```

## 📊 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── SensorCard.jsx   # Tarjeta de sensor individual
│   ├── TemperatureChart.jsx # Gráfica de temperatura
│   ├── HumidityChart.jsx    # Gráfica de humedad
│   ├── StatsCard.jsx    # Estadísticas generales
│   ├── LoadingSpinner.jsx   # Spinner de carga
│   └── ErrorMessage.jsx # Componente de error
├── hooks/
│   └── useSensorData.js # Hook para manejo de datos
├── config/
│   └── api.js          # Configuración de API
└── App.jsx             # Componente principal
```

## 🎯 Endpoints Utilizados

- `GET /api/sensors/recent` - Últimos datos de todos los sensores
- `GET /api/sensors/historical/24` - Datos históricos de 24 horas
- `GET /api/sensors/stats` - Estadísticas generales

## 🎨 Sensores y Colores

- **esp32-sala-01**: Rojo (#ef4444)
- **esp32-cocina-02**: Azul (#3b82f6)
- **esp32-dormitorio-03**: Verde (#10b981)

## 📱 Funcionalidades

### Tarjetas de Sensores
- Estado actual de temperatura y humedad
- Ubicación y último timestamp
- Colores únicos por sensor
- Estados de loading y error

### Gráficas Históricas
- Líneas de tiempo para temperatura y humedad
- 3 líneas (una por sensor) con colores consistentes
- Tooltips informativos
- Escalas optimizadas (15-35°C, 0-100%)

### Estadísticas
- Promedios, mínimos y máximos por sensor
- Total de lecturas y dispositivos activos
- Información del sistema

### Auto-actualización
- Refresco automático cada 30 segundos
- Botón de actualización manual
- Indicador de última actualización
- Estado de conexión

## 🔧 Personalización

Para modificar sensores o colores, editar en `App.jsx`:

```javascript
const sensorColors = {
  'esp32-sala-01': '#ef4444',
  'esp32-cocina-02': '#3b82f6', 
  'esp32-dormitorio-03': '#10b981'
};

const expectedSensors = [
  'esp32-sala-01',
  'esp32-cocina-02', 
  'esp32-dormitorio-03'
];
```

## 🚀 Despliegue

El proyecto está listo para desplegar en:
- **Vercel**: `vercel --prod`
- **Netlify**: `npm run build` y subir carpeta `dist/`
- **GitHub Pages**: Configurar workflow con build

## 📋 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter ESLint

## 🐛 Troubleshooting

### Error de CORS
Si hay problemas de CORS, verificar que la API tenga configurados los headers correctos.

### Datos no aparecen
1. Verificar que la API esté funcionando
2. Comprobar URLs en `src/config/api.js`
3. Revisar console del navegador

### Charts no se muestran
Asegurarse de que Chart.js esté correctamente instalado:
```bash
npm install chart.js react-chartjs-2
```