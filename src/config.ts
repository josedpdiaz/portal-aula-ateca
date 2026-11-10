/**
 * CONFIGURACIÓN DEL PORTAL Y DE LA COMUNIDAD DOCENTE
 * --------------------------------------------------
 * - APP_VERSION y LAST_UPDATED controlan el contador de versiones visible en la cabecera y el pie.
 * - apiEndpoint apunta al conector PHP en el propio hosting (./community-api.php) para que el
 *   profesorado autorizado pueda crear y editar actividades, experiencias y consejos en vivo.
 * - googleSheetId y googleSheetUrl referencian la hoja de cálculo oficial de respaldo en Google Drive.
 */
export const APP_VERSION = 'v1.2.0';
export const LAST_UPDATED = '10 de noviembre de 2026';
export const BOOKING_URL = 'https://ateca.fpapps.es';

export const COMMUNITY = {
  apiEndpoint: './community-api.php',
  googleSheetId: '1A_C6Hbay0sMyb5pIbTUE3XgrAFFVpFHNuGLfXbWiL2k',
  googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1A_C6Hbay0sMyb5pIbTUE3XgrAFFVpFHNuGLfXbWiL2k/edit',
  casesCsvUrl: '',
  casesFormUrl: '',
  guideTipsCsvUrl: '',
  guideTipsFormUrl: '',
  experiencesCsvUrl: '',
  experiencesFormUrl: '',
  youtubeChannelUrl: '',
};
