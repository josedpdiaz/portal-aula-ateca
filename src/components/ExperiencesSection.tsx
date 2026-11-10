import React, { useState } from 'react';
import { Experience } from '../types';
import { COMMUNITY } from '../config';
import { useCommunityExperiences } from '../lib/community';
import { Modal } from './CatalogSection';
import { Award, Plus, Image as ImageIcon, CalendarDays, Users } from 'lucide-react';

interface ExperiencesSectionProps {
  experiences: Experience[];
}

const FIELDS = ['Departamento', 'Ciclo y módulo', 'Actividad realizada', 'Tecnología utilizada', 'Fecha y participantes',
  'Fotografías (con autorización)', 'Resultados', 'Recomendaciones para otros docentes'];

/**
 * Solo muestra experiencias REALES: las del JSON local (vacío por defecto) y las
 * documentadas por el profesorado en la hoja de cálculo con Estado = Publicado.
 */
export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ experiences }) => {
  const community = useCommunityExperiences();
  const all = [...experiences, ...community.items];
  const [info, setInfo] = useState(false);

  const add = () => {
    if (COMMUNITY.experiencesFormUrl) window.open(COMMUNITY.experiencesFormUrl, '_blank', 'noopener');
    else setInfo(true);
  };

  return (
    <section id="experiencias" className="py-14 sm:py-16 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-cyan-800 uppercase tracking-wide">Experiencias y buenas prácticas</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">Lo que ya se ha hecho en el aula</h2>
            <p className="text-base sm:text-lg text-slate-700 mt-3 leading-relaxed">
              Aquí solo aparecen sesiones <strong>realizadas y documentadas</strong> por el profesorado del centro.
              Las ideas y propuestas están en «Actividades».
            </p>
          </div>
          <button onClick={add} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold self-start lg:self-auto">
            <Plus className="w-5 h-5" /> Documentar una experiencia
          </button>
        </header>

        {all.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-8 sm:p-10 text-center">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-xl font-bold text-slate-900 mt-3">Todavía no hay experiencias documentadas</p>
            <p className="text-slate-600 mt-2 max-w-xl mx-auto">
              Cuando realices una sesión en el Aula ATECA, compártela: es la mejor forma de animar a otros compañeros.
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {FIELDS.map(f => <li key={f} className="px-3 py-1.5 rounded-full bg-slate-100 text-sm text-slate-700">{f}</li>)}
            </ul>
          </div>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {all.map(e => (
              <li key={e.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <span className="inline-block text-xs font-bold px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">{e.status}</span>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{e.title}</h3>
                <p className="text-sm text-slate-600">{e.cycle} · {e.module}</p>
                <p className="text-[15px] text-slate-800">{e.summary}</p>
                {e.results && <p className="text-sm"><strong>Resultados:</strong> {e.results}</p>}
                {e.recommendations && <p className="text-sm"><strong>Recomendación:</strong> {e.recommendations}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  {e.sessionDate && <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{e.sessionDate}</span>}
                  {e.author && <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{e.author}</span>}
                  {e.photosUrl && <a href={e.photosUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-cyan-800"><ImageIcon className="w-3.5 h-3.5" />Fotos</a>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {info && (
        <Modal title="Documentar una experiencia" onClose={() => setInfo(false)}>
          <div className="space-y-3 text-slate-700">
            <p>Se hará con un formulario de Google para el profesorado autorizado, conectado a la hoja de cálculo del portal. La coordinación ATECA revisa y publica.</p>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              El formulario aún no está conectado. Mientras tanto, envía a la coordinación ATECA: {FIELDS.join(', ')}.
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
