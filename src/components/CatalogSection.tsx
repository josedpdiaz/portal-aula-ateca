import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from '../types';
import { BOOKING_URL, COMMUNITY } from '../config';
import { useCommunityCases, saveCommunityItem, ZONE_BY_GUIDE, CYCLE_NAMES, youtubeId } from '../lib/community';
import {
  Search, Clock, Calendar, ArrowRight, X, Printer, ExternalLink, CheckCircle,
  AlertTriangle, Info, Lightbulb, Plus, Users, Video, Box, Glasses, Monitor, Layers,
  SlidersHorizontal, BookOpen, Pencil, Save, Lock,
} from 'lucide-react';

interface CatalogSectionProps {
  activities: Activity[];
  onSelectGuide: (guideId: string) => void;
  selectedZoneFilter?: string;
  onClearZoneFilter?: () => void;
}

const TECHS = [
  { id: 'zona-audiovisual', label: 'Vídeo, croma y audio', Icon: Video },
  { id: 'zona-3d', label: 'Impresión y escaneo 3D', Icon: Box },
  { id: 'zona-vr', label: 'Realidad virtual', Icon: Glasses },
  { id: 'zona-simulacion', label: 'Pantalla, PC y simuladores', Icon: Monitor },
];
const techOf = (zoneId: string) => TECHS.find(t => t.id === zoneId) || { id: zoneId, label: zoneId, Icon: Layers };

const MODULE_OPTIONS: { cycle: string; course: string; code: string; name: string }[] = [
  { cycle: 'CSAF', course: '1º', code: 'CYA', name: 'Comunicación y Atención al Cliente' },
  { cycle: 'CSAF', course: '1º', code: 'OFA', name: 'Ofimática y Proceso de la Información' },
  { cycle: 'CSAF', course: '1º', code: 'GTJ', name: 'Gestión de la Documentación Jurídica y Empresarial' },
  { cycle: 'CSAF', course: '1º', code: 'PNG', name: 'Proceso Integral de la Actividad Comercial' },
  { cycle: 'CSAF', course: '1º', code: 'RCB', name: 'Recursos Humanos y Responsabilidad Social Corporativa' },
  { cycle: 'CSAF', course: '1º', code: 'DJK', name: 'Digitalización Aplicada a los Sectores Productivos' },
  { cycle: 'CSAF', course: '1º', code: 'ITK', name: 'Itinerario Personal para la Empleabilidad I' },
  { cycle: 'CSAF', course: '1º', code: 'IKL', name: 'Inglés Profesional' },
  { cycle: 'CSAF', course: '2º', code: 'COB', name: 'Contabilidad y Fiscalidad' },
  { cycle: 'CSAF', course: '2º', code: 'GEF', name: 'Gestión Financiera' },
  { cycle: 'CSAF', course: '2º', code: 'GIL', name: 'Gestión Logística y Comercial' },
  { cycle: 'CSAF', course: '2º', code: 'GTH', name: 'Gestión de Recursos Humanos' },
  { cycle: 'CSAF', course: '2º', code: 'SML', name: 'Simulación Empresarial' },
  { cycle: 'CSAF', course: '2º', code: 'SOJ', name: 'Sostenibilidad Aplicada al Sistema Productivo' },
  { cycle: 'CSAF', course: '2º', code: 'YFI', name: 'Proyecto de Administración y Finanzas' },
  { cycle: 'CSAF', course: '2º', code: 'IPW', name: 'Itinerario Personal para la Empleabilidad II' },
  { cycle: 'CSAF', course: '2º', code: 'OGV', name: 'Organización de Eventos Empresariales (optativa)' },
  { cycle: 'CSCI', course: '1º', code: 'GII', name: 'Gestión Administrativa del Comercio Internacional' },
  { cycle: 'CSCI', course: '1º', code: 'TRO', name: 'Transporte Internacional de Mercancías' },
  { cycle: 'CSCI', course: '1º', code: 'LOD', name: 'Logística de Almacenamiento' },
  { cycle: 'CSCI', course: '1º', code: 'GEL', name: 'Gestión Económica y Financiera del Transporte' },
  { cycle: 'CSCI', course: '1º', code: 'DJK', name: 'Digitalización Aplicada a los Sectores Productivos' },
  { cycle: 'CSCI', course: '1º', code: 'IKL', name: 'Inglés Profesional' },
];

const GUIDE_OPTIONS = [
  { id: 'guia-vr', label: 'Gafas VR Meta Quest 3 / 3S' },
  { id: 'guia-impresora3d', label: 'Impresora 3D Bambu Lab X1C' },
  { id: 'guia-pantalla', label: 'Pantalla Interactiva ViewSonic 75"' },
  { id: 'guia-audiovisual', label: 'Set Croma y Cámaras (PTZ / R50)' },
  { id: 'guia-audio', label: 'Micrófonos y Grabación de Audio' },
  { id: 'guia-escaner-laser', label: 'Escáner 3D Revopoint y Láser' },
  { id: 'guia-puestos-pc', label: 'PC Altas Prestaciones y Puestos' },
  { id: 'guia-simuladores', label: 'Simuladores y Software ERP' },
];

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
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
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

  // Si un docente autorizado ha editado una actividad existente, su versión prevalece por id
  const all = useMemo<Activity[]>(() => {
    const map = new Map<string, Activity>();
    activities.forEach(a => map.set(a.id, { ...a, source: a.source || 'catalogo' }));
    community.items.forEach(c => map.set(c.id, { ...c, source: 'profesorado' }));
    return Array.from(map.values());
  }, [activities, community.items]);

  const [query, setQuery] = useState('');
  const [cycle, setCycle] = useState('ALL');
  const [course, setCourse] = useState('ALL');
  const [moduleCode, setModuleCode] = useState('ALL');
  const [tech, setTech] = useState('ALL');
  const [origin, setOrigin] = useState<'ALL' | 'catalogo' | 'ideas' | 'profesorado'>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [open, setOpen] = useState<Activity | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  useEffect(() => {
    if (selectedZoneFilter && selectedZoneFilter !== 'ALL') {
      const t = TECHS.find(t => t.id === selectedZoneFilter || selectedZoneFilter.toLowerCase().includes(t.label.toLowerCase().split(' ')[0]));
      const byName = all.find(a => a.zone === selectedZoneFilter);
      setTech(t?.id || byName?.zoneId || 'ALL');
    }
  }, [selectedZoneFilter, all]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (setOpen(null), setShowFormModal(false));
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
        const hay = [a.title, a.module, a.officialCode, a.technology, a.objective, ...(a.tags || [])].join(' ').toLowerCase();
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

  const openCreateForm = () => {
    setEditingActivity(null);
    setShowFormModal(true);
  };

  const openEditForm = (act: Activity) => {
    setOpen(null);
    setEditingActivity(act);
    setShowFormModal(true);
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
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-extrabold shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Crear actividad (Docentes)
            </button>
            <a
              href={COMMUNITY.googleSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold"
              title="Ver hoja de cálculo de respaldo en Google Sheets"
            >
              <span>Hoja Google Sheets</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Buscador + filtros */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 mb-6">
          <div className="flex gap-2">
            <label className="relative flex-1">
              <span className="sr-only">Buscar actividades</span>
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Busca: arqueo, IGIC, PNG, croma, entrevista…"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200 text-sm sm:text-base outline-none"
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
              options={[{ value: 'ALL', label: 'Todos' }, { value: 'ideas', label: 'Ideas del dpto.' }, { value: 'profesorado', label: 'Del claustro' }]} />
            <div className="md:col-span-2 xl:col-span-4">
              <ChipGroup label="Tecnología" value={tech} onChange={setTech}
                options={[{ value: 'ALL', label: 'Todas' }, ...TECHS.map(t => ({ value: t.id, label: t.label }))]} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-xs sm:text-sm">
            <p className="text-slate-700" aria-live="polite">
              <strong className="text-slate-900">{filtered.length}</strong> {filtered.length === 1 ? 'actividad' : 'actividades'}
              {community.items.length > 0 && <> · <strong className="text-cyan-800">{community.items.length} creadas/editadas por docentes</strong></>}
            </p>
            {activeCount > 0 && <button onClick={reset} className="font-semibold text-cyan-800 underline cursor-pointer">Quitar filtros</button>}
          </div>
        </div>

        {/* Resultados */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p className="text-lg font-bold text-slate-800">No hay actividades con estos filtros</p>
            <p className="text-slate-600 mt-1">Prueba a quitar algún filtro o crea una nueva actividad.</p>
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={reset} className="px-4 py-2 rounded-xl border border-slate-300 font-semibold">Quitar filtros</button>
              <button onClick={openCreateForm} className="px-4 py-2 rounded-xl bg-amber-500 font-bold">Crear actividad</button>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(a => {
              const t = techOf(a.zoneId);
              return (
                <li key={a.id}>
                  <article className="h-full bg-white rounded-2xl border border-slate-200 hover:border-cyan-500 hover:shadow-md transition flex flex-col">
                    <button onClick={() => setOpen(a)} className="text-left p-4 sm:p-5 flex-1 flex flex-col gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 rounded-t-2xl cursor-pointer">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-extrabold text-sm px-2.5 py-0.5 rounded-md bg-slate-900 text-white">{a.officialCode || '—'}</span>
                        <span className="text-xs font-semibold text-slate-600">{a.cycleCode}{a.course ? ` · ${a.course}` : ''}</span>
                        <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-600"><Clock className="w-3.5 h-3.5" />{(a.duration || '55 min').replace(' minutos', ' min')}</span>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{a.module}</p>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-0.5">{a.title}</h2>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">{a.objective}</p>
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-900 border border-cyan-100">
                          <t.Icon className="w-3.5 h-3.5" />{t.label}
                        </span>
                        {a.origin && <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200"><Lightbulb className="w-3.5 h-3.5" />Idea dpto.</span>}
                        {a.source === 'profesorado' && <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200"><Users className="w-3.5 h-3.5" />{a.author || 'Docente'}</span>}
                        {a.legalNote && <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-red-50 text-red-800 border border-red-200"><AlertTriangle className="w-3.5 h-3.5" />Aviso</span>}
                      </div>
                    </button>
                    <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button onClick={() => setOpen(a)} className="inline-flex items-center gap-1 font-bold text-cyan-800 cursor-pointer">
                        Ver ficha <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditForm(a)}
                          className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                          title="Editar esta actividad (profesores autorizados)"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Editar
                        </button>
                        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-cyan-800">
                          <Calendar className="w-3.5 h-3.5" /> Reservar
                        </a>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Ficha completa */}
      {open && (
        <ActivitySheet
          a={open}
          onClose={() => setOpen(null)}
          onGuide={id => { setOpen(null); onSelectGuide(id); }}
          onEdit={() => openEditForm(open)}
        />
      )}

      {/* Modal interactivo para Crear o Editar Actividad */}
      {showFormModal && (
        <ActivityEditorModal
          initial={editingActivity}
          onClose={() => setShowFormModal(false)}
          onSaved={() => {
            setShowFormModal(false);
            community.reload();
          }}
        />
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
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer" aria-label="Cerrar"><X className="w-5 h-5" /></button>
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

const ActivitySheet: React.FC<{ a: Activity; onClose: () => void; onGuide: (id: string) => void; onEdit: () => void }> = ({ a, onClose, onGuide, onEdit }) => {
  const t = techOf(a.zoneId);
  const vid = youtubeId(a.videoUrl);
  return (
    <Modal title={`${a.officialCode} · ${a.module}`} onClose={onClose} wide>
      <div className="space-y-5 text-sm sm:text-[15px] text-slate-800 leading-relaxed">
        <div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold mb-2">
            <span className="px-2 py-1 rounded-md bg-slate-100">{a.cycle}{a.course ? ` · ${a.course} curso` : ''}</span>
            <span className="px-2 py-1 rounded-md bg-slate-100">{a.duration}</span>
            <span className="px-2 py-1 rounded-md bg-slate-100">Nivel: {a.difficulty}</span>
            <span className="px-2 py-1 rounded-md bg-sky-100 text-sky-900">{a.status || 'Propuesta'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">{a.title}</h2>
          {(a.origin || a.author) && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-900 font-semibold">
              <Lightbulb className="w-4 h-4" />{a.author ? `Autor/a: ${a.author}` : a.origin}
            </p>
          )}
        </div>

        <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100">
          <p className="text-xs font-bold text-cyan-900 uppercase flex items-center gap-1.5"><BookOpen className="w-4 h-4" />Objetivo didáctico</p>
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

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-slate-200"><p className="text-xs font-bold text-slate-500 uppercase">Tecnología</p><p className="font-semibold flex items-center gap-1.5 mt-0.5"><t.Icon className="w-4 h-4 text-cyan-700" />{a.technology}</p></div>
          <div className="p-3 rounded-xl border border-slate-200"><p className="text-xs font-bold text-slate-500 uppercase">Zona del aula</p><p className="font-semibold mt-0.5">{a.zone}</p></div>
        </div>

        {vid && (
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            <iframe className="w-full h-full" src={`https://www.youtube-nocookie.com/embed/${vid}`} title={`Vídeo: ${a.title}`} allowFullScreen loading="lazy" />
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <Block title="Materiales">
            <ul className="space-y-1.5">{(a.materials || []).map((m, i) => <li key={i} className="flex gap-2"><CheckCircle className="w-4 h-4 mt-1 text-cyan-700 shrink-0" />{m}</li>)}</ul>
          </Block>
          <Block title="Preparación previa"><p>{a.preparation}</p></Block>
        </div>

        <Block title="Desarrollo paso a paso">
          <ol className="space-y-2">
            {(a.steps || []).map((s, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-cyan-700 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Block>

        <div className="grid sm:grid-cols-2 gap-5">
          <Block title="Producto final"><p className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">{a.finalProduct}</p></Block>
          <Block title="Evaluación"><p className="p-3 rounded-xl bg-slate-50 border border-slate-200">{a.evaluation}</p></Block>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-4 border-t border-slate-200">
          <button onClick={() => onGuide(a.guideId)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-cyan-700 text-cyan-800 font-bold text-xs sm:text-sm cursor-pointer">
            Guía del equipo <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={onEdit} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm cursor-pointer">
            <Pencil className="w-4 h-4" /> Editar ficha
          </button>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs sm:text-sm">
            <Calendar className="w-4 h-4" /> Reservar el aula <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs sm:text-sm ml-auto cursor-pointer">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* ---------- Formulario interactivo para Crear / Editar Actividad ---------- */

const ActivityEditorModal: React.FC<{
  initial: Activity | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ initial, onClose, onSaved }) => {
  const [email, setEmail] = useState(() => localStorage.getItem('ateca_teacher_email') || '');
  const [pin, setPin] = useState(() => localStorage.getItem('ateca_teacher_pin') || '');
  const [author, setAuthor] = useState(initial?.author || '');
  const [cycleCode, setCycleCode] = useState(initial?.cycleCode || 'CSAF');
  const [officialCode, setOfficialCode] = useState(initial?.officialCode || 'PNG');
  const [customModule, setCustomModule] = useState(initial?.module || '');
  const [course, setCourse] = useState(initial?.course || '1º');
  const [title, setTitle] = useState(initial?.title || '');
  const [guideId, setGuideId] = useState(initial?.guideId || 'guia-impresora3d');
  const [technology, setTechnology] = useState(initial?.technology || 'Impresora 3D Bambu Lab X1 Carbon');
  const [duration] = useState(initial?.duration || '55 minutos');
  const [difficulty, setDifficulty] = useState(initial?.difficulty || 'Iniciación');
  const [objective, setObjective] = useState(initial?.objective || '');
  const [materialsText, setMaterialsText] = useState((initial?.materials || []).join('\n'));
  const [preparation, setPreparation] = useState(initial?.preparation || '');
  const [stepsText, setStepsText] = useState((initial?.steps || []).join('\n'));
  const [finalProduct, setFinalProduct] = useState(initial?.finalProduct || '');
  const [evaluation, setEvaluation] = useState(initial?.evaluation || '');
  const [tagsText, setTagsText] = useState((initial?.tags || []).join(', '));
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const availableMods = MODULE_OPTIONS.filter(m => m.cycle === cycleCode);

  useEffect(() => {
    if (!initial) {
      const first = MODULE_OPTIONS.find(m => m.cycle === cycleCode);
      if (first) {
        setOfficialCode(first.code);
        setCustomModule(first.name);
        setCourse(first.course);
      }
    }
  }, [cycleCode, initial]);

  const handleModuleChange = (code: string) => {
    setOfficialCode(code);
    const found = MODULE_OPTIONS.find(m => m.cycle === cycleCode && m.code === code);
    if (found) {
      setCustomModule(found.name);
      setCourse(found.course);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !objective.trim()) {
      setError('El título y el objetivo didáctico son obligatorios.');
      return;
    }

    setSaving(true);
    localStorage.setItem('ateca_teacher_email', email.trim());
    localStorage.setItem('ateca_teacher_pin', pin.trim());

    const [zone, zoneId] = ZONE_BY_GUIDE[guideId] || ZONE_BY_GUIDE['guia-puestos-pc'];
    const activityObj: Activity = {
      id: initial?.id || `act-prof-${Date.now()}`,
      title: title.trim(),
      cycle: CYCLE_NAMES[cycleCode] || cycleCode,
      cycleCode,
      course,
      module: customModule.trim() || officialCode,
      officialCode: officialCode.trim().toUpperCase(),
      zone,
      zoneId,
      technology: technology.trim(),
      guideId,
      duration: duration.trim() || '55 minutos',
      difficulty,
      status: initial ? 'Editada por el profesorado' : 'Aportada por el profesorado',
      objective: objective.trim(),
      materials: materialsText.split(/\n|;/).map(s => s.trim()).filter(Boolean),
      preparation: preparation.trim(),
      steps: stepsText.split(/\n|;/).map(s => s.trim()).filter(Boolean),
      finalProduct: finalProduct.trim(),
      evaluation: evaluation.trim(),
      bookingUrl: BOOKING_URL,
      tags: tagsText.split(/,|;/).map(s => s.trim()).filter(Boolean),
      videoUrl: videoUrl.trim() || undefined,
      source: 'profesorado',
      author: author.trim() || 'Docente del departamento',
      origin: initial?.origin,
      legalNote: initial?.legalNote,
      sessionNote: initial?.sessionNote,
    };

    const res = await saveCommunityItem('cases', email, pin, activityObj);
    setSaving(false);

    if (!res.ok) {
      setError(res.error || 'No se pudo guardar la actividad.');
      return;
    }
    onSaved();
  };

  return (
    <Modal title={initial ? `Editar actividad: ${initial.officialCode}` : 'Crear nueva actividad didáctica'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* Identificación del docente autorizado */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Identificación de docente autorizado</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Nombre del docente *</label>
              <input
                type="text"
                required
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Ej. Victoria / Luis / José Domingo"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Correo corporativo *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@gobiernodecanarias.org"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Código docente ATECA *</label>
              <input
                type="password"
                required
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Código del departamento"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 font-semibold text-xs">
            {error}
          </div>
        )}

        {/* Ciclo, Módulo y Equipo */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Ciclo formativo</label>
            <select
              value={cycleCode}
              onChange={e => setCycleCode(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
            >
              <option value="CSAF">CSAF · Adm. y Finanzas</option>
              <option value="CSCI">CSCI · Comercio Internacional</option>
              <option value="CFGM">CFGM · Gestión Administrativa</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Sigla del módulo</label>
            <select
              value={officialCode}
              onChange={e => handleModuleChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
            >
              {availableMods.map(m => (
                <option key={`${m.cycle}-${m.code}`} value={m.code}>
                  {m.code} · {m.name} ({m.course})
                </option>
              ))}
              <option value="OTRO">Otra sigla / módulo</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Guía de equipo asociada</label>
            <select
              value={guideId}
              onChange={e => setGuideId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
            >
              {GUIDE_OPTIONS.map(g => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Título de la actividad *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej. Simulación de arqueo de caja con monedas 3D"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tecnología utilizada</label>
            <input
              type="text"
              value={technology}
              onChange={e => setTechnology(e.target.value)}
              placeholder="Ej. Impresora 3D Bambu Lab X1C"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Objetivo didáctico *</label>
          <textarea
            rows={2}
            required
            value={objective}
            onChange={e => setObjective(e.target.value)}
            placeholder="Qué aprenderá a hacer el alumnado en esta sesión de 55 minutos…"
            className="w-full px-3 py-2 rounded-lg border border-slate-300"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Materiales necesarios (uno por línea)</label>
            <textarea
              rows={3}
              value={materialsText}
              onChange={e => setMaterialsText(e.target.value)}
              placeholder="Plantilla de hoja de arqueo&#10;Juego de monedas 3D"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Preparación previa del docente</label>
            <textarea
              rows={3}
              value={preparation}
              onChange={e => setPreparation(e.target.value)}
              placeholder="Qué debe dejar listo el docente antes de que entre el grupo…"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Pasos de la sesión de 55 min (uno por línea)</label>
          <textarea
            rows={4}
            value={stepsText}
            onChange={e => setStepsText(e.target.value)}
            placeholder="(10 min) Presentación del caso&#10;(25 min) Trabajo práctico por equipos&#10;(20 min) Puesta en común y cierre"
            className="w-full px-3 py-2 rounded-lg border border-slate-300"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Producto final del alumnado</label>
            <input
              type="text"
              value={finalProduct}
              onChange={e => setFinalProduct(e.target.value)}
              placeholder="Ej. Acta de arqueo firmada en PDF"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Evaluación breve</label>
            <input
              type="text"
              value={evaluation}
              onChange={e => setEvaluation(e.target.value)}
              placeholder="Ej. Lista de cotejo sobre exactitud y orden"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nivel</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white">
              <option value="Iniciación">Iniciación</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Etiquetas (separadas por comas)</label>
            <input
              type="text"
              value={tagsText}
              onChange={e => setTagsText(e.target.value)}
              placeholder="Arqueo, Impresión 3D, Tesorería"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Vídeo YouTube (opcional)</label>
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://youtu.be/..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 font-semibold cursor-pointer">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-extrabold cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Publicar actividad'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
