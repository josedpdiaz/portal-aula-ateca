import React, { useState } from 'react';
import { Calendar, Menu, X, ExternalLink, Sparkles, BookOpen, Layers, Award } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Inicio', icon: Sparkles },
    { id: 'zonas', label: 'Conoce el Aula', icon: Layers },
    { id: 'actividades', label: 'Actividades Didácticas', icon: BookOpen, badge: 'Prioritario' },
    { id: 'guias', label: 'Guías de Equipos', icon: Award, badge: '5 Min' },
    { id: 'experiencias', label: 'Experiencias', icon: Sparkles },
    { id: 'institucional', label: 'Marco Institucional', icon: Award }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Centro Info */}
          <div className="flex items-center space-x-3 sm:space-x-4 cursor-pointer" onClick={() => handleNavClick('inicio')}>
            <img 
              src="./Logo.png" 
              alt="Logotipo ATECA Aulas de Tecnología Aplicada" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <div className="h-8 w-px bg-slate-300 hidden sm:block"></div>
            <div className="flex items-center space-x-2">
              <img 
                src="./logo-iesb.webp" 
                alt="IES Agustín de Betancourt" 
                className="h-9 sm:h-10 w-auto object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div className="text-left">
                <span className="block text-xs font-semibold text-sky-800 tracking-wider uppercase">
                  IES Agustín de Betancourt
                </span>
                <span className="block text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Aula ATECA <span className="text-cyan-600 font-normal text-xs sm:text-sm">(Aula 19)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2" aria-label="Navegación principal">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative flex items-center space-x-1.5 ${
                    isActive 
                      ? 'text-cyan-700 bg-cyan-50 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Button: Reservar */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href="https://ateca.fpapps.es"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all group"
              title="Abrir sistema de reservas oficial en https://ateca.fpapps.es"
            >
              <Calendar className="w-4 h-4 text-cyan-100 group-hover:scale-110 transition-transform" />
              <span>Reservar Aula</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <a
              href="https://ateca.fpapps.es"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold sm:hidden"
            >
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>Reservar</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeSection === link.id
                  ? 'bg-cyan-50 text-cyan-800 font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-2">
                <link.icon className="w-4 h-4 text-cyan-600" />
                <span>{link.label}</span>
              </span>
              {link.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100">
            <a
              href="https://ateca.fpapps.es"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-cyan-600 text-white font-semibold text-sm shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Acceder al Sistema de Reservas (ateca.fpapps.es)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
