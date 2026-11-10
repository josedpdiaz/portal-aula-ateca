# Conectar la hoja de cálculo, los formularios y el canal de YouTube

El portal es **100 % estático** (archivos HTML/CSS/JS en el hosting del centro, sin servidor Node).
Las aportaciones del profesorado se recogen con **Google Forms** y se leen desde **Google Sheets**.

## 1. Crear la hoja de cálculo

1. Crea una hoja de cálculo de Google con **tres pestañas**:
   - `Casos de uso` — importa la cabecera desde [`public/plantillas/casos_de_uso.csv`](../public/plantillas/casos_de_uso.csv).
   - `Aportaciones guias` — importa [`public/plantillas/aportaciones_guias.csv`](../public/plantillas/aportaciones_guias.csv).
   - `Experiencias` — importa [`public/plantillas/experiencias.csv`](../public/plantillas/experiencias.csv).
2. En cada pestaña, la última columna es **`Estado`**.
   - El portal **solo muestra** las filas donde `Estado` es **`Publicado`**.
   - Así la coordinación ATECA revisa cada envío antes de que aparezca en la web.

## 2. Crear los formularios para el profesorado autorizado

Crea hasta tres formularios de Google (o uno por pestaña) y vincúlalos a la hoja de cálculo:

- En **Configuración › Respuestas**, activa la restricción al dominio del centro / profesorado autorizado (o comparte el enlace solo con el claustro).
- Deja la columna `Estado` fuera del formulario: cuando entra una respuesta queda vacía y la coordinación escribe `Publicado` tras revisarla.

### Valores esperados en la columna `Guía`

`guia-vr`, `guia-impresora3d`, `guia-pantalla`, `guia-audiovisual`, `guia-audio`, `guia-escaner-laser`, `guia-puestos-pc`, `guia-simuladores`.

En `Materiales`, `Pasos` y `Etiquetas`, separa varios elementos con punto y coma (`;`) o con saltos de línea.

## 3. Publicar las pestañas como CSV (solo lectura)

En la hoja de cálculo: **Archivo › Compartir › Publicar en la web**:

1. Elige la pestaña (no el documento entero) y el formato **Valores separados por comas (.csv)**.
2. Copia el enlace generado.
3. Repite para las tres pestañas.

> No publiques columnas con correos personales si no quieres que sean públicas, o crea una pestaña «Vista pública» con `=FILTER(...)` sin la columna `Correo` y publica esa pestaña.

## 4. Canal de YouTube del Aula ATECA

- Créalo con una **cuenta institucional del centro** (el alumnado no usa cuentas personales).
- Visibilidad recomendada al empezar: vídeos **«No listado»** (solo accesibles desde el portal o los QR) o **«Público»** cuando cuenten con autorización de imagen y revisión docente.
- Para poner el vídeo principal (máx. 5 min) de una guía: pega su URL de YouTube en `video.url` dentro de [`src/data/equipmentGuides.json`](../src/data/equipmentGuides.json) (o en [`scripts/generate_guides.py`](../scripts/generate_guides.py) y ejecuta `python3 scripts/generate_guides.py`).

## 5. Pegar los enlaces en el portal

Abre [`src/config.ts`](../src/config.ts), pega las URLs y vuelve a compilar (`npm run build`):

```ts
export const COMMUNITY = {
  casesCsvUrl: 'https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv',
  casesFormUrl: 'https://docs.google.com/forms/d/e/.../viewform',
  guideTipsCsvUrl: '...',
  guideTipsFormUrl: '...',
  experiencesCsvUrl: '...',
  experiencesFormUrl: '...',
  youtubeChannelUrl: 'https://www.youtube.com/@...',
};
```
