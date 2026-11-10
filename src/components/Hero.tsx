import React from 'react';
import { Calendar, ArrowRight, BookOpen, Wrench, Plus, Layers } from 'lucide-react';
import { BOOKING_URL, LAST_UPDATED } from '../config';

interface HeroProps {
  onExploreCatalog: () => void;
  onExploreGuides: () => void;
  onExploreZones: () => void;
}

/** Portada orientada a tareas: «¿Qué necesitas hacer?» en vez de texto largo. */
export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onExploreGuides, onExploreZones }) => {
  const tasks = [
    { icon: BookOpen, title: 'Buscar una actividad', text: 'Por ciclo, curso, módulo o tecnología.', action: onExploreCatalog, tone: 'bg-cyan-700 text-white' },
    { icon: Wrench, title: 'Poner en marcha un equipo', text: 'Vídeo corto + receta en 5 pasos.', action: onExploreGuides, tone: 'bg-slate-900 text-white' },
    { icon: Layers, title: 'Conocer el aula', text: 'Las 4 zonas y su equipamiento.', action: onExploreZones, tone: 'bg-white text-slate-900 border border-slate-300' },
  ];
  return (
    <section className="bg-gradient-to-b from-sky-50 to-slate-50 pt-8 pb-14 lg:pt-12 lg:pb-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-slate-700">
            <span>IES Agustín de Betancourt</span><span aria-hidden>·</span><span>Puerto de la Cruz</span><span aria-hidden>·</span><span>Aula 19</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold">
              Actualizado: {LAST_UPDATED}
            </span>
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1]">
            Aula ATECA: <span className="text-cyan-700">tecnología aplicada</span> a la Formación Profesional
          </h1>
          <p className="text-lg text-slate-700 leading-relaxed max-w-2xl">
            Vídeo y croma, impresión 3D, realidad virtual, pantalla interactiva y simuladores de gestión
            para trabajar situaciones reales de la profesión en sesiones de 55 minutos.
          </p>

          <div className="grid sm:grid-cols-3 gap-3">
            {tasks.map(t => (
              <button key={t.title} onClick={t.action} className={`text-left p-4 rounded-2xl shadow-sm hover:shadow-md transition ${t.tone}`}>
                <t.icon className="w-6 h-6" />
                <p className="font-bold mt-2 leading-snug">{t.title}</p>
                <p className="text-sm opacity-80 mt-0.5">{t.text}</p>
                <ArrowRight className="w-4 h-4 mt-2" />
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-base shadow">
              <Calendar className="w-5 h-5" /> Reservar Aula ATECA
            </a>
            <button onClick={onExploreCatalog} className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800">
              <Plus className="w-5 h-5" /> Aportar un caso de uso
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <figure className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
            <img src="./PLACA.png" alt="Placa institucional: Conversión de Aulas en Espacios de Tecnología Aplicada, financiada por la Unión Europea – NextGenerationEU (PRTR)"
              className="w-full h-auto rounded-lg border border-slate-200 bg-white object-contain" />
            <figcaption className="text-sm text-slate-600 mt-3">
              «Conversión de Aulas en Espacios de Tecnología Aplicada». Financiado por la Unión Europea – NextGenerationEU, Plan de Recuperación, Transformación y Resiliencia.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
