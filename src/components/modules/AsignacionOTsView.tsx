import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Clock,
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  Sparkles,
  MapPin,
  Lock,
} from 'lucide-react';

export const AsignacionOTsView: React.FC = () => {
  const { workOrders, technicians, assignTechnicianToOT, showToast, setCurrentView } = useApp();

  const unassignedOTs = workOrders.filter((wo) => !wo.assignedTechnician && wo.status !== 'completed');
  const [selectedOTCode, setSelectedOTCode] = useState<string>(
    unassignedOTs[0]?.code || 'OT-2026-089'
  );
  const [selectedTechId, setSelectedTechId] = useState<string>('TECH-3102');
  const [pushNotification, setPushNotification] = useState(true);

  const selectedOT =
    workOrders.find((wo) => wo.code === selectedOTCode) ||
    workOrders.find((wo) => wo.priority === 'critical') ||
    workOrders[0];

  const handleDispatch = () => {
    if (!selectedOT || !selectedTechId) return;

    assignTechnicianToOT(selectedOT.code, selectedTechId);
    showToast(
      'Despacho Notificado',
      `OT ${selectedOT.code} despachada a terminal móvil Zebra del técnico`,
      'success'
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Supervisión de Turno A
            </span>
            <span className="text-outline/40">•</span>
            <span className="text-xs font-mono text-on-surface-variant">Despacho Autorizado</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-sans text-on-surface tracking-tight">
            Consola de Despacho & Asignación de OTs
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Emparejamiento heurístico de técnicos según especialidad, certificación LOTO y carga horaria del turno.
          </p>
        </div>
      </div>

      {/* Main Grid: Unassigned OTs / Dispatch Center / Technician Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Unassigned OTs Queue */}
        <div className="lg:col-span-4 bg-surface-container-low border border-outline/15 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline/10">
            <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-error animate-pulse" />
              Cola de OTs por Asignar ({unassignedOTs.length})
            </span>
            <span className="text-[10px] font-mono text-error font-bold">ALERTA</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {unassignedOTs.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-on-surface-variant">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                No hay órdenes pendientes de asignación en este turno.
              </div>
            ) : (
              unassignedOTs.map((wo) => {
                const isSelected = selectedOT?.code === wo.code;
                const isCritical = wo.priority === 'critical';

                return (
                  <div
                    key={wo.id}
                    onClick={() => setSelectedOTCode(wo.code)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-md'
                        : isCritical
                        ? 'border-error/40 bg-error/5 hover:border-error/60'
                        : 'border-outline/15 bg-surface-container-lowest hover:border-outline/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono font-bold text-xs text-primary">{wo.code}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          isCritical ? 'bg-error/20 text-error' : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {wo.priority}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-on-surface truncate">{wo.assetName}</div>
                    <div className="text-[10px] font-mono text-secondary mt-0.5">{wo.assetCode}</div>

                    <div className="mt-2 pt-2 border-t border-outline/10 flex items-center justify-between text-[10px] font-mono text-on-surface-variant">
                      <span className="flex items-center gap-1 text-error font-bold">
                        <Clock className="w-3 h-3" /> SLA: {wo.slaLimit}
                      </span>
                      <span>{wo.location}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center & Right Columns: Selected OT Details & Technician Selection */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active OT Dispatch Console */}
          {selectedOT && (
            <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline/10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-primary/20 text-primary font-bold">
                    {selectedOT.code}
                  </span>
                  <span className="font-mono text-xs text-secondary font-bold">{selectedOT.assetCode}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-error font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> SLA Límite: {selectedOT.slaLimit}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-on-surface">{selectedOT.assetName}</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {selectedOT.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline/5">
                  <div className="text-[10px] text-on-surface-variant">MTTR ESTIMADO</div>
                  <div className="font-bold text-primary mt-0.5">45 min</div>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline/5">
                  <div className="text-[10px] text-on-surface-variant">BLOQUEO LOTO</div>
                  <div className="font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Requerido
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline/5">
                  <div className="text-[10px] text-on-surface-variant">ESPECIALIDAD</div>
                  <div className="font-bold text-secondary mt-0.5">Hidráulica Sr</div>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline/5">
                  <div className="text-[10px] text-on-surface-variant">COSTO PARO</div>
                  <div className="font-bold text-error mt-0.5">~$140/min</div>
                </div>
              </div>
            </div>
          )}

          {/* Technician Matrix */}
          <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline/10">
              <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
                <Users className="w-4 h-4 text-secondary" />
                Matriz de Técnicos Disponibles (Turno A)
              </span>
              <span className="text-[10px] font-mono text-primary font-bold">Ordenado por Compatibilidad</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {technicians.map((tech) => {
                const isSelected = selectedTechId === tech.id;
                const isAvailable = tech.status === 'available';

                return (
                  <div
                    key={tech.id}
                    onClick={() => setSelectedTechId(tech.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isSelected
                        ? 'border-secondary bg-secondary/10 shadow-md ring-1 ring-secondary'
                        : 'border-outline/15 bg-surface-container-lowest hover:border-outline/30'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={tech.avatar}
                        alt={tech.name}
                        className="w-11 h-11 rounded-lg object-cover border border-outline/25"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface-container-lowest ${
                          isAvailable ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-on-surface truncate">{tech.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                            tech.matchScore >= 90
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-primary/20 text-primary'
                          }`}
                        >
                          {tech.matchScore}% Match
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-secondary truncate mt-0.5">
                        {tech.role}
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-on-surface-variant">
                        <span>Carga: {tech.loadPercent}%</span>
                        {tech.lotoCertified && (
                          <span className="text-emerald-400 font-bold">LOTO Certificado</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notification and Confirmation Bar */}
            <div className="pt-3 border-t border-outline/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-mono text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotification}
                  onChange={(e) => setPushNotification(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary"
                />
                <span>Enviar push alert con vibración y plano a terminal móvil Zebra</span>
              </label>

              <button
                type="button"
                onClick={handleDispatch}
                disabled={!selectedOT}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Send className="w-4 h-4 fill-current" />
                Confirmar Despacho & Notificar Especialista
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
