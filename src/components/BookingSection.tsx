import React from 'react';
import { Calendar, ExternalLink, ShieldCheck, Users, Lock } from 'lucide-react';
import { StepGuideBanner, WindowBox } from './UiHelpers';

export const BookingSection: React.FC = () => {
  return (
    <section id="reservas" className="pt-6 pb-2 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        <StepGuideBanner
          title="Cómo reservar el Aula 19 y consultar el Marco Institucional (Paso a paso)"
          steps={[
            { label: 'Paso 1: Abre el calendario', desc: 'Pulsa «Abrir ateca.fpapps.es» para ver los turnos.' },
            { label: 'Paso 2: Elige día y hora', desc: 'Inicia sesión con tu correo @gobiernodecanarias.org y reserva turno.' },
            { label: 'Paso 3: Revisa normas y placas', desc: 'Más abajo tienes los criterios de uso y la publicidad oficial PRTR.' },
          ]}
        />

        <WindowBox
          badge={
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-800 dark:text-cyan-300 uppercase">
              <Calendar className="w-3.5 h-3.5" /> Sistema Oficial de Reservas
            </span>
          }
          title="Reserva de turnos del Aula ATECA (Aula 19)"
          subtitle="Acceso con cuenta corporativa @gobiernodecanarias.org"
        >
          <div className="space-y-4 text-xs sm:text-sm pt-1">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 text-white">
              <div>
                <p className="font-bold text-sm sm:text-base">Calendario de reservas en producción</p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Consulta disponibilidad y reserva tu franja horaria antes de acudir al Aula 19.
                </p>
              </div>
              <a
                href="https://ateca.fpapps.es"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shrink-0"
              >
                <Calendar className="w-4 h-4" />
                <span>Abrir ateca.fpapps.es</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs mb-1">
                  <Users className="w-4 h-4 text-cyan-700" /> Organización por estaciones
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Organiza el grupo por equipos rotatorios para trabajar simultáneamente en las distintas zonas.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs mb-1">
                  <Lock className="w-4 h-4 text-cyan-700" /> Reserva previa
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  La reserva previa evita coincidencias de horario y facilita las grabaciones de audio y vídeo.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs mb-1">
                  <ShieldCheck className="w-4 h-4 text-cyan-700" /> Cuidado del material
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Al finalizar la sesión, deja los equipos apagados y recogidos según indica su guía rápida.
                </p>
              </div>
            </div>
          </div>
        </WindowBox>

      </div>
    </section>
  );
};
