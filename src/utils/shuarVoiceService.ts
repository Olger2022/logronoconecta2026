/**
 * Servicio de Audio-Guía en Idioma Shuar Chicham para Logroño Conecta
 * Proporciona síntesis de voz, fonética adaptada, traducciones y guía sonora
 * para cada botón, opción y módulo de la aplicación.
 */

export interface ShuarVoiceEntry {
  key: string;
  titleEs: string;
  shuarText: string;
  phoneticText: string;
  explanationEs: string;
  voicePhrase: string; // Frase optimizada para síntesis de voz
}

export const SHUAR_VOICE_GUIDE_DATA: Record<string, ShuarVoiceEntry> = {
  welcome_intro: {
    key: 'welcome_intro',
    titleEs: 'Guía de Voz Shuar Activada',
    shuarText: 'Pénker Pujustin! Wi Shuar Audio-Guía Logroño Conecta itiajai. Yamaika nútara botón takastai, wi shuar chichamjai nu chicham paan étserkatatjai.',
    phoneticText: 'Penker Puhustin! Wi Shuar Audio-Guia Logroño Conecta ityajay. Yamaika nutara boton takastay, wi shuar chichamhay nu chicham paan etserkatathay.',
    explanationEs: '¡Bienvenido! Has activado la Guía de Voz en idioma Shuar. Ahora, cada botón u opción que selecciones te dará una explicación guiada por voz en Shuar y Español.',
    voicePhrase: 'Pénker Pujustin! Wi Shuar Chicham audio guía Logroño Conecta itiajai. Bienvenido a la guía por voz Shuar. Selecciona cualquier botón u opción para escuchar su explicación.'
  },
  inicio: {
    key: 'inicio',
    titleEs: 'Menú de Inicio',
    shuarText: 'Pénker Pujustin Logroño Conecta. Juita menú principal cantón Logroño.',
    phoneticText: 'Penker Puhustin Logroño Conecta. Hwita menu principal canton Logroño.',
    explanationEs: 'Pantalla principal con accesos directos a reportes, noticias, trámites y servicios municipales.',
    voicePhrase: 'Pénker Pujustin! Juita menú principal. Pantalla de inicio de Logroño Conecta.'
  },
  reportar_incidencia: {
    key: 'reportar_incidencia',
    titleEs: 'Reportar Incidencia Municipal',
    shuarText: 'Najanma Chicham Najatin: Baches, entsa tura namkur chicham GAD Logroñonman akupkai.',
    phoneticText: 'Nahanma Chicham Nahatin: Baches, entsa tura namkur chicham GAD Logroñonman akupkay.',
    explanationEs: 'Crea un nuevo reporte ciudadano con fotografía, coordenadas GPS y análisis de Inteligencia Artificial para el GAD.',
    voicePhrase: 'Najanma Chicham Najatin. Reportar Incidencia Municipal. Toma una foto y reporta daños en calles, agua o alumbrado.'
  },
  mis_reportes: {
    key: 'mis_reportes',
    titleEs: 'Mis Reportes y Seguimiento',
    shuarText: 'Wi Najanma Iwiarar: Aujsatainti itiur nankamas ninki najanma takamu.',
    phoneticText: 'Wi Nahanma Iwiarar: Awhsataynti ityur nankamas ninki nahanma takamu.',
    explanationEs: 'Consulta el historial de tus reportes, avance técnico en tiempo real y resoluciones de cuadrilla.',
    voicePhrase: 'Wi Najanma Iwiarar. Mis Reportes. Revisa el avance y estado de tus trámites e incidencias reportadas.'
  },
  noticias: {
    key: 'noticias',
    titleEs: 'Noticias y Comunicados',
    shuarText: 'Chicham Yamaram: Antuktai GAD Municipal Logroño chicham etserkamu tura obras.',
    phoneticText: 'Chicham Yamaram: Antuktay GAD Municipal Logroño chicham etserkamu tura obras.',
    explanationEs: 'Noticias oficiales, inauguración de obras, comunicados cantonales y avisos de corte de servicios.',
    voicePhrase: 'Chicham Yamaram. Noticias Municipales. Mantente informado con las novedades y comunicados oficiales del GAD Logroño.'
  },
  agenda: {
    key: 'agenda',
    titleEs: 'Agenda Cultural y Eventos',
    shuarText: 'Namper Tsawan: Nekatai cantón Logroño fiestari tura feria intercultural Shuar.',
    phoneticText: 'Namper Tsawan: Nekatay canton Logroño fyestari tura ferya intercultural Shuar.',
    explanationEs: 'Calendario oficial de festividades, ferias gastronómicas, mingas comunitarias y sesiones solemnes.',
    voicePhrase: 'Namper Tsawan. Agenda Cultural y Fiestas. Descubre los próximos eventos y ferias interculturales del cantón.'
  },
  emergencias: {
    key: 'emergencias',
    titleEs: 'Líneas de Emergencia Cantonal',
    shuarText: 'Tsamtai Aents Ikiakatin: Kakarman chichastai ECU 911, bomberos tura policía cantonal.',
    phoneticText: 'Tsamtay Aents Ikyakatin: Kakarman chichastay ECU 911, bomberos tura polisya cantonal.',
    explanationEs: 'Contactos inmediatos de auxilio: ECU 911, Bomberos de Logroño, Policía Nacional y Centro de Salud.',
    voicePhrase: 'Tsamtai Aents Ikiakatin. Líneas de Emergencia. Contacto directo con Bomberos, Policía y auxilio médico 911.'
  },
  directorio: {
    key: 'directorio',
    titleEs: 'Directorio Municipal GAD',
    shuarText: 'GAD Chichatai Papiri: Chichastai alcaldía, agua potable tura concejales.',
    phoneticText: 'GAD Chichatay Papyri: Chichastay alkaldiya, ahwa potable tura consehales.',
    explanationEs: 'Números telefónicos, extensiones y correos de cada departamento y jefatura del municipio.',
    voicePhrase: 'GAD Chichatai Papiri. Directorio Telefónico Municipal. Comunícate con las diferentes áreas del GAD Logroño.'
  },
  pqrs: {
    key: 'pqrs',
    titleEs: 'Trámites y PQRS Ciudadana',
    shuarText: 'Papiri Takastai PQRS: Seatai certificado, permiso ambiental tura reclamos.',
    phoneticText: 'Papyri Takastay PQRS: Seatay sertifikado, permiso ambyental tura reklamos.',
    explanationEs: 'Peticiones, Quejas, Reclamos y Sugerencias, más requisitos para trámites cantonales.',
    voicePhrase: 'Papiri Takastai PQRS. Catálogo de Trámites. Radica peticiones, quejas, reclamos o sugerencias formales.'
  },
  turismo_mapa: {
    key: 'turismo_mapa',
    titleEs: 'Turismo y Mapa Cantonal',
    shuarText: 'Logroño Nunke Iwiartai: Nekatai cascadas, cavernas de los Tayos tura atractivos.',
    phoneticText: 'Logroño Nunke Iwyartay: Nekatay kaskadas, kabernas de los Tayos tura atraktibos.',
    explanationEs: 'Mapa geográfico de Logroño, rutas turísticas, cascadas, comunidades y sectores cantonales.',
    voicePhrase: 'Logroño Nunke Iwiartai. Mapa Turístico y Cantonal. Explora los atractivos naturales y sectores de Logroño.'
  },
  logrobot_ai: {
    key: 'logrobot_ai',
    titleEs: 'Asistente IA LogroBot Bilingüe',
    shuarText: 'Yaimin IA LogroBot: Ikiakma bilingüe preguntas tura dudas cantonales.',
    phoneticText: 'Yaymin IA LogroBot: Ikyakma bilingwe preguntas tura dudas cantonales.',
    explanationEs: 'Asistente virtual inteligente 24/7 disponible en Español y Shuar para guiarte en trámites y consultas.',
    voicePhrase: 'Yaimin IA LogroBot. Asistente Virtual Inteligente. Pregúntame sobre cualquier servicio o información cantonal.'
  },
  tomar_foto: {
    key: 'tomar_foto',
    titleEs: 'Cámara y Fotografía',
    shuarText: 'Foto Najanma: Nakumtai daño calzada tura evidencia.',
    phoneticText: 'Foto Nahanma: Nakumtay daño kalsada tura ebydensya.',
    explanationEs: 'Captura o sube una fotografía del problema para análisis automático con inteligencia artificial.',
    voicePhrase: 'Foto Najanma. Adjuntar Fotografía. Captura la evidencia visual para agilizar la cuadrilla municipal.'
  },
  gps_ubicacion: {
    key: 'gps_ubicacion',
    titleEs: 'Geolocalización GPS',
    shuarText: 'GPS Nunka: Automaático nunka coordenadas cantón Logroñonman.',
    phoneticText: 'GPS Nunka: Automátiko nunka koordenadas canton Logroñonman.',
    explanationEs: 'Detección satelital automática de tu ubicación geográfica exacta en el cantón Logroño.',
    voicePhrase: 'GPS Nunka. Geolocalización Automática. Obteniendo tus coordenadas exactas en el cantón Logroño.'
  },
  cat_vias: {
    key: 'cat_vias',
    titleEs: 'Categoría: Vías y Aceras',
    shuarText: 'Jinti Najanma: Baches, calzada tura asfaltado tunkaru.',
    phoneticText: 'Hinti Nahanma: Baches, kalsada tura asfaltado tunkaru.',
    explanationEs: 'Reporte de huecos, baches en calzada, aceras rotas o falta de mantenimiento vial.',
    voicePhrase: 'Jinti Najanma. Vías y Aceras. Reportar baches, adoquinado o daños en la vía pública.'
  },
  cat_agua: {
    key: 'cat_agua',
    titleEs: 'Categoría: Agua Potable y Alcantarillado',
    shuarText: 'Entsa Yaimiu: Tubería tunkaru tura alcantarillado chicham.',
    phoneticText: 'Entsa Yaymyu: Tuberiya tunkaru tura alkantaryado chicham.',
    explanationEs: 'Fugas de agua, rotura de tuberías principales, sumideros tapados o falta de servicio.',
    voicePhrase: 'Entsa Yaimiu. Agua Potable y Alcantarillado. Reportar rotura de tuberías, fugas o cajas de alcantarilla.'
  },
  cat_alumbrado: {
    key: 'cat_alumbrado',
    titleEs: 'Categoría: Alumbrado Público',
    shuarText: 'Namkur Etsa: Poste tura foco luminaria dañada.',
    phoneticText: 'Namkur Etsa: Poste tura foko lumynarya dañada.',
    explanationEs: 'Luminarias apagadas, postes con fotocélula dañada o sectores a oscuras.',
    voicePhrase: 'Namkur Etsa. Alumbrado Público. Reportar postes con luz quemada o sectores sin iluminación.'
  },
  cat_parques: {
    key: 'cat_parques',
    titleEs: 'Categoría: Parques y Áreas Verdes',
    shuarText: 'Nunkui Pénker: Parques tura árboles podar takastai.',
    phoneticText: 'Nunkwi Penker: Parkes tura arboles podar takastay.',
    explanationEs: 'Mantenimiento de juegos infantiles, poda de áreas verdes y cuidado de parques cantonales.',
    voicePhrase: 'Nunkui Pénker. Parques y Áreas Verdes. Reportar maleza alta, juegos infantiles o jardinería.'
  },
  cat_limpieza: {
    key: 'cat_limpieza',
    titleEs: 'Categoría: Gestión de Residuos y Limpieza',
    shuarText: 'Yapa Iwiarar: Basura recolección tura calles aseo.',
    phoneticText: 'Yapa Iwyarar: Basura rekoleksyon tura kayes aseo.',
    explanationEs: 'Horarios de recolección de basura, botaderos clandestinos o limpieza urbana.',
    voicePhrase: 'Yapa Iwiarar. Gestión de Residuos. Reportar puntos de basura o solicitud de aseo de calles.'
  },
  cat_seguridad: {
    key: 'cat_seguridad',
    titleEs: 'Categoría: Seguridad y Ruidos',
    shuarText: 'Aents Kakarman: Seguridad ciudadana tura ruidos molestos.',
    phoneticText: 'Aents Kakarman: Seguryda syudadana tura rwydos molestos.',
    explanationEs: 'Control de ruidos excesivos, libadores en vía pública o requerimiento de patrullaje municipal.',
    voicePhrase: 'Aents Kakarman. Seguridad Ciudadana. Reportar ruidos excesivos o solicitar patrullaje preventivo.'
  },
  cat_shuar: {
    key: 'cat_shuar',
    titleEs: 'Categoría: Infraestructura Shuar Comunitaria',
    shuarText: 'Comunidad Shuar: Obra comunitaria tura casa comunal.',
    phoneticText: 'Komunyda Shuar: Obra komunyfarya tura kasa komunal.',
    explanationEs: 'Coordinación intercultural para infraestructura en centros shuar, canchas y casas comunales.',
    voicePhrase: 'Comunidad Shuar. Infraestructura Comunitaria. Solicitud de obras y mantenimiento en comunidades shuar.'
  },
  enviar_reporte: {
    key: 'enviar_reporte',
    titleEs: 'Enviar Reporte al GAD',
    shuarText: 'Akupkai GAD Logroñonman: Enviar reporte municipal instantáneo.',
    phoneticText: 'Akupkay GAD Logroñonman: Enbyar reporte munysypal instantaneo.',
    explanationEs: 'Envía formalmente tu reporte al sistema de asignación de cuadrillas del GAD Logroño.',
    voicePhrase: 'Akupkai GAD Logroñonman! Enviar reporte al GAD. Tu solicitud será atendida por las cuadrillas municipales.'
  },
  filtro_estado: {
    key: 'filtro_estado',
    titleEs: 'Filtro por Estado de Incidencia',
    shuarText: 'Iwiarar Estado: Reportado, En Proceso tura Resuelto.',
    phoneticText: 'Iwyarar Estado: Reportado, En Proceso tura Reswelto.',
    explanationEs: 'Filtra las incidencias por estado: Reportados, En Proceso o Resueltos.',
    voicePhrase: 'Iwiarar Estado. Filtro de incidencias por estado de atención técnica.'
  },
  perfil: {
    key: 'perfil',
    titleEs: 'Perfil Ciudadano',
    shuarText: 'Wi Perfil: Configuración tura datos personales.',
    phoneticText: 'Wi Perfyl: Konfygurasyon tura datos personales.',
    explanationEs: 'Configura tus datos de contacto, sector cantonal y preferencias de la aplicación.',
    voicePhrase: 'Wi Perfil. Perfil Ciudadano. Modifica tus datos de contacto y sector del cantón Logroño.'
  },
  idioma_toggle: {
    key: 'idioma_toggle',
    titleEs: 'Cambiar Idioma Intercultural',
    shuarText: 'Shuar Chicham tura Español yapajtai.',
    phoneticText: 'Shuar Chicham tura Españo yapahtay.',
    explanationEs: 'Alterna entre el idioma Español y el idioma Shuar Chicham en toda la interfaz.',
    voicePhrase: 'Shuar Chicham yapajtai. Idioma intercultural Shuar y Español.'
  }
};

// Listeners type for subscribers
type VoiceGuideListener = (state: {
  isPlaying: boolean;
  activeKey: string | null;
  entry: ShuarVoiceEntry | null;
  isGuideModeActive: boolean;
}) => void;

class ShuarVoiceService {
  private isPlaying: boolean = false;
  private activeKey: string | null = null;
  private isGuideModeActive: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private listeners: Set<VoiceGuideListener> = new Set();

  constructor() {
    // Initial setup
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Pre-warm voices
      };
    }
  }

  public subscribe(listener: VoiceGuideListener): () => void {
    this.listeners.add(listener);
    // Initial emit
    listener({
      isPlaying: this.isPlaying,
      activeKey: this.activeKey,
      entry: this.activeKey ? SHUAR_VOICE_GUIDE_DATA[this.activeKey] || null : null,
      isGuideModeActive: this.isGuideModeActive
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const entry = this.activeKey ? SHUAR_VOICE_GUIDE_DATA[this.activeKey] || null : null;
    this.listeners.forEach((cb) => {
      try {
        cb({
          isPlaying: this.isPlaying,
          activeKey: this.activeKey,
          entry,
          isGuideModeActive: this.isGuideModeActive
        });
      } catch {
        // safe
      }
    });
  }

  /**
   * Play a short melodic chime to give instant audio feedback
   */
  public playMelodicChime(type: 'guide' | 'success' | 'click' = 'guide') {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'guide') {
        // Two-tone warm pentatonic welcome chime (Morona Santiago acoustic tone)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.25); // G5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.46);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  /**
   * Speak guide entry in Shuar
   */
  public speak(keyOrPhrase: string, customTitle?: string) {
    this.playMelodicChime('guide');

    const entry = SHUAR_VOICE_GUIDE_DATA[keyOrPhrase];
    this.activeKey = entry ? entry.key : keyOrPhrase;
    this.isPlaying = true;
    this.notify();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      // Simulation timer if TTS not supported
      setTimeout(() => {
        this.isPlaying = false;
        this.notify();
      }, 3500);
      return;
    }

    // Cancel existing speech
    window.speechSynthesis.cancel();

    let textToSpeak = '';
    if (entry) {
      textToSpeak = `${entry.voicePhrase}`;
    } else {
      textToSpeak = customTitle || keyOrPhrase;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    this.currentUtterance = utterance;

    // Pick best voice (prefer Spanish Latin American / Ecuadorian / clear female or male)
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find((v) => v.lang.startsWith('es') || v.lang.includes('ES') || v.lang.includes('MX'));
    if (esVoice) {
      utterance.voice = esVoice;
    }

    utterance.lang = 'es-EC';
    utterance.rate = 0.94; // slightly relaxed for clear pronunciation of Shuar phonetics
    utterance.pitch = 1.05; // warm friendly tone
    utterance.volume = 1.0;

    utterance.onend = () => {
      this.isPlaying = false;
      this.notify();
    };

    utterance.onerror = () => {
      this.isPlaying = false;
      this.notify();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      this.isPlaying = false;
      this.notify();
    }
  }

  /**
   * Trigger guide on button click (if guide mode is active or explicitly triggered)
   */
  public guideAction(key: string, forceSpeak: boolean = false) {
    if (this.isGuideModeActive || forceSpeak) {
      this.speak(key);
    }
  }

  /**
   * Toggle Guide Mode ON/OFF
   */
  public setGuideMode(active: boolean) {
    this.isGuideModeActive = active;
    this.notify();
    if (active) {
      this.speak('welcome_intro');
    } else {
      this.stop();
    }
  }

  public toggleGuideMode() {
    this.setGuideMode(!this.isGuideModeActive);
  }

  public getIsGuideModeActive(): boolean {
    return this.isGuideModeActive;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.notify();
  }
}

export const shuarVoiceService = new ShuarVoiceService();
