import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';

import { MisOTsView } from './components/modules/MisOTsView';
import { EscanerQRView } from './components/modules/EscanerQRView';
import { ReportarFallaView } from './components/modules/ReportarFallaView';
import { ChecklistCierreView } from './components/modules/ChecklistCierreView';
import { JerarquiaActivosView } from './components/modules/JerarquiaActivosView';
import { AsignacionOTsView } from './components/modules/AsignacionOTsView';
import { BodegaRepuestosView } from './components/modules/BodegaRepuestosView';
import { SincronizacionLogsView } from './components/modules/SincronizacionLogsView';
import { KpisConfiabilidadView } from './components/modules/KpisConfiabilidadView';
import { CostosDisponibilidadView } from './components/modules/CostosDisponibilidadView';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'mis-ots-dashboard':
        return <MisOTsView />;
      case 'escaner-qr-activos':
        return <EscanerQRView />;
      case 'reportar-falla':
        return <ReportarFallaView />;
      case 'checklist-cierre':
        return <ChecklistCierreView />;
      case 'jerarquia-de-activos':
        return <JerarquiaActivosView />;
      case 'asignacion-de-ots':
        return <AsignacionOTsView />;
      case 'bodega-repuestos':
        return <BodegaRepuestosView />;
      case 'sincronizacion-logs':
        return <SincronizacionLogsView />;
      case 'kpis-confiabilidad':
        return <KpisConfiabilidadView />;
      case 'costos-disponibilidad':
        return <CostosDisponibilidadView />;
      default:
        return <MisOTsView />;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-surface-container-lowest/30">
          {renderCurrentView()}
        </main>
      </div>
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
