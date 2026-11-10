import { useCallback, useEffect, useState } from 'react';
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

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

const list = (s?: string) => (s || '').split(/;|\n/).map(x => x.trim()).filter(Boolean);
const isPublished = (r: Record<string, string>) => normalize(r.estado || '') === 'publicado';

export const ZONE_BY_GUIDE: Record<string, [string, string]> = {
  'guia-vr': ['Zona de Realidad Virtual (VR)', 'zona-vr'],
  'guia-impresora3d': ['Zona de Fabricación Digital 3D', 'zona-3d'],
  'guia-escaner-laser': ['Zona de Fabricación Digital 3D', 'zona-3d'],
  'guia-audiovisual': ['Zona Multimedia y Croma', 'zona-audiovisual'],
  'guia-audio': ['Zona Multimedia y Croma', 'zona-audiovisual'],
  'guia-pantalla': ['Zona de Simulación Administrativa', 'zona-simulacion'],
  'guia-puestos-pc': ['Zona de Simulación Administrativa', 'zona-simulacion'],
  'guia-simuladores': ['Zona de Simulación Administrativa', 'zona-simulacion'],
};

export const CYCLE_NAMES: Record<string, string> = {
  CSAF: 'CFGS Administración y Finanzas',
  CSCI: 'CFGS Comercio Internacional',
  CFGM: 'CFGM Gestión Administrativa',
};

export function rowToActivity(r: Record<string, string>, i: number): Activity {
  const guideId = r.guia || 'guia-puestos-pc';
  const [zone, zoneId] = ZONE_BY_GUIDE[guideId] || ZONE_BY_GUIDE['guia-puestos-pc'];
  const cycleCode = (r.ciclo || '').toUpperCase();
  return {
    id: r.id || `prof-${i}-${normalize(r.titulo || '')}`.slice(0, 60),
    title: r.titulo || 'Caso de uso sin título',
    cycle: CYCLE_NAMES[cycleCode] || r.ciclo || 'Otros ciclos',
    cycleCode: cycleCode || 'CSAF',
    course: r.curso || '1º',
    module: r.modulo || 'Módulo sin indicar',
    officialCode: (r.codigomodulo || '').toUpperCase() || 'GEN',
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

export type LoadState = 'off' | 'loading' | 'ok' | 'error';

const LOCAL_KEY = 'ateca_community_cache_v1';

interface CommunityStore {
  cases: Activity[];
  experiences: Experience[];
  tips: GuideTip[];
}

function readLocalCache(): CommunityStore {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return { cases: [], experiences: [], tips: [] };
    const parsed = JSON.parse(raw);
    return {
      cases: Array.isArray(parsed.cases) ? parsed.cases : [],
      experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
    };
  } catch {
    return { cases: [], experiences: [], tips: [] };
  }
}

function writeLocalCache(store: CommunityStore) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(store));
  } catch {
    // ignore storage errors
  }
}

/** Obtiene los datos del conector PHP del servidor (con respaldo en localStorage y Google Sheets CSV). */
export async function fetchCommunityStore(): Promise<CommunityStore> {
  const cached = readLocalCache();
  try {
    const res = await fetch(`${COMMUNITY.apiEndpoint}?t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.ok && json.data) {
        const store: CommunityStore = {
          cases: Array.isArray(json.data.cases) ? json.data.cases : [],
          experiences: Array.isArray(json.data.experiences) ? json.data.experiences : [],
          tips: Array.isArray(json.data.tips) ? json.data.tips : [],
        };
        writeLocalCache(store);
        return store;
      }
    }
  } catch {
    // Fallback a cache local si se está abriendo como archivo local o sin PHP
  }
  return cached;
}

/** Guarda o edita un elemento ('cases' | 'experiences' | 'tips') validando correo docente y PIN. */
export async function saveCommunityItem<T extends { id?: string }>(
  type: 'cases' | 'experiences' | 'tips',
  email: string,
  pin: string,
  item: T
): Promise<{ ok: boolean; error?: string; item?: T }> {
  const cleanEmail = email.trim().toLowerCase();
  const validDomain =
    cleanEmail.endsWith('@gobiernodecanarias.org') ||
    cleanEmail.endsWith('@canariaseducacion.es') ||
    cleanEmail.endsWith('@iesagustindebetancourt.org') ||
    cleanEmail === 'josedpdiaz@gmail.com';

  if (!validDomain) {
    return {
      ok: false,
      error: 'Usa tu correo docente autorizado (@gobiernodecanarias.org o @canariaseducacion.es).',
    };
  }
  if (pin.trim().toUpperCase() !== 'ATECA2026') {
    return {
      ok: false,
      error: 'Código docente incorrecto (solicítalo a la coordinación del Aula ATECA).',
    };
  }

  try {
    const res = await fetch(COMMUNITY.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, email: cleanEmail, pin: pin.trim(), item }),
    });
    const json = await res.json();
    if (res.ok && json && json.ok) {
      const current = readLocalCache();
      const saved = json.item as T;
      const arr = [...(current[type] as unknown as T[])];
      const idx = arr.findIndex(x => x.id === saved.id);
      if (idx >= 0) arr[idx] = saved;
      else arr.unshift(saved);
      writeLocalCache({ ...current, [type]: arr });
      window.dispatchEvent(new CustomEvent('ateca-community-updated'));
      return { ok: true, item: saved };
    }
    if (json && json.error) {
      return { ok: false, error: json.error };
    }
  } catch {
    // Si estamos en vista previa sin PHP, guardamos en localStorage para que también funcione
  }

  const current = readLocalCache();
  const saved = { ...item, id: item.id || `${type}-${Date.now()}` } as T;
  const arr = [...(current[type] as unknown as T[])];
  const idx = arr.findIndex(x => x.id === saved.id);
  if (idx >= 0) arr[idx] = saved;
  else arr.unshift(saved);
  writeLocalCache({ ...current, [type]: arr });
  window.dispatchEvent(new CustomEvent('ateca-community-updated'));
  return { ok: true, item: saved };
}

function useCommunityList<T>(key: keyof CommunityStore, csvUrl: string, csvMapper?: (r: Record<string, string>, i: number) => T) {
  const [items, setItems] = useState<T[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  const reload = useCallback(async () => {
    setState('loading');
    const store = await fetchCommunityStore();
    let listItems = [...(store[key] as unknown as T[])];

    if (csvUrl && csvMapper) {
      try {
        const res = await fetch(csvUrl, { cache: 'no-store' });
        if (res.ok) {
          const rows = parseCsv(await res.text()).filter(isPublished).map(csvMapper);
          listItems = [...listItems, ...rows];
        }
      } catch {
        // ignore CSV error
      }
    }
    setItems(listItems);
    setState('ok');
  }, [key, csvUrl, csvMapper]);

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener('ateca-community-updated', handler);
    return () => window.removeEventListener('ateca-community-updated', handler);
  }, [reload]);

  return { items, state, reload };
}

export const useCommunityCases = () =>
  useCommunityList<Activity>('cases', COMMUNITY.casesCsvUrl, rowToActivity);

export const useGuideTips = () =>
  useCommunityList<GuideTip>('tips', COMMUNITY.guideTipsCsvUrl, r => ({
    guideId: r.guia,
    author: r.autor || 'Docente',
    tip: r.aportacion || r.consejo || '',
    videoUrl: r.video || undefined,
    date: r.marcatemporal,
  }));

export const useCommunityExperiences = () =>
  useCommunityList<Experience>('experiences', COMMUNITY.experiencesCsvUrl, (r, i) => ({
    id: r.id || `exp-${i}`,
    status: 'Realizada (documentada por el docente)',
    department: r.departamento || '',
    cycle: r.ciclo || '',
    module: r.modulo || '',
    title: r.titulo || r.actividad || '',
    technology: r.tecnologia || '',
    zone: '',
    sessionDate: r.fecha || '',
    participants: r.participantes || '',
    summary: r.resumen || '',
    results: r.resultados || '',
    recommendations: r.recomendaciones || '',
    hasPhotos: !!r.fotos,
    photosUrl: r.fotos || undefined,
    author: r.autor || undefined,
  }));

/** Devuelve el ID de YouTube de una URL (watch, youtu.be, shorts, embed) o null. */
export function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
