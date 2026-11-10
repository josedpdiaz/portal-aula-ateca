import React, { useEffect, useState } from 'react';
import {
  Calendar, Menu, X, ExternalLink, Home, Layers, BookOpen, Wrench,
  Award, ShieldCheck, Sun, Moon, Lock, UserCheck,
} from 'lucide-react';
import { BOOKING_URL, LAST_UPDATED, APP_VERSION } from '../config';
import { useTeacherSession } from '../lib/community';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const FONT_SCALES = [90, 100, 112, 125];

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { session, requestAuth } = useTeacherSession();

  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ateca_theme') === 'dark';
    } catch {
      return false;
    }
  });

  const [fontScale, setFontScale] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem('ateca_font_scale'));
      return FONT_SCALES.includes(saved) ? saved : 100;
    } catch {
      return 100;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem('ateca_theme', dark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [dark]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    try {
      localStorage.setItem('ateca_font_scale', String(fontScale));
    } catch {
      // ignore
    }
  }, [fontScale]);

  const changeFont = (dir: -1 | 0 | 1) => {
    if (dir === 0) {
      setFontScale(100);
      return;
    }
    const idx = FONT_SCALES.indexOf(fontScale);
    const nextIdx = Math.min(FONT_SCALES.length - 1, Math.max(0, (idx === -1 ? 1 : idx) + dir));
    setFontScale(FONT_SCALES[nextIdx]);
  };

  const navLinks = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'actividades', label: 'Actividades', icon: BookOpen, badge: '38' },
    { id: 'guias', label: 'Guías', icon: Wrench, badge: '8' },
    { id: 'zonas', label: '4 Zonas', icon: Layers },
    { id: 'experiencias', label: 'Experiencias', icon: Award },
    { id: 'institucional', label: 'Marco', icon: ShieldCheck },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">

          {/* Identidad del Centro y Aula ATECA */}
          <button
            type="button"
            onClick={() => handleNavClick('inicio')}
            className="flex items-center gap-2 text-left focus:outline-none group shrink-0"
          >
            <img
              src="./Logo.png"
              alt="Logotipo ATECA"
              className="h-8 sm:h-9 w-auto object-contain bg-white rounded-md p-0.5"
            />
            <img
              src="./logo-iesb.webp"
              alt="IES Agustín de Betancourt"
              className="h-7 sm:h-8 w-auto object-contain hidden sm:block bg-white rounded-md p-0.5"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-cyan-800 dark:text-cyan-400 uppercase tracking-wider">
                  IES Agustín de Betancourt
                </span>
                <span className="hidden 2xl:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {APP_VERSION} · {LAST_UPDATED}
                </span>
              </div>
              <span className="block text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-cyan-700 transition-colors">
                Aula ATECA <span className="text-slate-500 dark:text-slate-400 font-semibold text-xs">· Aula 19</span>
              </span>
            </div>
          </button>

          {/* Pestañas de páginas (Escritorio) */}
          <nav className="hidden xl:flex items-center bg-slate-100/90 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700" aria-label="Páginas del portal">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-cyan-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-200/90 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Herramientas: Tamaño letra, Tema Claro/Oscuro, Acceso Docente y Reservar */}
          <div className="flex items-center gap-1.5">
            {/* Control de tamaño de letra A- / A / A+ */}
            <div
              className="hidden sm:flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5"
              title="Disminuir, restablecer o aumentar tamaño de letra"
            >
              <button
                type="button"
                onClick={() => changeFont(-1)}
                disabled={fontScale <= FONT_SCALES[0]}
                aria-label="Disminuir tamaño de letra"
                className="px-2 py-1 rounded-lg text-[11px] font-extrabold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => changeFont(0)}
                aria-label="Tamaño de letra normal"
                className="px-1.5 py-1 rounded-lg text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
              >
                {fontScale}%
              </button>
              <button
                type="button"
                onClick={() => changeFont(1)}
                disabled={fontScale >= FONT_SCALES[FONT_SCALES.length - 1]}
                aria-label="Aumentar tamaño de letra"
                className="px-2 py-1 rounded-lg text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40"
              >
                A+
              </button>
            </div>

            {/* Botón Modo Claro / Oscuro */}
            <button
              type="button"
              onClick={() => setDark(d => !d)}
              title={dark ? 'Cambiar a versión clara' : 'Cambiar a versión oscura'}
              aria-label={dark ? 'Cambiar a versión clara' : 'Cambiar a versión oscura'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Botón de Autenticación Docente */}
            <button
              type="button"
              onClick={() => requestAuth()}
              title={
                session
                  ? `Docente identificado: ${session.name} (${session.department} · ${session.email})`
                  : 'Identificarse como docente autorizado para crear o editar actividades, guías y experiencias'
              }
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-extrabold border transition-colors ${
                session
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                  : 'bg-slate-900 dark:bg-slate-800 border-slate-800 dark:border-slate-600 text-white hover:bg-slate-800'
              }`}
            >
              {session ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="max-w-[110px] truncate hidden md:inline">{session.name}</span>
                  <span className="md:hidden">Docente</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                  <span className="hidden sm:inline">Acceso Docente</span>
                </>
              )}
            </button>

            {/* Botón directo Reservar */}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-2xs transition-colors"
              title="Abrir sistema oficial de reservas en https://ateca.fpapps.es"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reservar</span>
              <ExternalLink className="w-3 h-3 opacity-75 hidden md:inline" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Barra rápida de pestañas en móvil/tablet */}
      <nav
        aria-label="Navegación rápida"
        className="xl:hidden flex items-center gap-1 overflow-x-auto px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 no-scrollbar"
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
                  ? 'bg-slate-900 dark:bg-cyan-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300 dark:text-white' : 'text-slate-500'}`} />
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Menú desplegable móvil con controles de accesibilidad */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-2 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">{APP_VERSION} · Actualizado: {LAST_UPDATED}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeFont(-1)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-extrabold"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => changeFont(0)}
                className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-semibold"
              >
                {fontScale}%
              </button>
              <button
                type="button"
                onClick={() => changeFont(1)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-extrabold"
              >
                A+
              </button>
            </div>
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
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
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
