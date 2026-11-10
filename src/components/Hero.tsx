import React, { useState } from 'react';
import {
  Calendar, ArrowRight, BookOpen, Wrench, Video, Box, Glasses, Monitor,
  ExternalLink, Minimize2, Maximize2,
} from 'lucide-react';
import { BOOKING_URL, LAST_UPDATED, APP_VERSION } from '../config';
import { StepGuideBanner, WindowBox } from './UiHelpers';

interface HeroProps {
  onNavigate: (page: string) => void;
  onSelectZone: (zoneId: string) => void;
  onSelectGuide: (guideId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onSelectZone, onSelectGuide }) => {
  const [allMinimized, setAllMinimized] = useState(false);

  const quickZones = [
    {
      id: 'zona-audiovisual',
      guideId: 'guia-audiovisual',
      title: 'Multimedia y Croma',
      subtitle: 'Cámara, iluminación, croma y microfonía para grabación y podcast',
      image: './zona-multimedia.jpg',
      icon: Video,
    },
    {
      id: 'zona-3d',
      guideId: 'guia-impresora3d',
      title: 'Fabricación 3D y Escáner',
      subtitle: 'Impresora 3D, escáner 3D y grabadora láser para prototipado',
      image: './zona-3d.jpg',
      icon: Box,
    },
    {
      id: 'zona-vr',
      guideId: 'guia-vr',
      title: 'Realidad Virtual (VR)',
      subtitle: 'Gafas de realidad virtual y simulaciones inmersivas',
      image: './zona-vr.jpg',
      icon: Glasses,
    },
    {
      id: 'zona-simulacion',
      guideId: 'guia-pantalla',
      title: 'Simulación y Pantalla',
      subtitle: 'Pantalla interactiva, puestos PC y software de gestión empresarial',
      image: './hero-ateca.jpg',
      icon: Monitor,
    },
  ];

  return (
    <div className="space-y-5 py-5 sm:py-7 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Paso a paso general del portal */}
      <StepGuideBanner
        title="Cómo empezar en el Portal del Aula ATECA (Paso a paso)"
        rightAction={
          <button
            type="button"
            onClick={() => setAllMinimized(m => !m)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 text-xs font-bold text-cyan-900 dark:text-cyan-300"
          >
            {allMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            {allMinimized ? 'Expandir todo' : 'Minimizar todo'}
          </button>
        }
        steps={[
          { label: 'Paso 1: Elige tu actividad o equipo', desc: 'Entra en «Actividades» (38 fichas) o «Guías» (8 recetas en 5 pasos).' },
          { label: 'Paso 2: Identifícate como docente', desc: 'Pulsa «Acceso Docente» arriba con tu correo, nombre y departamento.' },
          { label: 'Paso 3: Reserva o aporta cambios', desc: 'Reserva el Aula 19 o edita actividades, guías y experiencias.' },
        ]}
      />

      {/* Bloque Principal (Minimizable y Maximizable) */}
      <WindowBox
        forceMinimized={allMinimized}
        badge={
          <span className="text-[11px] font-bold text-cyan-800 dark:text-cyan-400 uppercase tracking-wider">
            IES Agustín de Betancourt · Aula 19 · {APP_VERSION} ({LAST_UPDATED})
          </span>
        }
        title="Espacio de Tecnología Aplicada para Formación Profesional"
        subtitle="Actividades de 55 min, guías rápidas con QR y reserva directa"
      >
        <div className="bg-slate-900 text-white rounded-2xl overflow-hidden grid lg:grid-cols-12 mt-1">
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Selecciona una sección para preparar tu sesión de clase o utiliza los botones superiores
              para ajustar el <strong>tamaño de letra (A- / A+)</strong>, alternar entre <strong>modo claro / oscuro</strong>
              e identificarte como docente.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('actividades')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs sm:text-sm cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>38 Actividades</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('guias')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-cyan-300" />
                <span>8 Guías Rápidas</span>
              </button>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar Aula</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-xs">
              <div>
                <span className="block text-base sm:text-lg font-extrabold text-cyan-300">38 fichas</span>
                <span className="text-slate-400">CSAF, CSCI y CFGM</span>
              </div>
              <div>
                <span className="block text-base sm:text-lg font-extrabold text-cyan-300">8 guías QR</span>
                <span className="text-slate-400">5 pasos + vídeo</span>
              </div>
              <div>
                <span className="block text-base sm:text-lg font-extrabold text-cyan-300">4 zonas</span>
                <span className="text-slate-400">Croma, 3D, VR y PC</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[200px] sm:min-h-[240px] bg-slate-800">
            <img
              src="./hero-ateca.jpg"
              alt="Equipamiento del Aula ATECA"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent flex items-end p-3.5">
              <div className="bg-slate-900/90 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 flex items-center gap-2.5 w-full">
                <img
                  src="./PLACA.png"
                  alt="Placa oficial Aula ATECA NextGenerationEU"
                  className="w-14 h-auto rounded bg-white p-0.5 shrink-0"
                />
                <div className="text-[11px] text-slate-200 min-w-0">
                  <p className="font-bold text-white truncate">Espacios de Tecnología Aplicada</p>
                  <button
                    type="button"
                    onClick={() => onNavigate('institucional')}
                    className="font-bold text-cyan-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    Ver financiación PRTR <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WindowBox>

      {/* Las 4 zonas en cuadraditos individuales minimizables/maximizables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {quickZones.map((z) => {
          const Icon = z.icon;
          return (
            <WindowBox
              key={z.id}
              forceMinimized={allMinimized}
              badge={
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-800 dark:text-cyan-300">
                  <Icon className="w-3.5 h-3.5" /> Zona Aula 19
                </span>
              }
              title={z.title}
              subtitle={z.subtitle}
            >
              <div className="space-y-2.5">
                <div className="h-28 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={z.image}
                    alt={z.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between pt-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => onSelectZone(z.id)}
                    className="text-cyan-800 dark:text-cyan-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    Actividades <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectGuide(z.guideId)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white cursor-pointer"
                  >
                    Guía 5 pasos
                  </button>
                </div>
              </div>
            </WindowBox>
          );
        })}
      </div>

    </div>
  );
};
