import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Barcode,
  CheckCircle2,
  AlertTriangle,
  Send,
  TrendingDown,
  RefreshCw,
  Search,
  CheckSquare,
  Square,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export const BodegaRepuestosView: React.FC = () => {
  const {
    voucher,
    toggleVoucherItemVerification,
    confirmDispatch,
    spareParts,
    reorderSparePart,
    showToast,
  } = useApp();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleScanBarcode = () => {
    if (!barcodeInput) return;
    const item = voucher.items.find(
      (it) => it.sku.toLowerCase() === barcodeInput.toLowerCase()
    );
    if (item) {
      if (!item.verified) {
        toggleVoucherItemVerification(item.sku);
      }
      showToast('SKU Verificado', `Lectura correcta: ${item.name}`, 'success');
      setBarcodeInput('');
    } else {
      showToast('SKU no encontrado', `El código ${barcodeInput} no pertenece a este vale`, 'error');
    }
  };

  const criticalStockItems = spareParts.filter((p) => p.status === 'critical' || p.status === 'warning');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Gestión de Materiales & Pañol
            </span>
            <span className="text-outline/40">•</span>
            <span className="text-xs font-mono text-on-surface-variant">Kardex Transaccional Atómico</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-sans text-on-surface tracking-tight">
            Bodega Central: Despacho & Control Kardex
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Despacho contra Orden de Trabajo con escaneo de código de barras y disparo automático de reposición de stock mínimo.
          </p>
        </div>
      </div>

      {/* Main Grid: Active Voucher Dispatch & Critical Stock Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Dispatch Voucher */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/20 text-primary">
                  Vale #{voucher.id}
                </span>
                <span className="text-xs font-mono font-bold text-error">
                  {voucher.otCode}
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface mt-1">{voucher.otTitle}</h3>
            </div>

            <span
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                voucher.status === 'dispatched'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {voucher.status === 'dispatched' ? 'Despachado' : 'Pendiente Entrega'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline/5">
              <div className="text-[10px] text-on-surface-variant">SOLICITANTE</div>
              <div className="font-bold text-on-surface truncate mt-0.5">{voucher.requesterName}</div>
            </div>
            <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline/5">
              <div className="text-[10px] text-on-surface-variant">BODEGUERO</div>
              <div className="font-bold text-on-surface truncate mt-0.5">Carlos Mendoza</div>
            </div>
            <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline/5">
              <div className="text-[10px] text-on-surface-variant">CENTRO COSTO</div>
              <div className="font-bold text-secondary truncate mt-0.5">{voucher.costCenter}</div>
            </div>
            <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline/5">
              <div className="text-[10px] text-on-surface-variant">TOTAL VALE</div>
              <div className="font-bold text-emerald-400 truncate mt-0.5">${voucher.totalCostUSD} USD</div>
            </div>
          </div>

          {/* Barcode Quick Verification Input */}
          <div className="flex gap-2 p-2 rounded-xl bg-surface-container-lowest border border-outline/20">
            <div className="relative flex-1">
              <Barcode className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleScanBarcode()}
                placeholder="Escanear o ingresar SKU (ej. KM-HYD-502, OR-90-NBR)..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container border border-outline/10 text-xs font-mono text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={handleScanBarcode}
              className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-mono font-bold text-xs active:scale-95 transition-all"
            >
              Verificar
            </button>
          </div>

          {/* Voucher Items List */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase text-on-surface-variant flex items-center justify-between">
              <span>Líneas de Material a Entregar</span>
              <span className="text-[11px] text-secondary">
                {voucher.items.filter((it) => it.verified).length} de {voucher.items.length} Verificados
              </span>
            </div>

            <div className="space-y-2">
              {voucher.items.map((item) => (
                <div
                  key={item.sku}
                  onClick={() => toggleVoucherItemVerification(item.sku)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                    item.verified
                      ? 'bg-surface-container-lowest/90 border-emerald-500/30'
                      : 'bg-surface-container-lowest border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button type="button" className="text-emerald-400">
                      {item.verified ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                      ) : (
                        <Square className="w-5 h-5 text-on-surface-variant" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-on-surface truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-bold">
                          {item.sku}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-on-surface-variant mt-0.5">
                        Ubicación: <span className="text-secondary font-bold">{item.location}</span> • Lote: {item.tag} • Stock actual: {item.stock} {item.unit}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-sm text-primary">
                      {item.qtyRequired} {item.unit}
                    </div>
                    <span className="text-[10px] font-mono text-on-surface-variant">Requerido</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-3 border-t border-outline/10 flex items-center justify-between">
            <div className="text-[11px] font-mono text-on-surface-variant">
              Rebaja automática de saldo en Kardex con firma SHA-256
            </div>

            <button
              type="button"
              onClick={() => confirmDispatch(voucher.id)}
              disabled={voucher.status === 'dispatched'}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-2 transition-all shadow-md ${
                voucher.status === 'dispatched'
                  ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 active:scale-95'
              }`}
            >
              <Send className="w-4 h-4 fill-current" />
              {voucher.status === 'dispatched' ? 'Despacho Ya Procesado' : 'Confirmar Despacho & Rebaja Kardex'}
            </button>
          </div>
        </div>

        {/* Right Column: Stock Monitor & Replenishment Trigger */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline/10">
              <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-error" />
                Alertas de Stock Crítico ({criticalStockItems.length})
              </span>
              <span className="text-[10px] font-mono text-secondary font-bold">REPOSICIÓN REQUERIDA</span>
            </div>

            <div className="space-y-3">
              {criticalStockItems.map((item) => (
                <div
                  key={item.sku}
                  className="p-3 rounded-xl bg-surface-container-lowest border border-outline/10 space-y-2 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface">{item.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.status === 'critical' ? 'bg-error/20 text-error' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {item.criticality}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>SKU: {item.sku}</span>
                    <span>{item.shelf}</span>
                  </div>

                  {/* Stock Gauge */}
                  <div>
                    <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
                      <span>Stock Actual: <b className="text-on-surface">{item.stockActual}</b> / Mínimo: {item.stockMin}</span>
                      <span>Reorden: +{item.stockReorden} {item.unit}</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.status === 'critical' ? 'bg-error' : 'bg-amber-400'}`}
                        style={{ width: `${Math.min(100, (item.stockActual / item.stockReorden) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-on-surface-variant">
                      Proveedor: {item.supplier} ({item.leadTime})
                    </span>
                    <button
                      type="button"
                      onClick={() => reorderSparePart(item.sku)}
                      className="px-2.5 py-1 rounded bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold text-[10px] transition-all"
                    >
                      Disparar Reorden
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kardex Transaction Audit Feed */}
          <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-outline/10">
              <span className="text-xs font-bold uppercase text-on-surface">Movimientos Recientes</span>
              <span className="text-[10px] text-emerald-400 font-bold">STREAM ACTIVO</span>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-surface-container-lowest flex items-center justify-between text-[11px]">
                <div>
                  <div className="text-on-surface font-bold">VAL-8821: Salida 2x KM-HYD-502</div>
                  <div className="text-[10px] text-on-surface-variant">OT-2026-098 • Inyectora 03</div>
                </div>
                <span className="text-error font-bold">-2 un</span>
              </div>

              <div className="p-2 rounded-lg bg-surface-container-lowest flex items-center justify-between text-[11px]">
                <div>
                  <div className="text-on-surface font-bold">VAL-8819: Salida 2x SKF 6208</div>
                  <div className="text-[10px] text-on-surface-variant">OT-2026-092 • Extrusora 02</div>
                </div>
                <span className="text-error font-bold">-2 un</span>
              </div>

              <div className="p-2 rounded-lg bg-surface-container-lowest flex items-center justify-between text-[11px]">
                <div>
                  <div className="text-on-surface font-bold">OC-4412: Ingreso Tambor Mobil VG 220</div>
                  <div className="text-[10px] text-on-surface-variant">Recepcionado por Pañol</div>
                </div>
                <span className="text-emerald-400 font-bold">+208 L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
