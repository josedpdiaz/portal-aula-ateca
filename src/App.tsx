import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ZoneCards } from './components/ZoneCards';
import { CatalogSection } from './components/CatalogSection';
import { QuickStartGuides } from './components/QuickStartGuides';
import { ExperiencesSection } from './components/ExperiencesSection';
import { BookingSection } from './components/BookingSection';
import { InstitutionalSection } from './components/InstitutionalSection';
import { Footer } from './components/Footer';
import { TeacherAuthModal } from './components/UiHelpers';

import activitiesData from './data/activities.json';
import equipmentGuidesData from './data/equipmentGuides.json';
import zonesData from './data/zones.json';
import experiencesData from './data/experiences.json';
import { Activity, EquipmentGuide, Zone, Experience } from './types';

const VALID_PAGES = new Set(['inicio', 'actividades', 'guias', 'zonas', 'experiencias', 'institucional']);

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [selectedGuideId, setSelectedGuideId] = useState<string>('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('ALL');

  const navigateTo = (pageId: string) => {
    const target = VALID_PAGES.has(pageId) ? pageId : 'inicio';
    setActiveSection(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enlaces directos desde QR (#guia-vr, #guia-impresora3d...) o desde secciones (#actividades, #zonas...)
  useEffect(() => {
    const syncFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      if (id.startsWith('guia-') && (equipmentGuidesData as EquipmentGuide[]).some(g => g.id === id)) {
        setSelectedGuideId(id);
        setActiveSection('guias');
        window.scrollTo({ top: 0 });
      } else if (VALID_PAGES.has(id)) {
        setActiveSection(id);
        window.scrollTo({ top: 0 });
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const handleSelectGuideFromOther = (guideId: string) => {
    setSelectedGuideId(guideId);
    setActiveSection('guias');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterByZone = (zoneId: string) => {
    setSelectedZoneFilter(zoneId);
    setActiveSection('actividades');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-cyan-100 selection:text-cyan-900">

      {/* Barra superior compacta con pestañas, tamaño de letra, modo claro/oscuro y Acceso Docente */}
      <Navbar
        activeSection={activeSection}
        onNavigate={navigateTo}
      />

      {/* Contenido de la página activa */}
      <main className="flex-1">
        {activeSection === 'inicio' && (
          <Hero
            onNavigate={navigateTo}
            onSelectZone={handleFilterByZone}
            onSelectGuide={handleSelectGuideFromOther}
          />
        )}

        {activeSection === 'zonas' && (
          <ZoneCards
            zones={zonesData as Zone[]}
            onSelectGuide={handleSelectGuideFromOther}
            onFilterByZone={handleFilterByZone}
          />
        )}

        {activeSection === 'actividades' && (
          <CatalogSection
            activities={activitiesData as Activity[]}
            onOpenGuide={handleSelectGuideFromOther}
            selectedZoneFilter={selectedZoneFilter}
            onClearZoneFilter={() => setSelectedZoneFilter('ALL')}
          />
        )}

        {activeSection === 'guias' && (
          <QuickStartGuides
            guides={equipmentGuidesData as EquipmentGuide[]}
            selectedGuideId={selectedGuideId}
            onSelectGuide={(id) => setSelectedGuideId(id)}
          />
        )}

        {activeSection === 'experiencias' && (
          <ExperiencesSection
            experiences={experiencesData as Experience[]}
          />
        )}

        {activeSection === 'institucional' && (
          <div>
            <BookingSection />
            <InstitutionalSection />
          </div>
        )}
      </main>

      {/* Modal global de autenticación docente */}
      <TeacherAuthModal />

      {/* Pie de página presente en todas las páginas */}
      <Footer
        onNavigate={navigateTo}
      />

    </div>
  );
};

export default App;
