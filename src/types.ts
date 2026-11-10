export type ActivitySource = 'catalogo' | 'profesorado';

export interface TeacherSession {
  email: string;
  name: string;
  department: string;
  pin: string;
}

export interface Activity {
  id: string;
  title: string;
  cycle: string;
  cycleCode: string;
  course?: string;
  module: string;
  officialCode: string;
  zone: string;
  zoneId: string;
  technology: string;
  guideId: string;
  duration: string;
  difficulty: string;
  status?: string;
  objective: string;
  materials: string[];
  preparation: string;
  steps: string[];
  finalProduct: string;
  evaluation: string;
  bookingUrl: string;
  tags: string[];
  /** Quién propuso la idea (p. ej. «Idea aportada por el profesorado del departamento»). */
  origin?: string;
  /** Aviso legal o de seguridad que debe leerse antes de la sesión. */
  legalNote?: string;
  /** Aclaración organizativa (p. ej. impresión 3D previa, proyecto de varias sesiones). */
  sessionNote?: string;
  /** Vídeo opcional de la actividad (YouTube). */
  videoUrl?: string;
  /** 'catalogo' = ficha del portal; 'profesorado' = aportada desde la hoja de cálculo. */
  source?: ActivitySource;
  author?: string;
  authorEmail?: string;
  department?: string;
  updatedAt?: string;
}

export interface TroubleshootingItem {
  issue: string;
  solution: string;
}

export interface ExternalLink {
  title: string;
  url: string;
  isOfficial: boolean;
}

export interface GuideVideo {
  url: string;
  maxMinutes: number;
  status: string;
  description: string;
}

export interface EquipmentGuide {
  id: string;
  title: string;
  category: string;
  zone: string;
  zoneId: string;
  equipmentModel: string;
  video?: GuideVideo;
  quickStart5Min: {
    summary: string;
    steps: string[];
  };
  requirementsBefore: string[];
  powerOnAndSetup: string[];
  basicUsage: string[];
  powerOffAndStorage: string[];
  troubleshooting: TroubleshootingItem[];
  externalLinks: ExternalLink[];
  qrCodeId: string;
  author?: string;
  authorEmail?: string;
  department?: string;
  updatedAt?: string;
}

/** Aportación de un docente a una guía (consejo práctico o vídeo), leída de la hoja de cálculo. */
export interface GuideTip {
  id?: string;
  guideId: string;
  author: string;
  authorEmail?: string;
  department?: string;
  tip: string;
  videoUrl?: string;
  date?: string;
  updatedAt?: string;
}

export interface Zone {
  id: string;
  name: string;
  icon: string;
  badge: string;
  tagline: string;
  equipmentList: string[];
  didacticUtility: string;
  examples: string[];
  guideId: string;
  audioGuideId?: string;
  screenGuideId?: string;
  pcGuideId?: string;
}

export interface Experience {
  id: string;
  status: string;
  department: string;
  cycle: string;
  module: string;
  title: string;
  technology: string;
  zone: string;
  sessionDate: string;
  participants: string;
  summary: string;
  results: string;
  recommendations: string;
  hasPhotos: boolean;
  author?: string;
  authorEmail?: string;
  photosUrl?: string;
  updatedAt?: string;
}

