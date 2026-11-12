import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityLevel } from '../../types';
import {
  AlertTriangle,
  Mic,
  Camera,
  Lock,
  Clock,
  ShieldAlert,
  Save,
  Flame,
  CheckCircle2,
  Image as ImageIcon,
  Radio,
  FileText,
  Volume2,
} from 'lucide-react';

export const ReportarFallaView: React.FC = () => {
  const { addWorkOrder, setCurrentView, showToast, selectedAssetCode } = useApp();

  const [assetCode, setAssetCode] = useState(selectedAssetCode || 'PL1-EXT-02');
  const [severity, setSeverity] = useState<PriorityLevel>('critical');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Vibración / Desbalance',
    'Sobrecalentamiento',
  ]);
  const [description, setDescription] = useState(
    'Ruido metálico intermitente y vibración anormal en reductor principal. Temperatura del cárter superior a 78°C.'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState<string | null>(null);
  const [lotoRequired, setLotoRequired] = useState(true);
  const [lotoLockId, setLotoLockId] = useState('LOTO-44-ANDINA');
  const [horometer, setHorometer] = useState('14,280');
  const [temperature, setTemperature] = useState('78.5');
  const [photos, setPhotos] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB3ju_HWhrd0dpf-sXUAvJtRATQcvVjVcgsuDY6UEV3boC2OjleSTPUsRoqnpFB3gtOj4bD6peSvadEOJUgzHwvkBKX-ueBObaJ4h5dzueh0eBNabsLyIxUo4DSDryLKyuYfRw8vMv_-qsYXIudhBX0hgde-iTBUxjkIxTO4tWNA2u_J_WpTuoUB18Z5p7IBkttmgznp_z6Sa4hg8B6ZqLgYsBQI-tCekXe0Vrp9yc',
  ]);

  const categories = [
    'Fuga Hidráulica',
    'Vibración / Desbalance',
    'Sobrecalentamiento',
    'Falla Eléctrica / Variador',
    'Bloqueo Mecánico',
    'Descalibración Sensores',
    'Desgaste de Sellos',
    'Presión Anómala',
  ];

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setAudioTranscript('Dictado grabado (0:08s): Vibración severa en eje de salida reductor Hansen.');
      setDescription((prev) => prev + ' [Audio transcrito]: Vibración severa en eje de salida reductor Hansen.');
      showToast('Audio Transcrito', 'Nota de voz procesada y añadida al reporte', 'info');
    } else {
      setIsRecording(true);
      showToast('Grabando Nota de Voz', 'Hable claramente describiendo el síntoma...', 'info');
      setTimeout(() => {
        setIsRecording(false);
        setAudioTranscript('Dictado grabado (0:08s): Vibración severa en eje de salida reductor Hansen.');
        setDescription((prev) => prev + ' [Audio transcrito]: Vibración severa en eje de salida reductor Hansen.');
      }, 3500);
    }
  };

  const handleSubmit = (isEmergency: boolean) => {
    if (!description.trim()) {
      showToast('Error de Validación', 'Debe ingresar una descripción del problema', 'error');
      return;
    }

    const priorityVal: PriorityLevel = isEmergency ? 'critical' : severity;
    const assetTitle =
      assetCode === 'PL1-EXT-02'
        ? 'Extrusora Doble Husillo 02'
        : assetCode === 'PL1-INJ-03'
        ? 'Inyectora Hidráulica 03'
        : `Equipo Industrial ${assetCode}`;

    addWorkOrder({
      assetCode,
      assetName: assetTitle,
      priority: priorityVal,
      type: isEmergency ? 'EMERGENCIA' : 'CORRECTIVO',
      description: `${description} [Categorías: ${selectedCategories.join(', ')}] [Horómetro: ${horometer}h | Temp: ${temperature}°C] [LOTO: ${lotoRequired ? lotoLockId : 'No requerido'}]`,
      location: 'Planta 1 > Plásticos & Polímeros',
      imageUrl: photos[0],
      slaLimit: isEmergency ? '45 min' : '02h 30m',
      status: 'pending',
    });

    setCurrentView('mis-ots-dashboard');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-error flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
              Notificación Inmediata en Terreno
            </span>
            <span className="text-outline/40">•</span>
            <span className="text-xs font-mono text-on-surface-variant">Modo Offline Compatible</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-sans text-on-surface tracking-tight">
            Reportar Falla Operacional / Solicitud SOS
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Grave el síntoma mecánico, capture evidencia fotográfica y solicite intervención inmediata con un solo toque.
          </p>
        </div>
      </div>

      {/* Main Report Form */}
      <div className="space-y-6 bg-surface-container-low border border-outline/15 rounded-2xl p-5 sm:p-7 shadow-lg">
        {/* Step 1: Asset Selector & Horometer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono font-bold uppercase text-on-surface mb-1.5">
              Activo / TAG Identificador
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value.toUpperCase())}
                placeholder="Ej. PL1-EXT-02"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline/20 text-on-surface font-mono font-bold text-sm focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setAssetCode('PL1-EXT-02')}
                className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-mono text-primary border border-outline/10 font-bold"
              >
                Extrusora 02
              </button>
              <button
                type="button"
                onClick={() => setAssetCode('PL1-INJ-03')}
                className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-mono text-error border border-outline/10 font-bold"
              >
                Inyectora 03
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-on-surface mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-secondary" /> Horómetro Actual (hrs)
            </label>
            <input
              type="text"
              value={horometer}
              onChange={(e) => setHorometer(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline/20 text-on-surface font-mono font-bold text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Step 2: Tactile Severity Selection */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-on-surface mb-2">
            Nivel de Severidad Operacional (Glove-Friendly)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSeverity('critical')}
              className={`p-4 rounded-xl border-2 text-left transition-all active:scale-98 ${
                severity === 'critical'
                  ? 'border-error bg-error/15 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'border-outline/15 bg-surface-container-lowest hover:border-outline/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-sm text-error flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> PARO DE LÍNEA
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-error" />
              </div>
              <p className="text-xs text-on-surface-variant font-sans">
                Línea detenida o riesgo inminente de daño mayor a máquina. SLA &lt; 15 min.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSeverity('high')}
              className={`p-4 rounded-xl border-2 text-left transition-all active:scale-98 ${
                severity === 'high'
                  ? 'border-amber-500 bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'border-outline/15 bg-surface-container-lowest hover:border-outline/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-sm text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> DEGRADACIÓN
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              </div>
              <p className="text-xs text-on-surface-variant font-sans">
                Operando a velocidad reducida o con parámetros térmicos al límite.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSeverity('medium')}
              className={`p-4 rounded-xl border-2 text-left transition-all active:scale-98 ${
                severity === 'medium'
                  ? 'border-secondary bg-secondary/15 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'border-outline/15 bg-surface-container-lowest hover:border-outline/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-sm text-secondary flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> CONDICIONAL
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              </div>
              <p className="text-xs text-on-surface-variant font-sans">
                Falla no crítica o anomalía visual programable para fin de turno.
              </p>
            </button>
          </div>
        </div>

        {/* Step 3: Category Chips */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-on-surface mb-2">
            Categoría del Síntoma
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const selected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
                    selected
                      ? 'bg-primary/20 text-primary border-primary/50 font-bold'
                      : 'bg-surface-container-lowest text-on-surface-variant border-outline/15 hover:border-outline/30'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Description & Audio Dictation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono font-bold uppercase text-on-surface">
              Descripción Técnica del Síntoma
            </label>
            <button
              type="button"
              onClick={handleVoiceRecording}
              className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                isRecording
                  ? 'bg-error text-on-error border-error animate-pulse shadow-md'
                  : 'bg-surface-container-high hover:bg-surface-container-highest text-primary border-primary/30'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              {isRecording ? 'Grabando Audio... (Toque para parar)' : 'Dictar por Voz (Audio Opus)'}
            </button>
          </div>

          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describa el comportamiento anómalo, vibraciones, olores o alarmas en pantalla..."
            className="w-full p-3 rounded-xl bg-surface-container-lowest border border-outline/20 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary font-sans leading-relaxed"
          />

          {audioTranscript && (
            <div className="mt-2 p-2.5 rounded-lg bg-surface-container-lowest border border-primary/20 flex items-center justify-between text-xs font-mono text-primary">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span>{audioTranscript}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">14.2 KB BLOB</span>
            </div>
          )}
        </div>

        {/* Step 5: Photographic Evidence Slots */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-on-surface mb-2">
            Evidencia Fotográfica (Cámara Móvil / Boroscopio)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden border border-outline/20 group"
              >
                <img src={photo} alt="Falla" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                  FOTO 1 (REDUCTOR)
                </span>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                showToast('Cámara Activada', 'Captura simulada añadida a la cola fotográfica', 'info');
                setPhotos((prev) => [
                  ...prev,
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuAP4Gv-6b-cK7Qf2sJtN1yL7P5e1f0b0u1r120q4y0o1v0e0-1c2o3p4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z',
                ]);
              }}
              className="aspect-video sm:aspect-square rounded-xl border-2 border-dashed border-outline/25 bg-surface-container-lowest hover:bg-surface-container flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[11px] font-mono font-bold">Añadir Foto</span>
            </button>
          </div>
        </div>

        {/* Step 6: Safety Lockout (LOTO) & Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline/10">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Bloqueo Energético LOTO
              </label>
              <input
                type="checkbox"
                checked={lotoRequired}
                onChange={(e) => setLotoRequired(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary"
              />
            </div>
            {lotoRequired && (
              <input
                type="text"
                value={lotoLockId}
                onChange={(e) => setLotoLockId(e.target.value)}
                placeholder="ID Candado Físico (ej. LOTO-44)"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container border border-outline/20 text-xs font-mono text-on-surface"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-on-surface mb-2">
              Lectura Térmica Infrarroja (°C)
            </label>
            <input
              type="text"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-surface-container border border-outline/20 text-xs font-mono text-error font-bold"
            />
          </div>
        </div>

        {/* Form Submission Actions */}
        <div className="pt-4 border-t border-outline/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline/20 font-mono font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4 text-secondary" />
            Guardar en Cola Offline (AES-256)
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-error hover:bg-error/90 text-on-error font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Flame className="w-4 h-4 fill-current" />
            Generar OT de Emergencia Inmediata
          </button>
        </div>
      </div>
    </div>
  );
};
