import React, { useState } from 'react';
import { Experience } from '../types';
import { COMMUNITY } from '../config';
import { useCommunityExperiences, saveCommunityItem } from '../lib/community';
import { Modal } from './CatalogSection';
import { Award, Plus, Image as ImageIcon, CalendarDays, Users, Pencil, Save, Lock, ExternalLink } from 'lucide-react';

interface ExperiencesSectionProps {
  experiences: Experience[];
}

const FIELDS = [
  'Departamento',
  'Ciclo y módulo',
  'Actividad realizada',
  'Tecnología utilizada',
  'Fecha y participantes',
  'Resultados obtenidos',
  'Recomendaciones para otros docentes',
];

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ experiences }) => {
  const community = useCommunityExperiences();

  const all = React.useMemo(() => {
    const map = new Map<string, Experience>();
    experiences.forEach(e => map.set(e.id, e));
    community.items.forEach(e => map.set(e.id, e));
    return Array.from(map.values());
  }, [experiences, community.items]);

  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openCreate = () => {
    setEditingExp(null);
    setShowModal(true);
  };

  const openEdit = (exp: Experience) => {
    setEditingExp(exp);
    setShowModal(true);
  };

  return (
    <section id="experiencias" className="py-8 sm:py-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold text-cyan-800 uppercase tracking-wide">Experiencias y buenas prácticas</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">Lo que ya se ha hecho en el aula</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
              Aquí solo aparecen sesiones <strong>realizadas y documentadas</strong> por el profesorado del centro.
              Cualquier docente autorizado puede registrar una nueva experiencia o editar las existentes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-extrabold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Registrar experiencia
            </button>
            <a
              href={COMMUNITY.googleSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold"
            >
              <span>Hoja Google Sheets</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {all.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-8 sm:p-10 text-center">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-xl font-bold text-slate-900 mt-3">Todavía no hay experiencias documentadas</p>
            <p className="text-slate-600 mt-2 max-w-xl mx-auto text-sm">
              Cuando realices una sesión en el Aula ATECA, pulsa <strong>«Registrar experiencia»</strong> para compartir resultados y consejos prácticos con el resto del departamento.
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {FIELDS.map(f => <li key={f} className="px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700">{f}</li>)}
            </ul>
            <button
              type="button"
              onClick={openCreate}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-sm font-extrabold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Registrar la primera experiencia
            </button>
          </div>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {all.map(e => (
              <li key={e.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-2xs">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {e.status || 'Realizada en el Aula 19'}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEdit(e)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-cyan-800 cursor-pointer"
                      title="Editar esta experiencia"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Editar
                    </button>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">{e.title}</h2>
                  <p className="text-xs font-semibold text-cyan-800">{e.cycle} · {e.module}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{e.summary}</p>
                  {e.results && <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"><strong>Resultados:</strong> {e.results}</p>}
                  {e.recommendations && <p className="text-xs text-amber-950 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70"><strong>Recomendación:</strong> {e.recommendations}</p>}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap gap-3">
                    {e.sessionDate && <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{e.sessionDate}</span>}
                    {e.author && <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{e.author}</span>}
                  </div>
                  {e.photosUrl && (
                    <a href={e.photosUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-cyan-800 hover:underline">
                      <ImageIcon className="w-3.5 h-3.5" />Fotos
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <ExperienceEditorModal
          initial={editingExp}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
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
  const [email, setEmail] = useState(() => localStorage.getItem('ateca_teacher_email') || '');
  const [pin, setPin] = useState(() => localStorage.getItem('ateca_teacher_pin') || '');
  const [author, setAuthor] = useState(initial?.author || '');
  const [department, setDepartment] = useState(initial?.department || 'Administración y Gestión / Comercio');
  const [cycle, setCycle] = useState(initial?.cycle || 'CFGS Administración y Finanzas');
  const [module, setModule] = useState(initial?.module || '');
  const [title, setTitle] = useState(initial?.title || '');
  const [technology, setTechnology] = useState(initial?.technology || '');
  const [sessionDate, setSessionDate] = useState(initial?.sessionDate || '');
  const [participants, setParticipants] = useState(initial?.participants || '');
  const [summary, setSummary] = useState(initial?.summary || '');
  const [results, setResults] = useState(initial?.results || '');
  const [recommendations, setRecommendations] = useState(initial?.recommendations || '');
  const [photosUrl, setPhotosUrl] = useState(initial?.photosUrl || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !summary.trim()) {
      setError('El título de la sesión y el resumen de lo realizado son obligatorios.');
      return;
    }

    setSaving(true);
    localStorage.setItem('ateca_teacher_email', email.trim());
    localStorage.setItem('ateca_teacher_pin', pin.trim());

    const expObj: Experience = {
      id: initial?.id || `exp-${Date.now()}`,
      status: 'Realizada y documentada',
      department: department.trim(),
      cycle: cycle.trim(),
      module: module.trim(),
      title: title.trim(),
      technology: technology.trim(),
      zone: initial?.zone || '',
      sessionDate: sessionDate.trim(),
      participants: participants.trim(),
      summary: summary.trim(),
      results: results.trim(),
      recommendations: recommendations.trim(),
      hasPhotos: !!photosUrl.trim(),
      photosUrl: photosUrl.trim() || undefined,
      author: author.trim() || 'Docente del departamento',
    };

    const res = await saveCommunityItem('experiences', email, pin, expObj);
    setSaving(false);
    if (!res.ok) {
      setError(res.error || 'No se pudo guardar la experiencia.');
      return;
    }
    onSaved();
  };

  return (
    <Modal title={initial ? 'Editar experiencia docente' : 'Registrar experiencia realizada en el Aula ATECA'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Identificación de docente autorizado</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Docente *</label>
              <input
                type="text"
                required
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Nombre y apellidos"
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

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Departamento</label>
            <input type="text" value={department} onChange={e => setDepartment(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Ciclo formativo</label>
            <input type="text" value={cycle} onChange={e => setCycle(e.target.value)} placeholder="Ej. 1.º CFGS Adm. y Finanzas" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Módulo (sigla y nombre)</label>
            <input type="text" value={module} onChange={e => setModule(e.target.value)} placeholder="Ej. PNG · Proceso Integral..." className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Título de la práctica realizada *</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Arqueo de caja con fichas impresas en 3D" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Equipos utilizados</label>
            <input type="text" value={technology} onChange={e => setTechnology(e.target.value)} placeholder="Ej. Bambu Lab X1C + Pantalla ViewSonic 75&quot;" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Fecha de la sesión</label>
            <input type="text" value={sessionDate} onChange={e => setSessionDate(e.target.value)} placeholder="Ej. 15/11/2026" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Participantes</label>
            <input type="text" value={participants} onChange={e => setParticipants(e.target.value)} placeholder="Ej. 18 alumnos en 2 turnos" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Enlace a fotos/vídeo (opcional)</label>
            <input type="url" value={photosUrl} onChange={e => setPhotosUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Resumen de lo realizado *</label>
          <textarea rows={2} required value={summary} onChange={e => setSummary(e.target.value)} placeholder="Cómo se organizó la sesión en el Aula 19…" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Resultados y valoración del alumnado</label>
            <textarea rows={2} value={results} onChange={e => setResults(e.target.value)} placeholder="Qué tal funcionó y qué producto entregaron…" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Recomendaciones para otros compañeros</label>
            <textarea rows={2} value={recommendations} onChange={e => setRecommendations(e.target.value)} placeholder="Consejos prácticos para repetir la sesión…" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
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
            <span>{saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Publicar experiencia'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
