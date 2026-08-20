import React, { useState, useMemo } from 'react';
import { 
  MUNICIPAL_DIRECTORY, 
  DIRECTORY_AREAS, 
  DirectoryEntry 
} from '../data/municipalDirectory';
import { 
  Users, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Filter, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  ArrowLeft,
  Briefcase,
  Layers,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  UserCheck
} from 'lucide-react';

interface MunicipalDirectoryProps {
  onBack?: () => void;
  lang?: 'es' | 'shuar';
}

export const MunicipalDirectory: React.FC<MunicipalDirectoryProps> = ({
  onBack,
  lang = 'es'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('TODAS');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<DirectoryEntry | null>(null);

  // Filtered directory list
  const filteredList = useMemo(() => {
    return MUNICIPAL_DIRECTORY.filter((item) => {
      const matchArea = selectedArea === 'TODAS' || item.area === selectedArea;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.usuario.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        (item.email && item.email.toLowerCase().includes(q));

      return matchArea && matchSearch;
    });
  }, [searchQuery, selectedArea]);

  // Copy email
  const handleCopyEmail = (entry: DirectoryEntry) => {
    if (entry.email) {
      navigator.clipboard.writeText(entry.email);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Export JSON/CSV
  const handleExportCSV = () => {
    const headers = 'Área,Usuario,Correo Institucional,Teléfono,Ubicación\n';
    const rows = filteredList
      .map(
        (i) =>
          `"${i.area}","${i.usuario}","${i.email || ''}","${i.telefono || ''}","${i.ubicacion || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Directorio_Municipal_Logrono_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 border-2 border-[#0A4191] rounded-3xl p-4 sm:p-6 shadow-xl space-y-5 text-slate-800 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white p-4 sm:p-5 rounded-2xl border-b-2 border-[#0A4191] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 -mx-1 -mt-1">
        <div className="flex items-center space-x-3.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 text-white hover:bg-white/20 rounded-full cursor-pointer transition-colors border border-white/20 active:scale-95 shrink-0"
              title="Volver a Inicio"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-amber-300 flex items-center justify-center shadow-sm shrink-0">
            <Users className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black font-mono text-amber-300 bg-white/15 px-2.5 py-0.5 rounded border border-white/20 uppercase tracking-wider shadow-2xs">
                Plantilla Oficial GAD
              </span>
              <span className="text-xs text-blue-200 font-bold hidden sm:inline">
                • {MUNICIPAL_DIRECTORY.length} Funcionarios y Áreas
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white font-serif tracking-tight mt-0.5">
              Directorio Municipal & Funcionarios GAD Logroño
            </h2>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-white/30 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Descargar directorio completo en formato CSV"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#0A4191] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Total Servidores</span>
            <span className="text-base sm:text-lg font-black text-slate-900">{MUNICIPAL_DIRECTORY.length}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Áreas / Direcciones</span>
            <span className="text-base sm:text-lg font-black text-emerald-800">{DIRECTORY_AREAS.length}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Central Telefónica</span>
            <span className="text-xs sm:text-sm font-black text-amber-900">(07) 2700-100</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
            <Filter className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Mostrando</span>
            <span className="text-base sm:text-lg font-black text-purple-900">{filteredList.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-[#0A4191]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por funcionario, nombre o departamento..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#0A4191] focus:bg-white rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 outline-hidden transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Area Select Dropdown */}
          <div className="flex items-center space-x-2">
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full py-2.5 pl-3 pr-8 bg-slate-50 border border-slate-300 focus:border-[#0A4191] rounded-xl text-xs font-bold text-slate-700 outline-hidden cursor-pointer"
              >
                <option value="TODAS">🏢 Todas las Áreas ({MUNICIPAL_DIRECTORY.length})</option>
                {DIRECTORY_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0A4191] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista en Tarjetas"
              >
                Tarjetas
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#0A4191] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista en Tabla"
              >
                Tabla
              </button>
            </div>
          </div>

        </div>

        {/* Quick Area Pill Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar text-[11px]">
          <button
            type="button"
            onClick={() => setSelectedArea('TODAS')}
            className={`px-2.5 py-1 rounded-lg font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
              selectedArea === 'TODAS'
                ? 'bg-[#0A4191] text-white border-[#0A4191] shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Todas ({MUNICIPAL_DIRECTORY.length})
          </button>
          {DIRECTORY_AREAS.slice(0, 8).map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setSelectedArea(area)}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedArea === area
                  ? 'bg-[#0A4191] text-white border-[#0A4191] shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Results Content */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-black text-slate-700">No se encontraron resultados</h3>
          <p className="text-xs text-slate-500">
            Intente con otro término de búsqueda o seleccione otra área en los filtros.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedArea('TODAS');
            }}
            className="mt-2 px-3 py-1.5 bg-[#0A4191] text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredList.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border-2 border-slate-200/90 hover:border-[#0A4191] p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Area Tag */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black text-[#0A4191] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md leading-tight line-clamp-1 uppercase tracking-wide">
                    {entry.area}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    GAD LOGROÑO
                  </span>
                </div>

                {/* Name */}
                <div className="flex items-center space-x-2.5 mt-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0A4191] to-[#0C51B6] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    {entry.usuario
                      .split(' ')
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('')}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#0A4191] transition-colors leading-tight">
                      {entry.usuario}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {entry.cargo}
                    </span>
                  </div>
                </div>

                {/* Email / Contact details */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                  {entry.email && (
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="flex items-center space-x-1.5 text-slate-500 truncate mr-1">
                        <Mail className="w-3 h-3 text-[#0A4191] shrink-0" />
                        <span className="truncate font-mono">{entry.email}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(entry)}
                        className="text-slate-400 hover:text-[#0A4191] p-1 rounded cursor-pointer shrink-0"
                        title="Copiar correo"
                      >
                        {copiedId === entry.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  <div className="flex items-center space-x-1.5 text-slate-500 text-[10.5px]">
                    <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Central: {entry.telefono}</span>
                  </div>
                </div>
              </div>

              {/* Bottom quick actions */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:072700100`}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10.5px] font-extrabold flex items-center space-x-1 border border-emerald-200 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Llamar</span>
                </a>

                {entry.email && (
                  <a
                    href={`mailto:${entry.email}?subject=Consulta%20Institucional%20GAD%20Logroño`}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0A4191] text-[10.5px] font-extrabold flex items-center space-x-1 border border-blue-200 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Enviar Correo</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white font-black text-[11px] uppercase tracking-wider border-b border-[#0A4191]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Área / Dirección</th>
                  <th className="py-3 px-4">Usuario / Servidor Municipal</th>
                  <th className="py-3 px-4">Correo Institucional</th>
                  <th className="py-3 px-4">Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredList.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-400 text-[10px]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-[#0A4191]">
                      <span className="bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                        {entry.area}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-extrabold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#0A4191] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {entry.usuario.charAt(0)}
                        </div>
                        <span>{entry.usuario}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600">
                      <div className="flex items-center space-x-2">
                        <span>{entry.email}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(entry)}
                          className="text-slate-400 hover:text-[#0A4191] cursor-pointer"
                          title="Copiar"
                        >
                          {copiedId === entry.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <a
                          href="tel:072700100"
                          className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 hover:bg-emerald-100 flex items-center space-x-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>(07) 2700-100</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Info Box */}
      <div className="bg-slate-100 rounded-2xl p-3.5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-[#0A4191] shrink-0" />
          <span>
            <strong>Atención Presencial:</strong> Palacio Municipal, Calle 10 de Agosto y Av. 24 de Mayo | Lunes a Viernes 08:00 - 17:00
          </span>
        </div>
        <span className="font-bold text-[#0A4191]">
          Logroño - Morona Santiago, Ecuador
        </span>
      </div>

    </div>
  );
};
