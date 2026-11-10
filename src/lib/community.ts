import { useCallback, useEffect, useState } from 'react';
import { Activity, EquipmentGuide, Experience, GuideTip, TeacherSession } from '../types';
import { COMMUNITY, BOOKING_URL, DEPARTMENTS } from '../config';

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
    authorEmail: r.correo || undefined,
    department: r.departamento || undefined,
  };
}

// ============================================================================
// SISTEMA CENTRALIZADO DE AUTENTICACIÓN DOCENTE
// ============================================================================
const AUTH_KEY = 'ateca_teacher_session_v1';

export function isValidTeacherEmail(email: string): boolean {
  const clean = email.trim().toLowerCase();
  if (!clean.includes('@')) return false;
  return (
    clean.endsWith('@gobiernodecanarias.org') ||
    clean.endsWith('@canariaseducacion.es') ||
    clean.endsWith('@iesagustindebetancourt.org') ||
    clean === 'josedpdiaz@gmail.com'
  );
}

export function getTeacherSession(): TeacherSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TeacherSession;
    if (!parsed || !parsed.email || !parsed.pin) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loginTeacher(
  email: string,
  name: string,
  department: string,
  pin: string
): { ok: boolean; error?: string; session?: TeacherSession } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanDept = department.trim() || DEPARTMENTS[0];
  const cleanPin = pin.trim();

  if (!cleanEmail) {
    return { ok: false, error: 'Falta el campo «Correo corporativo docente».' };
  }
  if (!isValidTeacherEmail(cleanEmail)) {
    return {
      ok: false,
      error: 'El correo debe ser corporativo (@gobiernodecanarias.org, @canariaseducacion.es o @iesagustindebetancourt.org).',
    };
  }
  if (!cleanName) {
    return { ok: false, error: 'Falta el campo «Nombre y apellidos del docente».' };
  }
  if (!cleanPin) {
    return { ok: false, error: 'Falta el campo «Clave docente ATECA».' };
  }
  if (cleanPin.toUpperCase() !== 'ATECA2026') {
    return {
      ok: false,
      error: 'Clave docente incorrecta. Solicítala a la coordinación del Aula ATECA.',
    };
  }

  const session: TeacherSession = {
    email: cleanEmail,
    name: cleanName,
    department: cleanDept,
    pin: cleanPin,
  };
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new CustomEvent('ateca-auth-changed'));
  return { ok: true, session };
}

export function logoutTeacher() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent('ateca-auth-changed'));
}

export function requestTeacherAuth(onSuccess?: () => void) {
  window.dispatchEvent(new CustomEvent('ateca-open-auth-modal', { detail: { onSuccess } }));
}

export function useTeacherSession() {
  const [session, setSession] = useState<TeacherSession | null>(() => getTeacherSession());

  useEffect(() => {
    const sync = () => setSession(getTeacherSession());
    window.addEventListener('ateca-auth-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('ateca-auth-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return {
    session,
    isAuthenticated: !!session,
    login: loginTeacher,
    logout: logoutTeacher,
    requestAuth: requestTeacherAuth,
  };
}

// ============================================================================
// ALMACENAMIENTO COMUNITARIO (CASOS, GUÍAS, EXPERIENCIAS, CONSEJOS)
// ============================================================================
export type LoadState = 'off' | 'loading' | 'ok' | 'error';

const LOCAL_KEY = 'ateca_community_cache_v2';

export interface CommunityStore {
  cases: Activity[];
  guides: EquipmentGuide[];
  experiences: Experience[];
  tips: GuideTip[];
}

function readLocalCache(): CommunityStore {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return { cases: [], guides: [], experiences: [], tips: [] };
    const parsed = JSON.parse(raw);
    return {
      cases: Array.isArray(parsed.cases) ? parsed.cases : [],
      guides: Array.isArray(parsed.guides) ? parsed.guides : [],
      experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
    };
  } catch {
    return { cases: [], guides: [], experiences: [], tips: [] };
  }
}

function writeLocalCache(store: CommunityStore) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(store));
  } catch {
    // ignore storage errors
  }
}

/** Obtiene los datos del conector PHP del servidor (con respaldo en localStorage). */
export async function fetchCommunityStore(): Promise<CommunityStore> {
  const cached = readLocalCache();
  try {
    const res = await fetch(`${COMMUNITY.apiEndpoint}?t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.ok && json.data) {
        const store: CommunityStore = {
          cases: Array.isArray(json.data.cases) ? json.data.cases : [],
          guides: Array.isArray(json.data.guides) ? json.data.guides : [],
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

/** Guarda o edita un elemento ('cases' | 'guides' | 'experiences' | 'tips') usando la sesión docente activa. */
export async function saveCommunityItem<T extends { id?: string }>(
  type: 'cases' | 'guides' | 'experiences' | 'tips',
  item: T,
  overrideAuth?: { email: string; pin: string; name?: string; department?: string }
): Promise<{ ok: boolean; error?: string; item?: T }> {
  const session = getTeacherSession();
  const email = (overrideAuth?.email || session?.email || '').trim().toLowerCase();
  const pin = (overrideAuth?.pin || session?.pin || '').trim();
  const author = (overrideAuth?.name || session?.name || '').trim();
  const department = (overrideAuth?.department || session?.department || DEPARTMENTS[0]).trim();

  if (!email || !isValidTeacherEmail(email)) {
    return {
      ok: false,
      error: 'Debes autentificarte primero con tu correo corporativo docente (@gobiernodecanarias.org o @canariaseducacion.es).',
    };
  }
  if (pin.toUpperCase() !== 'ATECA2026') {
    return {
      ok: false,
      error: 'Clave docente incorrecta. Verifica tu sesión en «Acceso Docente».',
    };
  }

  const nowStr = new Date().toLocaleDateString('es-ES');
  const enrichedItem = {
    ...item,
    id: item.id || `${type}-${Date.now()}`,
    author: author || (item as Record<string, unknown>).author || email.split('@')[0],
    authorEmail: email,
    department: department || (item as Record<string, unknown>).department || DEPARTMENTS[0],
    updatedAt: nowStr,
  } as T;

  try {
    const res = await fetch(COMMUNITY.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        email,
        pin,
        author: (enrichedItem as Record<string, unknown>).author,
        department: (enrichedItem as Record<string, unknown>).department,
        item: enrichedItem,
      }),
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
  const arr = [...(current[type] as unknown as T[])];
  const idx = arr.findIndex(x => x.id === enrichedItem.id);
  if (idx >= 0) arr[idx] = enrichedItem;
  else arr.unshift(enrichedItem);
  writeLocalCache({ ...current, [type]: arr });
  window.dispatchEvent(new CustomEvent('ateca-community-updated'));
  return { ok: true, item: enrichedItem };
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

export const useCommunityGuides = () =>
  useCommunityList<EquipmentGuide>('guides', '');

export const useGuideTips = () =>
  useCommunityList<GuideTip>('tips', COMMUNITY.guideTipsCsvUrl, r => ({
    guideId: r.guia,
    author: r.autor || 'Docente',
    authorEmail: r.correo || undefined,
    department: r.departamento || undefined,
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
    authorEmail: r.correo || undefined,
  }));

/** Devuelve el ID de YouTube de una URL (watch, youtu.be, shorts, embed) o null. */
export function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
