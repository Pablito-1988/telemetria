# Telemetrico

Dashboard de clasificación de Fórmula 1 construido con Next.js y datos de la API pública de [OpenF1](https://openf1.org/).

La aplicación permite seleccionar una sesión de qualifying, consultar sus pilotos y vueltas, visualizar tiempos y sectores, y revisar la posición del piloto al finalizar cada vuelta.

## Requisitos

- Node.js 20.9 o superior.
- npm 10 o superior, incluido normalmente con Node.js.
- Acceso a Internet para consultar OpenF1 y cargar imágenes externas.

No se necesita una API key ni un archivo `.env` para ejecutar el proyecto.

## Instalación desde cero

Clona el repositorio y entra en su carpeta:

```bash
git clone <URL_DEL_REPOSITORIO>
cd telemetrico
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La página principal enlaza al dashboard en `/qualifying`.

En Windows PowerShell, los mismos comandos funcionan desde la carpeta raíz del proyecto.

## Comandos disponibles

```bash
npm run dev      # Servidor de desarrollo con recarga automática
npm run lint     # Comprobación de ESLint
npm run build    # Compilación de producción y comprobación de TypeScript
npm run start    # Inicia la compilación de producción
```

Para probar el modo producción:

```bash
npm run build
npm run start
```

Después abre [http://localhost:3000](http://localhost:3000). Si el puerto está ocupado, inicia el servidor en otro puerto:

```bash
npx next start -p 3001
```

## Funcionamiento

1. La aplicación obtiene las sesiones de qualifying disponibles.
2. Al seleccionar una sesión, obtiene el meeting/circuito y sus pilotos.
3. Al seleccionar un piloto, consulta sus vueltas y posiciones.
4. Mientras la página está visible, las vueltas y posiciones se actualizan cada segundo.
5. La posición de cada vuelta se calcula usando el último evento de posición registrado hasta el final de esa vuelta.

## Endpoints internos

La interfaz utiliza estas rutas del servidor Next.js:

| Ruta | Función |
| --- | --- |
| `/api/openf1/sessions` | Sesiones de qualifying disponibles |
| `/api/openf1/meetings` | Información del circuito y país |
| `/api/openf1/drivers` | Pilotos de una sesión |
| `/api/openf1/laps` | Vueltas y sectores de un piloto |
| `/api/openf1/positions` | Historial de posiciones de un piloto |

Estas rutas funcionan como una capa tipada entre la interfaz y `https://api.openf1.org/v1`.

## Estructura principal

```text
app/
  page.tsx                         Página inicial
  qualifying/page.tsx              Dashboard de qualifying
  api/openf1/                      Rutas API internas
components/qualifying/
  QualifyingTable.tsx              Tabla de vueltas, sectores y posiciones
services/openf1/                   Servicios tipados para OpenF1
lib/f1/openf1.ts                   Cliente HTTP compartido
types/openf1.ts                    Tipos de sesiones, pilotos, vueltas y posiciones
public/                            Recursos estáticos
```

## Problemas frecuentes

### No aparecen sesiones o vueltas

Comprueba que tienes conexión a Internet y que OpenF1 está disponible. La aplicación depende de sus datos en tiempo de ejecución.

### Las imágenes no cargan

Las imágenes de circuitos, banderas y pilotos proceden de hosts externos configurados en `next.config.ts`. Si OpenF1 devuelve una URL de otro dominio, ese dominio debe añadirse a `images.remotePatterns`.

### El puerto 3000 está ocupado

Usa otro puerto con:

```bash
npm run dev -- -p 3001
```

## Tecnologías

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- OpenF1 API
