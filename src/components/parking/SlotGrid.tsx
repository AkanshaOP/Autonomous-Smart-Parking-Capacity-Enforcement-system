import { ParkingSlot } from '@/types/parking';
import { Car, ParkingSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SlotGridProps {
  slots: ParkingSlot[];
  onToggleSlot: (slotId: string) => void;
  demoMode: boolean;
}

export function SlotGrid({ slots, onToggleSlot, demoMode }: SlotGridProps) {
  return (
    <div className="dashboard-card">
      <h3 className="section-title">
        <ParkingSquare className="w-5 h-5 text-primary" />
        Parking Slot Map
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        {demoMode ? 'Click to toggle slot status (Demo Mode)' : 'Real-time slot detection active'}
      </p>
      
      <div className="slot-grid">
        {slots.map((slot) => (
          <Tooltip key={slot.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => demoMode && onToggleSlot(slot.id)}
                className={`parking-slot ${slot.status}`}
                disabled={!demoMode}
              >
                {slot.status === 'occupied' ? (
                  <Car className="w-8 h-8" />
                ) : (
                  <ParkingSquare className="w-8 h-8 opacity-30" />
                )}
                <span className="text-xs font-bold">{slot.id}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-card border-border">
              <div className="text-sm">
                <p className="font-semibold">Slot {slot.id}</p>
                <p className="text-muted-foreground">
                  Status: <span className={slot.status === 'occupied' ? 'text-destructive' : 'text-success'}>
                    {slot.status.toUpperCase()}
                  </span>
                </p>
                {slot.vehicleNumber && (
                  <>
                    <p className="font-mono text-primary">{slot.vehicleNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      Entry: {new Date(slot.entryTime!).toLocaleTimeString()}
                    </p>
                  </>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="flex items-center gap-6 mt-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/30 border border-success" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/30 border border-destructive" />
          <span className="text-muted-foreground">Occupied</span>
        </div>
      </div>
    </div>
  );
}
