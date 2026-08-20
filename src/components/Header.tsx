import React, { useState } from 'react';
import { ActiveTab, LanguageMode, UserProfile } from '../types';
import { SHUAR_DICTIONARY } from '../data/shuarDictionary';
import { BreadcrumbNav, BreadcrumbStep } from './BreadcrumbNav';
import { AdminLoginModal } from './AdminLoginModal';
import { 
  Building2, 
  Smartphone, 
  LayoutDashboard, 
  Bot, 
  Languages, 
  Wifi, 
  WifiOff, 
  ShieldAlert,
  LogOut,
  UserCheck,
  AlertTriangle,
  Lock,
  ShieldCheck,
  X
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: LanguageMode;
  setLang: (l: LanguageMode) => void;
  isOnline: boolean;
  offlineCount: number;
  openLogroBot: () => void;
  isLogroBotOpen?: boolean;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onAdminLoginSuccess?: (user: UserProfile) => void;
  breadcrumbHistory?: BreadcrumbStep[];
  breadcrumbIndex?: number;
  onNavigateToStep?: (index: number) => void;
  onGoBack?: () => void;
  onResetToHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isOnline,
  offlineCount,
  openLogroBot,
  isLogroBotOpen = false,
  currentUser,
  onLogout,
  onAdminLoginSuccess,
  breadcrumbHistory,
  breadcrumbIndex = 0,
  onNavigateToStep,
  onGoBack,
  onResetToHome
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const handlePanelGadClick = () => {
    if (isAdmin) {
      setActiveTab('admin_dashboard');
    } else {
      setShowAdminLoginModal(true);
    }
  };

  return (
    <header className="bg-white text-[#0A4191] shadow-md border-b-2 border-[#0A4191] sticky top-0 z-40">
      {/* Top Banner: GAD Municipal Info */}
      <div className="bg-blue-50 px-4 py-1.5 border-b border-blue-200 text-xs text-[#0A4191] flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#0A4191] animate-pulse"></span>
          <span className="font-bold tracking-wide">GOBIERNO AUTÓNOMO DESCENTRALIZADO MUNICIPAL DEL CANTÓN LOGROÑO</span>
          <span className="hidden sm:inline text-blue-400">|</span>
          <span className="hidden sm:inline text-slate-600">Morona Santiago, Ecuador</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Offline/Online Status Badge */}
          <div className="flex items-center space-x-1.5 bg-white px-2.5 py-0.5 rounded-full border border-blue-300 shadow-2xs" title={isOnline ? "Red Conectada" : `Modo Offline (${offlineCount} en cola)`}>
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-bold text-slate-700 hidden sm:inline">Red Conectada</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[11px] font-bold text-amber-700 hidden sm:inline">Offline ({offlineCount})</span>
                <span className="text-[10px] font-bold text-amber-700 sm:hidden">({offlineCount})</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog Modal for Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-[#0A4191] rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 text-slate-900 relative">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-tight">¿Cerrar Sesión?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Confirmación para prevenir acciones accidentales</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Está a punto de salir de su cuenta municipal. Deberá iniciar sesión nuevamente para acceder a sus trámites y reportes.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  if (onLogout) onLogout();
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sí, salir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 bg-white">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('citizen_app')}>
          <div className="w-11 h-11 rounded-xl bg-[#0A4191] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#0A4191]" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-[#0A4191]">
                Logroño Conecta
              </h1>
              <span className="bg-blue-100 text-[#0A4191] text-[10px] font-bold px-2 py-0.5 rounded border border-blue-300 uppercase">
                2026 GAD Digital
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {lang === 'shuar'
                ? SHUAR_DICTIONARY.welcome.shuar
                : 'Participación Ciudadana y Gestión Inteligente de Incidencias'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-white p-1.5 rounded-xl border-2 border-[#0A4191] overflow-x-auto max-w-full">
          <button
            id="nav-tab-citizen-app"
            onClick={() => setActiveTab('citizen_app')}
            title="App Ciudadana (PWA)"
            className={`flex items-center space-x-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-2 border-[#0A4191] ${
              activeTab === 'citizen_app'
                ? 'bg-blue-50 text-[#0A4191] shadow-xs font-black ring-2 ring-[#0A4191]/20'
                : 'bg-white text-[#0A4191] hover:bg-blue-50'
            }`}
          >
            <Smartphone className="w-4 h-4 flex-shrink-0 text-[#0A4191]" />
            <span className="hidden sm:inline">App Ciudadana</span>
          </button>

          <button
            id="nav-tab-admin-dashboard"
            onClick={handlePanelGadClick}
            title={isAdmin ? "Panel Municipal GAD (Sesión Activa)" : "Ingresar al Panel Municipal GAD con Usuario y Contraseña"}
            className={`flex items-center space-x-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-2 border-[#0A4191] relative group active:scale-95 ${
              activeTab === 'admin_dashboard'
                ? 'bg-[#0A4191] text-white shadow-md font-black ring-2 ring-[#0A4191]/30'
                : 'bg-white text-[#0A4191] hover:bg-blue-50'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 flex-shrink-0 ${activeTab === 'admin_dashboard' ? 'text-amber-300' : 'text-[#0A4191]'}`} />
            <span className="hidden sm:inline">Panel GAD</span>
            {!isAdmin ? (
              <span className="flex items-center text-[10px] text-amber-600 bg-amber-50 px-1 py-0.2 rounded border border-amber-300 font-bold" title="Requiere Login">
                <Lock className="w-2.5 h-2.5 mr-0.5" />
                <span className="hidden md:inline">Login</span>
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400 border border-white" title="Sesión Administrador Activa" />
            )}
          </button>

          <button
            id="nav-tab-logrobot-ai"
            onClick={openLogroBot}
            title={isLogroBotOpen ? "Ocultar Asistente LogroBot IA" : "Mostrar Asistente LogroBot IA"}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer border-2 ${
              isLogroBotOpen
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/40'
                : 'bg-white hover:bg-blue-50 text-[#0A4191] border-[#0A4191]'
            }`}
          >
            <Bot className={`w-4 h-4 flex-shrink-0 ${isLogroBotOpen ? 'text-amber-300' : 'text-[#0A4191]'}`} />
            <span className="hidden sm:inline">LogroBot IA</span>
            <span className="sm:hidden font-extrabold text-[11px]">IA</span>
          </button>

          {onLogout && (
            <button
              id="nav-tab-logout"
              onClick={() => setShowLogoutModal(true)}
              title="Cerrar sesión / Salir"
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-black bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border-2 border-red-500 hover:border-red-600 transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95 group"
            >
              <LogOut className="w-4 h-4 flex-shrink-0 text-red-600 group-hover:text-white stroke-[2.5]" />
              <span className="font-black">Salir</span>
            </button>
          )}
        </nav>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        lang={lang}
        onLoginSuccess={(adminUser) => {
          if (onAdminLoginSuccess) {
            onAdminLoginSuccess(adminUser);
          } else {
            setActiveTab('admin_dashboard');
          }
        }}
      />

      {/* Interactive Breadcrumb Navigation History Bar */}
      {breadcrumbHistory && breadcrumbHistory.length > 0 && onNavigateToStep && onGoBack && onResetToHome && (
        <BreadcrumbNav
          history={breadcrumbHistory}
          currentIndex={breadcrumbIndex}
          onNavigateToStep={onNavigateToStep}
          onGoBack={onGoBack}
          onResetToHome={onResetToHome}
          lang={lang}
        />
      )}
    </header>
  );
};
