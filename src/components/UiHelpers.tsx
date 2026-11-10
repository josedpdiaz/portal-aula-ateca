import React, { useEffect, useState } from 'react';
import {
  X, Minimize2, Maximize2, ChevronDown, ChevronUp, Lock, CheckCircle2,
  AlertCircle, Eye, EyeOff, HelpCircle, UserCheck, ShieldCheck,
} from 'lucide-react';
import { DEPARTMENTS } from '../config';
import { useTeacherSession } from '../lib/community';

/**
 * Guía Paso a Paso en cada pantalla (plegable y maximizable)
 */
export const StepGuideBanner: React.FC<{
  title: string;
  steps: { label: string; desc: string }[];
  defaultOpen?: boolean;
  rightAction?: React.ReactNode;
}> = ({ title, steps, defaultOpen = true, rightAction }) => {
  const [minimized, setMinimized] = useState(!defaultOpen);
  const [maximized, setMaximized] = useState(false);

  return (
    <div
      className={`rounded-2xl border border-cyan-200 dark:border-cyan-800/70 bg-cyan-50/70 dark:bg-slate-800/90 transition-all mb-5 ${
        maximized ? 'fixed inset-4 z-50 overflow-y-auto p-6 shadow-2xl bg-white dark:bg-slate-900' : 'p-3.5 sm:p-4'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setMinimized(m => !m)}
          className="flex items-center gap-2 text-left font-bold text-cyan-950 dark:text-cyan-200 text-xs sm:text-sm"
        >
          <HelpCircle className="w-4 h-4 text-cyan-700 dark:text-cyan-400 shrink-0" />
          <span>{title}</span>
          <span className="text-[11px] font-medium text-cyan-700 dark:text-cyan-400 underline ml-1">
            {minimized ? '(Mostrar pasos)' : '(Ocultar)'}
          </span>
        </button>

        <div className="flex items-center gap-1.5 ml-auto">
          {rightAction}
          <button
            type="button"
            onClick={() => setMinimized(m => !m)}
            title={minimized ? 'Desplegar recuadro' : 'Minimizar recuadro'}
            className="p-1.5 rounded-lg hover:bg-cyan-100 dark:hover:bg-slate-700 text-cyan-900 dark:text-slate-200"
          >
            {minimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => { setMinimized(false); setMaximized(x => !x); }}
            title={maximized ? 'Restaurar tamaño' : 'Maximizar recuadro'}
            className="p-1.5 rounded-lg hover:bg-cyan-100 dark:hover:bg-slate-700 text-cyan-900 dark:text-slate-200"
          >
            {maximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!minimized && (
        <ol className="grid sm:grid-cols-3 gap-2.5 mt-3">
          {steps.map((s, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-cyan-100 dark:border-slate-700"
            >
              <span className="w-6 h-6 rounded-full bg-cyan-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{s.label}</p>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5 leading-snug">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

/**
 * Recuadro / Tarjeta con controles para Minimizar (—) y Maximizar (⤢)
 */
export const WindowBox: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  defaultMinimized?: boolean;
  forceMinimized?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, badge, actions, defaultMinimized = false, forceMinimized, className = '', children }) => {
  const [minimized, setMinimized] = useState(defaultMinimized);
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (typeof forceMinimized === 'boolean') {
      setMinimized(forceMinimized);
    }
  }, [forceMinimized]);

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all ${
        maximized
          ? 'fixed inset-3 sm:inset-6 z-50 overflow-y-auto shadow-2xl ring-2 ring-cyan-500 p-5 sm:p-7'
          : `shadow-sm hover:shadow-md ${className}`
      }`}
    >
      <div className={`flex items-start justify-between gap-2 ${maximized ? 'pb-4 border-b border-slate-200 dark:border-slate-700 mb-4' : 'p-4 pb-2'}`}>
        <div className="min-w-0 flex-1">
          {badge && <div className="mb-1.5">{badge}</div>}
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-snug">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {actions}
          <button
            type="button"
            onClick={() => setMinimized(m => !m)}
            title={minimized ? 'Desplegar recuadro' : 'Minimizar recuadro'}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {minimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => { setMinimized(false); setMaximized(x => !x); }}
            title={maximized ? 'Restaurar tamaño' : 'Maximizar a pantalla completa'}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {maximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!minimized && (
        <div className={maximized ? '' : 'px-4 pb-4 pt-1'}>
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Ventana Modal con botones de Minimizar (a barra inferior), Maximizar (pantalla completa) y Cerrar
 */
export const SmartModal: React.FC<{
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: React.ReactNode;
}> = ({ title, onClose, wide, children }) => {
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white rounded-2xl shadow-2xl border border-cyan-500/40 px-4 py-3 flex items-center gap-3 max-w-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="text-xs font-bold truncate">{title}</span>
        <button
          type="button"
          onClick={() => setMinimized(false)}
          title="Restaurar ventana"
          className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold"
        >
          Abrir
        </button>
        <button
          type="button"
          onClick={onClose}
          title="Cerrar ventana"
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full transition-all flex flex-col ${
          maximized
            ? 'fixed inset-2 sm:inset-4 max-w-none max-h-none h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)]'
            : `${wide ? 'max-w-4xl' : 'max-w-xl'} my-4 max-h-[92vh]`
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-slate-900 text-white px-4 sm:px-6 py-3.5 rounded-t-2xl flex items-center justify-between gap-3">
          <h3 className="text-sm sm:text-base font-extrabold leading-snug truncate">{title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setMinimized(true)}
              title="Minimizar ventana a la esquina inferior (para consultar la página sin perder los datos)"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white inline-flex items-center gap-1 text-xs"
            >
              <ChevronDown className="w-4 h-4" />
              <span className="hidden sm:inline">Minimizar</span>
            </button>
            <button
              type="button"
              onClick={() => setMaximized(x => !x)}
              title={maximized ? 'Tamaño normal' : 'Maximizar a pantalla completa'}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white inline-flex items-center gap-1 text-xs"
            >
              {maximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{maximized ? 'Restaurar' : 'Maximizar'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              title="Cerrar ventana"
              className="p-1.5 rounded-lg hover:bg-red-600/80 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Etiqueta de auditoría que muestra quién registró/editó un elemento (Nombre, Departamento y Correo)
 */
export const AuditBadge: React.FC<{
  author?: string;
  authorEmail?: string;
  department?: string;
  updatedAt?: string;
}> = ({ author, authorEmail, department, updatedAt }) => {
  if (!author && !authorEmail && !department) return null;
  return (
    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/70 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
      <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      <span>
        Registrado por: <strong className="text-slate-700 dark:text-slate-200">{author || 'Docente'}</strong>
        {department ? ` · ${department}` : ''}
        {authorEmail ? ` (${authorEmail})` : ''}
        {updatedAt ? ` · ${updatedAt}` : ''}
      </span>
    </div>
  );
};

/**
 * Modal centralizado de Autenticación Docente (Nombre, Departamento, Correo corporativo y Clave)
 */
export const TeacherAuthModal: React.FC = () => {
  const { session, login, logout } = useTeacherSession();
  const [open, setOpen] = useState(false);
  const [onSuccessCb, setOnSuccessCb] = useState<(() => void) | undefined>(undefined);

  const [email, setEmail] = useState(session?.email || '');
  const [name, setName] = useState(session?.name || '');
  const [department, setDepartment] = useState(session?.department || DEPARTMENTS[0]);
  const [pin, setPin] = useState(session?.pin || '');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [missingField, setMissingField] = useState<'email' | 'name' | 'pin' | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ onSuccess?: () => void }>;
      setEmail(session?.email || '');
      setName(session?.name || '');
      setDepartment(session?.department || DEPARTMENTS[0]);
      setPin(session?.pin || '');
      setError('');
      setMissingField(null);
      setOnSuccessCb(() => custom.detail?.onSuccess);
      setOpen(true);
    };
    window.addEventListener('ateca-open-auth-modal', handler);
    return () => window.removeEventListener('ateca-open-auth-modal', handler);
  }, [session]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMissingField(null);

    if (!email.trim()) {
      setMissingField('email');
      setError('Paso 1 incompleto: escribe tu correo corporativo (@gobiernodecanarias.org o @canariaseducacion.es).');
      return;
    }
    if (!name.trim()) {
      setMissingField('name');
      setError('Paso 2 incompleto: indica tu nombre y apellidos para el registro de autoría.');
      return;
    }
    if (!pin.trim()) {
      setMissingField('pin');
      setError('Paso 3 incompleto: introduce la clave docente del Aula ATECA.');
      return;
    }

    const res = login(email, name, department, pin);
    if (!res.ok) {
      if (res.error?.includes('correo')) setMissingField('email');
      else if (res.error?.includes('Nombre')) setMissingField('name');
      else setMissingField('pin');
      setError(res.error || 'Datos de acceso no válidos.');
      return;
    }

    setOpen(false);
    if (onSuccessCb) onSuccessCb();
  };

  return (
    <SmartModal title="Identificación de Profesorado Autorizado · Aula ATECA" onClose={() => setOpen(false)}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs sm:text-sm">
        <div className="p-3.5 rounded-xl bg-cyan-50 dark:bg-slate-800 border border-cyan-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
          <p className="font-bold text-cyan-950 dark:text-cyan-300 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
            ¿Por qué pedimos identificación?
          </p>
          <p className="text-xs leading-relaxed">
            Solo el profesorado autorizado del centro puede crear o modificar actividades, guías y experiencias.
            Tu <strong>correo, nombre y departamento</strong> quedarán registrados automáticamente en cada aportación.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border-2 border-red-400 text-red-900 dark:text-red-200 text-xs font-bold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Paso 1: Correo */}
        <div className={`p-3.5 rounded-xl border ${missingField === 'email' ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'}`}>
          <label className="block font-bold text-slate-900 dark:text-white text-xs mb-1">
            Paso 1 · Correo corporativo docente <span className="text-red-600">*</span>
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            Debe terminar en <code>@gobiernodecanarias.org</code>, <code>@canariaseducacion.es</code> o <code>@iesagustindebetancourt.org</code>.
          </p>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="ejemplo@gobiernodecanarias.org"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
          />
        </div>

        {/* Paso 2: Nombre y Departamento */}
        <div className={`p-3.5 rounded-xl border ${missingField === 'name' ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'}`}>
          <label className="block font-bold text-slate-900 dark:text-white text-xs mb-2">
            Paso 2 · Nombre y Departamento didáctico <span className="text-red-600">*</span>
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <span className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Nombre y apellidos *</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Victoria / Luis / José Domingo"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Departamento *</span>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Paso 3: Clave docente */}
        <div className={`p-3.5 rounded-xl border ${missingField === 'pin' ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'}`}>
          <label className="block font-bold text-slate-900 dark:text-white text-xs mb-1">
            Paso 3 · Clave de acceso docente <span className="text-red-600">*</span>
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            Clave del claustro para el Aula ATECA (código actual: <strong>ATECA2026</strong>).
          </p>
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="Introduce la clave docente"
              className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPin(s => !s)}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              title={showPin ? 'Ocultar clave' : 'Mostrar clave'}
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
          {session ? (
            <button
              type="button"
              onClick={() => { logout(); setOpen(false); }}
              className="px-3.5 py-2 rounded-xl border border-red-300 text-red-700 dark:text-red-300 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              Cerrar sesión actual
            </button>
          ) : <span />}

          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Validar y activar sesión docente
            </button>
          </div>
        </div>
      </form>
    </SmartModal>
  );
};

/**
 * Barra superior de estado del docente dentro de cualquier formulario de creación/edición
 */
export const TeacherSessionBar: React.FC = () => {
  const { session, requestAuth } = useTeacherSession();

  if (!session) {
    return (
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 text-xs">
          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>No te has identificado todavía.</strong> Para guardar cambios debes identificarte con tu correo docente y departamento.
          </span>
        </div>
        <button
          type="button"
          onClick={() => requestAuth()}
          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs"
        >
          Identificarme ahora
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200">
        <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Sesión activa: <strong>{session.name}</strong> · <strong>{session.department}</strong> ({session.email})
        </span>
      </div>
      <button
        type="button"
        onClick={() => requestAuth()}
        className="text-emerald-800 dark:text-emerald-300 underline font-semibold hover:text-emerald-950"
      >
        Cambiar docente
      </button>
    </div>
  );
};
