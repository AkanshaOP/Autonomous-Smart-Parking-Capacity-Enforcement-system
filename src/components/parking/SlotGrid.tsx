import { ParkingSlot } from '@/types/parking';
import { Car, ParkingSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface SlotGridProps {
  slots: ParkingSlot[];
  onToggleSlot: (slotId: string) => void;
  demoMode: boolean;
  isScanning?: boolean;
}

export function SlotGrid({ slots, onToggleSlot, demoMode, isScanning }: SlotGridProps) {
  return (
    <motion.div 
      className="dashboard-card"
      animate={isScanning ? { 
        boxShadow: ['0 0 0 2px hsl(var(--destructive))', '0 0 20px 4px hsl(var(--destructive))', '0 0 0 2px hsl(var(--destructive))'],
      } : {}}
      transition={isScanning ? { repeat: Infinity, duration: 1 } : {}}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title mb-0">
          <ParkingSquare className="w-5 h-5 text-primary" />
          Parking Slot Map
        </h3>
        {isScanning && (
          <motion.div 
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/20 border border-destructive"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-xs font-semibold text-destructive uppercase">Scanning...</span>
          </motion.div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        {demoMode ? 'Click to toggle slot status (Demo Mode)' : 'Real-time slot detection active'}
      </p>
      
      <div className="slot-grid">
        {slots.map((slot, index) => (
          <Tooltip key={slot.id}>
            <TooltipTrigger asChild>
              <motion.button
                onClick={() => demoMode && onToggleSlot(slot.id)}
                className={`parking-slot ${slot.status} ${isScanning ? 'ring-2 ring-destructive' : ''}`}
                disabled={!demoMode}
                animate={isScanning ? {
                  borderColor: ['hsl(var(--destructive))', 'hsl(var(--destructive) / 0.3)', 'hsl(var(--destructive))'],
                } : {}}
                transition={isScanning ? { repeat: Infinity, duration: 0.8, delay: index * 0.1 } : {}}
              >
                {slot.status === 'occupied' ? (
                  <Car className="w-8 h-8" />
                ) : (
                  <motion.div
                    animate={isScanning ? { scale: [1, 1.1, 1], opacity: [0.3, 0.8, 0.3] } : {}}
                    transition={isScanning ? { repeat: Infinity, duration: 0.8 } : {}}
                  >
                    <ParkingSquare className="w-8 h-8 opacity-30" />
                  </motion.div>
                )}
                <span className="text-xs font-bold">{slot.id}</span>
              </motion.button>
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
    </motion.div>
  );
}
