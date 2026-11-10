import React from 'react';
import { Calendar, ExternalLink, ShieldCheck, Users, Lock, Info } from 'lucide-react';

export const BookingSection: React.FC = () => {
  return (
    <section id="reservas" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Box */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-blue-900/60 overflow-hidden relative">
          
          {/* Background Ambient Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-6 relative z-10">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Sección F • Sistema Oficial de Reservas</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Reserva y Gestión de Espacios en el Aula ATECA
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              El IES Agustín de Betancourt cuenta con un aplicativo web oficial en producción para la gestión de turnos del Aula 19. El sistema garantiza la reserva equitativa y la disponibilidad del equipamiento tecnológico para todo el profesorado de Formación Profesional.
            </p>

            {/* Direct CTA Button */}
            <div className="pt-2">
              <a
                href="https://ateca.fpapps.es"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-cyan-500/25 transition-all group"
              >
                <Calendar className="w-5 h-5 text-slate-900" />
                <span>Acceder al Sistema de Reservas (ateca.fpapps.es)</span>
                <ExternalLink className="w-4 h-4 text-slate-900 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <span className="block text-xs text-slate-400 mt-2">
                * Acceso autenticado mediante cuenta corporativa del Gobierno de Canarias (<code className="text-cyan-300">@gobiernodecanarias.org</code>).
              </span>
            </div>

            {/* Governance Recommendations Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Users className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">Aforo Recomendado</span>
                </div>
                <p className="text-xs text-slate-300">
                  Hasta <strong>10 personas por sesión</strong> (alumnado + docente) para asegurar la ratio práctica en visores VR, croma y estaciones 3D.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Lock className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">Bloqueo Exclusivo</span>
                </div>
                <p className="text-xs text-slate-300">
                  La reserva autorizada inhabilita el aula para otros grupos durante esa franja horaria, garantizando trabajo sin interferencias acústicas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">Coordinación por Zonas</span>
                </div>
                <p className="text-xs text-slate-300">
                  Supervisión técnica coordinada por los responsables de área del departamento para incidencias o material fungible.
                </p>
              </div>

            </div>

            <div className="p-3.5 rounded-xl bg-blue-900/40 border border-blue-800/60 flex items-start space-x-2.5 text-xs text-slate-300">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Nota organizativa:</strong> Las pautas de aforo y exclusividad son criterios metodológicos recomendados por el Departamento de Administración y Comercio para preservar la calidad del aprendizaje activo, sujetos siempre a las directrices de Jefatura de Estudios y Dirección del centro.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
