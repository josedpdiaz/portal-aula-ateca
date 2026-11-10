import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { EquipmentGuide } from '../types';
import { COMMUNITY } from '../config';
import { useGuideTips, youtubeId } from '../lib/community';
import { Modal } from './CatalogSection';
import {
  PlayCircle, ListChecks, ClipboardCheck, Power, Hand, PowerOff, Wrench, ExternalLink,
  QrCode, Printer, ChevronDown, Users, Plus, Youtube, Cpu,
} from 'lucide-react';

interface QuickStartGuidesProps {
  guides: EquipmentGuide[];
  selectedGuideId?: string;
  onSelectGuide?: (guideId: string) => void;
}

/** Bloque plegable: el detalle está disponible pero no satura la lectura. */
const Fold: React.FC<{ icon: React.ElementType; title: string; items: string[]; defaultOpen?: boolean }> = ({ icon: Icon, title, items, defaultOpen }) => (
  <details className="group bg-white rounded-xl border border-slate-200" open={defaultOpen}>
    <summary className="cursor-pointer list-none flex items-center gap-2 px-4 py-3 font-bold text-slate-900">
      <Icon className="w-5 h-5 text-cyan-700" />
      <span className="flex-1">{title}</span>
      <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
    </summary>
    <ul className="px-4 pb-4 space-y-2 text-[15px] text-slate-700 leading-relaxed">
      {items.map((it, i) => <li key={i} className="flex gap-2"><span className="text-cyan-700 font-bold">·</span><span>{it}</span></li>)}
    </ul>
  </details>
);

export const QuickStartGuides: React.FC<QuickStartGuidesProps> = ({ guides, selectedGuideId, onSelectGuide }) => {
  const [activeId, setActiveId] = useState(selectedGuideId || guides[0]?.id || '');
  const [qrOpen, setQrOpen] = useState(false);
  const [qrSvg, setQrSvg] = useState('');
  const [tipsInfo, setTipsInfo] = useState(false);
  const tips = useGuideTips();

  useEffect(() => { if (selectedGuideId) setActiveId(selectedGuideId); }, [selectedGuideId]);

  const g = guides.find(x => x.id === activeId) || guides[0];
  const vid = youtubeId(g?.video?.url);
  const guideTips = tips.items.filter(t => t.guideId === g?.id);

  const select = (id: string) => { setActiveId(id); onSelectGuide?.(id); };

  // QR real que abre esta guía directamente (portal publicado + #guia-...)
  useEffect(() => {
    if (!qrOpen || !g) return;
    const url = `${window.location.origin}${window.location.pathname}#${g.id}`;
    QRCode.toString(url, { type: 'svg', margin: 1, width: 220 }).then(setQrSvg).catch(() => setQrSvg(''));
  }, [qrOpen, g]);

  const addTip = () => {
    if (COMMUNITY.guideTipsFormUrl) window.open(COMMUNITY.guideTipsFormUrl, '_blank', 'noopener');
    else setTipsInfo(true);
  };

  if (!g) return null;

  return (
    <section id="guias" className="py-8 sm:py-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="max-w-2xl mb-6">
          <p className="text-xs font-bold text-cyan-800 uppercase tracking-wide">Puesta en marcha rápida · QR por equipo</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">Recetas para empezar con cada equipo</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
            Primero un <strong>vídeo corto (máx. 5 min)</strong> con las claves prácticas; después la <strong>receta en 5 pasos</strong>, el detalle plegable y las aportaciones del profesorado.
          </p>
        </header>

        {/* Selector de equipo */}
        <nav aria-label="Equipos" className="mb-6">
          <label htmlFor="sel-guia" className="sm:hidden block text-sm font-bold text-slate-700 mb-1">Equipo</label>
          <select id="sel-guia" value={g.id} onChange={e => select(e.target.value)}
            className="sm:hidden w-full p-3 rounded-xl border border-slate-300 bg-white font-semibold text-base">
            {guides.map(x => <option key={x.id} value={x.id}>{x.title}</option>)}
          </select>
          <div className="hidden sm:flex flex-wrap gap-2">
            {guides.map(x => (
              <button key={x.id} onClick={() => select(x.id)} aria-pressed={x.id === g.id}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  x.id === g.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:border-cyan-600'}`}>
                {x.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </nav>

        <article className="rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden">
          {/* Título */}
          <div className="bg-white px-5 sm:px-8 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-600">{g.zone}</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{g.title}</h3>
              <p className="text-sm text-slate-600 mt-1 flex gap-1.5"><Cpu className="w-4 h-4 mt-0.5 shrink-0 text-cyan-700" />{g.equipmentModel}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setQrOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-sm hover:border-cyan-600">
                <QrCode className="w-4 h-4" /> QR del equipo
              </button>
              <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-sm hover:border-cyan-600">
                <Printer className="w-4 h-4" /> Imprimir
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 p-5 sm:p-8">
            {/* 1. Vídeo */}
            <div>
              <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white text-sm flex items-center justify-center">1</span>
                Mira el vídeo <span className="text-sm font-medium text-slate-500">(máx. {g.video?.maxMinutes ?? 5} min)</span>
              </h4>
              {vid ? (
                <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow">
                  <iframe className="w-full h-full" src={`https://www.youtube-nocookie.com/embed/${vid}`} title={`Vídeo: ${g.title}`} allowFullScreen loading="lazy" />
                </div>
              ) : (
                <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-center p-6">
                  <PlayCircle className="w-12 h-12 text-slate-300" />
                  <p className="font-bold text-slate-800 mt-2">Vídeo en preparación</p>
                  <p className="text-sm text-slate-600 mt-1 max-w-sm">{g.video?.description}</p>
                  {COMMUNITY.youtubeChannelUrl && (
                    <a href={COMMUNITY.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-red-700">
                      <Youtube className="w-4 h-4" /> Canal ATECA
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* 2. Receta */}
            <div>
              <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
                <span className="w-7 h-7 rounded-full bg-cyan-700 text-white text-sm flex items-center justify-center">2</span>
                Sigue la receta
              </h4>
              <p className="text-slate-700 mb-3">{g.quickStart5Min.summary}</p>
              <ol className="space-y-2">
                {g.quickStart5Min.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 p-3 rounded-xl bg-white border border-slate-200">
                    <span className="w-7 h-7 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-[15px] text-slate-800 leading-relaxed">{s.replace(/^\d+\.\s*/, '')}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 3. Detalle plegable */}
          <div className="px-5 sm:px-8 pb-8 space-y-3">
            <h4 className="text-lg font-bold text-slate-900">Si necesitas más detalle</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <Fold icon={ClipboardCheck} title="Antes de la sesión" items={g.requirementsBefore} />
              <Fold icon={Power} title="Encender y configurar" items={g.powerOnAndSetup} />
              <Fold icon={Hand} title="Uso básico" items={g.basicUsage} />
              <Fold icon={PowerOff} title="Apagar y guardar" items={g.powerOffAndStorage} />
            </div>
            <Fold icon={Wrench} title={`Problemas frecuentes (${g.troubleshooting.length})`}
              items={g.troubleshooting.map(t => `${t.issue} → ${t.solution}`)} />
            <p className="text-sm text-slate-600 flex gap-1.5"><ListChecks className="w-4 h-4 mt-0.5 shrink-0" />
              Lo marcado «a confirmar en el aula» depende de la instalación concreta y se completará tras revisarlo in situ.</p>

            {g.externalLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {g.externalLinks.map(l => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-cyan-800 hover:border-cyan-600">
                    {l.title} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* 4. Aportaciones del profesorado */}
          <div className="bg-white border-t border-slate-200 px-5 sm:px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Users className="w-5 h-5 text-violet-700" />Aportaciones del profesorado</h4>
              <button onClick={addTip} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-sm">
                <Plus className="w-4 h-4" /> Añadir consejo o vídeo
              </button>
            </div>
            {guideTips.length === 0 ? (
              <p className="text-slate-600 text-sm">Todavía no hay aportaciones para este equipo. ¿Has descubierto un truco útil? Compártelo.</p>
            ) : (
              <ul className="space-y-3">
                {guideTips.map((t, i) => (
                  <li key={i} className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                    <p className="text-slate-800">{t.tip}</p>
                    <p className="text-xs text-slate-600 mt-1">— {t.author}{t.videoUrl && <> · <a className="font-semibold text-red-700 underline" href={t.videoUrl} target="_blank" rel="noopener noreferrer">ver vídeo</a></>}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      </div>

      {qrOpen && (
        <Modal title="Tarjeta QR para el equipo" onClose={() => setQrOpen(false)}>
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-600">Imprime y pega esta tarjeta junto al equipo. Al escanearla se abre esta guía.</p>
            <div className="inline-block p-4 rounded-2xl border-2 border-slate-900">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-800">Aula ATECA · Guía rápida</p>
              <p className="font-bold text-slate-900 mt-1 max-w-[240px]">{g.title}</p>
              {qrSvg ? <div className="mx-auto mt-3 w-[220px]" dangerouslySetInnerHTML={{ __html: qrSvg }} /> : <p className="text-sm py-10">Generando QR…</p>}
              <p className="font-mono text-xs text-slate-600 mt-2">{g.qrCodeId}</p>
            </div>
            <p className="text-xs text-slate-500">El QR apunta a la dirección donde se esté viendo el portal: genéralo desde la versión publicada en el servidor del centro.</p>
            <button onClick={() => window.print()} className="px-5 py-2.5 rounded-xl bg-cyan-700 text-white font-bold">Imprimir tarjeta</button>
          </div>
        </Modal>
      )}

      {tipsInfo && (
        <Modal title="Añadir consejo o vídeo" onClose={() => setTipsInfo(false)}>
          <div className="space-y-3 text-slate-700">
            <p>El profesorado autorizado podrá añadir consejos prácticos y enlaces a vídeos (YouTube, máx. 5 min) mediante un formulario de Google conectado a la hoja de cálculo del portal.</p>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              El formulario aún no está conectado. Campos previstos: <strong>Equipo, Autor/a, Aportación, Enlace al vídeo (opcional)</strong>. Se publica tras la revisión de la coordinación ATECA.
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
