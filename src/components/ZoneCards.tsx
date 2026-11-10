import React from 'react';
import { Zone } from '../types';
import { Video, Box, Glasses, LayoutDashboard, ArrowRight, BookOpen, Cpu, CheckCircle2 } from 'lucide-react';

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
  onFilterByZone
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="w-5 h-5 text-cyan-600" />;
      case 'Box':
        return <Box className="w-5 h-5 text-amber-600" />;
      case 'Glasses':
        return <Glasses className="w-5 h-5 text-blue-600" />;
      case 'LayoutDashboard':
      default:
        return <LayoutDashboard className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <section id="zonas" className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Cabecera compacta */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-800">
              Espacios y equipamiento del Aula 19
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
              Las 4 Zonas del Aula ATECA
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            89 m² distribuidos en cuatro zonas modulares para simular situaciones reales de trabajo, grabar contenidos, fabricar prototipos y entrenar en realidad virtual.
          </p>
        </div>

        {/* Cuadrícula 2x2 compacta con fotografías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {zones.map((zone) => {
            const img = ZONE_IMAGES[zone.id] || './hero-ateca.jpg';
            return (
              <article
                key={zone.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Imagen de cabecera de la zona */}
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={img}
                      alt={zone.name}
                      className="w-full h-full object-cover opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-xl shadow-xs shrink-0">
                          {getIcon(zone.icon)}
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold tracking-wider uppercase text-cyan-300 block">
                            {zone.badge}
                          </span>
                          <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                            {zone.name}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cuerpo compacto */}
                  <div className="p-5 space-y-4 text-xs sm:text-sm">
                    <p className="text-slate-600 leading-relaxed">
                      {zone.didacticUtility}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5 text-cyan-700" />
                          <span>Equipamiento</span>
                        </h3>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {zone.equipmentList.slice(0, 5).map((eq, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                              <span className="line-clamp-1">{eq}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                          Aplicaciones en FP
                        </h3>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {zone.examples.slice(0, 3).map((ex, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 mt-1.5 shrink-0" />
                              <span className="line-clamp-2">{ex}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pie de tarjeta */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectGuide(zone.guideId)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-800 hover:underline cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Guía rápida del equipo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onFilterByZone(zone.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-cyan-50 text-slate-800 hover:text-cyan-900 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-700" />
                    <span>Ver actividades</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
