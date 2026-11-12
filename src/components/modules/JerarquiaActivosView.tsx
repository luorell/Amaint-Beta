import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssetNode } from '../../types';
import { INITIAL_ASSET_TREE } from '../../data/mockData';
import {
  Network,
  ChevronDown,
  ChevronRight,
  Printer,
  Download,
  QrCode,
  Save,
  Search,
  Cpu,
  Layers,
  Wrench,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const JerarquiaActivosView: React.FC = () => {
  const { showToast } = useApp();

  const [treeData] = useState<AssetNode>(INITIAL_ASSET_TREE);
  const [selectedNode, setSelectedNode] = useState<AssetNode>({
    id: 'comp-red01',
    code: 'PL1-EXT-02-RED01',
    name: 'Reductor Principal de Velocidad Heloidal',
    level: 5,
    levelName: 'Subconjunto',
    status: 'alert',
    criticality: 'CLASE A',
    type: 'Mecánico Rotativo (Transmisión)',
    manufacturer: 'Hansen Industrial Transmissions',
    model: 'P4 QVP3-RLN-18.5',
    serialNumber: 'SN-2019-883492-H',
    hoursAccumulated: '14,820 hrs',
    tag: 'PL1-EXT-02-RED01',
    hash: '#928A-SYS',
    installedAt: '2021-03-15',
    nominalSpecs: {
      power: '75 kW (100 HP)',
      ratio: '1:18.5 i',
      lubricant: 'ISO VG 220 Sint.',
      capacity: '28.5 Litros',
    },
  });

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    pl01: true,
    'area-plast': true,
    'line-ext-02': true,
    'eq-ext-02': true,
  });

  const [specs, setSpecs] = useState(selectedNode);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectNode = (node: AssetNode) => {
    setSelectedNode(node);
    setSpecs(node);
  };

  const handleSaveSpecs = () => {
    showToast('Ficha Guardada', `Especificaciones de ${specs.code} actualizadas en catálogo maestro`, 'success');
  };

  const handlePrintZebra = () => {
    showToast('Impresión Zebra', 'Comando ZPL enviado a impresora térmica de pañol (Baud: 115200)', 'info');
  };

  const renderTree = (node: AssetNode) => {
    const isExpanded = !!expandedNodes[node.id];
    const isSelected = selectedNode.code === node.code;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="text-xs font-mono">
        <div
          onClick={() => handleSelectNode(node)}
          className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
            isSelected
              ? 'bg-primary/20 text-primary font-bold border-l-2 border-primary'
              : 'hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => toggleExpand(node.id, e)}
              className="p-0.5 hover:text-primary"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-4" />
          )}

          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              node.status === 'alert'
                ? 'bg-error animate-pulse'
                : node.criticality === 'CLASE A'
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
          />

          <span className="truncate">{node.code}</span>
          <span className="text-[10px] text-on-surface-variant/70 truncate hidden sm:inline">
            - {node.name}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="pl-4 ml-2 border-l border-outline/10 space-y-0.5">
            {node.children!.map((child) => renderTree(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" />
              Catálogo de Activos ISO 14224
            </span>
            <span className="text-outline/40">•</span>
            <span className="text-xs font-mono text-on-surface-variant">5 Niveles Jerárquicos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-sans text-on-surface tracking-tight">
            Jerarquía de Activos & Rotulado Industrial
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Estructuración taxonómica de equipos de planta y generador de placas de aluminio anodizado 70x50mm.
          </p>
        </div>
      </div>

      {/* Main Grid: Tree / Specs / Plate Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: ISO 14224 Tree Browser */}
        <div className="lg:col-span-4 bg-surface-container-low border border-outline/15 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline/10">
            <span className="text-xs font-mono font-bold uppercase text-on-surface">
              Árbol Taxonómico
            </span>
            <span className="text-[10px] font-mono text-secondary font-bold">PLANTA LOS ANDES</span>
          </div>

          <div className="max-h-[550px] overflow-y-auto space-y-1 pr-1">
            {renderTree(treeData)}
          </div>
        </div>

        {/* Center/Right Column: Specs Editor & Anodized Plate */}
        <div className="lg:col-span-8 space-y-6">
          {/* Physical Anodized Aluminum Plate Mockup */}
          <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-primary" />
                Previsualización de Placa Física (70x50 mm)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintZebra}
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir Zebra ZPL
                </button>
                <button
                  type="button"
                  onClick={() => showToast('SVG Generado', 'Vector descargado para corte láser por fibra', 'info')}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-mono font-bold flex items-center gap-1.5 border border-outline/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar SVG
                </button>
              </div>
            </div>

            {/* Realistic Brushed Anodized Metal Plate */}
            <div className="relative mx-auto max-w-lg rounded-xl border-4 border-slate-600 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-5 shadow-2xl text-slate-100 select-none overflow-hidden">
              {/* Brushed metal sheen overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

              {/* 4 Corner Screw Holes */}
              <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-400 flex items-center justify-center text-[9px] font-bold text-slate-400">
                +
              </div>
              <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-400 flex items-center justify-center text-[9px] font-bold text-slate-400">
                +
              </div>
              <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-400 flex items-center justify-center text-[9px] font-bold text-slate-400">
                +
              </div>
              <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-400 flex items-center justify-center text-[9px] font-bold text-slate-400">
                +
              </div>

              {/* Plate Header */}
              <div className="text-center border-b border-slate-600 pb-2 mb-3">
                <div className="text-[11px] font-mono tracking-widest font-black text-amber-300">
                  MANUFACTURAS ANDINA S.A.
                </div>
                <div className="text-[9px] font-mono text-slate-300">
                  PLANTA LOS ANDES • SISTEMA DE GESTIÓN ISO 14224 / 55000
                </div>
              </div>

              {/* Plate Content: Left specs + Right QR */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 font-mono text-[11px] text-slate-200 min-w-0">
                  <div className="text-sm font-black text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-600 inline-block">
                    TAG: {specs.code}
                  </div>
                  <div className="truncate">MOD: {specs.model || 'P4 QVP3-RLN-18.5'}</div>
                  <div className="truncate">S/N: {specs.serialNumber || 'SN-2019-883492-H'}</div>
                  <div className="truncate text-[10px] text-slate-300">
                    POT: {specs.nominalSpecs?.power || '75 kW'} • RATIO: {specs.nominalSpecs?.ratio || '1:18.5'}
                  </div>
                  <div className="truncate text-[10px] text-amber-200">
                    LUB: {specs.nominalSpecs?.lubricant || 'ISO VG 220 Sint.'} ({specs.nominalSpecs?.capacity || '28.5L'})
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white p-2 rounded-lg shrink-0 border-2 border-slate-300 shadow-md flex flex-col items-center">
                  {/* High contrast QR simulation */}
                  <div className="w-20 h-20 bg-black flex items-center justify-center text-white relative">
                    <QrCode className="w-18 h-18 text-white stroke-[2]" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-900 mt-1">
                    {specs.hash || '#928A-SYS'}
                  </span>
                </div>
              </div>

              {/* Barcode code128 strip */}
              <div className="mt-3 pt-2 border-t border-slate-600 flex flex-col items-center">
                <div className="h-6 w-56 flex items-stretch gap-0.5 justify-center opacity-85">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 1].map((w, i) => (
                    <div
                      key={i}
                      className="bg-white"
                      style={{ width: `${w * 2}px` }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 mt-0.5">
                  *{specs.code}*
                </span>
              </div>
            </div>
          </div>

          {/* Technical Specs Editor */}
          <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline/10">
              <span className="text-xs font-mono font-bold uppercase text-on-surface">
                Parámetros Nominales del Activo Seleccionado
              </span>
              <button
                type="button"
                onClick={handleSaveSpecs}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" /> Guardar Ficha
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-on-surface-variant block mb-1">CÓDIGO TAG</label>
                <input
                  type="text"
                  value={specs.code}
                  onChange={(e) => setSpecs({ ...specs, code: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline/15 text-primary font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant block mb-1">FABRICANTE</label>
                <input
                  type="text"
                  value={specs.manufacturer || ''}
                  onChange={(e) => setSpecs({ ...specs, manufacturer: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline/15 text-on-surface"
                />
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant block mb-1">MODELO TÉCNICO</label>
                <input
                  type="text"
                  value={specs.model || ''}
                  onChange={(e) => setSpecs({ ...specs, model: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline/15 text-on-surface"
                />
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant block mb-1">POTENCIA / VELOCIDAD</label>
                <input
                  type="text"
                  value={specs.nominalSpecs?.power || ''}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      nominalSpecs: { ...specs.nominalSpecs, power: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline/15 text-on-surface"
                />
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant block mb-1">LUBRICANTE RECOMENDADO</label>
                <input
                  type="text"
                  value={specs.nominalSpecs?.lubricant || ''}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      nominalSpecs: { ...specs.nominalSpecs, lubricant: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline/15 text-on-surface"
                />
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant block mb-1">CAPACIDAD CÁRTER</label>
                <input
                  type="text"
                  value={specs.nominalSpecs?.capacity || ''}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      nominalSpecs: { ...specs.nominalSpecs, capacity: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline/15 text-on-surface"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
