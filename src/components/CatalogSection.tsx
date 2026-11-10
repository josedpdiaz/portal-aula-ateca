import React, { useMemo, useState, useEffect } from 'react';
import { Activity } from '../types';
import { BOOKING_URL } from '../config';
import {
  useCommunityCases,
  saveCommunityItem,
  youtubeId,
  ZONE_BY_GUIDE,
  CYCLE_NAMES,
  useTeacherSession,
} from '../lib/community';
import {
  StepGuideBanner,
  WindowBox,
  SmartModal,
  TeacherSessionBar,
  AuditBadge,
} from './UiHelpers';
import {
  Search, RotateCcw, Clock, Wrench, Calendar, ExternalLink, Plus,
  AlertTriangle, Info, CheckCircle2, Sparkles, Edit3, Minimize2, Maximize2,
  AlertCircle, Lock,
} from 'lucide-react';

export { SmartModal as Modal };

interface CatalogSectionProps {
  activities: Activity[];
  selectedZoneFilter?: string;
  onClearZoneFilter?: () => void;
  onOpenGuide: (guideId: string) => void;
}

const MODULE_OPTIONS: { cycle: string; course: string; code: string; name: string }[] = [
  // 1º CSAF
  { cycle: 'CSAF', course: '1º', code: 'CYA', name: 'Comunicación y Atención al Cliente' },
  { cycle: 'CSAF', course: '1º', code: 'OFA', name: 'Ofimática y Proceso de la Información' },
  { cycle: 'CSAF', course: '1º', code: 'GTJ', name: 'Gestión de la Documentación Jurídica y Empresarial' },
  { cycle: 'CSAF', course: '1º', code: 'PNG', name: 'Proceso Integral de la Actividad Comercial' },
  { cycle: 'CSAF', course: '1º', code: 'RCB', name: 'Recursos Humanos y Responsabilidad Social Corporativa' },
  { cycle: 'CSAF', course: '1º', code: 'DJK', name: 'Digitalización Aplicada a los Sectores Productivos (GS)' },
  { cycle: 'CSAF', course: '1º', code: 'ITK', name: 'Itinerario Personal para la Empleabilidad I' },
  { cycle: 'CSAF', course: '1º', code: 'IKL', name: 'Inglés Profesional (GS)' },
  // 2º CSAF
  { cycle: 'CSAF', course: '2º', code: 'COB', name: 'Contabilidad y Fiscalidad' },
  { cycle: 'CSAF', course: '2º', code: 'GEF', name: 'Gestión Financiera' },
  { cycle: 'CSAF', course: '2º', code: 'GIL', name: 'Gestión Logística y Comercial' },
  { cycle: 'CSAF', course: '2º', code: 'GTH', name: 'Gestión de Recursos Humanos' },
  { cycle: 'CSAF', course: '2º', code: 'SML', name: 'Simulación Empresarial' },
  { cycle: 'CSAF', course: '2º', code: 'SOJ', name: 'Sostenibilidad Aplicada al Sistema Productivo' },
  { cycle: 'CSAF', course: '2º', code: 'YFI', name: 'Proyecto Intermodular de Administración y Finanzas' },
  { cycle: 'CSAF', course: '2º', code: 'IPW', name: 'Itinerario Personal para la Empleabilidad II' },
  { cycle: 'CSAF', course: '2º', code: 'OGV', name: 'Organización de Eventos Empresariales' },
  // 1º CSCI
  { cycle: 'CSCI', course: '1º', code: 'GII', name: 'Gestión Económica y Financiera de la Empresa' },
  { cycle: 'CSCI', course: '1º', code: 'TRO', name: 'Transporte Internacional de Mercancías' },
  { cycle: 'CSCI', course: '1º', code: 'LOD', name: 'Logística de Almacenamiento' },
  { cycle: 'CSCI', course: '1º', code: 'GEL', name: 'Gestión Administrativa del Comercio Internacional' },
  { cycle: 'CSCI', course: '1º', code: 'DJK', name: 'Digitalización Aplicada a los Sectores Productivos (GS)' },
  { cycle: 'CSCI', course: '1º', code: 'IKL', name: 'Inglés Profesional (GS)' },
  // CFGM
  { cycle: 'CFGM', course: '1º/2º', code: 'CFGM', name: 'Gestión Administrativa (Grado Medio)' },
];

const GUIDE_OPTIONS: { id: string; label: string; tech: string }[] = [
  { id: 'guia-impresora3d', label: 'Impresora 3D (Bambu Lab X1C)', tech: 'Impresora 3D Bambu Lab X1 Carbon' },
  { id: 'guia-escaner-laser', label: 'Escáner 3D y Grabadora Láser', tech: 'Escáner 3D Einstar / Grabadora Láser' },
  { id: 'guia-audiovisual', label: 'Cámara Sony ZV-E10, Trípode y Croma', tech: 'Kit Audiovisual Sony ZV-E10 + Croma' },
  { id: 'guia-audio', label: 'Micrófonos RØDE y Grabadora Zoom', tech: 'Sistema inalámbrico RØDE + Grabadora Zoom' },
  { id: 'guia-vr', label: 'Gafas de Realidad Virtual (VR)', tech: 'Gafas VR autónomas y Cámara 360º' },
  { id: 'guia-pantalla', label: 'Pantalla Interactiva de Gran Formato', tech: 'Pantalla Interactiva 4K + Pizarra' },
  { id: 'guia-puestos-pc', label: 'Puestos Informáticos y Doble Monitor', tech: 'Ordenadores All-in-One / Portátiles' },
  { id: 'guia-simuladores', label: 'Software ERP/CRM y Simuladores', tech: 'Simuladores Empresariales y Ofimática' },
];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  activities: baseActivities,
  selectedZoneFilter,
  onClearZoneFilter,
  onOpenGuide,
}) => {
  const community = useCommunityCases();
  const { session, requestAuth } = useTeacherSession();

  const allActivities = useMemo(() => {
    const map = new Map<string, Activity>();
    for (const a of baseActivities) map.set(a.id, a);
    for (const c of community.items) map.set(c.id, c);
    return Array.from(map.values());
  }, [baseActivities, community.items]);

  const [q, setQ] = useState('');
  const [cycle, setCycle] = useState('ALL');
  const [mod, setMod] = useState('ALL');
  const [zone, setZone] = useState(selectedZoneFilter || 'ALL');
  const [src, setSrc] = useState<'ALL' | 'catalogo' | 'profesorado'>('ALL');
  const [openAct, setOpenAct] = useState<Activity | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [allCardsMinimized, setAllCardsMinimized] = useState(false);

  useEffect(() => {
    setZone(selectedZoneFilter || 'ALL');
  }, [selectedZoneFilter]);

  const modules = useMemo(() => {
    const map = new Map<string, string>();
    allActivities
      .filter(a => cycle === 'ALL' || a.cycleCode === cycle)
      .forEach(a => map.set(a.officialCode, `${a.officialCode} — ${a.module}`));
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [allActivities, cycle]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return allActivities.filter(a => {
      if (cycle !== 'ALL' && a.cycleCode !== cycle) return false;
      if (mod !== 'ALL' && a.officialCode !== mod) return false;
      if (zone !== 'ALL' && a.zoneId !== zone) return false;
      if (src !== 'ALL' && (a.source || 'catalogo') !== src) return false;
      if (!s) return true;
      return [a.title, a.module, a.officialCode, a.technology, a.objective, a.author || '', ...a.tags]
        .some(t => t.toLowerCase().includes(s));
    });
  }, [allActivities, q, cycle, mod, zone, src]);

  const hasFilters = q !== '' || cycle !== 'ALL' || mod !== 'ALL' || zone !== 'ALL' || src !== 'ALL';
  const reset = () => {
    setQ('');
    setCycle('ALL');
    setMod('ALL');
    setZone('ALL');
    setSrc('ALL');
    onClearZoneFilter?.();
  };

  /** Exige autenticación docente antes de abrir el creador o editor */
  const handleCreateNew = () => {
    if (!session) {
      requestAuth(() => {
        setEditingActivity(null);
        setEditorOpen(true);
      });
      return;
    }
    setEditingActivity(null);
    setEditorOpen(true);
  };

  const handleEditActivity = (act: Activity) => {
    setOpenAct(null);
    if (!session) {
      requestAuth(() => {
        setEditingActivity(act);
        setEditorOpen(true);
      });
      return;
    }
    setEditingActivity(act);
    setEditorOpen(true);
  };

  return (
    <section id="catalogo" className="py-6 sm:py-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabecera compacta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-cyan-800 dark:text-cyan-400 uppercase tracking-wide">
              Catálogo Didáctico · Curso 2026–2027
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Actividades por Ciclo y Módulo ({allActivities.length})
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAllCardsMinimized(m => !m)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:border-cyan-600"
            >
              {allCardsMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              {allCardsMinimized ? 'Expandir todas las fichas' : 'Minimizar todas las fichas'}
            </button>
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {session ? 'Crear actividad docente' : '🔒 Identificarse y crear actividad'}
            </button>
          </div>
        </div>

        {/* Paso a paso de esta pantalla */}
        <StepGuideBanner
          title="Cómo usar esta pantalla de Actividades (Paso a paso)"
          steps={[
            {
              label: 'Filtra tu módulo o equipo',
              desc: 'Elige tu ciclo (CSAF, CSCI, CFGM) o código oficial (PNG, COB, CYA, OFA…).',
            },
            {
              label: 'Consulta o minimiza cada ficha',
              desc: 'Usa los iconos (— / ⤢) de cada recuadro para contraer o ampliar a pantalla completa.',
            },
            {
              label: 'Crea o edita con tu cuenta docente',
              desc: 'Pulsa «Crear actividad» o «Editar» tras identificarte con tu correo y departamento.',
            },
          ]}
        />

        {/* Panel de filtros dentro de un WindowBox (minimizable/maximizable) */}
        <WindowBox
          title="Buscador y filtros rápidos"
          subtitle={`Mostrando ${filtered.length} de ${allActivities.length} actividades`}
          className="mb-5"
          actions={
            hasFilters ? (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-bold text-cyan-800 dark:text-cyan-300"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpiar
              </button>
            ) : undefined
          }
        >
          <div className="space-y-3 pt-1">
            {/* Botones de Ciclo */}
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por ciclo">
              {[
                ['ALL', 'Todos'],
                ['CSAF', 'CSAF · Admón. y Finanzas (1º y 2º)'],
                ['CSCI', 'CSCI · Comercio Internacional (1º)'],
                ['CFGM', 'CFGM · Gestión Administrativa'],
              ].map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => { setCycle(code); setMod('ALL'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    cycle === code
                      ? 'bg-slate-900 dark:bg-cyan-600 text-white border-slate-900 dark:border-cyan-500'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-cyan-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Buscador + Selectores */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Buscar por código (PNG, COB…), título o equipo..."
                  aria-label="Buscar"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm"
                />
              </div>
              <div className="md:col-span-4">
                <select
                  aria-label="Módulo"
                  value={mod}
                  onChange={e => setMod(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium"
                >
                  <option value="ALL">Todos los módulos ({modules.length})</option>
                  {modules.map(([c, label]) => <option key={c} value={c}>{label}</option>)}
                </select>
              </div>
              <div className="md:col-span-3">
                <select
                  aria-label="Zona"
                  value={zone}
                  onChange={e => setZone(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium"
                >
                  <option value="ALL">Todas las zonas (4)</option>
                  <option value="zona-simulacion">Simulación y Puestos PC</option>
                  <option value="zona-audiovisual">Multimedia y Croma</option>
                  <option value="zona-3d">Fabricación 3D y Escáner</option>
                  <option value="zona-vr">Realidad Virtual (VR)</option>
                </select>
              </div>
            </div>
          </div>
        </WindowBox>

        {/* Rejilla de tarjetas (cada una dentro de un WindowBox con minimizar y maximizar) */}
        {filtered.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Sin actividades con estos filtros.</p>
            <button onClick={reset} className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">
              Ver las {allActivities.length} actividades
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(a => (
              <WindowBox
                key={a.id}
                forceMinimized={allCardsMinimized}
                badge={
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-200 font-bold text-[11px] border border-cyan-200 dark:border-cyan-800">
                      {a.course ? `${a.course} ` : ''}{a.cycleCode} · {a.officialCode}
                    </span>
                    {a.origin && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                        ★ Idea docente
                      </span>
                    )}
                    {a.source === 'profesorado' && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        Editada / Docente
                      </span>
                    )}
                  </div>
                }
                title={a.title}
                subtitle={`${a.module} · ${a.technology}`}
              >
                <div className="flex flex-col justify-between h-full space-y-3">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {a.objective}
                    </p>
                    {a.legalNote && (
                      <p className="mt-2 text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Aviso normativo de billetes/monedas
                      </p>
                    )}
                    <AuditBadge
                      author={a.author}
                      authorEmail={a.authorEmail}
                      department={a.department}
                      updatedAt={a.updatedAt}
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-1.5">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {a.duration}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEditActivity(a)}
                        title="Editar actividad (requiere identificación docente)"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-cyan-600 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenAct(a)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-cyan-600 hover:bg-cyan-800 text-white font-bold text-xs"
                      >
                        Ver pasos
                      </button>
                    </div>
                  </div>
                </div>
              </WindowBox>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle (con Minimizar y Maximizar) */}
      {openAct && (
        <SmartModal title={`${openAct.officialCode} · ${openAct.title}`} onClose={() => setOpenAct(null)} wide>
          <ActivityDetail
            a={openAct}
            onOpenGuide={id => { setOpenAct(null); onOpenGuide(id); }}
            onEdit={() => handleEditActivity(openAct)}
          />
        </SmartModal>
      )}

      {/* Modal de Creación / Edición paso a paso */}
      {editorOpen && (
        <ActivityEditorModal
          initial={editingActivity}
          onClose={() => setEditorOpen(false)}
          onSaved={() => {
            setEditorOpen(false);
            community.reload();
          }}
        />
      )}
    </section>
  );
};

const ActivityDetail: React.FC<{
  a: Activity;
  onOpenGuide: (id: string) => void;
  onEdit: () => void;
}> = ({ a, onOpenGuide, onEdit }) => {
  const vid = youtubeId(a.videoUrl);
  return (
    <div className="space-y-4 text-slate-700 dark:text-slate-200 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-200 border border-cyan-200">
            {a.course ? `${a.course} ` : ''}{a.cycleCode} · {a.officialCode} — {a.module}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            {a.zone}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            {a.duration} · {a.difficulty}
          </span>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
        >
          <Edit3 className="w-3.5 h-3.5" /> Editar ficha
        </button>
      </div>

      <AuditBadge
        author={a.author}
        authorEmail={a.authorEmail}
        department={a.department}
        updatedAt={a.updatedAt}
      />

      {a.origin && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex gap-2">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div><strong>Origen:</strong> {a.origin}</div>
        </div>
      )}

      {a.legalNote && (
        <div className="p-3 rounded-xl bg-red-50 border-2 border-red-300 text-red-950 text-xs flex gap-2">
          <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <div><strong>Cumplimiento legal:</strong> {a.legalNote}</div>
        </div>
      )}

      {a.sessionNote && (
        <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs flex gap-2">
          <Info className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
          <div><strong>Organización:</strong> {a.sessionNote}</div>
        </div>
      )}

      <WindowBox title="1. Objetivo y preparación previa">
        <p className="text-sm leading-relaxed mb-2"><strong>Objetivo:</strong> {a.objective}</p>
        {a.preparation && <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Preparación:</strong> {a.preparation}</p>}
      </WindowBox>

      {vid && (
        <div className="w-full aspect-video min-h-[220px] max-h-[80vh] rounded-xl overflow-hidden bg-black shadow-lg">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${vid}`}
            title={a.title}
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}

      <WindowBox title="2. Pasos de la sesión en el aula">
        <ol className="space-y-1.5 pt-1">
          {a.steps.map((s, i) => (
            <li key={i} className="flex gap-2.5 text-xs sm:text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{s.replace(/^\d+\.\s*/, '')}</span>
            </li>
          ))}
        </ol>
      </WindowBox>

      <div className="grid sm:grid-cols-2 gap-3">
        <WindowBox title="3. Materiales y recursos">
          <ul className="space-y-1 text-xs">
            {a.materials.map((m, i) => (
              <li key={i} className="flex gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-700 shrink-0 mt-0.5" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </WindowBox>
        <WindowBox title="4. Entregable y evaluación">
          <p className="text-xs"><strong>Producto final:</strong> {a.finalProduct}</p>
          <p className="text-xs mt-1.5"><strong>Evaluación:</strong> {a.evaluation}</p>
        </WindowBox>
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 justify-between items-center">
        <button
          onClick={() => onOpenGuide(a.guideId)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-xs hover:border-cyan-600"
        >
          <Wrench className="w-4 h-4 text-cyan-700" /> Abrir guía del equipo ({a.technology})
        </button>
        <a
          href={a.bookingUrl || BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
        >
          <Calendar className="w-4 h-4" /> Reservar Aula ATECA <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

/**
 * Formulario guiado paso a paso para Crear o Editar una Actividad (con validación clara sin globos confusos)
 */
const ActivityEditorModal: React.FC<{
  initial: Activity | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ initial, onClose, onSaved }) => {
  const { session, requestAuth } = useTeacherSession();

  const [cycleCode, setCycleCode] = useState(initial?.cycleCode || 'CSAF');
  const [officialCode, setOfficialCode] = useState(initial?.officialCode || 'PNG');
  const [customModule, setCustomModule] = useState(initial?.module || 'Proceso Integral de la Actividad Comercial');
  const [course, setCourse] = useState(initial?.course || '1º');
  const [title, setTitle] = useState(initial?.title || '');
  const [guideId, setGuideId] = useState(initial?.guideId || 'guia-impresora3d');
  const [technology, setTechnology] = useState(initial?.technology || 'Impresora 3D del Aula ATECA');
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
  const [missingFields, setMissingFields] = useState<string[]>([]);

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
    setMissingFields([]);

    if (!session) {
      setError('Primero debes identificarte como docente pulsando «Identificarme ahora» en la barra amarilla superior.');
      requestAuth();
      return;
    }

    const missing: string[] = [];
    if (!title.trim()) missing.push('title');
    if (!objective.trim()) missing.push('objective');

    if (missing.length > 0) {
      setMissingFields(missing);
      const names = missing.map(f => (f === 'title' ? '«Título de la actividad» (Paso 1)' : '«Objetivo didáctico» (Paso 2)')).join(' y ');
      setError(`Falta completar los siguientes campos obligatorios: ${names}. Están marcados en rojo más abajo.`);
      return;
    }

    setSaving(true);
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
      origin: initial?.origin,
      legalNote: initial?.legalNote,
      sessionNote: initial?.sessionNote,
    };

    const res = await saveCommunityItem('cases', activityObj);
    setSaving(false);

    if (!res.ok) {
      setError(res.error || 'No se pudo guardar la actividad.');
      return;
    }
    onSaved();
  };

  return (
    <SmartModal
      title={initial ? `Editar actividad (${initial.officialCode})` : 'Crear nueva actividad docente (Paso a paso)'}
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs sm:text-sm">
        {/* Registro automático del docente autenticado */}
        <TeacherSessionBar />

        {/* Guía rápida de 3 pasos */}
        <StepGuideBanner
          title="Pasos para rellenar esta actividad"
          steps={[
            { label: 'Paso 1: Ciclo, Módulo y Título', desc: 'Selecciona el ciclo, el módulo y escribe un título claro (obligatorio).' },
            { label: 'Paso 2: Equipo y Objetivo', desc: 'Elige el equipo del Aula ATECA, el objetivo (obligatorio) y los pasos.' },
            { label: 'Paso 3: Materiales y Evaluación', desc: 'Opcional: añade materiales, entregable del alumnado o vídeo.' },
          ]}
        />

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-500 text-red-900 font-bold text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* PASO 1 */}
        <WindowBox title="Paso 1 · Ciclo, Módulo y Título de la actividad (Obligatorio)">
          <div className="grid sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold mb-1">1.1 Ciclo formativo</label>
              <select
                value={cycleCode}
                onChange={e => setCycleCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
              >
                <option value="CSAF">CSAF · Admón. y Finanzas</option>
                <option value="CSCI">CSCI · Comercio Internacional</option>
                <option value="CFGM">CFGM · Gestión Administrativa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">1.2 Módulo oficial</label>
              <select
                value={officialCode}
                onChange={e => handleModuleChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
              >
                {availableMods.map(m => (
                  <option key={`${m.cycle}-${m.code}`} value={m.code}>
                    {m.code} ({m.course}) — {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">1.3 Nivel de dificultad</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              >
                <option value="Iniciación">Iniciación</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-bold mb-1">
              1.4 Título de la actividad <span className="text-red-600">* (Obligatorio)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej. Simulación de arqueo de caja con monedas 3D y datáfono"
              className={`w-full px-3 py-2 rounded-lg border text-sm font-medium ${
                missingFields.includes('title') ? 'border-2 border-red-500 bg-red-50/40' : 'border-slate-300'
              }`}
            />
          </div>
        </WindowBox>

        {/* PASO 2 */}
        <WindowBox title="Paso 2 · Equipo del Aula ATECA, Objetivo y Pasos de clase (Obligatorio)">
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold mb-1">2.1 Equipo principal del Aula ATECA</label>
              <select
                value={guideId}
                onChange={e => {
                  const id = e.target.value;
                  setGuideId(id);
                  const found = GUIDE_OPTIONS.find(g => g.id === id);
                  if (found) setTechnology(found.tech);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
              >
                {GUIDE_OPTIONS.map(g => (
                  <option key={g.id} value={g.id}>{g.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                2.2 Objetivo didáctico <span className="text-red-600">* (Obligatorio)</span>
              </label>
              <textarea
                rows={2}
                value={objective}
                onChange={e => setObjective(e.target.value)}
                placeholder="¿Qué aprenderá o practicará el alumnado en esta sesión?"
                className={`w-full px-3 py-2 rounded-lg border text-xs ${
                  missingFields.includes('objective') ? 'border-2 border-red-500 bg-red-50/40' : 'border-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">2.3 Pasos de la sesión (uno por línea)</label>
              <textarea
                rows={3}
                value={stepsText}
                onChange={e => setStepsText(e.target.value)}
                placeholder={'1. Presentación del reto (10 min)\n2. Trabajo práctico por equipos (30 min)\n3. Puesta en común (15 min)'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>
        </WindowBox>

        {/* PASO 3 */}
        <WindowBox title="Paso 3 · Materiales, Evaluación y Vídeo (Opcional)" defaultMinimized>
          <div className="space-y-3 pt-1">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">3.1 Preparación previa</label>
                <textarea
                  rows={2}
                  value={preparation}
                  onChange={e => setPreparation(e.target.value)}
                  placeholder="Qué conviene tener preparado antes de entrar al aula..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">3.2 Materiales necesarios (uno por línea)</label>
                <textarea
                  rows={2}
                  value={materialsText}
                  onChange={e => setMaterialsText(e.target.value)}
                  placeholder={'Equipo reservado\nPlantilla de trabajo'}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">3.3 Producto final del alumnado</label>
                <input
                  type="text"
                  value={finalProduct}
                  onChange={e => setFinalProduct(e.target.value)}
                  placeholder="Ej. Vídeo de 2 min / Acta de arqueo"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">3.4 Criterio de evaluación</label>
                <input
                  type="text"
                  value={evaluation}
                  onChange={e => setEvaluation(e.target.value)}
                  placeholder="Ej. Lista de cotejo o rúbrica práctica"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">3.5 Etiquetas (separadas por comas)</label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={e => setTagsText(e.target.value)}
                  placeholder="3D, Simulación, Oralidad"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">3.6 Vídeo de apoyo en YouTube (opcional)</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        </WindowBox>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
          <span className="text-[11px] text-slate-500">
            * Solo «Título» y «Objetivo» son obligatorios. Tu correo y departamento se registran automáticamente.
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {!session && <Lock className="w-3.5 h-3.5" />}
              {saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Publicar actividad'}
            </button>
          </div>
        </div>
      </form>
    </SmartModal>
  );
};
