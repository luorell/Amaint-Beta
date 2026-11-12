import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  BarChart3,
  PieChart,
  Search,
  Filter,
  Download,
  Calendar,
} from 'lucide-react';

export const KpisConfiabilidadView: React.FC = () => {
  const { showToast } = useApp();
  const [auditSearch, setAuditSearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('quarter');

  const paretoData = [
    { asset: 'Extrusora Doble Husillo 02 (PL1-EXT-02)', downtimeHours: 42, pct: 38.5, cumPct: 38.5 },
    { asset: 'Inyectora Hidráulica 03 (PL1-INJ-03)', downtimeHours: 31, pct: 28.4, cumPct: 66.9 },
    { asset: 'Molino de Gránulos 02 (PL1-MOL-02)', downtimeHours: 18, pct: 16.5, cumPct: 83.4 },
    { asset: 'Ensacadora Línea 1 (PL1-ENS-01)', downtimeHours: 12, pct: 11.0, cumPct: 94.4 },
    { asset: 'Chiller Circuito A (PL1-CHL-01)', downtimeHours: 6, pct: 5.6, cumPct: 100.0 },
  ];

  const auditEvents = [
    {
      id: 'EVT-2026-104',
      date: '2026-03-30 08:50',
      assetCode: 'PL1-EXT-02',
      assetName: 'Extrusora 02',
      failureMode: 'Falla Mecánica - Cojinete/Rodamiento',
      rootCause: 'Fatiga de material por sobrecarga axial en lote de policarbonato',
      mttrHours: 2.15,
      impactUSD: '$1,850',
      action: 'Reemplazo SKF 6208 + Alineación Láser',
    },
    {
      id: 'EVT-2026-103',
      date: '2026-03-28 14:15',
      assetCode: 'PL1-INJ-03',
      assetName: 'Inyectora 03',
      failureMode: 'Fuga de Fluido - Válvula Proporcional',
      rootCause: 'Degradación de sellos vitón por picos térmicos en aceite hidráulico',
      mttrHours: 1.75,
      impactUSD: '$2,400',
      action: 'Cambio O-Rings + Purga de circuito',
    },
    {
      id: 'EVT-2026-102',
      date: '2026-03-24 11:20',
      assetCode: 'PL1-ENS-01',
      assetName: 'Ensacadora 01',
      failureMode: 'Instrumentación - Sensor Inductivo',
      rootCause: 'Descalibración por vibración y polvo plástico acumulado en cabezal',
      mttrHours: 0.8,
      impactUSD: '$420',
      action: 'Limpieza con solvente dieléctrico y recalibración a 8mm',
    },
    {
      id: 'EVT-2026-101',
      date: '2026-03-19 16:40',
      assetCode: 'PL1-MOL-02',
      assetName: 'Molino 02',
      failureMode: 'Mecánico - Holgura en Chumacera',
      rootCause: 'Falta de grasa de alta viscosidad por bypass de preventiva semanal',
      mttrHours: 3.4,
      impactUSD: '$3,100',
      action: 'Ajuste de tuerca de fijación y relubricación completa',
    },
  ];

  const filteredEvents = auditEvents.filter(
    (ev) =>
      ev.assetCode.toLowerCase().includes(auditSearch.toLowerCase()) ||
      ev.assetName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      ev.failureMode.toLowerCase().includes(auditSearch.toLowerCase()) ||
      ev.rootCause.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Ingeniería de Mantenimiento & RAMS
            </span>
            <span className="text-outline/40">•</span>
            <span className="text-xs font-mono text-on-surface-variant">Norma ISO 14224 / OREDA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-sans text-on-surface tracking-tight">
            KPIs de Confiabilidad & Curvas de Vida
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Métricas de confiabilidad (MTBF), mantenibilidad (MTTR) y análisis causa-raíz de paradas no programadas.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-surface-container-low p-1 rounded-lg border border-outline/10 flex items-center">
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedPeriod === 'month' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setSelectedPeriod('quarter')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedPeriod === 'quarter' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              Q1 2026
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedPeriod === 'year' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              Año
            </button>
          </div>

          <button
            onClick={() => showToast('Exportación RAMS', 'Generando informe analítico PDF / CSV...', 'info')}
            className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-outline/15 text-on-surface"
            title="Exportar Reporte"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Core RAMS Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MTBF */}
        <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
            <span>MTBF PLANTA</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-on-surface">218.4 hrs</div>
          <p className="text-[11px] font-mono text-on-surface-variant">
            Meta Planta: &gt; 200.0 hrs • Tiempo Medio Entre Fallas
          </p>
          <div className="pt-2 border-t border-outline/10 text-[10px] font-mono text-emerald-400">
            Excelente estabilidad operacional
          </div>
        </div>

        {/* MTTR */}
        <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
            <span>MTTR PLANTA</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" /> -18.5%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-secondary">2.75 hrs</div>
          <p className="text-[11px] font-mono text-on-surface-variant">
            Meta Planta: &lt; 3.5 hrs • Tiempo Medio de Reparación
          </p>
          <div className="pt-2 border-t border-outline/10 text-[10px] font-mono text-secondary">
            Eficiencia óptima en diagnóstico y repuestos
          </div>
        </div>

        {/* Failure Rate Lambda */}
        <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
            <span>TASA DE FALLA (λ)</span>
            <span className="text-primary font-bold">ESTABLE</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-primary">0.00458</div>
          <p className="text-[11px] font-mono text-on-surface-variant">
            Fallas por hora máquina en régimen continuo
          </p>
          <div className="pt-2 border-t border-outline/10 text-[10px] font-mono text-on-surface-variant">
            Distribución exponencial de Poisson validada
          </div>
        </div>

        {/* Reliability R(168h) */}
        <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
            <span>CONFIABILIDAD R(168h)</span>
            <span className="text-emerald-400 font-bold">88.4%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">88.4%</div>
          <p className="text-[11px] font-mono text-on-surface-variant">
            Probabilidad de operar 7 días continuos sin fallo
          </p>
          <div className="pt-2 border-t border-outline/10 text-[10px] font-mono text-emerald-400">
            Alineado con plan maestro de producción
          </div>
        </div>
      </div>

      {/* Mid Section: Pareto 80/20 & MTBF vs MTTR Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pareto 80/20 Chart */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline/10">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-primary" />
                Pareto 80/20: Horas de Detención por Activo
              </span>
              <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                El 80% de las horas improductivas se concentran en las líneas de extrusión e inyección.
              </p>
            </div>
            <span className="text-xs font-mono text-primary font-bold">109 hrs Totales</span>
          </div>

          <div className="space-y-3 pt-2">
            {paretoData.map((item) => (
              <div key={item.asset} className="space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-on-surface truncate">{item.asset}</span>
                  <span className="text-on-surface-variant shrink-0 ml-2">
                    <b className="text-primary">{item.downtimeHours} hrs</b> ({item.pct}%) • Acum: {item.cumPct}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-primary transition-all rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8-Week Evolution Curve */}
        <div className="lg:col-span-5 bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline/10">
            <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Evolución 8 Semanas (MTBF vs MTTR)
            </span>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary" /> MTBF (hrs)
              </span>
              <span className="flex items-center gap-1 text-secondary">
                <span className="w-2 h-2 rounded-full bg-secondary" /> MTTR (hrs)
              </span>
            </div>
          </div>

          {/* SVG Trend Lines */}
          <div className="relative h-48 w-full bg-surface-container-lowest rounded-xl p-3 border border-outline/10 flex items-center justify-center">
            <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="20" y1="20" x2="380" y2="20" stroke="currentColor" className="text-outline/10" strokeDasharray="3 3" />
              <line x1="20" y1="60" x2="380" y2="60" stroke="currentColor" className="text-outline/10" strokeDasharray="3 3" />
              <line x1="20" y1="100" x2="380" y2="100" stroke="currentColor" className="text-outline/10" strokeDasharray="3 3" />
              <line x1="20" y1="140" x2="380" y2="140" stroke="currentColor" className="text-outline/10" strokeDasharray="3 3" />

              {/* MTBF Line (Green/Primary, trending upwards from 150 to 218) */}
              <polyline
                fill="none"
                stroke="#4ade80"
                strokeWidth="3"
                points="30,110 80,95 130,85 180,90 230,70 280,60 330,45 370,30"
              />
              {/* MTBF Dots */}
              {[[30,110],[80,95],[130,85],[180,90],[230,70],[280,60],[330,45],[370,30]].map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r="3.5" fill="#4ade80" />
              ))}

              {/* MTTR Line (Secondary/Cyan, trending downwards from 4.2 to 2.7) */}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                points="30,40 80,55 130,65 180,75 230,85 280,95 330,115 370,125"
              />
              {/* MTTR Dots */}
              {[[30,40],[80,55],[130,65],[180,75],[230,85],[280,95],[330,115],[370,125]].map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r="3" fill="#38bdf8" />
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
            <span>Sem 01 (Ene)</span>
            <span>Sem 04 (Feb)</span>
            <span>Sem 08 (Mar Actual)</span>
          </div>
        </div>
      </div>

      {/* ISO 14224 Failure Mode Breakdown & Event Table */}
      <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline/10">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Auditoría Forense de Fallas ISO 14224 / OREDA
            </span>
            <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">
              Trazabilidad técnica de eventos con imputación de causa raíz y horas de paro
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              placeholder="Buscar por equipo, causa o modo..."
              className="w-full pl-8 pr-3 py-1 rounded-lg bg-surface-container-lowest border border-outline/15 text-xs font-mono text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-container-lowest uppercase text-[10px] text-on-surface-variant border-b border-outline/10">
              <tr>
                <th className="py-2.5 px-3">Folio & Fecha</th>
                <th className="py-2.5 px-3">Activo</th>
                <th className="py-2.5 px-3">Modo de Falla</th>
                <th className="py-2.5 px-3">Causa Raíz Diagnosticada</th>
                <th className="py-2.5 px-3">MTTR</th>
                <th className="py-2.5 px-3">Impacto</th>
                <th className="py-2.5 px-3">Acción Correctiva</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-surface-container/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-primary">{ev.id}</div>
                    <div className="text-[10px] text-on-surface-variant">{ev.date}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-on-surface">{ev.assetName}</div>
                    <div className="text-[10px] text-secondary">{ev.assetCode}</div>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant font-medium">{ev.failureMode}</td>
                  <td className="py-3 px-3 text-on-surface font-sans text-xs max-w-xs">{ev.rootCause}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{ev.mttrHours}h</td>
                  <td className="py-3 px-3 text-error font-bold">{ev.impactUSD}</td>
                  <td className="py-3 px-3 text-on-surface-variant font-sans text-xs max-w-xs">{ev.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
