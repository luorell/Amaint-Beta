import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  RefreshCw,
  Wifi,
  HardDrive,
  ShieldCheck,
  Clock,
  Layers,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    setCurrentView,
    isSyncing,
    triggerManualSync,
    offlineQueueCount,
  } = useApp();

  const [time, setTime] = useState<string>('10:14:22');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('es-CL', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-surface-container-low border-b border-outline/10 text-on-surface select-none shadow-sm">
      {/* Top Telemetry & Connectivity Strip */}
      <div className="bg-surface-container-lowest px-4 py-1 text-[11px] font-mono flex flex-wrap items-center justify-between border-b border-outline/5 text-on-surface-variant">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            PWA STATUS: OFFLINE-READY
          </span>
          <span className="text-outline/40">|</span>
          <span className="text-on-surface-variant/80 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-secondary" />
            SW v4.2.1 • Cache: 14.2 MB
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-tertiary font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
            BUFFER OFFLINE: {offlineQueueCount} TRANSACCIONES (AES-256)
          </span>
          <span className="text-outline/40 hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-on-surface-variant/70" />
            <span>HORA PLANTA:</span>
            <span className="text-primary font-bold">{time} CLT</span>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Plant Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-surface-container-highest border border-outline/20 flex items-center justify-center shrink-0 shadow-inner group">
            <Layers className="w-6 h-6 text-primary transition-transform group-hover:scale-105" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-lg text-on-surface tracking-tight truncate">
                Amaint
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono font-medium">
                v4.2
              </span>
            </div>
            <p className="text-[11px] font-mono text-on-surface-variant truncate">
              Planta Los Andes • Líneas Críticas Plásticos
            </p>
          </div>
        </div>

        {/* Global Action Buttons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentView('escaner-qr-activos')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 text-xs font-semibold tracking-wide transition-all active:scale-95"
            title="Escanear Código QR o Código de Barra de Activo"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden md:inline">Escanear Activo</span>
          </button>

          <button
            onClick={triggerManualSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all active:scale-95 ${
              isSyncing
                ? 'bg-secondary/20 text-secondary border-secondary/40'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline/20'
            }`}
            title="Sincronizar cola de transacciones offline"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-secondary ${
                isSyncing ? 'animate-spin' : ''
              }`}
            />
            <span className="hidden md:inline">
              {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
            </span>
          </button>

          <div className="h-6 w-px bg-outline/20 mx-1 hidden sm:block" />

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-1 py-1 rounded-lg bg-surface-container-lowest/60 border border-outline/10">
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPnf1IGI8mYtSiw50ftYXnzXXjDAUHYx3wwEmyVLzlbyc0g32boOhmX52UGxgHW6cuHAcCJws4hx4Ae6xtg20MGB-33CUf70unMYwq3eL25gLA3_CNgtC0FFit8w-HymakuvbEOps1Uye_haElZ8UUuV0KsNitKKG28EJnzaO8bSww5kI5qfi2dJcKueDeHzYgMoV0G_F5UO2gOj8lkkQevanpuAJLJsg3ksDIOn8"
                alt="Carlos Mendoza"
                className="w-8 h-8 rounded-md object-cover border border-outline/30"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface-container-lowest" />
            </div>
            <div className="hidden lg:block text-left pr-2">
              <div className="text-xs font-semibold text-on-surface leading-tight">
                Carlos Mendoza
              </div>
              <div className="text-[10px] text-on-surface-variant font-mono">
                Técnico Mecánico • Turno A
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
