import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { EquipmentGuide, GuideTip } from '../types';
import { COMMUNITY } from '../config';
import {
  useGuideTips,
  useCommunityGuides,
  saveCommunityItem,
  youtubeId,
  useTeacherSession,
} from '../lib/community';
import {
  StepGuideBanner,
  WindowBox,
  SmartModal,
  TeacherSessionBar,
  AuditBadge,
} from './UiHelpers';
import {
  PlayCircle, ExternalLink, QrCode, Printer, Users, Plus, Youtube, Cpu,
  CheckCircle2, AlertCircle, Edit3, Minimize2, Maximize2,
} from 'lucide-react';

interface QuickStartGuidesProps {
  guides: EquipmentGuide[];
  selectedGuideId?: string;
  onSelectGuide?: (guideId: string) => void;
}

export const QuickStartGuides: React.FC<QuickStartGuidesProps> = ({
  guides: baseGuides,
  selectedGuideId,
  onSelectGuide,
}) => {
  const communityGuides = useCommunityGuides();
  const tips = useGuideTips();
  const { session, requestAuth } = useTeacherSession();

  const guides = useMemo(() => {
    const map = new Map<string, EquipmentGuide>();
    for (const g of baseGuides) map.set(g.id, g);
    for (const cg of communityGuides.items) map.set(cg.id, cg);
    return Array.from(map.values());
  }, [baseGuides, communityGuides.items]);

  const [activeId, setActiveId] = useState(selectedGuideId || guides[0]?.id || '');
  const [qrOpen, setQrOpen] = useState(false);
  const [qrSvg, setQrSvg] = useState('');
  const [tipsInfo, setTipsInfo] = useState(false);
  const [guideEditorOpen, setGuideEditorOpen] = useState(false);
  const [allMinimized, setAllMinimized] = useState(false);

  const [tipText, setTipText] = useState('');
  const [tipVideo, setTipVideo] = useState('');
  const [tipErr, setTipErr] = useState('');
  const [tipDone, setTipDone] = useState(false);
  const [tipBusy, setTipBusy] = useState(false);

  useEffect(() => {
    if (selectedGuideId) setActiveId(selectedGuideId);
  }, [selectedGuideId]);

  const g = guides.find(x => x.id === activeId) || guides[0];
  const vid = youtubeId(g?.video?.url);
  const guideTips = tips.items.filter(t => t.guideId === g?.id);

  const select = (id: string) => {
    setActiveId(id);
    onSelectGuide?.(id);
  };

  useEffect(() => {
    if (!qrOpen || !g) return;
    const url = `${window.location.origin}${window.location.pathname}#${g.id}`;
    QRCode.toString(url, { type: 'svg', margin: 1, width: 220 })
      .then(setQrSvg)
      .catch(() => setQrSvg(''));
  }, [qrOpen, g]);

  const openTipModal = () => {
    if (!session) {
      requestAuth(() => {
        setTipErr('');
        setTipDone(false);
        setTipsInfo(true);
      });
      return;
    }
    setTipErr('');
    setTipDone(false);
    setTipsInfo(true);
  };

  const openGuideEditor = () => {
    if (!session) {
      requestAuth(() => setGuideEditorOpen(true));
      return;
    }
    setGuideEditorOpen(true);
  };

  const submitTip = async (e: React.FormEvent) => {
    e.preventDefault();
    setTipErr('');
    if (!session) {
      setTipErr('Debes identificarte primero como docente autorizado.');
      requestAuth();
      return;
    }
    if (!tipText.trim()) {
      setTipErr('Falta el campo obligatorio: «Consejo práctico o truco de aula».');
      return;
    }
    setTipBusy(true);
    const newTip: GuideTip = {
      id: `tip-${Date.now()}`,
      guideId: g.id,
      author: session.name,
      authorEmail: session.email,
      department: session.department,
      tip: tipText.trim(),
      videoUrl: tipVideo.trim() || undefined,
      date: new Date().toLocaleDateString('es-ES'),
    };
    const res = await saveCommunityItem('tips', newTip);
    setTipBusy(false);
    if (!res.ok) {
      setTipErr(res.error || 'No se pudo guardar.');
      return;
    }
    setTipDone(true);
    setTipText('');
    setTipVideo('');
  };

  if (!g) return null;

  return (
    <section id="guias" className="py-6 sm:py-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabecera compacta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-bold text-cyan-800 dark:text-cyan-400 uppercase tracking-wide">
              Guías Prácticas · Recetas en 5 minutos
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Puesta en marcha de cada equipo ({guides.length})
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAllMinimized(m => !m)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              {allMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              {allMinimized ? 'Expandir recuadros' : 'Minimizar recuadros'}
            </button>
            <button
              type="button"
              onClick={openGuideEditor}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {session ? 'Editar esta guía práctica' : '🔒 Identificarse y editar guía'}
            </button>
          </div>
        </div>

        {/* Paso a paso */}
        <StepGuideBanner
          title="Cómo usar y editar las Guías Prácticas (Paso a paso)"
          steps={[
            { label: 'Paso 1: Elige el equipo', desc: 'Pulsa sobre la pestaña del equipo que vas a usar en el Aula 19.' },
            { label: 'Paso 2: Vídeo + Receta de 5 pasos', desc: 'Revisa el vídeo corto y sigue los 5 pasos numerados.' },
            { label: 'Paso 3: Edita o añade consejos', desc: 'Pulsa «Editar esta guía práctica» o «Añadir consejo» con tu sesión docente.' },
          ]}
        />

        {/* Selector de equipo */}
        <nav aria-label="Equipos" className="mb-5">
          <select
            id="sel-guia"
            value={g.id}
            onChange={e => select(e.target.value)}
            className="sm:hidden w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-sm"
          >
            {guides.map(x => <option key={x.id} value={x.id}>{x.title}</option>)}
          </select>
          <div className="hidden sm:flex flex-wrap gap-1.5">
            {guides.map(x => (
              <button
                key={x.id}
                onClick={() => select(x.id)}
                aria-pressed={x.id === g.id}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  x.id === g.id
                    ? 'bg-slate-900 dark:bg-cyan-600 text-white border-slate-900 dark:border-cyan-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-cyan-600'
                }`}
              >
                {x.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </nav>

        {/* Cabecera del equipo seleccionado */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 sm:p-5 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">{g.zone}</span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">{g.title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
              {g.equipmentModel}
            </p>
            <AuditBadge
              author={g.author}
              authorEmail={g.authorEmail}
              department={g.department}
              updatedAt={g.updatedAt}
            />
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={openGuideEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar guía
            </button>
            <button
              onClick={() => setQrOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 font-semibold text-xs hover:border-cyan-600"
            >
              <QrCode className="w-3.5 h-3.5" /> Tarjeta QR
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 font-semibold text-xs hover:border-cyan-600"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir
            </button>
          </div>
        </div>

        {/* Bloques principales (Vídeo + Receta en 5 pasos) en WindowBox minimizables/maximizables */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <WindowBox
            forceMinimized={allMinimized}
            title={`1. Vídeo práctico (máx. ${g.video?.maxMinutes ?? 5} min)`}
            subtitle="Explicación visual rápida antes de tocar el equipo"
          >
            {vid ? (
              <div className="w-full flex-1 aspect-video min-h-[220px] max-h-[82vh] rounded-xl overflow-hidden bg-black shadow-lg">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${vid}`}
                  title={`Vídeo: ${g.title}`}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-center p-4">
                <PlayCircle className="w-10 h-10 text-slate-400" />
                <p className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm mt-2">
                  Espacio listo para vídeo de hasta 5 min
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">{g.video?.description}</p>
                <button
                  type="button"
                  onClick={openGuideEditor}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs"
                >
                  Añadir enlace de YouTube a esta guía
                </button>
                {COMMUNITY.youtubeChannelUrl && (
                  <a
                    href={COMMUNITY.youtubeChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-700"
                  >
                    <Youtube className="w-3.5 h-3.5" /> Canal ATECA
                  </a>
                )}
              </div>
            )}
          </WindowBox>

          <WindowBox
            forceMinimized={allMinimized}
            title="2. Receta de puesta en marcha en 5 pasos"
            subtitle={g.quickStart5Min.summary}
          >
            <ol className="space-y-2 pt-1">
              {g.quickStart5Min.steps.map((s, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-cyan-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{s.replace(/^\d+\.\s*/, '')}</span>
                </li>
              ))}
            </ol>
          </WindowBox>
        </div>

        {/* Cuadraditos técnicos (todos con Minimizar y Maximizar) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <WindowBox forceMinimized={allMinimized} title="Antes de empezar">
            <ul className="space-y-1.5 text-xs">
              {g.requirementsBefore.map((it, i) => (
                <li key={i} className="flex gap-1.5"><span className="text-cyan-700 font-bold">·</span><span>{it}</span></li>
              ))}
            </ul>
          </WindowBox>

          <WindowBox forceMinimized={allMinimized} title="Encender y configurar">
            <ul className="space-y-1.5 text-xs">
              {g.powerOnAndSetup.map((it, i) => (
                <li key={i} className="flex gap-1.5"><span className="text-cyan-700 font-bold">·</span><span>{it}</span></li>
              ))}
            </ul>
          </WindowBox>

          <WindowBox forceMinimized={allMinimized} title="Uso durante la clase">
            <ul className="space-y-1.5 text-xs">
              {g.basicUsage.map((it, i) => (
                <li key={i} className="flex gap-1.5"><span className="text-cyan-700 font-bold">·</span><span>{it}</span></li>
              ))}
            </ul>
          </WindowBox>

          <WindowBox forceMinimized={allMinimized} title="Apagar y recoger">
            <ul className="space-y-1.5 text-xs">
              {g.powerOffAndStorage.map((it, i) => (
                <li key={i} className="flex gap-1.5"><span className="text-cyan-700 font-bold">·</span><span>{it}</span></li>
              ))}
            </ul>
          </WindowBox>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Solución de problemas */}
          <WindowBox
            forceMinimized={allMinimized}
            title={`Problemas frecuentes (${g.troubleshooting.length})`}
            subtitle="Soluciones rápidas sin salir del aula"
          >
            <ul className="space-y-2 text-xs">
              {g.troubleshooting.map((t, i) => (
                <li key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white">{t.issue}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">→ {t.solution}</p>
                </li>
              ))}
            </ul>
            {g.externalLinks.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-slate-100 dark:border-slate-700">
                {g.externalLinks.map(l => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-cyan-800 dark:text-cyan-300"
                  >
                    {l.title} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </WindowBox>

          {/* Aportaciones y vídeos breves del profesorado */}
          <WindowBox
            forceMinimized={allMinimized}
            title={
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-700" />
                Consejos y vídeos del profesorado ({guideTips.length})
              </span>
            }
            subtitle="Trucos añadidos por docentes del centro"
            actions={
              <button
                type="button"
                onClick={openTipModal}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir consejo
              </button>
            }
          >
            {guideTips.length === 0 ? (
              <p className="text-slate-500 text-xs py-2">
                Aún no hay consejos adicionales para este equipo. Pulsa «Añadir consejo» para compartir un truco o vídeo.
              </p>
            ) : (
              <ul className="space-y-2.5 text-xs">
                {guideTips.map((t, i) => (
                  <li key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-800 dark:text-slate-100 font-medium">{t.tip}</p>
                    {t.videoUrl && (
                      <a
                        className="inline-flex items-center gap-1 font-bold text-red-700 underline mt-1"
                        href={t.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Youtube className="w-3.5 h-3.5" /> Ver vídeo explicativo
                      </a>
                    )}
                    <AuditBadge
                      author={t.author}
                      authorEmail={t.authorEmail}
                      department={t.department}
                      updatedAt={t.date || t.updatedAt}
                    />
                  </li>
                ))}
              </ul>
            )}
          </WindowBox>
        </div>
      </div>

      {/* Modal de Tarjeta QR */}
      {qrOpen && (
        <SmartModal title="Tarjeta QR para el equipo" onClose={() => setQrOpen(false)}>
          <div className="text-center space-y-4">
            <p className="text-xs sm:text-sm text-slate-600">
              Imprime esta tarjeta junto al equipo para abrir su receta en el móvil.
            </p>
            <div className="inline-block p-4 rounded-2xl border-2 border-slate-900 bg-white text-slate-900">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-800">Aula ATECA · Guía rápida</p>
              <p className="font-bold text-slate-900 mt-1 max-w-[240px]">{g.title}</p>
              {qrSvg ? (
                <div className="mx-auto mt-3 w-[220px]" dangerouslySetInnerHTML={{ __html: qrSvg }} />
              ) : (
                <p className="text-sm py-10">Generando QR…</p>
              )}
              <p className="font-mono text-xs text-slate-600 mt-2">{g.qrCodeId}</p>
            </div>
            <div>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-cyan-700 text-white font-bold text-xs"
              >
                Imprimir tarjeta
              </button>
            </div>
          </div>
        </SmartModal>
      )}

      {/* Modal para Añadir Consejo o Vídeo */}
      {tipsInfo && (
        <SmartModal title={`Añadir consejo o vídeo · ${g.title}`} onClose={() => setTipsInfo(false)}>
          <form onSubmit={submitTip} noValidate className="space-y-4 text-xs sm:text-sm">
            <TeacherSessionBar />

            <StepGuideBanner
              title="Cómo añadir un consejo o vídeo"
              steps={[
                { label: 'Paso 1: Verifica tu sesión', desc: 'Tu correo y departamento aparecen arriba.' },
                { label: 'Paso 2: Escribe el consejo', desc: 'Resume en 1 o 2 frases el truco práctico.' },
                { label: 'Paso 3: Enlace de vídeo (opcional)', desc: 'Si grabaste un vídeo en YouTube, pega su URL.' },
              ]}
            />

            {tipErr && (
              <div className="p-3 rounded-xl bg-red-50 border-2 border-red-400 text-red-900 font-bold text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{tipErr}</span>
              </div>
            )}

            {tipDone && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>¡Consejo guardado y publicado con tu registro docente!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1">
                1. Consejo práctico o truco de aula <span className="text-red-600">* (Obligatorio)</span>
              </label>
              <textarea
                rows={3}
                value={tipText}
                onChange={e => setTipText(e.target.value)}
                placeholder="Describe el consejo práctico para este equipo..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">2. Enlace a vídeo de YouTube (Opcional, máx. 5 min)</label>
              <input
                type="url"
                value={tipVideo}
                onChange={e => setTipVideo(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setTipsInfo(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs"
              >
                Cerrar
              </button>
              <button
                type="submit"
                disabled={tipBusy}
                className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs disabled:opacity-50"
              >
                {tipBusy ? 'Guardando…' : 'Guardar consejo'}
              </button>
            </div>
          </form>
        </SmartModal>
      )}

      {/* Modal para Editar la Guía Práctica completa paso a paso */}
      {guideEditorOpen && (
        <GuideEditorModal
          guide={g}
          onClose={() => setGuideEditorOpen(false)}
          onSaved={() => {
            setGuideEditorOpen(false);
            communityGuides.reload();
          }}
        />
      )}
    </section>
  );
};

/**
 * Editor completo de una Guía Práctica (Vídeo, Receta en 5 pasos y Bloques de uso)
 */
const GuideEditorModal: React.FC<{
  guide: EquipmentGuide;
  onClose: () => void;
  onSaved: () => void;
}> = ({ guide, onClose, onSaved }) => {
  const { session, requestAuth } = useTeacherSession();

  const [title, setTitle] = useState(guide.title);
  const [equipmentModel, setEquipmentModel] = useState(guide.equipmentModel);
  const [videoUrl, setVideoUrl] = useState(guide.video?.url || '');
  const [videoDesc, setVideoDesc] = useState(guide.video?.description || '');
  const [summary, setSummary] = useState(guide.quickStart5Min.summary);
  const [stepsText, setStepsText] = useState(guide.quickStart5Min.steps.join('\n'));
  const [reqBeforeText, setReqBeforeText] = useState(guide.requirementsBefore.join('\n'));
  const [powerOnText, setPowerOnText] = useState(guide.powerOnAndSetup.join('\n'));
  const [basicUsageText, setBasicUsageText] = useState(guide.basicUsage.join('\n'));
  const [powerOffText, setPowerOffText] = useState(guide.powerOffAndStorage.join('\n'));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!session) {
      setError('Debes identificarte primero con tu cuenta docente en la barra superior.');
      requestAuth();
      return;
    }
    if (!title.trim() || !stepsText.trim()) {
      setError('Falta completar el «Nombre de la guía» (Paso 1) o los «Pasos de la receta» (Paso 2).');
      return;
    }

    setSaving(true);
    const updated: EquipmentGuide = {
      ...guide,
      title: title.trim(),
      equipmentModel: equipmentModel.trim(),
      video: {
        url: videoUrl.trim(),
        maxMinutes: 5,
        status: videoUrl.trim() ? 'Vídeo disponible' : 'Pendiente de grabación',
        description: videoDesc.trim(),
      },
      quickStart5Min: {
        summary: summary.trim(),
        steps: stepsText.split('\n').map(s => s.trim()).filter(Boolean),
      },
      requirementsBefore: reqBeforeText.split('\n').map(s => s.trim()).filter(Boolean),
      powerOnAndSetup: powerOnText.split('\n').map(s => s.trim()).filter(Boolean),
      basicUsage: basicUsageText.split('\n').map(s => s.trim()).filter(Boolean),
      powerOffAndStorage: powerOffText.split('\n').map(s => s.trim()).filter(Boolean),
    };

    const res = await saveCommunityItem('guides', updated);
    setSaving(false);
    if (!res.ok) {
      setError(res.error || 'No se pudo guardar la guía.');
      return;
    }
    onSaved();
  };

  return (
    <SmartModal title={`Editar Guía Práctica · ${guide.title}`} onClose={onClose} wide>
      <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs sm:text-sm">
        <TeacherSessionBar />

        <StepGuideBanner
          title="Pasos para editar esta guía práctica"
          steps={[
            { label: 'Paso 1: Equipo y Vídeo (5 min)', desc: 'Actualiza el modelo o pega el enlace de YouTube del tutorial.' },
            { label: 'Paso 2: Receta en 5 pasos', desc: 'Edita el resumen y los 5 pasos rápidos de puesta en marcha.' },
            { label: 'Paso 3: Detalles de encendido/apagado', desc: 'Ajusta las listas de comprobación del aula.' },
          ]}
        />

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border-2 border-red-500 text-red-900 font-bold text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <WindowBox title="Paso 1 · Datos del equipo y Vídeo de 5 minutos">
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold mb-1">1.1 Título de la guía *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">1.2 Modelo / Dotación en el aula</label>
              <input
                type="text"
                value={equipmentModel}
                onChange={e => setEquipmentModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-bold mb-1">1.3 URL del vídeo en YouTube (máx. 5 min)</label>
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">1.4 Descripción breve del vídeo</label>
              <input
                type="text"
                value={videoDesc}
                onChange={e => setVideoDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>
        </WindowBox>

        <WindowBox title="Paso 2 · Receta de puesta en marcha en 5 pasos *">
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold mb-1">2.1 Resumen en una frase</label>
              <input
                type="text"
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">2.2 Pasos de la receta (uno por línea) *</label>
              <textarea
                rows={5}
                value={stepsText}
                onChange={e => setStepsText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>
        </WindowBox>

        <WindowBox title="Paso 3 · Listas de verificación (Antes, Encender, Uso, Apagar)" defaultMinimized>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold mb-1">3.1 Antes de empezar (uno por línea)</label>
              <textarea
                rows={3}
                value={reqBeforeText}
                onChange={e => setReqBeforeText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">3.2 Encender y configurar</label>
              <textarea
                rows={3}
                value={powerOnText}
                onChange={e => setPowerOnText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">3.3 Uso durante la clase</label>
              <textarea
                rows={3}
                value={basicUsageText}
                onChange={e => setBasicUsageText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">3.4 Apagar y recoger</label>
              <textarea
                rows={3}
                value={powerOffText}
                onChange={e => setPowerOffText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>
        </WindowBox>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Guardar cambios en la guía'}
          </button>
        </div>
      </form>
    </SmartModal>
  );
};
