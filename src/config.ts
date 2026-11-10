/**
 * CONFIGURACIÓN DE LA COMUNIDAD (Google Sheets + Google Forms + YouTube)
 * ---------------------------------------------------------------------
 * El portal es 100 % estático. Las aportaciones del profesorado se guardan en
 * una hoja de cálculo de Google a través de formularios de Google restringidos
 * al profesorado autorizado. El portal solo LEE las filas marcadas como
 * «Publicado» (moderación por la coordinación ATECA).
 *
 * Cómo rellenar (ver docs/COMUNIDAD.md):
 *  - *CsvUrl: Archivo › Compartir › Publicar en la web › pestaña › CSV.
 *  - *FormUrl: enlace «Enviar» del formulario de Google.
 * Si un valor está vacío, el portal muestra solo el contenido propio y un aviso.
 */
export const COMMUNITY = {
  casesCsvUrl: '',
  casesFormUrl: '',
  guideTipsCsvUrl: '',
  guideTipsFormUrl: '',
  experiencesCsvUrl: '',
  experiencesFormUrl: '',
  youtubeChannelUrl: '',
};

export const BOOKING_URL = 'https://ateca.fpapps.es';
export const LAST_UPDATED = '10 de noviembre de 2026';
