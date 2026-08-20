import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Incident } from '../types';
import { 
  Navigation, 
  MapPin, 
  Route, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Share2, 
  Copy, 
  Check, 
  Clock, 
  X,
  LocateFixed,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Zap,
  Radio
} from 'lucide-react';

interface RouteGpsModalProps {
  incident: Incident;
  onClose: () => void;
  onOpenInspector?: (incident: Incident) => void;
}

const GAD_MUNICIPAL_COORDS: [number, number] = [-2.6280, -78.1760];

// Haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const RouteGpsModal: React.FC<RouteGpsModalProps> = ({
  incident,
  onClose,
  onOpenInspector
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  // Simulation journey state
  const [isJourneyRunning, setIsJourneyRunning] = useState(true);
  const [journeyProgress, setJourneyProgress] = useState(0); // 0 to 100%
  const [journeyStatus, setJourneyStatus] = useState<'en_ruta' | 'llegado'>('en_ruta');
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 1x, 2x

  const targetLat = incident.location.lat || -2.6280;
  const targetLng = incident.location.lng || -78.1760;

  // Origin can be live user GPS if detected, otherwise default to GAD Municipal Logroño
  const originLat = userLocation ? userLocation[0] : GAD_MUNICIPAL_COORDS[0];
  const originLng = userLocation ? userLocation[1] : GAD_MUNICIPAL_COORDS[1];

  const totalDistanceKm = calculateDistanceKm(originLat, originLng, targetLat, targetLng);
  const formattedDistance = totalDistanceKm < 1 
    ? `${Math.round(totalDistanceKm * 1000)} m` 
    : `${totalDistanceKm.toFixed(2)} km`;
  
  // Approximate driving time
  const totalDrivingMinutes = Math.max(1, Math.round((totalDistanceKm / 30) * 60));

  // Current remaining distance and ETA based on progress
  const remainingDistanceKm = totalDistanceKm * (1 - journeyProgress / 100);
  const formattedRemainingDistance = remainingDistanceKm < 0.05 
    ? '0 m (¡En el punto!)' 
    : remainingDistanceKm < 1 
      ? `${Math.round(remainingDistanceKm * 1000)} m` 
      : `${remainingDistanceKm.toFixed(2)} km`;
  const remainingMinutes = Math.max(0, Math.ceil(totalDrivingMinutes * (1 - journeyProgress / 100)));

  // Google Maps Navigation URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat.toFixed(6)},${originLng.toFixed(6)}&destination=${targetLat.toFixed(6)},${targetLng.toFixed(6)}&travelmode=driving`;

  // Compute interpolated waypoints for realistic route
  const waypoints = React.useMemo(() => {
    const pts: [number, number][] = [];
    const midLat = originLat + (targetLat - originLat) * 0.5 + 0.0004;
    const midLng = originLng + (targetLng - originLng) * 0.5 - 0.0006;

    const baseKeypoints: [number, number][] = [
      [originLat, originLng],
      [originLat + (midLat - originLat) * 0.5, originLng],
      [midLat, midLng],
      [targetLat, midLng],
      [targetLat, targetLng]
    ];

    // Subdivide into dense points for smooth vehicle animation (120 steps)
    const stepsPerSegment = 25;
    for (let i = 0; i < baseKeypoints.length - 1; i++) {
      const p1 = baseKeypoints[i];
      const p2 = baseKeypoints[i + 1];
      for (let s = 0; s < stepsPerSegment; s++) {
        const t = s / stepsPerSegment;
        pts.push([
          p1[0] + (p2[0] - p1[0]) * t,
          p1[1] + (p2[1] - p1[1]) * t
        ]);
      }
    }
    pts.push([targetLat, targetLng]);
    return pts;
  }, [originLat, originLng, targetLat, targetLng]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [(originLat + targetLat) / 2, (originLng + targetLng) / 2],
      zoom: 15,
      zoomControl: true
    });

    const tileUrl = mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileAttribution = mapType === 'satellite'
      ? '&copy; Esri &mdash; GAD Municipal Logroño'
      : '&copy; OpenStreetMap contributors &mdash; GAD Logroño';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: tileAttribution
    }).addTo(map);

    // 1. Origin Marker (GAD Municipal or User GPS)
    const originPinHtml = `
      <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; inset:-4px; background:rgba(21,154,68,0.35); border-radius:50%; animation:ping 2s infinite;"></div>
        <div style="
          width:28px; 
          height:28px; 
          background:#159A44; 
          border:2.5px solid #ffffff; 
          border-radius:8px; 
          box-shadow:0 4px 10px rgba(0,0,0,0.5); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          color:#ffffff;
        ">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
            <path d="M6 12h12"/>
            <path d="M6 7h12"/>
          </svg>
        </div>
      </div>
    `;

    const originIcon = L.divIcon({
      html: originPinHtml,
      className: 'origin-marker-icon',
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const originMarker = L.marker([originLat, originLng], { icon: originIcon }).addTo(map);
    originMarker.bindPopup(`
      <div style="padding:4px; font-family:sans-serif; text-align:center;">
        <strong style="color:#159A44; font-size:12px;">Punto de Partida</strong><br/>
        <span style="font-size:10px; color:#334155;">${userLocation ? 'Tu Ubicación GPS en Vivo' : 'Edificio Central GAD Municipal Logroño'}</span>
      </div>
    `);

    // 2. Destination Marker (Incident Exact Location)
    const destPinHtml = `
      <div style="position:relative; width:38px; height:38px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; inset:0; background:rgba(10,65,145,0.4); border-radius:50%; animation:ping 1.5s infinite;"></div>
        <div style="
          width:30px; 
          height:30px; 
          background:#0A4191; 
          border:3px solid #ffffff; 
          border-radius:50%; 
          box-shadow:0 4px 12px rgba(10,65,145,0.8); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          color:#ffffff;
        ">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `;

    const destIcon = L.divIcon({
      html: destPinHtml,
      className: 'dest-marker-icon',
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const destMarker = L.marker([targetLat, targetLng], { icon: destIcon }).addTo(map);
    destMarker.bindPopup(`
      <div style="padding:6px; font-family:sans-serif; min-width:180px;">
        <span style="background:#0A4191; color:#fff; font-size:9px; font-weight:bold; padding:2px 6px; border-radius:4px;">
          ${incident.code}
        </span>
        <strong style="color:#0A4191; font-size:12px; display:block; margin-top:4px;">
          ${incident.title}
        </strong>
        <p style="font-size:10px; color:#475569; margin:2px 0;">
          Sector: <strong>${incident.location.sector}</strong>
        </p>
        <p style="font-size:10px; color:#64748b; margin:0;">
          ${incident.location.address || 'Ubicación Georreferenciada'}
        </p>
      </div>
    `).openPopup();

    // 3. Draw Route Polyline
    L.polyline(waypoints, {
      color: '#082f49',
      weight: 8,
      opacity: 0.45,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    L.polyline(waypoints, {
      color: '#0284c7',
      weight: 5,
      opacity: 0.95,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // 4. Moving Vehicle Marker (Cuadrilla / Móvil GAD Logroño)
    const vehicleIconHtml = `
      <div style="position:relative; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; inset:0; background:rgba(245, 158, 11, 0.4); border-radius:50%; animation:ping 1s infinite;"></div>
        <div style="
          width:32px; 
          height:32px; 
          background:linear-gradient(135deg, #f59e0b, #d97706); 
          border:2.5px solid #ffffff; 
          border-radius:50%; 
          box-shadow:0 4px 12px rgba(217,119,6,0.9); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          color:#ffffff;
          font-size:16px;
        ">
          🚒
        </div>
      </div>
    `;

    const vehicleIcon = L.divIcon({
      html: vehicleIconHtml,
      className: 'vehicle-route-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const vMarker = L.marker([originLat, originLng], { icon: vehicleIcon, zIndexOffset: 1000 }).addTo(map);
    vMarker.bindPopup(`
      <div style="padding:4px; font-family:sans-serif; text-align:center;">
        <strong style="color:#d97706; font-size:11px;">Móvil de Respuesta GAD</strong><br/>
        <span style="font-size:9px; color:#475569;">En trayecto a incidencia</span>
      </div>
    `);
    vehicleMarkerRef.current = vMarker;

    // Fit bounds
    const bounds = L.latLngBounds([
      [originLat, originLng],
      [targetLat, targetLng]
    ]);
    map.fitBounds(bounds.pad(0.35));

    mapInstanceRef.current = map;

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [originLat, originLng, targetLat, targetLng, mapType, userLocation, waypoints]);

  // Automated Vehicle Movement along the route (Journey Simulation)
  useEffect(() => {
    if (!isJourneyRunning || waypoints.length === 0) return;

    let currentIndex = Math.floor((journeyProgress / 100) * (waypoints.length - 1));

    const interval = setInterval(() => {
      currentIndex += simulationSpeed;
      if (currentIndex >= waypoints.length - 1) {
        currentIndex = waypoints.length - 1;
        setJourneyProgress(100);
        setJourneyStatus('llegado');
        setIsJourneyRunning(false);
        clearInterval(interval);
      } else {
        const progress = (currentIndex / (waypoints.length - 1)) * 100;
        setJourneyProgress(progress);
      }

      const currentPos = waypoints[currentIndex];
      if (vehicleMarkerRef.current && currentPos) {
        vehicleMarkerRef.current.setLatLng(currentPos);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isJourneyRunning, waypoints, simulationSpeed, journeyProgress]);

  // Automatic Spanish Voice Guidance on Mount
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    
    // Slight delay so the modal mounts smoothly
    const timer = setTimeout(() => {
      window.speechSynthesis.cancel();
      const voiceMessage = `Iniciando recorrido GPS hacia ${incident.title}, en el sector ${incident.location.sector}. Distancia: ${formattedDistance}. Por favor siga la ruta trazada en el mapa hacia el destino.`;
      const utterance = new SpeechSynthesisUtterance(voiceMessage);
      utterance.lang = 'es-EC';
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }, 600);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis?.cancel();
    };
  }, [incident, formattedDistance]);

  // Reset journey to start
  const handleRestartJourney = () => {
    setJourneyProgress(0);
    setJourneyStatus('en_ruta');
    setIsJourneyRunning(true);
    if (vehicleMarkerRef.current && waypoints.length > 0) {
      vehicleMarkerRef.current.setLatLng(waypoints[0]);
    }
  };

  // Real-time Device Geolocation
  const handleDetectUserLocation = () => {
    setIsLocatingUser(true);
    if (!navigator.geolocation) {
      setIsLocatingUser(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingUser(false);
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setJourneyProgress(0);
        setJourneyStatus('en_ruta');
        setIsJourneyRunning(true);
      },
      () => {
        setIsLocatingUser(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Copy Google Maps Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(googleMapsUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // WhatsApp Share
  const handleShareWhatsApp = () => {
    const text = `🚨 *DESPACHO DE RUTA GAD LOGROÑO*\n\n` +
      `📋 *Trámite:* ${incident.code} - ${incident.title}\n` +
      `📍 *Sector:* ${incident.location.sector}\n` +
      `📌 *Dirección:* ${incident.location.address || 'Ubicación exacta'}\n` +
      `📏 *Distancia:* ${formattedDistance} (~${totalDrivingMinutes} min)\n` +
      `🗺️ *Navegación GPS Google Maps:*\n${googleMapsUrl}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Toggle Voice
  const handleToggleVoice = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const voiceMessage = `Ruta en progreso hacia ${incident.title}. Distancia restante: ${formattedRemainingDistance}. Tiempo estimado: ${remainingMinutes} minutos.`;
    const utterance = new SpeechSynthesisUtterance(voiceMessage);
    utterance.lang = 'es-EC';
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-gradient-to-b from-white via-slate-50 to-blue-50/20 rounded-3xl max-w-4xl w-full border-2 border-[#0A4191] shadow-2xl overflow-hidden flex flex-col max-h-[96vh] text-slate-800">
        
        {/* Header with High-Visibility "Atender Incidencia" button */}
        <div className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] p-3.5 sm:p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#0A4191]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-amber-300 flex items-center justify-center shadow-md shrink-0">
              <Route className="w-6 h-6 stroke-[2.5] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-white/20 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-md border border-white/30 shadow-2xs">
                  {incident.code}
                </span>
                <span className="text-[11px] sm:text-xs font-black text-amber-300 uppercase tracking-wide flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Recorrido GPS en Vivo</span>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight mt-0.5 line-clamp-1">
                {incident.title}
              </h2>
            </div>
          </div>

          {/* Action buttons in header */}
          <div className="flex items-center space-x-2 self-end sm:self-auto flex-wrap">
            {/* BOTÓN PRINCIPAL ATENDER INCIDENCIA */}
            {onOpenInspector && (
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) window.speechSynthesis?.cancel();
                  onClose();
                  onOpenInspector(incident);
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-black text-xs sm:text-sm flex items-center space-x-2 shadow-lg border border-emerald-300/40 transition-all cursor-pointer active:scale-95 animate-pulse"
                title="Atender y resolver esta incidencia ahora"
              >
                <UserCheck className="w-4 h-4 text-emerald-100" />
                <span>Atender Incidencia</span>
              </button>
            )}

            {/* Map Layer Switcher */}
            <div className="flex bg-black/30 p-0.5 rounded-xl border border-white/20">
              <button
                type="button"
                onClick={() => setMapType('roadmap')}
                className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                  mapType === 'roadmap'
                    ? 'bg-white text-[#0A4191] shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Vías
              </button>
              <button
                type="button"
                onClick={() => setMapType('satellite')}
                className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                  mapType === 'satellite'
                    ? 'bg-white text-[#0A4191] shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Satelital
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isSpeaking) window.speechSynthesis?.cancel();
                onClose();
              }}
              className="text-white hover:bg-white/20 font-black text-lg w-8 h-8 rounded-full border border-white/30 flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Journey Progress & Simulation Control Bar */}
        <div className="bg-slate-900 text-white px-3.5 sm:px-4 py-2.5 border-b border-blue-400/30 flex flex-col gap-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            
            {/* Origin -> Destination text */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1.5 font-medium text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <strong className="text-white">Origen:</strong>
                <span>{userLocation ? 'GPS Técnico' : 'GAD Logroño'}</span>
              </div>

              <span className="text-slate-500">➔</span>

              <div className="flex items-center space-x-1.5 font-medium text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] inline-block" />
                <strong className="text-white">Destino:</strong>
                <span className="text-amber-300 font-bold">{incident.location.sector}</span>
              </div>
            </div>

            {/* Recorrido Controls */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsJourneyRunning(!isJourneyRunning)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center space-x-1 transition-all cursor-pointer ${
                  isJourneyRunning
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
                }`}
                title={isJourneyRunning ? 'Pausar recorrido simulado' : 'Continuar recorrido simulado'}
              >
                {isJourneyRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Iniciar Recorrido</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRestartJourney}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer border border-white/20"
                title="Reiniciar recorrido desde el punto de partida"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>

              <button
                type="button"
                onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : 1)}
                className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 rounded-lg text-[11px] font-mono font-bold border border-blue-400/30"
                title="Cambiar velocidad de avance"
              >
                {simulationSpeed}x Vel
              </button>
            </div>

          </div>

          {/* Progress bar along route */}
          <div className="flex items-center space-x-3 pt-1">
            <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-white/20 relative">
              <div 
                className={`h-full transition-all duration-200 ${
                  journeyStatus === 'llegado' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                    : 'bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400'
                }`}
                style={{ width: `${journeyProgress}%` }}
              />
            </div>

            <div className="flex items-center space-x-2 shrink-0 font-mono text-[11px]">
              <span className="text-amber-300 font-bold">
                {journeyStatus === 'llegado' ? '🏁 ¡Llegada al Destino!' : `🚒 Avance: ${Math.round(journeyProgress)}%`}
              </span>
              <span className="text-blue-300 font-bold">
                Restante: {formattedRemainingDistance}
              </span>
              <span className="text-emerald-300 font-bold">
                ⏱️ ~{remainingMinutes} min
              </span>
            </div>
          </div>

        </div>

        {/* Map Canvas Container */}
        <div className="relative flex-1 min-h-[360px] sm:min-h-[420px] w-full bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Floating live badge */}
          <div className="absolute top-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-blue-400/40 shadow-lg text-[11px] font-bold flex items-center space-x-2 pointer-events-none">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Móvil de Respuesta en Ruta hacia: <strong className="text-amber-300">{incident.title}</strong></span>
          </div>

          {/* Direct Google Maps Floating Action Button on Canvas */}
          <div className="absolute bottom-3 right-3 z-[1000]">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] text-white rounded-xl font-black text-xs flex items-center space-x-1.5 shadow-xl border border-blue-300/40 transition-all cursor-pointer active:scale-95"
              title="Abrir en Google Maps (Navegación Externa)"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>Abrir Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
            </a>
          </div>
        </div>

        {/* Actions & Navigation Controls Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* BOTÓN ATENDER INCIDENCIA DESTACADO */}
            {onOpenInspector && (
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) window.speechSynthesis?.cancel();
                  onClose();
                  onOpenInspector(incident);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 border border-emerald-400/40"
              >
                <UserCheck className="w-4 h-4 text-emerald-100" />
                <span>Atender Incidencia</span>
              </button>
            )}

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] hover:to-[#0A4191] text-white rounded-xl font-black text-xs flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer active:scale-95 border border-blue-400/30"
              title="Abrir indicaciones guiadas en Google Maps"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>Abrir en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
            </a>

            <button
              type="button"
              onClick={handleToggleVoice}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer border active:scale-95 ${
                isSpeaking
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
              title="Escuchar indicaciones de ruta por voz"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-white" />
                  <span>Detener Voz</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#0A4191]" />
                  <span>Voz GPS</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Actions: WhatsApp Share, Copy Link, Detect GPS */}
          <div className="flex items-center space-x-2 self-end sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={handleDetectUserLocation}
              disabled={isLocatingUser}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
              title="Calcular ruta desde mi ubicación GPS actual"
            >
              <LocateFixed className={`w-3.5 h-3.5 text-[#0A4191] ${isLocatingUser ? 'animate-spin' : ''}`} />
              <span>{isLocatingUser ? 'Localizando...' : 'Desde Mi GPS'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-3 py-2 bg-[#25D366] hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Compartir ruta y coordenadas con la cuadrilla por WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
              title="Copiar enlace de Google Maps"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
