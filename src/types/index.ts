export type ViewPath =
  | 'mis-ots-dashboard'
  | 'escaner-qr-activos'
  | 'reportar-falla'
  | 'checklist-cierre'
  | 'jerarquia-de-activos'
  | 'asignacion-de-ots'
  | 'bodega-repuestos'
  | 'sincronizacion-logs'
  | 'kpis-confiabilidad'
  | 'costos-disponibilidad';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';
export type OTStatus = 'pending' | 'in_progress' | 'completed';

export interface WorkOrder {
  id: string;
  code: string;
  assetCode: string;
  assetName: string;
  location: string;
  priority: PriorityLevel;
  status: OTStatus;
  type: 'EMERGENCIA' | 'CORRECTIVO' | 'PREVENTIVO' | 'PREDICTIVO';
  description: string;
  assignedTechnician?: string;
  assignedTechnicianId?: string;
  assignedTechnicianAvatar?: string;
  assignedTechnicianRole?: string;
  timeElapsed?: string;
  slaLimit: string;
  slaRemaining?: string;
  progressPercent: number;
  currentStep?: string;
  reservedParts?: string[];
  imageUrl?: string;
  costEstimate?: string;
  reportedAt: string;
}

export interface AssetNode {
  id: string;
  code: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  levelName: 'Planta' | 'Área' | 'Línea' | 'Equipo' | 'Subconjunto';
  status: 'normal' | 'alert' | 'standby';
  criticality: 'CLASE A' | 'CLASE B' | 'CLASE C';
  type?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  hoursAccumulated?: string;
  nominalSpecs?: {
    power?: string;
    ratio?: string;
    lubricant?: string;
    capacity?: string;
    pressure?: string;
  };
  children?: AssetNode[];
  tag?: string;
  hash?: string;
  installedAt?: string;
}

export interface SparePartItem {
  sku: string;
  name: string;
  category: string;
  shelf: string;
  stockActual: number;
  stockMin: number;
  stockReorden: number;
  unit: string;
  unitPriceUSD: number;
  status: 'critical' | 'warning' | 'healthy';
  supplier: string;
  leadTime: string;
  criticality: string;
}

export interface DispatchVoucher {
  id: string;
  otCode: string;
  otTitle: string;
  requesterName: string;
  requesterRole: string;
  warehouseKeeper: string;
  costCenter: string;
  totalCostUSD: number;
  status: 'pending' | 'dispatched';
  items: {
    sku: string;
    name: string;
    tag: string;
    location: string;
    stock: number;
    qtyRequired: number;
    unit: string;
    verified: boolean;
  }[];
}

export interface SyncPacket {
  id: string;
  payloadType: string;
  originDevice: string;
  operator: string;
  entityTag: string;
  sizeBytes: string;
  cipherMethod: string;
  status: 'transmitting' | 'queued' | 'synced' | 'failed';
  progress: number;
  timestamp: string;
  payloadJson: Record<string, any>;
}

export interface ForensicLog {
  id: string;
  timestamp: string;
  date: string;
  level: 'INFO' | 'WARN' | 'SECURITY' | 'CRITICAL';
  action: string;
  description: string;
  entity: string;
  user: string;
  role: string;
  ip: string;
  terminal: string;
  sha256Hash: string;
  diffPayload?: {
    preTx: Record<string, any>;
    postTx: Record<string, any>;
  };
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  specialty: 'Hidráulica' | 'Mecánica' | 'Eléctrica' | 'Instrumentación';
  avatar: string;
  status: 'available' | 'busy' | 'offline';
  shift: string;
  currentOT?: string;
  loadPercent: number;
  lotoCertified: boolean;
  matchScore: number;
}
