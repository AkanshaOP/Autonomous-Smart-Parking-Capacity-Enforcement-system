import { Settings, RotateCcw, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SystemConfig } from '@/types/parking';

interface AdminControlsProps {
  config: SystemConfig;
  onSetCapacity: (capacity: number) => void;
  onToggleDemoMode: () => void;
  onResetLogs: () => void;
  onResetSystem: () => void;
  totalSlots: number;
}

export function AdminControls({
  config,
  onSetCapacity,
  onToggleDemoMode,
  onResetLogs,
  onResetSystem,
  totalSlots,
}: AdminControlsProps) {
  return (
    <div className="dashboard-card">
      <h3 className="section-title">
        <Settings className="w-5 h-5 text-primary" />
        Admin Controls
      </h3>

      <div className="space-y-6">
        {/* Capacity Control */}
        <div>
          <div className="flex justify-between mb-3">
            <label className="text-sm font-medium">Allowed Capacity</label>
            <span className="text-sm font-mono text-primary">{config.totalCapacity} slots</span>
          </div>
          <Slider
            value={[config.totalCapacity]}
            onValueChange={([value]) => onSetCapacity(value)}
            min={1}
            max={totalSlots}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Set lower than total slots ({totalSlots}) to test capacity enforcement
          </p>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
          <div>
            <p className="text-sm font-medium">Demo Mode</p>
            <p className="text-xs text-muted-foreground">
              {config.demoMode ? 'Manual slot toggle enabled' : 'Simulated sensor mode'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDemoMode}
            className="gap-2"
          >
            {config.demoMode ? (
              <ToggleRight className="w-6 h-6 text-success" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onResetLogs}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Logs
          </Button>
          <Button
            variant="destructive"
            onClick={onResetSystem}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          ⚠️ Reset actions cannot be undone
        </p>
      </div>
    </div>
  );
}
