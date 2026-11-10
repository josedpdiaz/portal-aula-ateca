import React from 'react';
import { Calendar, ArrowRight, BookOpen, Wrench, Award, ShieldCheck, Video, Box, Glasses, Monitor, ExternalLink } from 'lucide-react';
import { BOOKING_URL, LAST_UPDATED } from '../config';

interface HeroProps {
  onNavigate: (page: string) => void;
  onSelectZone: (zoneId: string) => void;
  onSelectGuide: (guideId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onSelectZone, onSelectGuide }) => {
  const quickZones = [
    {
      id: 'zona-audiovisual',
      guideId: 'guia-audiovisual',
      title: 'Multimedia y Croma',
      subtitle: 'Croma verde, Canon R50, cámara PTZ, focos LED y microfonía podcast',
      image: './zona-multimedia.jpg',
      icon: Video,
    },
    {
      id: 'zona-3d',
      guideId: 'guia-impresora3d',
      title: 'Fabricación 3D y Escáner',
      subtitle: 'Bambu Lab X1 Carbon Combo (AMS multicolor), escáner 3D Revopoint y láser',
      image: './zona-3d.jpg',
      icon: Box,
    },
    {
      id: 'zona-vr',
      guideId: 'guia-vr',
      title: 'Realidad Virtual (VR)',
      subtitle: '6 visores Meta Quest 3 / 3S, simuladores Bakata PRL y emergencias',
      image: './zona-vr.jpg',
      icon: Glasses,
    },
    {
      id: 'zona-simulacion',
      guideId: 'guia-pantalla',
      title: 'Simulación y Pizarra 75"',
      subtitle: 'ViewSonic 75" 4K, 2 PC Ultra 9 RTX, monitores 31.5" y ERP FacturaScripts',
      image: './hero-ateca.jpg',
      icon: Monitor,
    },
  ];

  return (
    <div className="space-y-8 py-6 sm:py-8">
      {/* Bloque Principal Compacto con Imagen del Aula */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-lg border border-slate-800 grid lg:grid-cols-12">
          
          {/* Columna Izquierda: Mensaje directo y acciones */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-semibold">
                <span className="text-cyan-300 font-bold">IES Agustín de Betancourt</span>
                <span>·</span>
                <span>Puerto de la Cruz (Aula 19)</span>
                <span>·</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white">
                  Actualizado: {LAST_UPDATED}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                Espacio de Tecnología Aplicada para Formación Profesional
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Catálogo de actividades de <strong>55 minutos</strong> listas para llevar al aula, recetas de puesta en marcha en <strong>5 pasos</strong> con código QR y acceso directo a la reserva del <strong>Aula 19</strong>.
              </p>
            </div>

            {/* Botones de acción principales */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('actividades')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm shadow-sm transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorar 38 Actividades</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('guias')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-colors cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-cyan-300" />
                <span>Guías de Equipos (5 pasos)</span>
              </button>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-sm transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar Aula</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Resumen compacto de cifras reales */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="block text-lg sm:text-xl font-extrabold text-cyan-300">38 fichas</span>
                <span className="text-slate-400">CSAF (1.º y 2.º) y CSCI (1.º)</span>
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-extrabold text-cyan-300">8 guías QR</span>
                <span className="text-slate-400">Receta en 5 pasos + vídeo</span>
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-extrabold text-cyan-300">4 zonas</span>
                <span className="text-slate-400">Croma, 3D, VR y Simulación</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Fotografía panorámica del aula */}
          <div className="lg:col-span-5 relative min-h-[240px] sm:min-h-[300px] bg-slate-800">
            <img
              src="./hero-ateca.jpg"
              alt="Vista panorámica del equipamiento del Aula ATECA: croma, impresora 3D, gafas VR y pantalla interactiva"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent flex items-end p-4 sm:p-5">
              <div className="bg-slate-900/90 backdrop-blur-xs border border-white/15 rounded-2xl p-3 flex items-center gap-3 w-full">
                <img
                  src="./PLACA.png"
                  alt="Placa oficial Aula ATECA NextGenerationEU"
                  className="w-16 sm:w-20 h-auto rounded bg-white p-0.5 shrink-0"
                />
                <div className="text-xs text-slate-200 min-w-0">
                  <p className="font-bold text-white truncate">Conversión de Aulas en Espacios de Tecnología Aplicada</p>
                  <p className="text-[11px] text-slate-300 truncate">Ministerio de Educación · NextGenerationEU · PRTR</p>
                  <button
                    type="button"
                    onClick={() => onNavigate('institucional')}
                    className="text-[11px] font-bold text-cyan-300 hover:underline mt-0.5 inline-flex items-center gap-1 cursor-pointer"
                  >
                    Ver placa y financiación <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Mapa Visual del Sitio: 4 Zonas con Imagen + Accesos Rápidos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Las 4 zonas tecnológicas de un vistazo
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Elige una zona para filtrar sus actividades didácticas o abrir la guía rápida de sus equipos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('zonas')}
            className="text-xs font-bold text-cyan-800 hover:text-cyan-950 inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            Ver inventario completo de las 4 zonas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickZones.map((z) => {
            const Icon = z.icon;
            return (
              <div
                key={z.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-cyan-500 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 overflow-hidden bg-slate-100">
                    <img
                      src={z.image}
                      alt={z.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/85 text-white text-xs font-bold backdrop-blur-xs">
                      <Icon className="w-3.5 h-3.5 text-cyan-300" />
                      {z.title}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {z.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => onSelectZone(z.id)}
                    className="text-cyan-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    Actividades <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectGuide(z.guideId)}
                    className="text-slate-700 hover:text-slate-950 cursor-pointer"
                  >
                    Guía 5 pasos
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Índice rápido de las secciones del portal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-100 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Banco de Casos de Uso</h3>
              <p className="text-slate-600">Filtra por ciclo (`CSAF` / `CSCI`), curso y siglas oficiales (`PNG`, `CYA`, `OFA`, `COB`, `GII`…) o aporta el tuyo.</p>
              <button type="button" onClick={() => onNavigate('actividades')} className="font-bold text-cyan-800 hover:underline inline-flex items-center gap-1 cursor-pointer">
                Ir a Actividades <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Experiencias del Claustro</h3>
              <p className="text-slate-600">Espacio para registrar las sesiones reales impartidas en el Aula 19 y compartir recomendaciones entre docentes.</p>
              <button type="button" onClick={() => onNavigate('experiencias')} className="font-bold text-cyan-800 hover:underline inline-flex items-center gap-1 cursor-pointer">
                Ir a Experiencias <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Reservas y Marco PRTR</h3>
              <p className="text-slate-600">Normas de uso del espacio, enlace a `ateca.fpapps.es` y publicidad preceptiva NextGenerationEU.</p>
              <button type="button" onClick={() => onNavigate('institucional')} className="font-bold text-cyan-800 hover:underline inline-flex items-center gap-1 cursor-pointer">
                Ver Financiación y Normas <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
