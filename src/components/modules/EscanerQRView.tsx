import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  Flashlight,
  QrCode,
  Volume2,
  VolumeX,
  FileText,
  Clock,
  Package,
  Wrench,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const EscanerQRView: React.FC = () => {
  const { setCurrentView, showToast, setSelectedAssetCode } = useApp();

  const [torchOn, setTorchOn] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [manualCode, setManualCode] = useState('PL1-EXT-02');
  const [activeTab, setActiveTab] = useState<'specs' | 'history' | 'parts'>('specs');
  const [scanEffect, setScanEffect] = useState(false);

  const simulateScan = (code: string) => {
    setScanEffect(true);
    setManualCode(code);
    setSelectedAssetCode(code);
    setTimeout(() => {
      setScanEffect(false);
      showToast('Código Detectado', `Activo ${code} sincronizado con éxito`, 'success');
    }, 600);
  };

  const handleKeypadPress = (val: string) => {
    if (val === 'CLEAR') {
      setManualCode('');
    } else if (val === 'ENTER') {
      simulateScan(manualCode || 'PL1-EXT-02');
    } else {
      setManualCode((prev) => (prev.length < 15 ? prev + val : prev));
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-secondary">
              Módulo de Campo
            </span>
            <span className="text-outline/40">•</span>
            <span className="text-xs font-mono text-on-surface-variant">Reconocimiento Óptico & RFID</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-sans text-on-surface tracking-tight">
            Escáner QR & Identificación de Activos
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Escanee la placa física de aluminio anodizado o ingrese el código mediante el teclado de alta rugosidad.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateScan('PL1-EXT-02')}
            className="px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary border border-primary/30 text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Simular Escaneo Extrusora
          </button>
          <button
            onClick={() => simulateScan('PL1-INJ-03')}
            className="px-3.5 py-1.5 rounded-lg bg-error/20 hover:bg-error/30 text-error border border-error/30 text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Simular Inyectora 03
          </button>
        </div>
      </div>

      {/* Main Grid: Scanner / Keypad on Left, Asset Sheet on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Camera Scanner HUD & Rugged Keypad */}
        <div className="lg:col-span-5 space-y-4">
          {/* Camera Viewport Simulation */}
          <div className="rounded-2xl bg-surface-container-lowest border-2 border-outline/20 overflow-hidden relative shadow-2xl">
            <div className="relative aspect-4/3 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              {/* Camera background simulation image */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP4Gv-6b-cK7Qf2sJtN1yL7P5e1f0b0u1r120q4y0o1v0e0-1c2o3p4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z"
                alt="Camera feed"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity pointer-events-none"
              />

              {/* Laser scanning beam */}
              {cameraActive && (
                <div
                  className={`absolute inset-x-0 h-1 bg-primary/90 shadow-[0_0_15px_#4ade80] transition-all duration-1000 ${
                    scanEffect ? 'scale-y-[80] bg-emerald-400 opacity-80' : 'animate-bounce'
                  }`}
                  style={{ animationDuration: '2.5s' }}
                />
              )}

              {/* Targeting HUD Box */}
              <div
                className={`relative w-56 h-56 border-2 transition-all duration-300 rounded-xl flex items-center justify-center ${
                  scanEffect
                    ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_25px_#34d399]'
                    : torchOn
                    ? 'border-primary shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                    : 'border-primary/80'
                }`}
              >
                {/* Corner reticles */}
                <span className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary" />
                <span className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary" />
                <span className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary" />
                <span className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary" />

                <div className="text-center font-mono">
                  <QrCode className="w-12 h-12 text-primary/70 mx-auto mb-1 animate-pulse" />
                  <span className="text-[10px] text-primary/90 tracking-widest font-bold">
                    {scanEffect ? 'DECODIFICANDO...' : 'ENFOQUE EL CÓDIGO'}
                  </span>
                </div>
              </div>

              {/* Camera Overlays / Controls */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between text-xs font-mono text-white/90">
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur border border-white/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LENTE TRASERO 60 FPS
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSoundOn(!soundOn)}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur border border-white/20 transition-colors"
                    title="Sonido de escaneo"
                  >
                    {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                  </button>

                  <button
                    onClick={() => {
                      setTorchOn(!torchOn);
                      showToast('Linterna LED', !torchOn ? 'Linterna Activada' : 'Linterna Apagada', 'info');
                    }}
                    className={`p-1.5 rounded-lg backdrop-blur border transition-colors ${
                      torchOn
                        ? 'bg-amber-400 text-black border-amber-300 font-bold'
                        : 'bg-black/60 hover:bg-black/80 border-white/20 text-white'
                    }`}
                    title="Alternar Linterna LED Industrial"
                  >
                    <Flashlight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom camera HUD footer */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-mono text-white/80 bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
                <span>ISO 14224 • QR / DataMatrix / Code128</span>
                <span className="text-primary font-bold">AUTO-FOCUS OK</span>
              </div>
            </div>
          </div>

          {/* Rugged Glove-Friendly Keypad */}
          <div className="rounded-2xl bg-surface-container-low border border-outline/10 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase text-on-surface-variant flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-secondary" />
                Ingreso Manual de Tag
              </span>
              <span className="text-[10px] font-mono text-outline">Modo Guantes Activado</span>
            </div>

            {/* Display Input */}
            <div className="mb-3 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline/20 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-primary tracking-wider">
                {manualCode || 'PL1-'}
              </span>
              <button
                onClick={() => setManualCode('')}
                className="text-xs font-mono text-on-surface-variant hover:text-error transition-colors"
              >
                BORRAR
              </button>
            </div>

            {/* Plant Prefixes */}
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {['PL1-', 'EXT-', 'INJ-', 'MOL-'].map((prefix) => (
                <button
                  key={prefix}
                  onClick={() => setManualCode(prefix)}
                  className="py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline/15 text-xs font-mono font-bold text-secondary transition-all active:scale-95"
                >
                  {prefix}
                </button>
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 font-mono">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', 'OK'].map((key) => {
                const isEnter = key === 'OK';
                return (
                  <button
                    key={key}
                    onClick={() => (isEnter ? handleKeypadPress('ENTER') : handleKeypadPress(key))}
                    className={`py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm ${
                      isEnter
                        ? 'bg-primary hover:bg-primary/90 text-on-primary font-black col-span-2'
                        : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline/10'
                    }`}
                  >
                    {isEnter ? 'CONSULTAR ACTIVO' : key}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Asset Technical Sheet (PL1-EXT-02) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-surface-container-low border border-outline/15 p-5 shadow-md">
            {/* Asset Status Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-outline/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-xs font-bold">
                      {manualCode || 'PL1-EXT-02'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">
                      EN ALERTA VIBRACIÓN
                    </span>
                    <span className="px-2 py-0.5 rounded bg-error/20 text-error font-mono text-xs font-bold">
                      CLASE A
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-on-surface mt-1">
                    Extrusora de Polímeros Doble Husillo 02
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('reportar-falla')}
                  className="px-3 py-1.5 rounded-lg bg-error hover:bg-error/90 text-on-error font-semibold text-xs transition-all shadow-sm active:scale-95"
                >
                  Reportar Falla
                </button>
                <button
                  onClick={() => setCurrentView('checklist-cierre')}
                  className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary font-semibold text-xs transition-all shadow-sm active:scale-95"
                >
                  Cierre de OT
                </button>
              </div>
            </div>

            {/* Quick Specs Overview Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 text-xs font-mono">
              <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline/5">
                <div className="text-[10px] text-on-surface-variant">FABRICANTE</div>
                <div className="font-bold text-on-surface mt-0.5">KraussMaffei</div>
              </div>
              <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline/5">
                <div className="text-[10px] text-on-surface-variant">MODELO & N/S</div>
                <div className="font-bold text-on-surface mt-0.5 truncate">KMD 90-32/P</div>
              </div>
              <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline/5">
                <div className="text-[10px] text-on-surface-variant">HORÓMETRO</div>
                <div className="font-bold text-secondary mt-0.5">14,280 hrs</div>
              </div>
              <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline/5">
                <div className="text-[10px] text-on-surface-variant">UBICACIÓN</div>
                <div className="font-bold text-on-surface mt-0.5 truncate">Planta 1 &gt; Nave A</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-outline/10 text-xs font-mono font-medium">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 px-3 transition-colors border-b-2 ${
                  activeTab === 'specs'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                1. Datos Técnicos & Manuales
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-2.5 px-3 transition-colors border-b-2 ${
                  activeTab === 'history'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                2. Historial de OTs (3)
              </button>
              <button
                onClick={() => setActiveTab('parts')}
                className={`pb-2.5 px-3 transition-colors border-b-2 ${
                  activeTab === 'parts'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                3. Repuestos Stock (4)
              </button>
            </div>

            {/* Tab 1: Datos Técnicos & Manuales */}
            {activeTab === 'specs' && (
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline/10 space-y-2">
                    <span className="font-bold text-primary flex items-center gap-1.5 uppercase text-[11px]">
                      <Wrench className="w-3.5 h-3.5" /> Reductor Principal
                    </span>
                    <div className="text-on-surface-variant space-y-1">
                      <div>Marca: Hansen Industrial Transmissions</div>
                      <div>Ratio: 1:18.5 i</div>
                      <div>Aceite: ISO VG 220 Sintético (28.5 Litros)</div>
                      <div>Temp. Operación Límite: 75°C</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline/10 space-y-2">
                    <span className="font-bold text-secondary flex items-center gap-1.5 uppercase text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" /> Motor Eléctrico 90kW
                    </span>
                    <div className="text-on-surface-variant space-y-1">
                      <div>Fabricante: Siemens 1LA8 315-4PB80</div>
                      <div>Voltaje: 400V / 50 Hz (Tri)</div>
                      <div>Corriente Nominal: 162 A</div>
                      <div>Rodamientos: SKF 6319 C3 (Grasa Mobilith SHC)</div>
                    </div>
                  </div>
                </div>

                {/* Offline Document Cache List */}
                <div className="rounded-xl bg-surface-container-lowest p-4 border border-outline/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase text-on-surface-variant flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-primary" />
                      Planos & Manuales en Memoria Local (Offline Cached)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">100% DISPONIBLE</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between hover:bg-surface-container-high transition-colors">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-secondary" />
                        <div>
                          <div className="font-bold text-on-surface">Manual_Mantenimiento_KMD90.pdf</div>
                          <div className="text-[10px] text-on-surface-variant">12.4 MB • Rev 4.1 Oficial Fabricante</div>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast('Visor Offline', 'Abriendo Manual KMD 90 en memoria PWA', 'info')}
                        className="px-2.5 py-1 rounded bg-surface-container-highest text-primary text-[11px] font-bold"
                      >
                        Abrir PDF
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between hover:bg-surface-container-high transition-colors">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-secondary" />
                        <div>
                          <div className="font-bold text-on-surface">Diagrama_Electrico_S7-1500.dwg</div>
                          <div className="text-[10px] text-on-surface-variant">4.8 MB • Planos Nave A Tablero 02</div>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast('Visor Offline', 'Cargando esquemático eléctrico S7-1500', 'info')}
                        className="px-2.5 py-1 rounded bg-surface-container-highest text-primary text-[11px] font-bold"
                      >
                        Ver Esquema
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Historial de OTs */}
            {activeTab === 'history' && (
              <div className="py-4 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline/10 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">OT-2026-092</span>
                      <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary font-bold text-[10px]">
                        EN CURSO
                      </span>
                      <span className="text-on-surface-variant text-[11px]">Hoy 08:50</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface mt-1">
                      Vibración anómala en reductor principal (eje intermedio desalineado).
                    </p>
                    <div className="text-[10px] text-on-surface-variant mt-1">
                      Asignado: Carlos Mendoza (Téc. Senior) • Avance: 57%
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('checklist-cierre')}
                    className="text-primary hover:underline text-xs flex items-center gap-0.5"
                  >
                    Ver Cierre <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline/10 flex items-start justify-between opacity-80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">OT-2026-044</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        COMPLETADA
                      </span>
                      <span className="text-on-surface-variant text-[11px]">15 Mar 2026</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface mt-1">
                      Mantenimiento Preventivo Semestral: Cambio de aceite ISO VG 220 y filtro.
                    </p>
                    <div className="text-[10px] text-on-surface-variant mt-1">
                      Técnico: Fernando Silva • Tiempo real: 03h 40m
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline/10 flex items-start justify-between opacity-70">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">OT-2025-812</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        COMPLETADA
                      </span>
                      <span className="text-on-surface-variant text-[11px]">28 Nov 2025</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface mt-1">
                      Sustitución de retenes de eje husillos y reapriete dinamométrico.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Repuestos Stock */}
            {activeTab === 'parts' && (
              <div className="py-4 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-on-surface">Rodamiento Rígido SKF 6208-2RS</div>
                    <div className="text-[10px] text-on-surface-variant">
                      SKU: ROD-SKF-6208 • Estante B-12 • Stock: <span className="text-error font-bold">2 un (Crítico)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView('bodega-repuestos');
                    }}
                    className="px-2.5 py-1 rounded bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold text-[11px]"
                  >
                    Pedir a Pañol
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-on-surface">Retén Vitón 45x65x10 Doble Labio</div>
                    <div className="text-[10px] text-on-surface-variant">
                      SKU: RET-VIT-4565 • Fila 08-C • Stock: <span className="text-amber-400 font-bold">3 un</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('bodega-repuestos')}
                    className="px-2.5 py-1 rounded bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold text-[11px]"
                  >
                    Pedir a Pañol
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-on-surface">Aceite Hidráulico Mobil DTE ISO 68</div>
                    <div className="text-[10px] text-on-surface-variant">
                      SKU: LUB-ISO68-MBL • Zona L-01 • Stock: <span className="text-emerald-400 font-bold">140 Litros</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('bodega-repuestos')}
                    className="px-2.5 py-1 rounded bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold text-[11px]"
                  >
                    Pedir a Pañol
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
