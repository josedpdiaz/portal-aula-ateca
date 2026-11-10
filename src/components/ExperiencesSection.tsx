import React, { useMemo, useState } from 'react';
import { Experience } from '../types';
import { COMMUNITY } from '../config';
import { useCommunityExperiences, saveCommunityItem, useTeacherSession } from '../lib/community';
import {
  StepGuideBanner,
  WindowBox,
  SmartModal,
  TeacherSessionBar,
  AuditBadge,
} from './UiHelpers';
import {
  Award, Calendar, Users, ExternalLink, Plus, Edit3, Minimize2, Maximize2, AlertCircle, Lock,
} from 'lucide-react';

export const ExperiencesSection: React.FC<{ experiences: Experience[] }> = ({
  experiences: baseExperiences,
}) => {
  const community = useCommunityExperiences();
  const { session, requestAuth } = useTeacherSession();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [allMinimized, setAllMinimized] = useState(false);

  const list = useMemo(() => {
    const map = new Map<string, Experience>();
    for (const e of baseExperiences) map.set(e.id, e);
    for (const ce of community.items) map.set(ce.id, ce);
    return Array.from(map.values());
  }, [baseExperiences, community.items]);

  const handleCreate = () => {
    if (!session) {
      requestAuth(() => {
        setEditingExp(null);
        setEditorOpen(true);
      });
      return;
    }
    setEditingExp(null);
    setEditorOpen(true);
  };

  const handleEdit = (exp: Experience) => {
    if (!session) {
      requestAuth(() => {
        setEditingExp(exp);
        setEditorOpen(true);
      });
      return;
    }
    setEditingExp(exp);
    setEditorOpen(true);
  };

  return (
    <section id="experiencias" className="py-6 sm:py-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-bold text-cyan-800 dark:text-cyan-400 uppercase tracking-wide">
              Memoria Viva · Registro Docente
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Experiencias en el Aula ATECA ({list.length})
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAllMinimized(m => !m)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              {allMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              {allMinimized ? 'Expandir tarjetas' : 'Minimizar tarjetas'}
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-xs"
            >
              <Plus className="w-4 h-4" />
              {session ? 'Registrar experiencia' : '🔒 Identificarse y registrar experiencia'}
            </button>
          </div>
        </div>

        {/* Paso a paso */}
        <StepGuideBanner
          title="Cómo registrar o editar una Experiencia (Paso a paso)"
          steps={[
            { label: 'Paso 1: Identifícate como docente', desc: 'Tu correo, nombre y departamento quedan vinculados automáticamente.' },
            { label: 'Paso 2: Pulsa «Registrar» o «Editar»', desc: 'Puedes crear una experiencia nueva o actualizar una en preparación.' },
            { label: 'Paso 3: Añade resultados y fotos', desc: 'Indica qué funcionó mejor y, si quieres, un enlace a Drive con evidencias.' },
          ]}
        />

        {/* Tarjetas de experiencias */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(e => (
            <WindowBox
              key={e.id}
              forceMinimized={allMinimized}
              badge={
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {e.status}
                  </span>
                  <span className="text-[11px] font-semibold text-cyan-800 dark:text-cyan-300">
                    {e.cycle} · {e.module}
                  </span>
                </div>
              }
              title={e.title}
              subtitle={
                <span className="inline-flex flex-wrap items-center gap-3 mt-0.5">
                  <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{e.sessionDate}</span>
                  <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{e.participants}</span>
                </span>
              }
              actions={
                <button
                  type="button"
                  onClick={() => handleEdit(e)}
                  title="Editar experiencia"
                  className="px-2 py-1 rounded-lg border border-slate-200 hover:border-cyan-600 text-xs font-semibold inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Editar
                </button>
              }
            >
              <div className="space-y-2 text-xs">
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{e.summary}</p>
                {e.results && (
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Resultados:</strong> {e.results}
                  </p>
                )}
                {e.recommendations && (
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Consejo:</strong> {e.recommendations}
                  </p>
                )}
                {e.photosUrl && (
                  <a
                    href={e.photosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-cyan-800 dark:text-cyan-300 hover:underline"
                  >
                    <Award className="w-3.5 h-3.5" /> Ver evidencias / fotos <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <AuditBadge
                  author={e.author}
                  authorEmail={e.authorEmail}
                  department={e.department}
                  updatedAt={e.updatedAt}
                />
              </div>
            </WindowBox>
          ))}
        </div>
      </div>

      {editorOpen && (
        <ExperienceEditorModal
          initial={editingExp}
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

const ExperienceEditorModal: React.FC<{
  initial: Experience | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ initial, onClose, onSaved }) => {
  const { session, requestAuth } = useTeacherSession();

  const [status, setStatus] = useState(initial?.status || 'Realizada (documentada por el docente)');
  const [cycle, setCycle] = useState(initial?.cycle || 'CFGS Administración y Finanzas');
  const [module, setModule] = useState(initial?.module || 'PNG · Proceso Integral de la Actividad Comercial');
  const [title, setTitle] = useState(initial?.title || '');
  const [technology, setTechnology] = useState(initial?.technology || 'Equipamiento del Aula ATECA');
  const [sessionDate, setSessionDate] = useState(initial?.sessionDate || 'Curso 2026–2027');
  const [participants, setParticipants] = useState(initial?.participants || 'Grupo completo');
  const [summary, setSummary] = useState(initial?.summary || '');
  const [results, setResults] = useState(initial?.results || '');
  const [recommendations, setRecommendations] = useState(initial?.recommendations || '');
  const [photosUrl, setPhotosUrl] = useState(initial?.photosUrl || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMissingFields([]);

    if (!session) {
      setError('Primero debes identificarte como docente pulsando «Identificarme ahora» en la barra superior.');
      requestAuth();
      return;
    }

    const missing: string[] = [];
    if (!title.trim()) missing.push('title');
    if (!summary.trim()) missing.push('summary');

    if (missing.length > 0) {
      setMissingFields(missing);
      const names = missing.map(f => (f === 'title' ? '«Título de la práctica» (Paso 1)' : '«Resumen de la sesión» (Paso 2)')).join(' y ');
      setError(`Falta completar: ${names}. Están señalados en rojo.`);
      return;
    }

    setSaving(true);
    const expObj: Experience = {
      id: initial?.id || `exp-${Date.now()}`,
      status,
      department: session.department,
      cycle: cycle.trim(),
      module: module.trim(),
      title: title.trim(),
      technology: technology.trim(),
      zone: initial?.zone || 'Aula ATECA (Aula 19)',
      sessionDate: sessionDate.trim() || 'Curso 2026–2027',
      participants: participants.trim() || 'Grupo de FP',
      summary: summary.trim(),
      results: results.trim(),
      recommendations: recommendations.trim(),
      hasPhotos: !!photosUrl.trim(),
      photosUrl: photosUrl.trim() || undefined,
      author: session.name,
      authorEmail: session.email,
    };

    const res = await saveCommunityItem('experiences', expObj);
    setSaving(false);
    if (!res.ok) {
      setError(res.error || 'No se pudo guardar la experiencia.');
      return;
    }
    onSaved();
  };

  return (
    <SmartModal
      title={initial ? `Editar experiencia: ${initial.title}` : 'Registrar experiencia docente (Paso a paso)'}
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs sm:text-sm">
        <TeacherSessionBar />

        <StepGuideBanner
          title="Pasos para documentar tu experiencia"
          steps={[
            { label: 'Paso 1: Ciclo, Módulo y Título', desc: 'Indica el grupo, estado de la práctica y título (obligatorio).' },
            { label: 'Paso 2: Resumen de lo realizado', desc: 'Cuenta brevemente qué hicisteis en el Aula 19 (obligatorio).' },
            { label: 'Paso 3: Valoración y fotos', desc: 'Opcional: añade recomendaciones para otros compañeros o enlace a fotos.' },
          ]}
        />

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-500 text-red-900 font-bold text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <WindowBox title="Paso 1 · Datos de la sesión y Título (Obligatorio)">
          <div className="grid sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold mb-1">1.1 Estado</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
              >
                <option value="Realizada (documentada por el docente)">Realizada</option>
                <option value="En curso / Programada">En curso / Programada</option>
                <option value="En preparación (ficha de registro lista)">En preparación</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">1.2 Ciclo formativo</label>
              <input
                type="text"
                value={cycle}
                onChange={e => setCycle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">1.3 Módulo y código</label>
              <input
                type="text"
                value={module}
                onChange={e => setModule(e.target.value)}
                placeholder="Ej. PNG · Proceso Integral..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-bold mb-1">
              1.4 Título de la práctica o proyecto <span className="text-red-600">* (Obligatorio)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej. Práctica de arqueo de caja con monedas impresas en 3D"
              className={`w-full px-3 py-2 rounded-lg border text-sm font-medium ${
                missingFields.includes('title') ? 'border-2 border-red-500 bg-red-50/40' : 'border-slate-300'
              }`}
            />
          </div>
        </WindowBox>

        <WindowBox title="Paso 2 · Equipos usados y Resumen de la sesión (Obligatorio)">
          <div className="grid sm:grid-cols-3 gap-3 pt-1 mb-3">
            <div>
              <label className="block text-xs font-bold mb-1">2.1 Equipo utilizado</label>
              <input
                type="text"
                value={technology}
                onChange={e => setTechnology(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">2.2 Fecha o trimestre</label>
              <input
                type="text"
                value={sessionDate}
                onChange={e => setSessionDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">2.3 Alumnado participante</label>
              <input
                type="text"
                value={participants}
                onChange={e => setParticipants(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              2.4 Resumen de lo trabajado en el aula <span className="text-red-600">* (Obligatorio)</span>
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Describe brevemente en qué consistió la sesión..."
              className={`w-full px-3 py-2 rounded-lg border text-xs ${
                missingFields.includes('summary') ? 'border-2 border-red-500 bg-red-50/40' : 'border-slate-300'
              }`}
            />
          </div>
        </WindowBox>

        <WindowBox title="Paso 3 · Resultados, Consejos y Enlace a Fotos (Opcional)" defaultMinimized>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold mb-1">3.1 Resultados obtenidos</label>
              <textarea
                rows={2}
                value={results}
                onChange={e => setResults(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">3.2 Consejos para otros docentes</label>
              <textarea
                rows={2}
                value={recommendations}
                onChange={e => setRecommendations(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-bold mb-1">3.3 Carpeta de fotos o vídeo en Drive/YouTube</label>
            <input
              type="url"
              value={photosUrl}
              onChange={e => setPhotosUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
          </div>
        </WindowBox>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
          {COMMUNITY.googleSheetUrl && (
            <a
              href={COMMUNITY.googleSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-cyan-800 hover:underline inline-flex items-center gap-1"
            >
              Ver hoja Google Sheets <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
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
              {saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Publicar experiencia'}
            </button>
          </div>
        </div>
      </form>
    </SmartModal>
  );
};
