import { Car, ParkingSquare, AlertTriangle, TrendingUp } from 'lucide-react';

interface StatsPanelProps {
  totalSlots: number;
  occupiedCount: number;
  availableCount: number;
  violationCount: number;
  capacity: number;
}

export function StatsPanel({ totalSlots, occupiedCount, availableCount, violationCount, capacity }: StatsPanelProps) {
  const capacityPercentage = Math.round((occupiedCount / capacity) * 100);
  const isNearCapacity = capacityPercentage >= 80;
  const isAtCapacity = capacityPercentage >= 100;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="stat-card">
        <div className="flex items-center justify-between">
          <ParkingSquare className="w-8 h-8 text-primary" />
          <span className="text-xs text-muted-foreground">TOTAL</span>
        </div>
        <div className="stat-value text-foreground">{totalSlots}</div>
        <div className="stat-label">Total Slots</div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between">
          <Car className="w-8 h-8 text-destructive" />
          <span className="text-xs text-muted-foreground">ACTIVE</span>
        </div>
        <div className="stat-value text-destructive">{occupiedCount}</div>
        <div className="stat-label">Occupied</div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between">
          <TrendingUp className="w-8 h-8 text-success" />
          <span className="text-xs text-muted-foreground">FREE</span>
        </div>
        <div className="stat-value text-success">{Math.max(0, availableCount)}</div>
        <div className="stat-label">Available</div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between">
          <AlertTriangle className="w-8 h-8 text-warning" />
          <span className="text-xs text-muted-foreground">FLAGS</span>
        </div>
        <div className="stat-value text-warning">{violationCount}</div>
        <div className="stat-label">Violations</div>
      </div>

      <div className="col-span-2 lg:col-span-4 dashboard-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Capacity Utilization</span>
          <span className={`text-sm font-bold ${isAtCapacity ? 'text-destructive' : isNearCapacity ? 'text-warning' : 'text-success'}`}>
            {occupiedCount} / {capacity} ({capacityPercentage}%)
          </span>
        </div>
        <div className="capacity-bar">
          <div 
            className={`capacity-fill ${isAtCapacity ? 'bg-destructive' : isNearCapacity ? 'bg-warning' : 'bg-success'}`}
            style={{ width: `${Math.min(100, capacityPercentage)}%` }}
          />
        </div>
        {isAtCapacity && (
          <p className="text-xs text-destructive mt-2 animate-pulse">
            ⚠️ CAPACITY REACHED - Gate Locked - No new entries allowed
          </p>
        )}
      </div>
    </div>
  );
}
