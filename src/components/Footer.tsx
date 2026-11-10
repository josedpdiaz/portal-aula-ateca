import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Upper Footer: Logos and Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Center Identity & ATECA */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="./Logo.png" 
                alt="Logo ATECA" 
                className="h-10 w-auto object-contain bg-white/10 p-1 rounded-lg"
              />
              <img 
                src="./logo-iesb.webp" 
                alt="IES Agustín de Betancourt" 
                className="h-10 w-auto object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>

            <div>
              <h4 className="text-white font-bold text-sm">IES Agustín de Betancourt</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Código de Centro: 38003963 • Puerto de la Cruz, Santa Cruz de Tenerife, Canarias
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Aula 19 • Espacio de Tecnología Aplicada (ATECA)
              </p>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Laboratorio de innovación tecnológica para la Formación Profesional de las familias de Administración y Gestión y Comercio Internacional.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Secciones del Portal
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('inicio')} className="hover:text-cyan-400 transition-colors">
                  Inicio y Presentación
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('zonas')} className="hover:text-cyan-400 transition-colors">
                  Conoce el Aula (4 Zonas)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('actividades')} className="hover:text-cyan-400 transition-colors text-cyan-300 font-semibold">
                  Catálogo de Actividades Didácticas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guias')} className="hover:text-cyan-400 transition-colors">
                  Guías de Puesta en Marcha (5 min)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('experiencias')} className="hover:text-cyan-400 transition-colors">
                  Experiencias Docentes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('institucional')} className="hover:text-cyan-400 transition-colors">
                  Marco Institucional y Financiación
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: External Systems & Reservas */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Sistemas y Recursos Conectados
            </h5>
            <div className="space-y-2">
              <a
                href="https://ateca.fpapps.es"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-xs text-white">Sistema de Reservas Oficial</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>

              <a
                href="https://ateca-forma-vr1.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span className="font-semibold text-xs text-white">Manuales de Realidad Virtual</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              Coordinación ATECA: <span className="text-slate-400 font-mono">jpacdia@gobiernodecanarias.org</span>
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Legal Strip */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <div className="flex items-center space-x-4">
            <img 
              src="./images.png" 
              alt="Ministerio de Educación" 
              className="h-7 w-auto object-contain bg-white/10 p-0.5 rounded"
            />
            <img 
              src="./ES_Financiado_por_la_Unión_Europea_RGB_MONOCHROME.png" 
              alt="Financiado por la UE NextGenEU" 
              className="h-6 w-auto object-contain"
            />
          </div>

          <p className="text-[11px] text-slate-500 max-w-2xl">
            Actuación financiada por el Ministerio de Educación, Formación Profesional y Deportes y la Unión Europea-NextGenerationEU en el marco del Plan de Recuperación, Transformación y Resiliencia (PRTR).
          </p>

          <div className="text-[11px] text-slate-400 text-center md:text-right space-y-0.5">
            <p className="font-semibold text-slate-300">Versión v1.2.0 · Actualizado: 10 de noviembre de 2026</p>
            <p className="text-slate-500">© {new Date().getFullYear()} IES Agustín de Betancourt.</p>
          </div>

        </div>
      </div>

    </footer>
  );
};
