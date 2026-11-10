import React from 'react';
import { Zone } from '../types';
import { Video, Box, Glasses, LayoutDashboard, ArrowRight, BookOpen, Cpu, CheckCircle2 } from 'lucide-react';

interface ZoneCardsProps {
  zones: Zone[];
  onSelectGuide: (guideId: string) => void;
  onFilterByZone: (zoneId: string) => void;
}

export const ZoneCards: React.FC<ZoneCardsProps> = ({
  zones,
  onSelectGuide,
  onFilterByZone
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="w-6 h-6 text-cyan-600" />;
      case 'Box':
        return <Box className="w-6 h-6 text-amber-600" />;
      case 'Glasses':
        return <Glasses className="w-6 h-6 text-blue-600" />;
      case 'LayoutDashboard':
      default:
        return <LayoutDashboard className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <section id="zonas" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
            <span>Sección B • Espacios y Recursos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Conoce las 4 Zonas del Aula ATECA
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            El Aula 19 cuenta con una superficie de 89 m² distribuida de forma modular en cuatro estaciones de alta tecnología diseñadas para simular el tejido productivo y fomentar el aprendizaje activo.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-cyan-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 sm:p-7 space-y-5">
                
                {/* Header: Icon, Badge, Name */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200/80">
                      {getIcon(zone.icon)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-700 block">
                        {zone.badge}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                        {zone.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-medium italic border-l-2 border-cyan-500 pl-3">
                  "{zone.tagline}"
                </p>

                {/* Didactic Utility */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Utilidad Didáctica en FP
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {zone.didacticUtility}
                  </p>
                </div>

                {/* Equipment List */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-slate-500" />
                    <span>Equipamiento Real Instalado</span>
                  </h4>
                  <ul className="grid grid-cols-1 gap-1.5 text-xs text-slate-700">
                    {zone.equipmentList.slice(0, 4).map((eq, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                        <span>{eq}</span>
                      </li>
                    ))}
                    {zone.equipmentList.length > 4 && (
                      <li className="text-[11px] text-slate-500 italic pl-5">
                        + {zone.equipmentList.length - 4} recursos complementarios disponibles en el aula.
                      </li>
                    )}
                  </ul>
                </div>

                {/* Practical Examples */}
                <div className="space-y-2 pt-1 border-t border-slate-200/70">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Ejemplos de Aplicación
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {zone.examples.slice(0, 2).map((ex, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                        <span className="line-clamp-2">{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="px-6 py-4 bg-white border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => onSelectGuide(zone.guideId)}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-cyan-700 hover:text-cyan-900 hover:underline"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Ver Guía de Utilización</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>

                <button
                  onClick={() => onFilterByZone(zone.id)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 text-xs font-medium border border-slate-200/70 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ver Actividades Didácticas</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
