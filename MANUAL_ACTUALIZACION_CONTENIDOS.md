# 📖 Manual de Actualización y Mantenimiento de Contenidos
## Portal Web Aula ATECA • IES Agustín de Betancourt

---

## 🎯 Filosofía de Mantenimiento
Toda la información del portal (actividades didácticas, guías de equipamiento, zonas y experiencias de los profesores) está **desacoplada del código fuente**. Se almacena en archivos de datos estructurados en formato **JSON** dentro de la carpeta:

```text
portal-aula-ateca/src/data/
├── activities.json        # Banco de fichas y actividades didácticas
├── equipmentGuides.json   # Guías de uso y resolución de problemas de equipos
├── zones.json             # Información de las 4 zonas del aula
├── experiences.json       # Registro de experiencias reales de los docentes
└── institutionalInfo.json # Datos legales, presupuestarios y enlaces oficiales
```

Cualquier profesor o coordinador puede añadir o modificar contenidos editando estos ficheros con un editor de texto convencional, sin necesidad de saber programar.

---

## 1. Cómo Añadir una Nueva Actividad Didáctica

Abre el archivo `src/data/activities.json`. Al final del corchete `[...]`, añade una coma `,` y copia la siguiente plantilla con tus datos:

```json
{
  "id": "act-csaf-09",
  "title": "Título descriptivo de la actividad didáctica",
  "cycle": "CFGS Administración y Finanzas",
  "cycleCode": "CSAF",
  "module": "Nombre oficial del módulo profesional en Canarias",
  "officialCode": "CYF",
  "zone": "Zona de Simulación Administrativa",
  "zoneId": "zona-simulacion",
  "technology": "Tecnología o software utilizado en el Aula 19",
  "guideId": "guia-simuladores",
  "duration": "55 minutos",
  "difficulty": "Intermedio",
  "objective": "Objetivo pedagógico redactado con infinitivo y contextualizado.",
  "materials": [
    "Material 1",
    "Material 2"
  ],
  "preparation": "Qué debe tener preparado el docente antes de entrar al aula.",
  "steps": [
    "Paso 1 (10 min): Explicación inicial y reparto de casos.",
    "Paso 2 (20 min): Trabajo práctico del alumnado con la tecnología.",
    "Paso 3 (15 min): Obtención del entregable.",
    "Paso 4 (10 min): Evaluación y cierre de sesión."
  ],
  "finalProduct": "Entregable concreto del alumnado (ej. Borrador PDF del Modelo 420).",
  "evaluation": "Criterios breves de evaluación o rúbrica.",
  "bookingUrl": "https://ateca.fpapps.es",
  "tags": ["Tributación", "REF", "Canarias"]
}
```

---

## 2. Cómo Añadir o Modificar una Guía de Equipo

Abre el archivo `src/data/equipmentGuides.json`. Cada guía cuenta con los 5 bloques obligatorios:

```json
{
  "id": "guia-nuevo-equipo",
  "title": "Nombre del equipo",
  "category": "Categoría tecnológica",
  "zone": "Zona del aula",
  "zoneId": "zona-3d",
  "equipmentModel": "Marca y modelo exacto instalado",
  "quickStart5Min": {
    "summary": "Resumen para empezar en 5 minutos.",
    "steps": [
      "1. Paso de encendido rápido.",
      "2. Calibración básica.",
      "3. Carga del archivo.",
      "4. Inicio de trabajo.",
      "5. Supervisión."
    ]
  },
  "requirementsBefore": ["Requisito 1", "Requisito 2"],
  "powerOnAndSetup": ["Paso 1", "Paso 2", "Paso 3"],
  "basicUsage": ["Función 1", "Función 2"],
  "powerOffAndStorage": ["Paso 1 de apagado", "Paso 2 de limpieza"],
  "troubleshooting": [
    {
      "issue": "¿Qué ocurre si la máquina no responde?",
      "solution": "Comprueba el cable de corriente y reinicia el interruptor trasero."
    }
  ],
  "externalLinks": [
    {
      "title": "Manual oficial del fabricante",
      "url": "https://...",
      "isOfficial": true
    }
  ],
  "qrCodeId": "QR-ATECA-05"
}
```

---

## 3. Cómo Incorporar una Nueva Experiencia Real Docente

Abre `src/data/experiences.json` e inserta una nueva entrada:

```json
{
  "id": "exp-04",
  "status": "Realizada y Documentada",
  "department": "Administración y Comercio",
  "cycle": "CFGS Administración y Finanzas (1º)",
  "module": "Comunicación y Atención al Cliente",
  "title": "Práctica de Mediación y Role-Playing en el Set de Croma",
  "technology": "Set de Croma y Cámara PTZ",
  "zone": "Zona Multimedia y Croma",
  "sessionDate": "Noviembre 2026",
  "participants": "16 alumnos en parejas",
  "summary": "Grabación de interacciones cara a cara con proyección inmediata en la pantalla de 75\".",
  "results": "Mejora notable en la detección de fallos de comunicación no verbal.",
  "recommendations": "Calibrar los focos LED 10 minutos antes de comenzar la clase.",
  "hasPhotos": false
}
```

---

## 4. Cómo Aplicar los Cambios a Producción (1 Minuto)

Una vez editados los archivos JSON:

1. Abre la terminal en la carpeta del proyecto.
2. Ejecuta la compilación automática:
   ```bash
   npm run build
   ```
3. Sube la carpeta `dist/` resultante a tu servidor web (o ejecuta el comando `npm run deploy` si tienes configurada la clave SSH).

¡Los nuevos contenidos aparecerán de inmediato en el portal web con todos los filtros operativos!
