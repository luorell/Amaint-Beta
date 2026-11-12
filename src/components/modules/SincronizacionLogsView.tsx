import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SyncPacket, ForensicLog } from '../../types';
import {
  Terminal,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  Radio,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const SincronizacionLogsView: React.FC = () => {
  const {
    syncPackets,
    forensicLogs,
    isSyncing,
    triggerManualSync,
    offlineQueueCount,
  } = useApp();

  const [selectedPacket, setSelectedPacket] = useState<SyncPacket | null>(null);
  const [selectedLog, setSelectedLog] = useState<ForensicLog | null>(forensicLogs[0] || null);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Arquitectura Offline-First
            </span>
            <span className="text-outline/40">•</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">SHA-256 Inmutable</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-sans text-on-surface tracking-tight">
            Sincronización & Auditoría Forense de Paquetes
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Inspección de cola transaccional en IndexedDB, estados de transmisión cifrados y registro forense de cambios (Diff JSON).
          </p>
        </div>

        <button
          type="button"
          onClick={triggerManualSync}
          disabled={isSyncing}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando Buffer...' : 'Forzar Sincronización Total Ahora'}
        </button>
      </div>

      {/* Telemetry Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline/10">
          <div className="text-[10px] text-on-surface-variant uppercase flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> WebSocket Cluster
          </div>
          <div className="font-bold text-on-surface mt-1 truncate">wss://gateway.andina:8443</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Conectado (Latencia: 18ms)</div>
        </div>

        <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline/10">
          <div className="text-[10px] text-on-surface-variant uppercase flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-secondary" /> IndexedDB Local
          </div>
          <div className="font-bold text-on-surface mt-1">14.2 MB / 500 MB</div>
          <div className="text-[10px] text-secondary mt-0.5">Cache PWA Actualizada</div>
        </div>

        <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline/10">
          <div className="text-[10px] text-on-surface-variant uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-tertiary" /> Algoritmo Cifrado
          </div>
          <div className="font-bold text-tertiary mt-1">AES-256-GCM</div>
          <div className="text-[10px] text-on-surface-variant mt-0.5">Nonce Dinámico + ECDSA</div>
        </div>

        <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline/10">
          <div className="text-[10px] text-on-surface-variant uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" /> Cola de Salida
          </div>
          <div className="font-bold text-primary mt-1">{offlineQueueCount} Paquetes Pendientes</div>
          <div className="text-[10px] text-on-surface-variant mt-0.5">Próximo push automático: 30s</div>
        </div>
      </div>

      {/* Main Grid: Outbox Queue & Forensic Audit Table */}
      <div className="space-y-6">
        {/* Outbox Queue Table */}
        <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline/10">
            <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-secondary" />
              Cola Local de Salida (IndexedDB Outbox Queue)
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant">Prioridad FIFO con Retry Exponencial</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-container-lowest uppercase text-[10px] text-on-surface-variant border-b border-outline/10">
                <tr>
                  <th className="py-2.5 px-3">ID Paquete</th>
                  <th className="py-2.5 px-3">Tipo Transacción</th>
                  <th className="py-2.5 px-3">Origen & Operador</th>
                  <th className="py-2.5 px-3">Entidad Afectada</th>
                  <th className="py-2.5 px-3">Tamaño & Cifrado</th>
                  <th className="py-2.5 px-3">Estado & Progreso</th>
                  <th className="py-2.5 px-3 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/5">
                {syncPackets.map((pkt) => (
                  <tr key={pkt.id} className="hover:bg-surface-container/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-primary">{pkt.id}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold text-[10px]">
                        {pkt.payloadType}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-on-surface font-semibold">{pkt.operator}</div>
                      <div className="text-[10px] text-on-surface-variant">{pkt.originDevice}</div>
                    </td>
                    <td className="py-3 px-3 text-secondary font-medium">{pkt.entityTag}</td>
                    <td className="py-3 px-3 text-on-surface-variant">
                      <div>{pkt.sizeBytes}</div>
                      <div className="text-[10px] text-tertiary">{pkt.cipherMethod}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            pkt.status === 'synced'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : pkt.status === 'transmitting'
                              ? 'bg-secondary/20 text-secondary'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {pkt.status}
                        </span>
                        {pkt.status === 'transmitting' && (
                          <span className="text-[10px] text-secondary">{pkt.progress}%</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedPacket(pkt)}
                        className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-primary text-[11px] font-bold flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forensic Audit Log & JSON Diff Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Audit Logs Table */}
          <div className="lg:col-span-7 bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline/10">
              <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-400" />
                Registro Forense de Auditoría (Logs Criptográficos)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">100% AUDITADO</span>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {forensicLogs.map((log) => {
                const isSelected = selectedLog?.id === log.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`p-3 rounded-xl border font-mono text-xs cursor-pointer transition-all select-none ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40'
                        : 'border-outline/10 bg-surface-container-lowest hover:border-outline/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-bold">{log.id}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                            log.level === 'CRITICAL'
                              ? 'bg-error/20 text-error'
                              : log.level === 'SECURITY'
                              ? 'bg-amber-500/20 text-amber-400'
                              : log.level === 'WARN'
                              ? 'bg-amber-400/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {log.level}
                        </span>
                        <span className="font-bold text-on-surface text-[11px]">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant">{log.timestamp}</span>
                    </div>

                    <p className="font-sans text-xs text-on-surface-variant line-clamp-1">
                      {log.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-outline/5 flex items-center justify-between text-[10px] text-on-surface-variant">
                      <span>{log.user} ({log.role})</span>
                      <span className="text-secondary truncate max-w-[140px]">{log.sha256Hash}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* JSON Diff Inspector Panel */}
          <div className="lg:col-span-5 bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-outline/10">
              <span className="text-xs font-bold uppercase text-on-surface flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-secondary" />
                Inspector Diff Transaccional
              </span>
              <span className="text-[10px] text-primary font-bold">
                {selectedLog?.id || 'LOG-8812'}
              </span>
            </div>

            {selectedLog ? (
              <div className="space-y-3">
                <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline/10 space-y-1 text-[11px]">
                  <div className="text-on-surface font-bold">{selectedLog.description}</div>
                  <div className="text-on-surface-variant text-[10px]">
                    Usuario: {selectedLog.user} • IP: {selectedLog.ip} • Terminal: {selectedLog.terminal}
                  </div>
                  <div className="text-[10px] text-emerald-400 break-all select-all pt-1">
                    SHA-256: {selectedLog.sha256Hash}
                  </div>
                </div>

                {/* Pre / Post Tx JSON comparison */}
                {selectedLog.diffPayload ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-rose-500/30 overflow-x-auto">
                      <div className="text-rose-400 font-bold mb-1 border-b border-rose-500/20 pb-1">
                        - Estado Pre-Transacción
                      </div>
                      <pre className="text-rose-300">
                        {JSON.stringify(selectedLog.diffPayload.preTx, null, 2)}
                      </pre>
                    </div>

                    <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-emerald-500/30 overflow-x-auto">
                      <div className="text-emerald-400 font-bold mb-1 border-b border-emerald-500/20 pb-1">
                        + Estado Post-Transacción
                      </div>
                      <pre className="text-emerald-300">
                        {JSON.stringify(selectedLog.diffPayload.postTx, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline/10 text-on-surface-variant text-center py-8">
                    Registro forense sin modificaciones de estado Kardex.
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-on-surface-variant">
                Seleccione un log forense para inspeccionar la estructura diff.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Packet Inspect Modal */}
      {selectedPacket && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="bg-surface-container-low border border-outline/20 rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline/10">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                  {selectedPacket.id}
                </span>
                <span className="text-xs text-on-surface font-bold">{selectedPacket.payloadType}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPacket(null)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline/10 text-xs overflow-x-auto max-h-72">
              <pre className="text-emerald-400">
                {JSON.stringify(selectedPacket.payloadJson, null, 2)}
              </pre>
            </div>

            <div className="text-[11px] text-on-surface-variant flex justify-between items-center pt-2">
              <span>{selectedPacket.cipherMethod}</span>
              <button
                type="button"
                onClick={() => setSelectedPacket(null)}
                className="px-4 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-bold hover:bg-surface-container-highest"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
