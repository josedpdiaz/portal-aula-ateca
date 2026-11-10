import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ZoneCards } from './components/ZoneCards';
import { CatalogSection } from './components/CatalogSection';
import { QuickStartGuides } from './components/QuickStartGuides';
import { ExperiencesSection } from './components/ExperiencesSection';
import { BookingSection } from './components/BookingSection';
import { InstitutionalSection } from './components/InstitutionalSection';
import { Footer } from './components/Footer';

import activitiesData from './data/activities.json';
import equipmentGuidesData from './data/equipmentGuides.json';
import zonesData from './data/zones.json';
import experiencesData from './data/experiences.json';
import { Activity, EquipmentGuide, Zone, Experience } from './types';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [selectedGuideId, setSelectedGuideId] = useState<string>('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('ALL');

  // Enlaces directos desde los QR de los equipos: …/#guia-vr
  React.useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id.startsWith('guia-') && (equipmentGuidesData as EquipmentGuide[]).some(g => g.id === id)) {
        setSelectedGuideId(id);
        setTimeout(() => document.getElementById('guias')?.scrollIntoView({ block: 'start' }), 50);
      }
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectGuideFromOther = (guideId: string) => {
    setSelectedGuideId(guideId);
    scrollToSection('guias');
  };

  const handleFilterByZone = (zoneName: string) => {
    setSelectedZoneFilter(zoneName);
    scrollToSection('actividades');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-cyan-100 selection:text-cyan-900">
      
      {/* Navbar with quick links & booking CTA */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Section A: Inicio & Hero Presentation */}
        <div id="inicio">
          <Hero
            onExploreCatalog={() => scrollToSection('actividades')}
            onExploreGuides={() => scrollToSection('guias')}
            onExploreZones={() => scrollToSection('zonas')}
          />
        </div>

        {/* Section B: Conoce el Aula (4 Zonas Tecnológicas) */}
        <ZoneCards
          zones={zonesData as Zone[]}
          onSelectGuide={handleSelectGuideFromOther}
          onFilterByZone={handleFilterByZone}
        />

        {/* Section C: Actividades Didácticas (SECCIÓN PRIORITARIA) */}
        <CatalogSection
          activities={activitiesData as Activity[]}
          onSelectGuide={handleSelectGuideFromOther}
          selectedZoneFilter={selectedZoneFilter}
          onClearZoneFilter={() => setSelectedZoneFilter('ALL')}
        />

        {/* Section D: Puesta en Marcha Rápida (SEGUNDA SECCIÓN PRIORITARIA) */}
        <QuickStartGuides
          guides={equipmentGuidesData as EquipmentGuide[]}
          selectedGuideId={selectedGuideId}
          onSelectGuide={(id) => setSelectedGuideId(id)}
        />

        {/* Section E: Experiencias y Buenas Prácticas */}
        <ExperiencesSection
          experiences={experiencesData as Experience[]}
        />

        {/* Section F: Reservas y Gobernanza del Espacio */}
        <BookingSection />

        {/* Section G: Información Institucional y Financiación */}
        <InstitutionalSection />

      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
      />

    </div>
  );
};

export default App;
