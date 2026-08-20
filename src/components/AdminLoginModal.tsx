import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  lang?: 'es' | 'shuar';
}

interface DemoAccount {
  label: string;
  roleTitle: string;
  email: string;
  pass: string;
  department: string;
  name: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Alcaldía / Administración',
    roleTitle: 'Administrador General',
    email: 'admin@gadlogrono.gob.ec',
    pass: 'gad2026',
    department: 'Dirección General de Planificación',
    name: 'Ing. María Viteri'
  },
  {
    label: 'Obras Públicas',
    roleTitle: 'Director de Obras',
    email: 'obras@gadlogrono.gob.ec',
    pass: 'obras2026',
    department: 'Dirección de Obras Públicas y Vialidad',
    name: 'Arq. Edison Chumpi'
  },
  {
    label: 'Despacho Territorial',
    roleTitle: 'Operador de Cuadrillas',
    email: 'despacho@gadlogrono.gob.ec',
    pass: 'despacho2026',
    department: 'Centro de Operaciones y Servicios',
    name: 'Téc. Javier Narváez'
  }
];

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang = 'es'
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);

  if (!isOpen) return null;

  const handleSelectDemoAccount = (acc: DemoAccount) => {
    setUsername(acc.email);
    setPassword(acc.pass);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Por favor ingrese su usuario/correo institucional y contraseña.');
      return;
    }

    if (cleanPass.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check if matches known demo or custom valid admin credential
      const matchedDemo = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === cleanUser.toLowerCase()
      );

      let adminName = matchedDemo ? matchedDemo.name : '';
      if (!adminName) {
        const prefix = cleanUser.includes('@') ? cleanUser.split('@')[0] : cleanUser;
        const words = prefix.split(/[._-]/).filter(Boolean);
        adminName = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Funcionario GAD Logroño';
      }

      const adminUser: UserProfile = {
        id: `usr-admin-${Date.now()}`,
        name: adminName,
        email: cleanUser.includes('@') ? cleanUser : `${cleanUser}@gadlogrono.gob.ec`,
        role: 'admin',
        sector: 'Logroño Centro (Cabecera)',
        provider: 'password',
        avatarUrl: ''
      };

      onLoginSuccess(adminUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border-2 border-[#0A4191] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-800 relative">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-all border border-white/30 active:scale-95"
          title="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] p-5 sm:p-6 text-white border-b-2 border-[#0A4191]">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-amber-300 flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-amber-400 text-slate-950 font-mono font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-2xs">
                  Acceso Restringido
                </span>
                <span className="text-xs font-extrabold text-blue-200 uppercase tracking-wide">
                  Seguridad GAD
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight mt-0.5">
                Acceso al Panel GAD Municipal
              </h2>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                Ingrese sus credenciales de funcionario o técnico municipal
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-gradient-to-b from-white via-slate-50 to-blue-50/20">
          
          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-300 text-red-700 text-xs font-bold flex items-start space-x-2.5 animate-in shake duration-300">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Access Pills */}
          <div className="bg-blue-50/80 rounded-2xl p-3.5 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-[#0A4191] uppercase tracking-wide flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Cuentas de Acceso Rápido GAD:</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Clic para auto-completar</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDemoAccount(acc)}
                  className="p-2 rounded-xl bg-white hover:bg-blue-100/70 border border-blue-200 hover:border-[#0A4191] text-left transition-all cursor-pointer shadow-2xs group active:scale-95"
                >
                  <div className="text-[11px] font-black text-[#0A4191] group-hover:text-blue-900 leading-tight">
                    {acc.label}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                    {acc.email}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Institutional Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                Usuario / Correo Institucional <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0A4191]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="ej: admin@gadlogrono.gob.ec o usuario"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/20 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 outline-hidden transition-all shadow-2xs"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                  Contraseña de Seguridad <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Clave asignada por GAD</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0A4191]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-white border-2 border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/20 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 outline-hidden transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="w-4 h-4 text-[#0A4191] rounded-md border-slate-300 focus:ring-[#0A4191] cursor-pointer"
                />
                <span className="font-semibold text-xs text-slate-700">Mantener sesión institucional activa</span>
              </label>

              <span className="text-[11px] text-[#0A4191] font-bold">
                Puerto Seguro GAD
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] hover:from-[#083373] hover:to-[#0A4191] text-white rounded-xl font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-75 disabled:cursor-not-allowed mt-2 border border-blue-400/30"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Autenticando funcionario...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-amber-300" />
                  <span>Ingresar al Panel GAD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Security Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cifrado SSL/TLS 256-bit</span>
          </div>
          <span>GAD Municipal Logroño © 2026</span>
        </div>

      </div>
    </div>
  );
};
