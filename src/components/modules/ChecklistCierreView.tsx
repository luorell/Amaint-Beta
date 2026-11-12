import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Square,
  ShieldCheck,
  Clock,
  Camera,
  FileCheck,
  AlertTriangle,
  UserCheck,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ChecklistStep {
  id: number;
  title: string;
  detail: string;
  done: boolean;
  timestamp: string;
}

export const ChecklistCierreView: React.FC = () => {
  const { updateWorkOrder, setCurrentView, showToast, addForensicLog } = useApp();

  const [steps, setSteps] = useState<ChecklistStep[]>([
    {
      id: 1,
      title: 'Bloqueo y Tarjeteo Energético LOTO',
      detail: 'Candado #LOTO-44 verificado. Purga de presión residual hidráulica y corte disyuntor motor.',
      done: true,
      timestamp: '09:20 hrs',
    },
    {
      id: 2,
      title: 'Desmontaje de Tapa y Extracción Rodamiento',
      detail: 'Extracción hidráulica de rodamiento SKF 6208 dañado. Inspección visual de flancos de piñón.',
      done: true,
      timestamp: '10:15 hrs',
    },
    {
      id: 3,
      title: 'Limpieza Química y Metrología de Muñón',
      detail: 'Micrómetro de exteriores: 40.012 mm (Tolerancia h6 dentro de norma de fábrica).',
      done: true,
      timestamp: '11:30 hrs',
    },
    {
      id: 4,
      title: 'Montaje por Calentamiento por Inducción SKF',
      detail: 'Rodamiento nuevo calentado a 110°C controlados por termocupla magnética sin impacto.',
      done: true,
      timestamp: '12:10 hrs',
    },
    {
      id: 5,
      title: 'Sustitución de Retén de Vitón y Sellado',
      detail: 'Retén 45x65x10 lubricado e instalado con prensa guía. Sellador Loctite 518 en plano de brida.',
      done: true,
      timestamp: '12:45 hrs',
    },
    {
      id: 6,
      title: 'Relleno de Lubricante Sintético Mobil VG 220',
      detail: 'Carga de 4.0 Litros según nivel en mirilla óptica. Tapón magnético de drenaje limpio.',
      done: true,
      timestamp: '13:15 hrs',
    },
    {
      id: 7,
      title: 'Prueba de Giro y Análisis Vibracional con Carga',
      detail: 'Línea operando a 45 RPM. Vibración global RMS descendió de 6.8 mm/s a 1.2 mm/s (Zona Buena ISO 10816).',
      done: true,
      timestamp: '13:38 hrs',
    },
  ]);

  const [observations, setObservations] = useState(
    'Se completó con éxito la reparación mecánica en reductor principal. Se identificó fatiga en pista externa de rodamiento antiguo por sobrecarga de lote anterior. Parámetros de temperatura estables en 42°C y nivel de ruido atenuado a norma.'
  );

  const [signed, setSigned] = useState(true);
  const [supervisor, setSupervisor] = useState('Ing. Mauricio Valenzuela (Jefe de Mantenimiento)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleStep = (id: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
  };

  const handleConcludeOT = () => {
    const allChecked = steps.every((s) => s.done);
    if (!allChecked) {
      showToast('Checklist Incompleto', 'Debe certificar todos los 7 pasos antes de cerrar la OT', 'warn');
      return;
    }

    if (!signed) {
      showToast('Firma Requerida', 'El técnico responsable debe firmar digitalmente el acta', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      updateWorkOrder('wo-092', {
        status: 'completed',
        progressPercent: 100,
        currentStep: 'Completada y Certificada',
      });

      addForensicLog({
        level: 'INFO',
        action: 'OT_CIERRE_CERTIFICADO',
        description: 'Certificación 7/7 pasos completados con éxito en OT-2026-092 (Extrusora 02).',
        entity: 'OT-2026-092',
        user: 'Carlos Mendoza',
        role: 'Técnico Mecánico Senior',
        ip: '192.168.12.88',
        terminal: 'Tablet Zebra ET51',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      });

      showToast('OT Concluida', 'OT-2026-092 cerrada exitosamente con firma digital SHA-256', 'success');
      setCurrentView('mis-ots-dashboard');
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header & Active OT Badge */}
      <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                Certificación y Cierre de Intervención
              </span>
              <span className="text-outline/40">•</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">Paso 7 de 7</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-on-surface tracking-tight">
              Checklist & Entrega Operacional OT-2026-092
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              PL1-EXT-02 • Extrusora de Polímeros Doble Husillo 02 (Planta 1 &gt; Nave A)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline/10 text-right">
              <div className="text-[10px] font-mono text-on-surface-variant flex items-center gap-1">
                <Clock className="w-3 h-3 text-secondary" /> Tiempo Intervención
              </div>
              <div className="text-sm font-mono font-bold text-on-surface">02h 10m 45s</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Mandatory Steps Checklist */}
      <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 sm:p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-outline/10">
          <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Pasos Mandatorios de Protocolo Técnico (ISO 9001 / OSHA)
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {steps.filter((s) => s.done).length} de {steps.length} Verificados
          </span>
        </div>

        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                step.done
                  ? 'bg-surface-container-lowest/80 border-outline/15 hover:border-emerald-500/40'
                  : 'bg-surface-container-lowest border-amber-500/30'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-emerald-400 focus:outline-none"
              >
                {step.done ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                ) : (
                  <Square className="w-5 h-5 text-on-surface-variant" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-xs font-bold ${
                      step.done ? 'text-on-surface' : 'text-amber-400'
                    }`}
                  >
                    {step.id}. {step.title}
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant/70 shrink-0">
                    {step.timestamp}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed font-sans">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spare Parts Validation & Photographic Closure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spare Parts Imputed */}
        <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-on-surface flex items-center justify-between">
            <span>Repuestos Imputados (Vale #RQ-9921)</span>
            <span className="text-emerald-400 text-[10px]">Kardex Conciliado</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline/10 flex items-center justify-between">
              <div>
                <div className="font-bold text-on-surface">2x Rodamiento SKF 6208-2RS</div>
                <div className="text-[10px] text-on-surface-variant">Lote #SKF-2025-Q4 • $69.00 USD</div>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">INSTALADO</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline/10 flex items-center justify-between">
              <div>
                <div className="font-bold text-on-surface">1x Retén Vitón 45x65x10</div>
                <div className="text-[10px] text-on-surface-variant">Doble labio freudenberg • $18.20 USD</div>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">INSTALADO</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline/10 flex items-center justify-between">
              <div>
                <div className="font-bold text-on-surface">4.0L Aceite Mobil ISO VG 220</div>
                <div className="text-[10px] text-on-surface-variant">Tambor Central • $24.00 USD</div>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">RELLENADO</span>
            </div>
          </div>
        </div>

        {/* Photographic Evidence */}
        <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-on-surface flex items-center justify-between">
            <span>Evidencia Fotográfica de Entrega</span>
            <span className="text-primary text-[10px]">2 Fotos Adjuntas</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-outline/20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3ju_HWhrd0dpf-sXUAvJtRATQcvVjVcgsuDY6UEV3boC2OjleSTPUsRoqnpFB3gtOj4bD6peSvadEOJUgzHwvkBKX-ueBObaJ4h5dzueh0eBNabsLyIxUo4DSDryLKyuYfRw8vMv_-qsYXIudhBX0hgde-iTBUxjkIxTO4tWNA2u_J_WpTuoUB18Z5p7IBkttmgznp_z6Sa4hg8B6ZqLgYsBQI-tCekXe0Vrp9yc"
                alt="Rodamiento montado"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                RODAMIENTO OK
              </span>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden border border-outline/20 bg-surface-container-lowest flex flex-col items-center justify-center p-2 text-center">
              <Camera className="w-5 h-5 text-secondary mb-1" />
              <span className="text-[10px] font-mono text-on-surface">Mirilla Nivel Aceite</span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">4.0 Litros OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Observations Textarea */}
      <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm">
        <label className="block text-xs font-mono font-bold uppercase text-on-surface mb-2">
          Observaciones Técnicas Finales & Recomendaciones
        </label>
        <textarea
          rows={3}
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          className="w-full p-3 rounded-xl bg-surface-container-lowest border border-outline/20 text-xs sm:text-sm text-on-surface font-sans leading-relaxed focus:outline-none focus:border-primary"
        />
      </div>

      {/* Digital Signature & SHA-256 Pad */}
      <div className="bg-surface-container-low border border-outline/15 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-primary" />
            Firma Digital del Técnico Ejecutor
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">CERTIFICADO ACTIVO</span>
        </div>

        {/* Signature Box */}
        <div className="relative rounded-xl border border-outline/25 bg-surface-container-lowest p-4 h-28 flex flex-col justify-between">
          {/* Simulated digital signature SVG scribble */}
          <div className="h-16 flex items-center pl-4">
            <svg viewBox="0 0 300 60" className="w-64 h-14 text-primary stroke-current fill-none stroke-2">
              <path d="M 10 35 Q 40 10 70 30 T 120 20 T 160 40 T 210 15 T 260 30 T 290 25" />
              <path d="M 60 45 Q 110 50 170 45" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant border-t border-outline/10 pt-1">
            <span>Carlos Mendoza (ID: TECH-4402) • Firma verificada por PIN biométrico</span>
            <span className="text-primary font-bold">VALIDADO</span>
          </div>
        </div>

        {/* Cryptographic SHA-256 Hash Preview */}
        <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline/10 text-xs font-mono">
          <div className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">
            Huella Digital Criptográfica (SHA-256 Inmutable)
          </div>
          <div className="text-[11px] text-emerald-400 break-all select-all font-mono">
            e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="w-full sm:w-auto text-xs font-mono text-on-surface-variant">
            <span>Aprobador asignado: </span>
            <span className="text-on-surface font-semibold">{supervisor}</span>
          </div>

          <button
            type="button"
            onClick={handleConcludeOT}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <CheckSquare className="w-4 h-4 fill-current" />
            {isSubmitting ? 'Cerrando y Reconciliando...' : 'Concluir & Entregar OT a Producción'}
          </button>
        </div>
      </div>
    </div>
  );
};
