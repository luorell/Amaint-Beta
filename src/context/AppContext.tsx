import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ViewPath,
  WorkOrder,
  Technician,
  SparePartItem,
  DispatchVoucher,
  SyncPacket,
  ForensicLog,
} from '../types';
import {
  INITIAL_WORK_ORDERS,
  INITIAL_TECHNICIANS,
  INITIAL_SPARE_PARTS,
  INITIAL_VOUCHER,
  INITIAL_SYNC_PACKETS,
  INITIAL_FORENSIC_LOGS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warn' | 'error';
}

interface AppContextType {
  currentView: ViewPath;
  setCurrentView: (view: ViewPath) => void;
  selectedAssetCode: string;
  setSelectedAssetCode: (code: string) => void;
  workOrders: WorkOrder[];
  addWorkOrder: (wo: Partial<WorkOrder>) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  technicians: Technician[];
  assignTechnicianToOT: (otCode: string, techId: string) => void;
  spareParts: SparePartItem[];
  updateSparePartStock: (sku: string, delta: number) => void;
  reorderSparePart: (sku: string) => void;
  voucher: DispatchVoucher;
  toggleVoucherItemVerification: (sku: string) => void;
  confirmDispatch: (voucherId: string) => void;
  syncPackets: SyncPacket[];
  addSyncPacket: (packet: SyncPacket) => void;
  forensicLogs: ForensicLog[];
  addForensicLog: (log: Omit<ForensicLog, 'id' | 'timestamp' | 'date'>) => void;
  isSyncing: boolean;
  triggerManualSync: () => void;
  offlineQueueCount: number;
  toast: ToastMessage | null;
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  activeOTDetailId: string | null;
  setActiveOTDetailId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewPath>('mis-ots-dashboard');
  const [selectedAssetCode, setSelectedAssetCode] = useState<string>('PL1-EXT-02');
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [spareParts, setSpareParts] = useState<SparePartItem[]>(INITIAL_SPARE_PARTS);
  const [voucher, setVoucher] = useState<DispatchVoucher>(INITIAL_VOUCHER);
  const [syncPackets, setSyncPackets] = useState<SyncPacket[]>(INITIAL_SYNC_PACKETS);
  const [forensicLogs, setForensicLogs] = useState<ForensicLog[]>(INITIAL_FORENSIC_LOGS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(2);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [activeOTDetailId, setActiveOTDetailId] = useState<string | null>(null);

  const showToast = (title: string, message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const addWorkOrder = (woData: Partial<WorkOrder>) => {
    const nextNum = Math.floor(100 + Math.random() * 900);
    const newCode = `OT-2026-${nextNum}`;
    const newWo: WorkOrder = {
      id: `wo-${nextNum}`,
      code: newCode,
      assetCode: woData.assetCode || 'PL1-EXT-02',
      assetName: woData.assetName || 'Activo Industrial Planta 1',
      location: woData.location || 'Planta 1 > Plásticos',
      priority: woData.priority || 'high',
      status: woData.status || 'pending',
      type: woData.type || 'CORRECTIVO',
      description: woData.description || 'Falla operacional reportada por operador de turno.',
      slaLimit: woData.slaLimit || '18:00 hrs',
      progressPercent: 0,
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' hrs',
      ...woData,
    };

    setWorkOrders((prev) => [newWo, ...prev]);

    // Also register a forensic log
    addForensicLog({
      level: newWo.priority === 'critical' ? 'CRITICAL' : 'INFO',
      action: newWo.priority === 'critical' ? 'EMERGENCIA_CREADA' : 'REPORTE_FALLA_CREADO',
      description: `Generación de orden de trabajo ${newCode} (${newWo.assetCode})`,
      entity: newCode,
      user: 'Carlos Mendoza',
      role: 'Técnico Mecánico Senior',
      ip: '192.168.12.88',
      terminal: 'Tablet Zebra ET51',
      sha256Hash: Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18),
    });

    // Also queue an offline sync packet
    const newPacket: SyncPacket = {
      id: `PKT-${Math.floor(9100 + Math.random() * 800)}`,
      payloadType: 'NUEVA_ORDEN_TRABAJO',
      originDevice: 'Tablet Zebra ET51 (#TECH-4402)',
      operator: 'Carlos Mendoza',
      entityTag: `${newCode} (${newWo.assetCode})`,
      sizeBytes: '9.4 KB',
      cipherMethod: 'AES-256-GCM',
      status: 'queued',
      progress: 0,
      timestamp: new Date().toLocaleTimeString() + ' UTC-4',
      payloadJson: {
        codigo: newCode,
        activo: newWo.assetCode,
        prioridad: newWo.priority,
        descripcion: newWo.description,
      },
    };
    setSyncPackets((prev) => [newPacket, ...prev]);
    setOfflineQueueCount((c) => c + 1);

    showToast('Orden Registrada', `Se generó ${newCode} con prioridad ${newWo.priority.toUpperCase()}`, 'success');
  };

  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === id || wo.code === id) {
          return { ...wo, ...updates };
        }
        return wo;
      })
    );
  };

  const assignTechnicianToOT = (otCode: string, techId: string) => {
    const tech = technicians.find((t) => t.id === techId);
    if (!tech) return;

    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.code === otCode) {
          return {
            ...wo,
            status: 'in_progress',
            assignedTechnician: tech.name,
            assignedTechnicianId: tech.id,
            assignedTechnicianRole: tech.role,
            assignedTechnicianAvatar: tech.avatar,
            timeElapsed: '00h 05m',
            progressPercent: 20,
          };
        }
        return wo;
      })
    );

    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id === techId) {
          return {
            ...t,
            status: 'busy',
            currentOT: otCode,
            loadPercent: Math.min(100, t.loadPercent + 30),
          };
        }
        return t;
      })
    );

    addForensicLog({
      level: 'INFO',
      action: 'ASIGNACION_OT_TECNICO',
      description: `Asignación de ${otCode} a especialista ${tech.name} (${tech.id})`,
      entity: otCode,
      user: 'Supervisor Turno A',
      role: 'Jefe de Mantenimiento',
      ip: '192.168.10.15',
      terminal: 'Consola Despacho Central',
      sha256Hash: Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18),
    });

    showToast('Técnico Asignado', `${tech.name} asignado a ${otCode}`, 'success');
  };

  const updateSparePartStock = (sku: string, delta: number) => {
    setSpareParts((prev) =>
      prev.map((p) => {
        if (p.sku === sku) {
          const newStock = Math.max(0, p.stockActual + delta);
          let newStatus = p.status;
          if (newStock <= p.stockMin) newStatus = 'critical';
          else if (newStock <= p.stockReorden) newStatus = 'warning';
          else newStatus = 'healthy';
          return { ...p, stockActual: newStock, status: newStatus };
        }
        return p;
      })
    );
  };

  const reorderSparePart = (sku: string) => {
    const part = spareParts.find((p) => p.sku === sku);
    if (!part) return;

    showToast(
      'Reorden Solicitado',
      `Solicitud de compra emitida para ${part.name} (+${part.stockReorden} ${part.unit})`,
      'info'
    );

    addForensicLog({
      level: 'WARN',
      action: 'ORDEN_COMPRA_REORDEN',
      description: `Disparo automático de OC para SKU: ${sku} (${part.supplier})`,
      entity: sku,
      user: 'Carlos Mendoza',
      role: 'Técnico Mecánico Senior',
      ip: '192.168.12.88',
      terminal: 'Tablet Zebra ET51',
      sha256Hash: Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18),
    });
  };

  const toggleVoucherItemVerification = (sku: string) => {
    setVoucher((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.sku === sku ? { ...it, verified: !it.verified } : it)),
    }));
  };

  const confirmDispatch = (voucherId: string) => {
    setVoucher((prev) => ({ ...prev, status: 'dispatched' }));

    // Deduct stock for each item in the voucher
    voucher.items.forEach((item) => {
      updateSparePartStock(item.sku, -item.qtyRequired);
    });

    addForensicLog({
      level: 'INFO',
      action: 'DESPACHO_CONFIRMADO',
      description: `Entrega completada para Vale #${voucherId} (${voucher.otCode}). Inventario Kardex actualizado.`,
      entity: `Vale #${voucherId}`,
      user: 'F. Silva',
      role: 'Bodeguero Central (R-2)',
      ip: '192.168.10.45',
      terminal: 'MAC: d4:6a:91:21:c0',
      sha256Hash: '7f8a3c9b421a998c01d41829e2f418d0124fe8',
      diffPayload: {
        preTx: {
          transaccion_id: 'TX-9901827',
          vale_bodega: voucherId,
          estado: 'PENDIENTE',
        },
        postTx: {
          transaccion_id: 'TX-9901827',
          vale_bodega: voucherId,
          estado: 'DESPACHO_EFECTUADO',
          receptor_firma: 'carlos.mendoza (Pin verificado)',
          sha256_cadena: '7f8a3c9b421a998c01d41829e2f418d0124fe8',
        },
      },
    });

    showToast('Despacho Exitoso', `Materiales para ${voucher.otCode} entregados y descontados`, 'success');
  };

  const addSyncPacket = (packet: SyncPacket) => {
    setSyncPackets((prev) => [packet, ...prev]);
    setOfflineQueueCount((c) => c + 1);
  };

  const addForensicLog = (logData: Omit<ForensicLog, 'id' | 'timestamp' | 'date'>) => {
    const now = new Date();
    const newLog: ForensicLog = {
      id: `LOG-${Math.floor(8820 + Math.random() * 200)}`,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: now.toISOString().split('T')[0],
      ...logData,
    };
    setForensicLogs((prev) => [newLog, ...prev]);
  };

  const triggerManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    showToast('Sincronización en curso', 'Transmitiendo cola cifrada a servidor central...', 'info');

    // Update packets
    setSyncPackets((prev) =>
      prev.map((p) =>
        p.status === 'queued' || p.status === 'transmitting'
          ? { ...p, status: 'transmitting', progress: 50 }
          : p
      )
    );

    setTimeout(() => {
      setSyncPackets((prev) =>
        prev.map((p) => ({ ...p, status: 'synced', progress: 100 }))
      );
      setOfflineQueueCount(0);
      setIsSyncing(false);

      addForensicLog({
        level: 'INFO',
        action: 'SYNC_MANUAL_COMPLETADO',
        description: 'Vaciado de buffer offline local y reconciliación de hash con cluster central.',
        entity: 'Buffer AES-256',
        user: 'Carlos Mendoza',
        role: 'Técnico Mecánico Senior',
        ip: '192.168.12.88',
        terminal: 'Tablet Zebra ET51',
        sha256Hash: '4a19b8823f001928dae3211099238bc1a',
      });

      showToast('Sincronización Completa', '100% de paquetes reconciliados con el servidor central', 'success');
    }, 1800);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedAssetCode,
        setSelectedAssetCode,
        workOrders,
        addWorkOrder,
        updateWorkOrder,
        technicians,
        assignTechnicianToOT,
        spareParts,
        updateSparePartStock,
        reorderSparePart,
        voucher,
        toggleVoucherItemVerification,
        confirmDispatch,
        syncPackets,
        addSyncPacket,
        forensicLogs,
        addForensicLog,
        isSyncing,
        triggerManualSync,
        offlineQueueCount,
        toast,
        showToast,
        activeOTDetailId,
        setActiveOTDetailId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
