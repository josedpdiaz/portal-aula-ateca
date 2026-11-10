import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { APP_VERSION, BOOKING_URL, LAST_UPDATED } from '../config';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Identidad del centro */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src="./Logo.png"
                alt="Logo ATECA"
                className="h-9 w-auto object-contain bg-white p-1 rounded-lg"
              />
              <img
                src="./logo-iesb.webp"
                alt="IES Agustín de Betancourt"
                className="h-9 w-auto object-contain bg-white p-1 rounded-lg"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">IES Agustín de Betancourt</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Código de Centro: 38003963 · Puerto de la Cruz, Tenerife
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                Aula 19 · Espacio de Tecnología Aplicada (ATECA)
              </p>
            </div>
          </div>

          {/* Navegación */}
          <div className="md:col-span-4 space-y-2">
            <h5 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Páginas del Portal
            </h5>
            <div className="grid grid-cols-2 gap-1.5">
              <button onClick={() => onNavigate('inicio')} className="text-left hover:text-cyan-400">Inicio</button>
              <button onClick={() => onNavigate('actividades')} className="text-left hover:text-cyan-400 text-cyan-300 font-semibold">Actividades (38)</button>
              <button onClick={() => onNavigate('guias')} className="text-left hover:text-cyan-400">Guías Rápidas (8)</button>
              <button onClick={() => onNavigate('zonas')} className="text-left hover:text-cyan-400">4 Zonas</button>
              <button onClick={() => onNavigate('experiencias')} className="text-left hover:text-cyan-400">Experiencias</button>
              <button onClick={() => onNavigate('institucional')} className="text-left hover:text-cyan-400">Marco PRTR</button>
            </div>
          </div>

          {/* Reserva directa */}
          <div className="md:col-span-3 space-y-2">
            <h5 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Reserva del Aula 19
            </h5>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
            >
              <span className="flex items-center gap-2 font-semibold text-xs">
                <Calendar className="w-4 h-4 text-amber-400" />
                ateca.fpapps.es
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

        </div>
      </div>

      {/* Franja institucional inferior */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center space-x-3">
            <img
              src="./images.png"
              alt="Ministerio de Educación, Formación Profesional y Deportes"
              className="h-7 w-auto object-contain bg-white p-0.5 rounded"
            />
            <img
              src="./ES_Financiado_por_la_Unión_Europea_RGB_MONOCHROME.png"
              alt="Financiado por la Unión Europea - NextGenerationEU"
              className="h-6 w-auto object-contain bg-white p-0.5 rounded"
            />
          </div>

          <p className="text-[11px] text-slate-400 max-w-xl">
            Financiado por el Ministerio de Educación, Formación Profesional y Deportes y la Unión Europea-NextGenerationEU (PRTR).
          </p>

          <div className="text-[11px] text-slate-300 font-semibold">
            {APP_VERSION} · Actualizado: {LAST_UPDATED}
          </div>
        </div>
      </div>
    </footer>
  );
};
