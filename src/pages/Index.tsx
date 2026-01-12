import { useParkingSystem } from '@/hooks/useParkingSystem';
import { Header } from '@/components/parking/Header';
import { StatsPanel } from '@/components/parking/StatsPanel';
import { SlotGrid } from '@/components/parking/SlotGrid';
import { GateStatus } from '@/components/parking/GateStatus';
import { ANPRPanel } from '@/components/parking/ANPRPanel';
import { EventLog } from '@/components/parking/EventLog';
import { VehicleTable } from '@/components/parking/VehicleTable';
import { ContractorPanel } from '@/components/parking/ContractorPanel';
import { AdminControls } from '@/components/parking/AdminControls';
import { AlertBanner } from '@/components/parking/AlertBanner';
import { ViolationLog } from '@/components/parking/ViolationLog';

const Index = () => {
  const {
    slots,
    logs,
    contractors,
    config,
    alerts,
    lastANPRResult,
    occupiedCount,
    availableCount,
    violationCount,
    toggleSlot,
    simulateANPR,
    setCapacity,
    toggleDemoMode,
    resetLogs,
    resetSystem,
    dismissAlert,
    getComplianceScore,
  } = useParkingSystem();

  return (
    <div className="min-h-screen bg-background">
      <Header gateStatus={config.gateStatus} />
      
      <AlertBanner alerts={alerts} onDismiss={dismissAlert} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <StatsPanel
          totalSlots={slots.length}
          occupiedCount={occupiedCount}
          availableCount={availableCount}
          violationCount={violationCount}
          capacity={config.totalCapacity}
        />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Slot Map */}
          <div className="lg:col-span-2 space-y-6">
            <SlotGrid 
              slots={slots} 
              onToggleSlot={toggleSlot}
              demoMode={config.demoMode}
            />
            
            <ANPRPanel 
              onSimulateANPR={simulateANPR}
              lastResult={lastANPRResult}
              gateStatus={config.gateStatus}
            />
          </div>

          {/* Right Column - Status & Controls */}
          <div className="space-y-6">
            <GateStatus 
              status={config.gateStatus}
              occupiedCount={occupiedCount}
              capacity={config.totalCapacity}
            />
            
            <AdminControls
              config={config}
              onSetCapacity={setCapacity}
              onToggleDemoMode={toggleDemoMode}
              onResetLogs={resetLogs}
              onResetSystem={resetSystem}
              totalSlots={slots.length}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <VehicleTable slots={slots} />
          <ViolationLog logs={logs} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <EventLog logs={logs} />
          <ContractorPanel 
            contractors={contractors}
            getComplianceScore={getComplianceScore}
          />
        </div>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Municipal Parking Enforcement System v1.0 • Prototype Demo
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tamper-proof logging • Real-time detection • Automated enforcement
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
