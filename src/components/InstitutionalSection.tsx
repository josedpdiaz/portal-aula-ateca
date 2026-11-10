import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Award, FileCheck, CheckCircle2, Info } from 'lucide-react';

export const InstitutionalSection: React.FC = () => {
  const [selectedPlaqueVersion, setSelectedPlaqueVersion] = useState<'fisica' | 'regional'>('regional');

  return (
    <section id="institucional" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-extrabold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-blue-700" />
            <span>Sección G • Publicidad Preceptiva y Financiación</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Marco Institucional y Pista de Auditoría
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Cumplimiento estricto de las obligaciones de información, publicidad y comunicación preceptivas en el marco del <strong>Plan de Recuperación, Transformación y Resiliencia (PRTR)</strong> financiado por la Unión Europea a través de los fondos <strong>NextGenerationEU</strong>.
          </p>
        </div>

        {/* Mandatory Legal Text Card */}
        <div className="bg-white rounded-3xl border-2 border-cyan-500/30 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-cyan-800">
            <ShieldCheck className="w-6 h-6 text-cyan-600 shrink-0" />
            <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wider">
              Cláusula Preceptiva de Financiación Institucional
            </h3>
          </div>

          <blockquote className="p-4 sm:p-5 rounded-2xl bg-cyan-50/60 border-l-4 border-cyan-600 text-sm sm:text-base font-semibold text-slate-800 leading-relaxed italic">
            "Las acciones desarrolladas en el centro relacionadas con la actuación «Conversión de aulas en espacios de tecnología aplicada» del «Plan de Modernización de la Formación Profesional», están financiadas por el Ministerio de Educación, Formación Profesional y Deportes y la Unión Europea-NextGenerationEU en el marco del Plan de Recuperación, Transformación y Resiliencia."
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="block font-bold text-slate-900">Actuación</span>
              <span>C20.I02.P02 Aulas ATECA</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="block font-bold text-slate-900">Código de Centro</span>
              <span>38003963 (IES Agustín de Betancourt)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="block font-bold text-slate-900">Dotación Asignada</span>
              <span className="font-semibold text-cyan-700">55.000,00 € (Módulo Oficial)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="block font-bold text-slate-900">Principio Ambiental</span>
              <span>DNSH (Do No Significant Harm)</span>
            </div>
          </div>
        </div>

        {/* Trilogía Oficial de Logotipos */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg uppercase tracking-wider">
              Trilogía Reglamentaria de Emblemas Oficiales
            </h3>
            <p className="text-xs text-slate-500">
              Identificación gráfica sin alteraciones conforme al Manual de Marca PRTR y directrices de la Unión Europea.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-items-center pt-2">
            
            {/* Ministerio */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 w-full flex flex-col items-center justify-center space-y-2 h-36">
              <img 
                src="./images.png" 
                alt="Ministerio de Educación, Formación Profesional y Deportes" 
                className="max-h-16 max-w-full object-contain"
              />
              <span className="text-[10px] text-slate-500 font-semibold uppercase text-center">
                Gobierno de España • MEFPD
              </span>
            </div>

            {/* Unión Europea NextGenEU */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 w-full flex flex-col items-center justify-center space-y-2 h-36">
              <img 
                src="./ES_Financiado_por_la_Unión_Europea_RGB_MONOCHROME.png" 
                alt="Financiado por la Unión Europea - NextGenerationEU" 
                className="max-h-14 max-w-full object-contain"
              />
              <span className="text-[10px] text-slate-500 font-semibold uppercase text-center">
                Unión Europea • NextGenerationEU
              </span>
            </div>

            {/* ATECA Logo */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 w-full flex flex-col items-center justify-center space-y-2 h-36">
              <img 
                src="./Logo.png" 
                alt="ATECA Aulas de Tecnología Aplicada" 
                className="max-h-14 max-w-full object-contain"
              />
              <span className="text-[10px] text-slate-500 font-semibold uppercase text-center">
                Red de Aulas ATECA de Canarias
              </span>
            </div>

          </div>
        </div>

        {/* Plaque Analysis & Presentation (PLACA.png vs Placa_PDF.png) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider block">
                Elemento Identificativo Obligatorio
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Placa Conmemorativa del Espacio (Aula 19)
              </h3>
            </div>

            {/* Selector between both versions */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSelectedPlaqueVersion('regional')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedPlaqueVersion === 'regional'
                    ? 'bg-white text-cyan-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Versión Completa (Gobierno de Canarias)
              </button>
              <button
                onClick={() => setSelectedPlaqueVersion('fisica')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedPlaqueVersion === 'fisica'
                    ? 'bg-white text-cyan-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Versión Física (Renderizado)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Plaque Viewer */}
            <div className="lg:col-span-7 bg-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-200 flex items-center justify-center">
              <div className="bg-white p-3 rounded-xl shadow-md border border-slate-200 max-w-lg w-full">
                <img 
                  src={selectedPlaqueVersion === 'regional' ? './Placa_PDF.png' : './PLACA.png'} 
                  alt="Placa conmemorativa Conversión de Aulas en Espacios de Tecnología Aplicada"
                  className="w-full h-auto object-contain rounded"
                />
              </div>
            </div>

            {/* Plaque Detailed Verification Report */}
            <div className="lg:col-span-5 space-y-4 text-xs sm:text-sm text-slate-600">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Dictamen Técnico sobre las Versiones de la Placa
              </h4>
              
              <p className="leading-relaxed">
                Hemos examinado píxel a píxel los dos archivos gráficos originales facilitados por el centro:
              </p>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-semibold">
                    1. <code className="text-cyan-700">Placa_PDF.png</code> (Recomendada para Publicación):
                  </strong>
                  <p className="text-xs text-slate-600">
                    Contiene la co-marca completa exigida en el ámbito autonómico: incorpora el logotipo oficial del <strong>Gobierno de Canarias</strong> en el pie junto a la bandera de la UE y el PRTR, sobre fondo transparente preparado para integrar en web institucional.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-semibold">
                    2. <code className="text-cyan-700">PLACA.png</code> (Referencia Física en Puerta):
                  </strong>
                  <p className="text-xs text-slate-600">
                    Es la versión opaca con biselado que emula la placa física rígida de metacrilato (formato A3) instalada en la puerta del Aula 19 del centro.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Conclusión:</strong> Ambas placas son oficiales y legítimas. Se publica por defecto la versión institucional completa regional (<code className="font-semibold">Placa_PDF.png</code> montada en tarjeta blanca), garantizando máxima legibilidad y cumplimiento con la Consejería de Educación.
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Budget Audit Table & Verification URL */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider block">
                Transparencia Económica • Expediente Técnico
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Desglose Presupuestario Oficial (55.000,00 €)
              </h3>
            </div>
            
            <a
              href="https://sede.gobiernodecanarias.org/sede/verifica_doc?codigo_nde=0zsHq3g0fSAmeDJuXwE_CtQcVqJDNmMZF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors"
              title="Verificar resolución oficial en Sede Electrónica del Gobierno de Canarias"
            >
              <FileCheck className="w-4 h-4 text-cyan-700" />
              <span>Verificar en Sede Electrónica GobCan</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            La dotación económica para el Aula ATECA del IES Agustín de Betancourt fue transferida a través de dos libramientos finalistas extraordinarios de la Dirección General de Formación Profesional y Enseñanzas de Régimen Especial:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 uppercase text-[11px] font-bold">
                  <th className="py-3 px-4">Libramiento / Actuación</th>
                  <th className="py-3 px-4">Concepto Subvencionable</th>
                  <th className="py-3 px-4">Importe</th>
                  <th className="py-3 px-4">Estado del Gasto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    Primer Libramiento (Res. Nº 306/2025)
                  </td>
                  <td className="py-3.5 px-4">
                    Acondicionamiento físico del Aula 19 (18.000 €), Formación docente (2.000 €) y Difusión (1.000 €)
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    21.000,00 €
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      Ejecutado y Justificado
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    Segundo Libramiento (Res. Nº 422/2025)
                  </td>
                  <td className="py-3.5 px-4">
                    Equipamiento tecnológico específico (Visores VR, Bambu Lab X1 Carbon, ViewBoard 75", PC Ultra 9, cámaras y audio)
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    34.000,00 €
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      Ejecutado y Justificado
                    </span>
                  </td>
                </tr>
                <tr className="bg-slate-50/70 font-bold text-slate-900">
                  <td className="py-3.5 px-4" colSpan={2}>
                    TOTAL MÓDULO ECONÓMICO ASIGNADO AL AULA ATECA
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cyan-800 text-base">
                    55.000,00 €
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">
                    100% Imputado a PCT 2024
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start space-x-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Código de verificación electrónica oficial en la Sede del Gobierno de Canarias: <code className="font-mono text-slate-700 font-semibold">0zsHq3g0fSAmeDJuXwE_CtQcVqJDNmMZF</code>. Pista de auditoría custodiada conforme a la Ley de Contratos del Sector Público durante el periodo reglamentario mínimo de 4 años.
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
