import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart2,
  Calendar,
  Layers,
  Percent,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react';

export const CostosDisponibilidadView: React.FC = () => {
  const { showToast } = useApp();
  const [currency] = useState<'USD'>('USD');

  const lineUptimes = [
    { line: 'Línea Extrusión 01', code: 'PL1-EXT01', availability: 96.2, target: 92.0, costUSD: 14200, status: 'optimal' },
    { line: 'Línea Extrusión 02', code: 'PL1-EXT02', availability: 89.4, target: 92.0, costUSD: 29800, status: 'warning' },
    { line: 'Línea Inyección Nave B', code: 'PL1-INJ-B', availability: 91.8, target: 92.0, costUSD: 22400, status: 'acceptable' },
    { line: 'Línea Ensamble & Embalaje', code: 'PL1-ENS', availability: 95.1, target: 92.0, costUSD: 9600, status: 'optimal' },
    { line: 'Sector Molienda & Scrap', code: 'PL1-MOL', availability: 94.6, target: 92.0, costUSD: 8230, status: 'optimal' },
  ];

  const costCenters = [
    { cc: 'CC-301 Extrusión General', budget: 45000, actual: 44000, variance: -1000, pct: 97.7 },
    { cc: 'CC-302 Inyección Nave B', budget: 28000, actual: 22400, variance: -5600, pct: 80.0 },
    { cc: 'CC-303 Recuperación & Molinos', budget: 12000, actual: 8230, variance: -3770, pct: 68.5 },
    { cc: 'CC-401 Servicios Auxiliares', budget: 10000, actual: 9600, variance: -400, pct: 96.0 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              Gestión Financiera & OEE
            </span>
            <span className="text-outline/40">•</span>
            <span className="text-xs font-mono text-on-surface-variant">Cierre Q1 2026 (Enero - Marzo)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-sans text-on-surface tracking-tight">
            Costos Operacionales & Disponibilidad de Líneas
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Presupuesto ejecutado vs proyectado, relación Preventivo/Correctivo y costo de mantenimiento por tonelada procesada.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('Reporte Financiero', 'Generando balance contable para Gerencia de Planta', 'info')}
          className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline/20 font-mono text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4 text-secondary" />
          Exportar Balance Q1 (Excel / PDF)
        </button>
      </div>

      {/* 4 Core Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Availability */}
        <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
            <span>DISPONIBILIDAD TOTAL</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +1.4%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">93.4%</div>
          <p className="text-[11px] font-mono text-on-surface-variant">
            Meta Planta: &gt; 92.0% • Uptime global ponderado
          </p>
          <div className="pt-2 border-t border-outline/10 text-[10px] font-mono text-emerald-400">
            Supera benchmark industrial
          </div>
        </div>

        {/* Spend Q1 */}
        <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
            <span>GASTO EJECUTADO Q1</span>
            <span className="text-emerald-400 font-bold">-11.3% vs PPT</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-on-surface">$84,230 USD</div>
          <p className="text-[11px] font-mono text-on-surface-variant">
            Presupuesto Asignado: $95,000 USD
          </p>
          <div className="pt-2 border-t border-outline/10 text-[10px] font-mono text-emerald-400">
            Ahorro de $10,770 USD a la fecha
          </div>
        </div>

        {/* Cost per Ton */}
        <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
            <span>COSTO / TONELADA</span>
            <span className="text-secondary font-bold">ÓPTIMO</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-secondary">$18.40 / Ton</div>
          <p className="text-[11px] font-mono text-on-surface-variant">
            Meta Corporativa: &lt; $20.00 USD / Tonelada
          </p>
          <div className="pt-2 border-t border-outline/10 text-[10px] font-mono text-secondary">
            4,578 Toneladas procesadas en Q1
          </div>
        </div>

        {/* MP / MC Ratio */}
        <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
            <span>RELACIÓN MP / MC</span>
            <span className="text-primary font-bold">WORLD-CLASS</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-primary">68% / 32%</div>
          <p className="text-[11px] font-mono text-on-surface-variant">
            Preventivo: 68% • Correctivo: 32%
          </p>
          <div className="pt-2 border-t border-outline/10 text-[10px] font-mono text-on-surface-variant">
            Objetivo World-Class: 70% / 30%
          </div>
        </div>
      </div>

      {/* Mid Section: Expense Composition & Monthly Spend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Expense Composition */}
        <div className="lg:col-span-5 bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline/10">
            <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-primary" />
              Composición del Gasto ($84,230 USD)
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-on-surface font-semibold">Repuestos & Rodamientos (50%)</span>
                <span className="text-primary font-bold">$42,100 USD</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[50%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-on-surface font-semibold">Mano de Obra & Turnos Extras (29%)</span>
                <span className="text-secondary font-bold">$24,800 USD</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[29%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-on-surface font-semibold">Servicios Terceros & Tornería (13%)</span>
                <span className="text-amber-400 font-bold">$11,200 USD</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 w-[13%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-on-surface font-semibold">Fluidos & Lubricantes (8%)</span>
                <span className="text-purple-400 font-bold">$6,130 USD</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 w-[8%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend Bars */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline/10">
            <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-secondary" />
              Evolución Mensual: Preventivo vs Correctivo
            </span>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-primary">
                <span className="w-2.5 h-2.5 rounded bg-primary" /> Preventivo
              </span>
              <span className="flex items-center gap-1 text-error">
                <span className="w-2.5 h-2.5 rounded bg-error" /> Correctivo
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 text-center font-mono">
            {/* Enero */}
            <div className="space-y-2">
              <div className="h-40 bg-surface-container-lowest rounded-xl p-2 flex items-end justify-center gap-2 border border-outline/10">
                <div className="w-8 bg-primary rounded-t-md" style={{ height: '70%' }} title="Preventivo: $19,200" />
                <div className="w-8 bg-error rounded-t-md" style={{ height: '35%' }} title="Correctivo: $9,600" />
              </div>
              <div className="text-xs font-bold text-on-surface">Enero 2026</div>
              <div className="text-[10px] text-on-surface-variant">$28,800 USD Total</div>
            </div>

            {/* Febrero */}
            <div className="space-y-2">
              <div className="h-40 bg-surface-container-lowest rounded-xl p-2 flex items-end justify-center gap-2 border border-outline/10">
                <div className="w-8 bg-primary rounded-t-md" style={{ height: '75%' }} title="Preventivo: $21,100" />
                <div className="w-8 bg-error rounded-t-md" style={{ height: '28%' }} title="Correctivo: $7,400" />
              </div>
              <div className="text-xs font-bold text-on-surface">Febrero 2026</div>
              <div className="text-[10px] text-on-surface-variant">$28,500 USD Total</div>
            </div>

            {/* Marzo */}
            <div className="space-y-2">
              <div className="h-40 bg-surface-container-lowest rounded-xl p-2 flex items-end justify-center gap-2 border border-outline/10">
                <div className="w-8 bg-primary rounded-t-md" style={{ height: '62%' }} title="Preventivo: $17,000" />
                <div className="w-8 bg-error rounded-t-md" style={{ height: '38%' }} title="Correctivo: $9,930" />
              </div>
              <div className="text-xs font-bold text-on-surface">Marzo 2026</div>
              <div className="text-[10px] text-on-surface-variant">$26,930 USD Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Line Availability & Cost Center Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Line Uptime Table */}
        <div className="lg:col-span-6 bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline/10">
            <span className="text-xs font-mono font-bold uppercase text-on-surface">
              Disponibilidad por Línea Productiva
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant">Meta: 92.0%</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {lineUptimes.map((l) => (
              <div
                key={l.code}
                className="p-3 rounded-xl bg-surface-container-lowest border border-outline/10 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-on-surface">{l.line}</div>
                  <div className="text-[10px] text-on-surface-variant">
                    {l.code} • Gasto acumulado: ${l.costUSD.toLocaleString()} USD
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-black text-sm ${
                      l.availability >= l.target ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {l.availability}%
                  </div>
                  <span className="text-[9px] uppercase font-bold text-on-surface-variant">
                    {l.availability >= l.target ? 'CUMPLE TARGET' : 'BAJO REVISIÓN'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Center Allocation Table */}
        <div className="lg:col-span-6 bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-outline/10">
            <span className="text-xs font-bold uppercase text-on-surface">
              Ejecución por Centro de Costo (Q1)
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">PRESUPUESTO CONTROLADO</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-lowest uppercase text-[10px] text-on-surface-variant border-b border-outline/10">
                <tr>
                  <th className="py-2.5 px-3">Centro de Costo</th>
                  <th className="py-2.5 px-3">Presupuesto</th>
                  <th className="py-2.5 px-3">Ejecutado</th>
                  <th className="py-2.5 px-3">Variación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/5">
                {costCenters.map((cc) => (
                  <tr key={cc.cc} className="hover:bg-surface-container/60 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-on-surface">{cc.cc}</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">${cc.budget.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-bold text-primary">${cc.actual.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">
                      {cc.variance < 0 ? `-$${Math.abs(cc.variance).toLocaleString()}` : `+$${cc.variance}`} ({cc.pct}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
