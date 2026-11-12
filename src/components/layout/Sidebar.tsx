import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewPath } from '../../types';
import {
  ClipboardList,
  QrCode,
  AlertTriangle,
  CheckSquare,
  Network,
  Users,
  Package,
  Terminal,
  Activity,
  DollarSign,
  Radio,
  HardDrive,
  Cpu,
} from 'lucide-react';

interface NavItem {
  id: ViewPath;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, workOrders, offlineQueueCount } = useApp();

  const pendingOTsCount = workOrders.filter((wo) => wo.status === 'pending').length;

  const plantModule: NavItem[] = [
    {
      id: 'mis-ots-dashboard',
      label: 'Mis OTs / Dashboard',
      badge: pendingOTsCount > 0 ? `${pendingOTsCount}` : undefined,
      icon: ClipboardList,
    },
    {
      id: 'escaner-qr-activos',
      label: 'Escáner QR & Activos',
      icon: QrCode,
    },
    {
      id: 'reportar-falla',
      label: 'Reportar Falla',
      badge: 'SOS',
      icon: AlertTriangle,
    },
    {
      id: 'checklist-cierre',
      label: 'Checklist & Cierre OT',
      icon: CheckSquare,
    },
  ];

  const managementModule: NavItem[] = [
    {
      id: 'jerarquia-de-activos',
      label: 'Jerarquía ISO 14224',
      icon: Network,
    },
    {
      id: 'asignacion-de-ots',
      label: 'Asignación de OTs',
      icon: Users,
    },
    {
      id: 'bodega-repuestos',
      label: 'Bodega & Repuestos',
      badge: 'Kardex',
      icon: Package,
    },
    {
      id: 'sincronizacion-logs',
      label: 'Sincronización & Logs',
      badge: offlineQueueCount > 0 ? `${offlineQueueCount}` : undefined,
      icon: Terminal,
    },
  ];

  const analyticsModule: NavItem[] = [
    {
      id: 'kpis-confiabilidad',
      label: 'KPIs Confiabilidad (RAMS)',
      icon: Activity,
    },
    {
      id: 'costos-disponibilidad',
      label: 'Costos & Disponibilidad',
      icon: DollarSign,
    },
  ];

  const renderNavList = (title: string, items: NavItem[]) => (
    <div className="mb-5">
      <div className="px-3 mb-2 text-[10px] font-mono font-bold tracking-wider text-outline uppercase flex items-center justify-between">
        <span>{title}</span>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = currentView === item.id;
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-surface-container-high text-primary border-l-4 border-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <IconComponent
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-primary' : 'text-on-surface-variant/70 group-hover:text-on-surface'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    item.badge === 'SOS'
                      ? 'bg-error/20 text-error border border-error/30 animate-pulse'
                      : isActive
                      ? 'bg-primary/20 text-primary'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-outline/10 flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] overflow-y-auto select-none">
      <div className="p-3">
        {renderNavList('Operación Planta', plantModule)}
        {renderNavList('Gestión & Logística', managementModule)}
        {renderNavList('Analítica RAMS & Finanzas', analyticsModule)}
      </div>

      {/* Hardware / Engine Telemetry Box */}
      <div className="p-3 m-3 rounded-lg bg-surface-container-low border border-outline/10 text-[11px] font-mono text-on-surface-variant">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-on-surface font-semibold">
            <Radio className="w-3.5 h-3.5 text-tertiary animate-pulse" />
            Nodo Offline
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">ACTIVO</span>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[10px] text-on-surface-variant/80 mb-1">
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-secondary" />
                IndexedDB Cache
              </span>
              <span>14.2 MB / 500 MB</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
              <div className="h-full bg-secondary w-[14%]" />
            </div>
          </div>

          <div className="pt-1 border-t border-outline/10 flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-outline" />
              AES-256 Engine
            </span>
            <span className="text-on-surface font-medium">Hardware Accel.</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
