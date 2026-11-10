import { useEffect, useState } from 'react';
import { Activity, Experience, GuideTip } from '../types';
import { COMMUNITY, BOOKING_URL } from '../config';

/** Parser CSV mínimo (RFC 4180: comillas, comas y saltos de línea dentro de campos). */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...data] = rows.filter(r => r.some(v => v.trim() !== ''));
  if (!header) return [];
  const keys = header.map(h => normalize(h));
  return data.map(r => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])));
}

/** «Código módulo» → «codigomodulo» para tolerar tildes, mayúsculas y espacios. */
function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

const list = (s?: string) => (s || '').split(/;|\n/).map(x => x.trim()).filter(Boolean);
const isPublished = (r: Record<string, string>) => normalize(r.estado || '') === 'publicado';

const ZONE_BY_GUIDE: Record<string, [string, string]> = {
  'guia-vr': ['Zona de Realidad Virtual (VR)', 'zona-vr'],
  'guia-impresora3d': ['Zona de Fabricación Digital 3D', 'zona-3d'],
  'guia-escaner-laser': ['Zona de Fabricación Digital 3D', 'zona-3d'],
  'guia-audiovisual': ['Zona Multimedia y Croma', 'zona-audiovisual'],
  'guia-audio': ['Zona Multimedia y Croma', 'zona-audiovisual'],
  'guia-pantalla': ['Zona de Simulación Administrativa', 'zona-simulacion'],
  'guia-puestos-pc': ['Zona de Simulación Administrativa', 'zona-simulacion'],
  'guia-simuladores': ['Zona de Simulación Administrativa', 'zona-simulacion'],
};

const CYCLE_NAMES: Record<string, string> = {
  CSAF: 'CFGS Administración y Finanzas',
  CSCI: 'CFGS Comercio Internacional',
};

export function rowToActivity(r: Record<string, string>, i: number): Activity {
  const guideId = r.guia || 'guia-puestos-pc';
  const [zone, zoneId] = ZONE_BY_GUIDE[guideId] || ZONE_BY_GUIDE['guia-puestos-pc'];
  const cycleCode = (r.ciclo || '').toUpperCase();
  return {
    id: `prof-${i}-${normalize(r.titulo || '')}`.slice(0, 60),
    title: r.titulo || 'Caso de uso sin título',
    cycle: CYCLE_NAMES[cycleCode] || r.ciclo || 'Otros ciclos',
    cycleCode: cycleCode || 'OTRO',
    course: r.curso,
    module: r.modulo || 'Módulo sin indicar',
    officialCode: (r.codigomodulo || '').toUpperCase(),
    zone, zoneId,
    technology: r.tecnologia || '',
    guideId,
    duration: r.duracion || '55 minutos',
    difficulty: r.nivel || 'Iniciación',
    status: 'Aportado por el profesorado',
    objective: r.objetivo || '',
    materials: list(r.materiales),
    preparation: r.preparacion || '',
    steps: list(r.pasos),
    finalProduct: r.productofinal || '',
    evaluation: r.evaluacion || '',
    bookingUrl: BOOKING_URL,
    tags: list(r.etiquetas),
    videoUrl: r.video || undefined,
    source: 'profesorado',
    author: r.autor || r.autora || undefined,
  };
}

async function fetchCsv(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseCsv(await res.text());
}

export type LoadState = 'off' | 'loading' | 'ok' | 'error';

/** Carga una pestaña publicada si hay URL configurada; si no, devuelve [] con estado 'off'. */
function useSheet<T>(url: string, map: (r: Record<string, string>, i: number) => T) {
  const [items, setItems] = useState<T[]>([]);
  const [state, setState] = useState<LoadState>(url ? 'loading' : 'off');
  useEffect(() => {
    if (!url) return;
    let alive = true;
    fetchCsv(url)
      .then(rows => { if (alive) { setItems(rows.filter(isPublished).map(map)); setState('ok'); } })
      .catch(() => { if (alive) setState('error'); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return { items, state };
}

export const useCommunityCases = () => useSheet<Activity>(COMMUNITY.casesCsvUrl, rowToActivity);

export const useGuideTips = () =>
  useSheet<GuideTip>(COMMUNITY.guideTipsCsvUrl, r => ({
    guideId: r.guia, author: r.autor || 'Docente', tip: r.aportacion || r.consejo || '',
    videoUrl: r.video || undefined, date: r.marcatemporal,
  }));

export const useCommunityExperiences = () =>
  useSheet<Experience>(COMMUNITY.experiencesCsvUrl, (r, i) => ({
    id: `exp-${i}`, status: 'Realizada (documentada por el docente)',
    department: r.departamento || '', cycle: r.ciclo || '', module: r.modulo || '',
    title: r.titulo || r.actividad || '', technology: r.tecnologia || '', zone: '',
    sessionDate: r.fecha || '', participants: r.participantes || '',
    summary: r.resumen || '', results: r.resultados || '', recommendations: r.recomendaciones || '',
    hasPhotos: !!r.fotos, photosUrl: r.fotos || undefined, author: r.autor || undefined,
  }));

/** Devuelve el ID de YouTube de una URL (watch, youtu.be, shorts, embed) o null. */
export function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
