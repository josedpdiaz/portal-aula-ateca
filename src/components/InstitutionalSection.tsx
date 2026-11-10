import React, { useState } from 'react';
import { ShieldCheck, Minimize2, Maximize2 } from 'lucide-react';
import { WindowBox } from './UiHelpers';

export const InstitutionalSection: React.FC = () => {
  const [selectedPlaqueVersion, setSelectedPlaqueVersion] = useState<'fisica' | 'regional'>('regional');
  const [allMinimized, setAllMinimized] = useState(false);

  return (
    <section id="institucional" className="py-4 sm:py-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Financiación y Publicidad Preceptiva PRTR
          </h2>
          <button
            type="button"
            onClick={() => setAllMinimized(m => !m)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          >
            {allMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            {allMinimized ? 'Expandir recuadros' : 'Minimizar recuadros'}
          </button>
        </div>

        {/* 1. Cláusula Preceptiva */}
        <WindowBox
          forceMinimized={allMinimized}
          badge={
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-800 dark:text-cyan-300 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> Obligación de Publicidad
            </span>
          }
          title="Cláusula Oficial de Financiación NextGenerationEU"
        >
          <div className="space-y-3 pt-1">
            <blockquote className="p-3.5 rounded-xl bg-cyan-50/70 dark:bg-slate-900 border-l-4 border-cyan-600 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed italic">
              "Las acciones desarrolladas en el centro relacionadas con la actuación «Conversión de aulas en espacios de tecnología aplicada» del «Plan de Modernización de la Formación Profesional», están financiadas por el Ministerio de Educación, Formación Profesional y Deportes y la Unión Europea-NextGenerationEU en el marco del Plan de Recuperación, Transformación y Resiliencia."
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="block font-bold">Actuación</span>
                <span>Conversión de aulas en espacios de tecnología aplicada (Aulas ATECA)</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="block font-bold">Centro (Código)</span>
                <span>IES Agustín de Betancourt (38003963) · Aula 19</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="block font-bold">Marco de Financiación</span>
                <span>MEFPD · Unión Europea-NextGenerationEU · PRTR</span>
              </div>
            </div>
          </div>
        </WindowBox>

        {/* 2. Emblemas Oficiales y Placa */}
        <div className="grid lg:grid-cols-2 gap-4">
          <WindowBox
            forceMinimized={allMinimized}
            title="Emblemas Oficiales Reglamentarios"
            subtitle="Sin alteraciones conforme al Manual de Marca PRTR"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center justify-items-center pt-1">
              <div className="p-3 rounded-xl bg-white border border-slate-200 w-full flex flex-col items-center justify-center space-y-1.5 h-28">
                <img
                  src="./images.png"
                  alt="Ministerio de Educación, Formación Profesional y Deportes"
                  className="max-h-14 max-w-full object-contain"
                />
                <span className="text-[10px] text-slate-600 font-semibold uppercase text-center">MEFPD</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 w-full flex flex-col items-center justify-center space-y-1.5 h-28">
                <img
                  src="./ES_Financiado_por_la_Unión_Europea_RGB_MONOCHROME.png"
                  alt="Financiado por la Unión Europea - NextGenerationEU"
                  className="max-h-12 max-w-full object-contain"
                />
                <span className="text-[10px] text-slate-600 font-semibold uppercase text-center">NextGenerationEU</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 w-full flex flex-col items-center justify-center space-y-1.5 h-28">
                <img
                  src="./Logo.png"
                  alt="ATECA Aulas de Tecnología Aplicada"
                  className="max-h-12 max-w-full object-contain"
                />
                <span className="text-[10px] text-slate-600 font-semibold uppercase text-center">Aula ATECA</span>
              </div>
            </div>
          </WindowBox>

          <WindowBox
            forceMinimized={allMinimized}
            title="Placa Oficial del Espacio (Aula 19)"
            actions={
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedPlaqueVersion('regional')}
                  className={`px-2 py-1 rounded-md ${selectedPlaqueVersion === 'regional' ? 'bg-white text-cyan-800 shadow-2xs' : 'text-slate-600'}`}
                >
                  Versión GobCan
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlaqueVersion('fisica')}
                  className={`px-2 py-1 rounded-md ${selectedPlaqueVersion === 'fisica' ? 'bg-white text-cyan-800 shadow-2xs' : 'text-slate-600'}`}
                >
                  Versión Placa
                </button>
              </div>
            }
          >
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-center">
              <img
                src={selectedPlaqueVersion === 'regional' ? './Placa_PDF.png' : './PLACA.png'}
                alt="Placa conmemorativa Aula ATECA"
                className="max-h-48 w-auto object-contain rounded"
              />
            </div>
          </WindowBox>
        </div>

      </div>
    </section>
  );
};
