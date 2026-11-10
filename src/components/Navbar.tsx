import React, { useState } from 'react';
import { Calendar, Menu, X, ExternalLink, Home, Layers, BookOpen, Wrench, Award, ShieldCheck } from 'lucide-react';
import { BOOKING_URL, LAST_UPDATED, APP_VERSION } from '../config';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'actividades', label: 'Actividades FP', icon: BookOpen, badge: '38' },
    { id: 'guias', label: 'Guías Rápidas', icon: Wrench, badge: '8' },
    { id: 'zonas', label: '4 Zonas', icon: Layers },
    { id: 'experiencias', label: 'Experiencias', icon: Award },
    { id: 'institucional', label: 'Financiación', icon: ShieldCheck }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Identidad del Centro y Aula ATECA */}
          <button
            type="button"
            onClick={() => handleNavClick('inicio')}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <img
              src="./Logo.png"
              alt="Logotipo ATECA Aulas de Tecnología Aplicada"
              className="h-9 sm:h-10 w-auto object-contain"
            />
            <div className="h-7 w-px bg-slate-200 hidden sm:block" />
            <img
              src="./logo-iesb.webp"
              alt="IES Agustín de Betancourt"
              className="h-8 sm:h-9 w-auto object-contain hidden xs:block"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider">
                  IES Agustín de Betancourt
                </span>
                <span className="hidden xl:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {APP_VERSION} · Actualizado: {LAST_UPDATED}
                </span>
              </div>
              <span className="block text-sm font-extrabold text-slate-900 leading-tight group-hover:text-cyan-700 transition-colors">
                Aula ATECA <span className="text-slate-500 font-semibold text-xs">· Aula 19</span>
              </span>
            </div>
          </button>

          {/* Pestañas de páginas (Escritorio) */}
          <nav className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80" aria-label="Páginas del portal">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-200/90 text-slate-700'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Botón directo Reservar */}
          <div className="flex items-center gap-2">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-2xs transition-colors"
              title="Abrir sistema oficial de reservas en https://ateca.fpapps.es"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar</span>
              <ExternalLink className="w-3 h-3 opacity-75 hidden sm:inline" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
              aria-label="Abrir menú de páginas"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Barra rápida de pestañas en móvil/tablet para cambiar de página con un toque */}
      <nav
        aria-label="Navegación rápida móvil"
        className="lg:hidden flex items-center gap-1 overflow-x-auto px-3 py-1.5 bg-slate-50 border-t border-slate-200/80 no-scrollbar"
      >
        {navLinks.map((link) => {
          const isActive = activeSection === link.id;
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200/90'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Menú desplegable móvil completo */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1.5 shadow-xl">
          <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Secciones del portal</span>
            <span className="font-semibold text-slate-700">Actualizado: {LAST_UPDATED}</span>
          </div>
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-cyan-700'}`} />
                  <span>{link.label}</span>
                </span>
                {link.badge && (
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
