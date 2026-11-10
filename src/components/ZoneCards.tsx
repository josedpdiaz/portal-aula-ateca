import React, { useState } from 'react';
import { Zone } from '../types';
import { StepGuideBanner, WindowBox } from './UiHelpers';
import {
  Video, Box, Glasses, LayoutDashboard, ArrowRight, BookOpen, Cpu, CheckCircle2, Minimize2, Maximize2,
} from 'lucide-react';

interface ZoneCardsProps {
  zones: Zone[];
  onSelectGuide: (guideId: string) => void;
  onFilterByZone: (zoneId: string) => void;
}

const ZONE_IMAGES: Record<string, string> = {
  'zona-audiovisual': './zona-multimedia.jpg',
  'zona-3d': './zona-3d.jpg',
  'zona-vr': './zona-vr.jpg',
  'zona-simulacion': './hero-ateca.jpg',
};

export const ZoneCards: React.FC<ZoneCardsProps> = ({
  zones,
  onSelectGuide,
  onFilterByZone,
}) => {
  const [allMinimized, setAllMinimized] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="w-4 h-4 text-cyan-600" />;
      case 'Box':
        return <Box className="w-4 h-4 text-amber-600" />;
      case 'Glasses':
        return <Glasses className="w-4 h-4 text-blue-600" />;
      case 'LayoutDashboard':
      default:
        return <LayoutDashboard className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <section id="zonas" className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-400">
              Espacios y equipamiento del Aula 19
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Las 4 Zonas de Trabajo
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setAllMinimized(m => !m)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs self-start md:self-auto"
          >
            {allMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            {allMinimized ? 'Expandir zonas' : 'Minimizar zonas'}
          </button>
        </div>

        <StepGuideBanner
          title="Cómo recorrer las 4 Zonas (Paso a paso)"
          steps={[
            { label: 'Paso 1: Elige la zona', desc: 'Revisa los equipos disponibles en cada rincón del Aula 19.' },
            { label: 'Paso 2: Abre la guía del equipo', desc: 'Pulsa «Guía rápida» para ver cómo encenderlo en 5 pasos.' },
            { label: 'Paso 3: Filtra actividades', desc: 'Pulsa «Ver actividades» para mostrar las prácticas de esa zona.' },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone) => {
            const img = ZONE_IMAGES[zone.id] || './hero-ateca.jpg';
            return (
              <WindowBox
                key={zone.id}
                forceMinimized={allMinimized}
                badge={
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                    {getIcon(zone.icon)}
                    {zone.badge}
                  </span>
                }
                title={zone.name}
                subtitle={zone.tagline}
              >
                <div className="space-y-3 text-xs">
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-900">
                    <img
                      src={img}
                      alt={zone.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase mb-1 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Equipamiento</span>
                      </h3>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                        {zone.equipmentList.slice(0, 4).map((eq, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{eq}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase mb-1">
                        Usos prácticos
                      </h3>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                        {zone.examples.slice(0, 3).map((ex, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 mt-1.5 shrink-0" />
                            <span className="line-clamp-1">{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectGuide(zone.guideId)}
                      className="inline-flex items-center gap-1 font-bold text-cyan-800 dark:text-cyan-300 hover:underline"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Guía rápida</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onFilterByZone(zone.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-cyan-50 text-slate-800 dark:text-white font-bold"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-300" />
                      <span>Ver actividades</span>
                    </button>
                  </div>
                </div>
              </WindowBox>
            );
          })}
        </div>

      </div>
    </section>
  );
};
