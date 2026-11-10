import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from '../types';
import { COMMUNITY, BOOKING_URL } from '../config';
import { useCommunityCases, youtubeId } from '../lib/community';
import {
  Search, Clock, Calendar, ArrowRight, X, Printer, ExternalLink, CheckCircle,
  AlertTriangle, Info, Lightbulb, Plus, Users, Video, Box, Glasses, Monitor, Layers,
  SlidersHorizontal, BookOpen,
} from 'lucide-react';

interface CatalogSectionProps {
  activities: Activity[];
  onSelectGuide: (guideId: string) => void;
  selectedZoneFilter?: string;
  onClearZoneFilter?: () => void;
}

/** Tecnologías = zonas del aula, con etiqueta corta y fácil de reconocer. */
const TECHS = [
  { id: 'zona-audiovisual', label: 'Vídeo, croma y audio', Icon: Video },
  { id: 'zona-3d', label: 'Impresión y escaneo 3D', Icon: Box },
  { id: 'zona-vr', label: 'Realidad virtual', Icon: Glasses },
  { id: 'zona-simulacion', label: 'Pantalla, PC y simuladores', Icon: Monitor },
];
const techOf = (zoneId: string) => TECHS.find(t => t.id === zoneId) || { id: zoneId, label: zoneId, Icon: Layers };

type Chip<T extends string> = { value: T; label: string };

function ChipGroup<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: Chip<T>[]; onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              value === o.value
                ? 'bg-cyan-700 border-cyan-700 text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:border-cyan-600 hover:text-cyan-800'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  activities, onSelectGuide, selectedZoneFilter, onClearZoneFilter,
}) => {
  const community = useCommunityCases();
  const all = useMemo<Activity[]>(
    () => [...activities.map(a => ({ ...a, source: a.source || 'catalogo' as const })), ...community.items],
    [activities, community.items],
  );

  const [query, setQuery] = useState('');
  const [cycle, setCycle] = useState('ALL');
  const [course, setCourse] = useState('ALL');
  const [moduleCode, setModuleCode] = useState('ALL');
  const [tech, setTech] = useState('ALL');
  const [origin, setOrigin] = useState<'ALL' | 'catalogo' | 'ideas' | 'profesorado'>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [open, setOpen] = useState<Activity | null>(null);
  const [showContribute, setShowContribute] = useState(false);

  // La sección «Conoce el aula» puede pedir filtrar por una zona.
  useEffect(() => {
    if (selectedZoneFilter && selectedZoneFilter !== 'ALL') {
      const t = TECHS.find(t => t.id === selectedZoneFilter || selectedZoneFilter.toLowerCase().includes(t.label.toLowerCase().split(' ')[0]));
      const byName = all.find(a => a.zone === selectedZoneFilter);
      setTech(t?.id || byName?.zoneId || 'ALL');
    }
  }, [selectedZoneFilter, all]);

  // Cerrar la ficha con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (setOpen(null), setShowContribute(false));
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const modules = useMemo(() => {
    const map = new Map<string, string>();
    all.filter(a => (cycle === 'ALL' || a.cycleCode === cycle) && (course === 'ALL' || a.course === course))
      .forEach(a => a.officialCode && map.set(a.officialCode, a.module));
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [all, cycle, course]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter(a => {
      if (cycle !== 'ALL' && a.cycleCode !== cycle) return false;
      if (course !== 'ALL' && a.course !== course) return false;
      if (moduleCode !== 'ALL' && a.officialCode !== moduleCode) return false;
      if (tech !== 'ALL' && a.zoneId !== tech) return false;
      if (origin === 'catalogo' && a.source !== 'catalogo') return false;
      if (origin === 'profesorado' && a.source !== 'profesorado') return false;
      if (origin === 'ideas' && !a.origin) return false;
      if (q) {
        const hay = [a.title, a.module, a.officialCode, a.technology, a.objective, ...a.tags].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [all, query, cycle, course, moduleCode, tech, origin]);

  const activeCount = [cycle, course, moduleCode, tech, origin].filter(v => v !== 'ALL').length + (query ? 1 : 0);
  const reset = () => {
    setQuery(''); setCycle('ALL'); setCourse('ALL'); setModuleCode('ALL'); setTech('ALL'); setOrigin('ALL');
    onClearZoneFilter?.();
  };

  const contribute = () => {
    if (COMMUNITY.casesFormUrl) window.open(COMMUNITY.casesFormUrl, '_blank', 'noopener');
    else setShowContribute(true);
  };

  return (
    <section id="actividades" className="py-8 sm:py-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabecera */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold text-cyan-800 uppercase tracking-wide">Banco de casos de uso · Sesiones de 55 min</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">Actividades didácticas para FP</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
              Propuestas para <strong>Administración y Finanzas</strong> (1.º y 2.º)
              y <strong>Comercio Internacional</strong> (1.º), organizadas por las siglas oficiales de cada módulo.
            </p>
          </div>
          <button
            onClick={contribute}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-extrabold shadow-2xs self-start lg:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Aportar un caso de uso
          </button>
        </header>

        {/* Buscador + filtros */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-6">
          <div className="flex gap-2">
            <label className="relative flex-1">
              <span className="sr-only">Buscar actividades</span>
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Busca: arqueo, IGIC, PNG, croma, entrevista…"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200 text-base outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowFilters(s => !s)}
              aria-expanded={showFilters}
              className="md:hidden inline-flex items-center gap-1.5 px-3 rounded-xl border border-slate-300 font-semibold text-slate-700"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {activeCount > 0 && <span className="text-xs bg-cyan-700 text-white rounded-full px-1.5">{activeCount}</span>}
            </button>
          </div>

          <div className={`${showFilters ? 'grid' : 'hidden'} md:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100`}>
            <ChipGroup label="Ciclo" value={cycle} onChange={v => { setCycle(v); setModuleCode('ALL'); }}
              options={[{ value: 'ALL', label: 'Todos' }, { value: 'CSAF', label: 'Adm. y Finanzas' }, { value: 'CSCI', label: 'Comercio Int.' }]} />
            <ChipGroup label="Curso" value={course} onChange={v => { setCourse(v); setModuleCode('ALL'); }}
              options={[{ value: 'ALL', label: 'Todos' }, { value: '1º', label: '1.º' }, { value: '2º', label: '2.º' }]} />
            <div>
              <label htmlFor="f-modulo" className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">Módulo</label>
              <select id="f-modulo" value={moduleCode} onChange={e => setModuleCode(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-sm font-medium">
                <option value="ALL">Todos los módulos</option>
                {modules.map(([code, name]) => <option key={code} value={code}>{code} · {name}</option>)}
              </select>
            </div>
            <ChipGroup label="Origen" value={origin} onChange={setOrigin}
              options={[{ value: 'ALL', label: 'Todos' }, { value: 'ideas', label: 'Ideas del dpto.' }, { value: 'profesorado', label: 'Aportados' }]} />
            <div className="md:col-span-2 xl:col-span-4">
              <ChipGroup label="Tecnología" value={tech} onChange={setTech}
                options={[{ value: 'ALL', label: 'Todas' }, ...TECHS.map(t => ({ value: t.id, label: t.label }))]} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-sm">
            <p className="text-slate-700" aria-live="polite">
              <strong className="text-slate-900">{filtered.length}</strong> {filtered.length === 1 ? 'actividad' : 'actividades'}
              {community.state === 'ok' && community.items.length > 0 && <> · {community.items.length} aportadas por docentes</>}
            </p>
            {activeCount > 0 && <button onClick={reset} className="font-semibold text-cyan-800 underline">Quitar filtros</button>}
          </div>
        </div>

        {/* Resultados */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p className="text-lg font-bold text-slate-800">No hay actividades con estos filtros</p>
            <p className="text-slate-600 mt-1">Prueba a quitar algún filtro o… ¡aporta tú la primera!</p>
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={reset} className="px-4 py-2 rounded-xl border border-slate-300 font-semibold">Quitar filtros</button>
              <button onClick={contribute} className="px-4 py-2 rounded-xl bg-amber-500 font-bold">Aportar caso</button>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(a => {
              const t = techOf(a.zoneId);
              return (
                <li key={a.id}>
                  <article className="h-full bg-white rounded-2xl border border-slate-200 hover:border-cyan-500 hover:shadow-md transition flex flex-col">
                    <button onClick={() => setOpen(a)} className="text-left p-5 flex-1 flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 rounded-t-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-extrabold text-base px-2.5 py-0.5 rounded-md bg-slate-900 text-white">{a.officialCode || '—'}</span>
                        <span className="text-xs font-semibold text-slate-600">{a.cycleCode}{a.course ? ` · ${a.course}` : ''}</span>
                        <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-600"><Clock className="w-3.5 h-3.5" />{a.duration.replace(' minutos', ' min')}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">{a.module}</p>
                        <h3 className="text-lg font-bold text-slate-900 leading-snug mt-0.5">{a.title}</h3>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{a.objective}</p>
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-cyan-50 text-cyan-900 border border-cyan-100">
                          <t.Icon className="w-3.5 h-3.5" />{t.label}
                        </span>
                        {a.origin && <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200"><Lightbulb className="w-3.5 h-3.5" />Idea del dpto.</span>}
                        {a.source === 'profesorado' && <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-violet-50 text-violet-900 border border-violet-200"><Users className="w-3.5 h-3.5" />Aportado</span>}
                        {a.legalNote && <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-red-50 text-red-800 border border-red-200"><AlertTriangle className="w-3.5 h-3.5" />Aviso</span>}
                      </div>
                    </button>
                    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                      <button onClick={() => setOpen(a)} className="inline-flex items-center gap-1 text-sm font-bold text-cyan-800">
                        Ver ficha <ArrowRight className="w-4 h-4" />
                      </button>
                      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-cyan-800">
                        <Calendar className="w-4 h-4" /> Reservar
                      </a>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Ficha completa */}
      {open && <ActivitySheet a={open} onClose={() => setOpen(null)} onGuide={id => { setOpen(null); onSelectGuide(id); }} />}

      {/* Cómo aportar (si aún no hay formulario configurado) */}
      {showContribute && (
        <Modal title="Aportar un caso de uso" onClose={() => setShowContribute(false)}>
          <div className="space-y-4 text-slate-700">
            <p>
              El profesorado autorizado podrá enviar sus casos de uso mediante un <strong>formulario de Google</strong>.
              Las respuestas se guardan en una <strong>hoja de cálculo</strong> y aparecen aquí cuando la coordinación ATECA
              las marca como <em>Publicado</em>.
            </p>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              El formulario todavía no está conectado. Mientras tanto, envía tu propuesta a la coordinación ATECA con estos campos:
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm list-disc pl-5">
              {['Autor/a', 'Ciclo y curso', 'Código y nombre del módulo', 'Título', 'Tecnología / guía del equipo', 'Duración y nivel',
                'Objetivo didáctico', 'Materiales', 'Preparación previa', 'Pasos de la sesión', 'Producto final', 'Evaluación', 'Etiquetas', 'Vídeo (opcional)']
                .map(f => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </Modal>
      )}
    </section>
  );
};

/* ---------- Piezas reutilizables ---------- */

export const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }> = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
    <div className={`bg-white w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl`} onClick={e => e.stopPropagation()}>
      <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between gap-3 z-10">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Cerrar"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  </div>
);

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    <h4 className="text-sm font-bold uppercase tracking-wide text-slate-900">{title}</h4>
    {children}
  </section>
);

const ActivitySheet: React.FC<{ a: Activity; onClose: () => void; onGuide: (id: string) => void }> = ({ a, onClose, onGuide }) => {
  const t = techOf(a.zoneId);
  const vid = youtubeId(a.videoUrl);
  return (
    <Modal title={`${a.officialCode} · ${a.module}`} onClose={onClose} wide>
      <div className="space-y-6 text-[15px] text-slate-800 leading-relaxed">
        <div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold mb-2">
            <span className="px-2 py-1 rounded-md bg-slate-100">{a.cycle}{a.course ? ` · ${a.course} curso` : ''}</span>
            <span className="px-2 py-1 rounded-md bg-slate-100">{a.duration}</span>
            <span className="px-2 py-1 rounded-md bg-slate-100">Nivel: {a.difficulty}</span>
            <span className="px-2 py-1 rounded-md bg-sky-100 text-sky-900">{a.status || 'Propuesta'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{a.title}</h2>
          {(a.origin || a.author) && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-amber-900"><Lightbulb className="w-4 h-4" />{a.author ? `Aportado por ${a.author}` : a.origin}</p>
          )}
        </div>

        <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100">
          <p className="text-sm font-bold text-cyan-900 flex items-center gap-1.5"><BookOpen className="w-4 h-4" />Objetivo</p>
          <p className="mt-1">{a.objective}</p>
        </div>

        {a.legalNote && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900">
            <p className="font-bold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" />Antes de empezar: aviso legal</p>
            <p className="mt-1 text-sm">{a.legalNote}</p>
          </div>
        )}
        {a.sessionNote && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm flex gap-2"><Info className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />{a.sessionNote}</div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl border border-slate-200"><p className="text-xs font-bold text-slate-500 uppercase">Tecnología</p><p className="font-semibold flex items-center gap-1.5 mt-0.5"><t.Icon className="w-4 h-4 text-cyan-700" />{a.technology}</p></div>
          <div className="p-3 rounded-xl border border-slate-200"><p className="text-xs font-bold text-slate-500 uppercase">Zona del aula</p><p className="font-semibold mt-0.5">{a.zone}</p></div>
        </div>

        {vid && (
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            <iframe className="w-full h-full" src={`https://www.youtube-nocookie.com/embed/${vid}`} title={`Vídeo: ${a.title}`} allowFullScreen loading="lazy" />
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          <Block title="Materiales">
            <ul className="space-y-1.5">{a.materials.map((m, i) => <li key={i} className="flex gap-2"><CheckCircle className="w-4 h-4 mt-1 text-cyan-700 shrink-0" />{m}</li>)}</ul>
          </Block>
          <Block title="Preparación previa"><p>{a.preparation}</p></Block>
        </div>

        <Block title="Desarrollo paso a paso">
          <ol className="space-y-2">
            {a.steps.map((s, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-cyan-700 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Block>

        <div className="grid sm:grid-cols-2 gap-6">
          <Block title="Producto final"><p className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">{a.finalProduct}</p></Block>
          <Block title="Evaluación"><p className="p-3 rounded-xl bg-slate-50 border border-slate-200">{a.evaluation}</p></Block>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
          <button onClick={() => onGuide(a.guideId)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-cyan-700 text-cyan-800 font-bold">
            Guía del equipo <ArrowRight className="w-4 h-4" />
          </button>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold">
            <Calendar className="w-4 h-4" /> Reservar el aula <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 font-semibold ml-auto">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
        </div>
      </div>
    </Modal>
  );
};
