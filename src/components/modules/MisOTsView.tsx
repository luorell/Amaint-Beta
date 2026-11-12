import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkOrder } from '../../types';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Filter,
  Flame,
  LayoutGrid,
  List,
  MapPin,
  Play,
  Search,
  ShieldAlert,
  User,
  Wrench,
  X,
  FileCheck,
  Package,
} from 'lucide-react';

export const MisOTsView: React.FC = () => {
  const {
    workOrders,
    setCurrentView,
    updateWorkOrder,
    showToast,
    activeOTDetailId,
    setActiveOTDetailId,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'in_progress' | 'pending' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const emergencyOT = workOrders.find((wo) => wo.priority === 'critical' && wo.status !== 'completed');

  const filteredOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'critical') return wo.priority === 'critical';
    if (filterType === 'in_progress') return wo.status === 'in_progress';
    if (filterType === 'pending') return wo.status === 'pending';
    if (filterType === 'completed') return wo.status === 'completed';
    return true;
  });

  const selectedOT = workOrders.find((wo) => wo.id === activeOTDetailId || wo.code === activeOTDetailId);

  const handleStartIntervention = (wo: WorkOrder) => {
    updateWorkOrder(wo.id, {
      status: 'in_progress',
      assignedTechnician: 'Carlos Mendoza',
      timeElapsed: '00h 02m',
      progressPercent: 20,
    });
    showToast('Intervención Iniciada', `OT ${wo.code} pasada a estado EN PROGRESO`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Shift Overview Header */}
      <div className="rounded-xl bg-surface-container-low border border-outline/10 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Turno A • Operaciones Planta
              </span>
              <span className="text-outline/40">•</span>
              <span className="text-xs font-mono text-on-surface-variant">07:00 - 15:30 hrs</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-on-surface tracking-tight">
              Mis Órdenes de Trabajo & Monitoreo
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Manufacturas Andina S.A. • Líneas Críticas Extrusión e Inyección
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('reportar-falla')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error hover:bg-error/90 text-on-error font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Flame className="w-4 h-4 fill-current animate-bounce" />
              <span>Reportar Falla Inmediata</span>
            </button>
          </div>
        </div>

        {/* Quick Shift Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-outline/10">
          <div className="bg-surface-container-lowest/60 p-3 rounded-lg border border-outline/5">
            <div className="text-[11px] font-mono text-on-surface-variant uppercase">Total Turno</div>
            <div className="text-lg font-bold font-mono text-on-surface mt-0.5">{workOrders.length} OTs</div>
          </div>
          <div className="bg-surface-container-lowest/60 p-3 rounded-lg border border-outline/5">
            <div className="text-[11px] font-mono text-error uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
              Paro / Emergencia
            </div>
            <div className="text-lg font-bold font-mono text-error mt-0.5">
              {workOrders.filter((wo) => wo.priority === 'critical' && wo.status !== 'completed').length} Crítica
            </div>
          </div>
          <div className="bg-surface-container-lowest/60 p-3 rounded-lg border border-outline/5">
            <div className="text-[11px] font-mono text-secondary uppercase">En Curso</div>
            <div className="text-lg font-bold font-mono text-secondary mt-0.5">
              {workOrders.filter((wo) => wo.status === 'in_progress').length} Intervenciones
            </div>
          </div>
          <div className="bg-surface-container-lowest/60 p-3 rounded-lg border border-outline/5">
            <div className="text-[11px] font-mono text-emerald-400 uppercase">Cumplimiento SLA</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">98.4%</div>
          </div>
        </div>
      </div>

      {/* Emergency OT Alert Card (if present) */}
      {emergencyOT && (
        <div className="rounded-xl bg-error-container/20 border-2 border-error/50 p-4 sm:p-5 relative overflow-hidden shadow-lg animate-in fade-in duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-error text-on-error shrink-0 shadow-md">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-error text-on-error font-mono font-bold text-xs">
                    EMERGENCIA PARO PLANTA
                  </span>
                  <span className="font-mono text-sm font-bold text-on-surface">{emergencyOT.code}</span>
                  <span className="text-outline/40">•</span>
                  <span className="font-mono text-xs text-on-surface-variant">{emergencyOT.assetCode}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-on-surface mt-1">
                  {emergencyOT.assetName}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1 line-clamp-2 max-w-2xl">
                  {emergencyOT.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono text-on-surface-variant">
                  <span className="flex items-center gap-1 text-error font-bold">
                    <Clock className="w-3.5 h-3.5" /> SLA Restante: {emergencyOT.slaRemaining || '12 min'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-secondary" /> {emergencyOT.location}
                  </span>
                  {emergencyOT.costEstimate && (
                    <span className="text-amber-400 font-semibold">{emergencyOT.costEstimate}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0">
              <button
                onClick={() => {
                  setActiveOTDetailId(emergencyOT.id);
                }}
                className="flex-1 lg:flex-none px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline/20 font-medium text-xs transition-colors"
              >
                Ver Ficha & Planos
              </button>
              <button
                onClick={() => handleStartIntervention(emergencyOT)}
                className="flex-1 lg:flex-none px-4 py-2 rounded-lg bg-error hover:bg-error/90 text-on-error font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Intervenir Ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and View Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-container-low p-3 rounded-xl border border-outline/10">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código OT, equipo, falla o ubicación..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline/15 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary font-mono"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center bg-surface-container-lowest p-1 rounded-lg border border-outline/10 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Todas ({workOrders.length})
            </button>
            <button
              onClick={() => setFilterType('critical')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                filterType === 'critical'
                  ? 'bg-error text-on-error font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Críticas
            </button>
            <button
              onClick={() => setFilterType('in_progress')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                filterType === 'in_progress'
                  ? 'bg-secondary text-on-secondary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              En Curso
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                filterType === 'pending'
                  ? 'bg-surface-container-highest text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Pendientes
            </button>
          </div>

          <div className="h-6 w-px bg-outline/20 mx-1" />

          {/* Card / Table View Toggle */}
          <div className="flex items-center bg-surface-container-lowest p-1 rounded-lg border border-outline/10">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'cards' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'
              }`}
              title="Vista en tarjetas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'
              }`}
              title="Vista en tabla densa"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Grid or Dense Table View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((wo) => {
            const isCritical = wo.priority === 'critical';
            const isInProgress = wo.status === 'in_progress';
            const isCompleted = wo.status === 'completed';

            return (
              <div
                key={wo.id}
                className={`rounded-xl bg-surface-container-low border transition-all hover:border-primary/40 p-4 flex flex-col justify-between ${
                  isCritical
                    ? 'border-error/40 bg-error-container/5'
                    : isInProgress
                    ? 'border-secondary/40'
                    : 'border-outline/15'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono font-bold text-sm text-primary tracking-tight">{wo.code}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isCritical
                          ? 'bg-error/20 text-error border border-error/30'
                          : isInProgress
                          ? 'bg-secondary/20 text-secondary border border-secondary/30'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {wo.status === 'in_progress' ? 'En Curso' : wo.status === 'completed' ? 'Cerrada' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-secondary font-medium">{wo.assetCode}</div>
                  <h4 className="text-sm font-bold text-on-surface mt-0.5 line-clamp-1">{wo.assetName}</h4>

                  <p className="text-xs text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
                    {wo.description}
                  </p>

                  {/* Progress bar if in progress */}
                  {isInProgress && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] font-mono text-on-surface-variant mb-1">
                        <span>Progreso Tarea</span>
                        <span className="font-bold text-secondary">{wo.progressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary transition-all"
                          style={{ width: `${wo.progressPercent}%` }}
                        />
                      </div>
                      {wo.currentStep && (
                        <div className="text-[10px] font-mono text-on-surface-variant/80 mt-1 truncate">
                          {wo.currentStep}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-outline/10 text-xs font-mono text-on-surface-variant space-y-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-outline shrink-0" />
                      <span className="truncate">{wo.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-on-surface-variant">
                        <Clock className="w-3 h-3" /> SLA: {wo.slaLimit}
                      </span>
                      {wo.assignedTechnician && (
                        <span className="flex items-center gap-1 text-primary">
                          <User className="w-3 h-3" /> {wo.assignedTechnician}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="mt-4 pt-3 border-t border-outline/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveOTDetailId(wo.id)}
                    className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                  >
                    Detalle Técnico <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {isInProgress ? (
                    <button
                      onClick={() => setCurrentView('checklist-cierre')}
                      className="px-3 py-1 rounded-md bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 text-xs font-mono font-bold flex items-center gap-1 transition-all"
                    >
                      <FileCheck className="w-3.5 h-3.5" /> Cierre
                    </button>
                  ) : !isCompleted ? (
                    <button
                      onClick={() => handleStartIntervention(wo)}
                      className="px-3 py-1 rounded-md bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold flex items-center gap-1 transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Iniciar
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Auditada
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dense Table View */
        <div className="rounded-xl bg-surface-container-low border border-outline/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-lowest font-mono uppercase text-[11px] text-on-surface-variant border-b border-outline/10">
                <tr>
                  <th className="py-2.5 px-3">Código OT</th>
                  <th className="py-2.5 px-3">Activo & Tag</th>
                  <th className="py-2.5 px-3">Prioridad</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Especialista</th>
                  <th className="py-2.5 px-3">SLA / Límite</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/5 font-mono">
                {filteredOrders.map((wo) => (
                  <tr key={wo.id} className="hover:bg-surface-container/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-primary">{wo.code}</td>
                    <td className="py-3 px-3">
                      <div className="font-sans font-semibold text-on-surface">{wo.assetName}</div>
                      <div className="text-[10px] text-on-surface-variant">{wo.assetCode} • {wo.location}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          wo.priority === 'critical'
                            ? 'bg-error/20 text-error'
                            : wo.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {wo.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          wo.status === 'in_progress'
                            ? 'bg-secondary/20 text-secondary'
                            : wo.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {wo.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-on-surface">{wo.assignedTechnician || 'Sin Asignar'}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{wo.slaLimit}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActiveOTDetailId(wo.id)}
                        className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-primary font-semibold text-[11px] transition-colors"
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OT Technical Detail Modal */}
      {selectedOT && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-outline/10 flex items-center justify-between sticky top-0 bg-surface-container-low/95 backdrop-blur z-10">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                  {selectedOT.code}
                </span>
                <span className="font-mono text-xs text-on-surface-variant">{selectedOT.assetCode}</span>
              </div>
              <button
                onClick={() => setActiveOTDetailId(null)}
                className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface">{selectedOT.assetName}</h3>
                <p className="text-xs text-secondary font-mono mt-0.5">{selectedOT.location}</p>
              </div>

              {selectedOT.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-outline/20 max-h-56">
                  <img
                    src={selectedOT.imageUrl}
                    alt={selectedOT.assetName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline/10">
                <div className="text-[10px] font-mono uppercase text-on-surface-variant font-bold mb-1">
                  Descripción del Problema & Síntomas
                </div>
                <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                  {selectedOT.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline/5">
                  <div className="text-[10px] text-on-surface-variant">PRIORIDAD</div>
                  <div className="font-bold uppercase text-primary mt-0.5">{selectedOT.priority}</div>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline/5">
                  <div className="text-[10px] text-on-surface-variant">SLA ESTIMADO</div>
                  <div className="font-bold text-on-surface mt-0.5">{selectedOT.slaLimit}</div>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline/5">
                  <div className="text-[10px] text-on-surface-variant">TIPO INTERVENCIÓN</div>
                  <div className="font-bold text-secondary mt-0.5">{selectedOT.type}</div>
                </div>
              </div>

              {selectedOT.reservedParts && selectedOT.reservedParts.length > 0 && (
                <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline/10">
                  <div className="text-[10px] font-mono uppercase text-on-surface-variant font-bold mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-secondary" />
                    Repuestos Reservados en Pañol
                  </div>
                  <ul className="space-y-1.5">
                    {selectedOT.reservedParts.map((part, idx) => (
                      <li key={idx} className="text-xs font-mono text-on-surface flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {part}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-3 border-t border-outline/10 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setActiveOTDetailId(null);
                    setCurrentView('bodega-repuestos');
                  }}
                  className="px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-mono font-medium"
                >
                  Pedir Repuestos
                </button>
                <button
                  onClick={() => {
                    setActiveOTDetailId(null);
                    setCurrentView('checklist-cierre');
                  }}
                  className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" /> Checklist & Cierre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
