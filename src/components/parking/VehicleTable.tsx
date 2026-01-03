import { ParkingSlot } from '@/types/parking';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Car, Clock } from 'lucide-react';

interface VehicleTableProps {
  slots: ParkingSlot[];
}

export function VehicleTable({ slots }: VehicleTableProps) {
  const occupiedSlots = slots.filter(s => s.status === 'occupied');

  const formatDuration = (entryTime: string): string => {
    const entry = new Date(entryTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - entry.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
  };

  return (
    <div className="dashboard-card">
      <h3 className="section-title">
        <Car className="w-5 h-5 text-primary" />
        Active Vehicles
      </h3>

      <ScrollArea className="h-[250px]">
        {occupiedSlots.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No vehicles currently parked.
          </p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Slot</th>
                <th>Vehicle No.</th>
                <th>Duration</th>
                <th>Entry Time</th>
              </tr>
            </thead>
            <tbody>
              {occupiedSlots.map((slot) => (
                <tr key={slot.id} className="animate-fade-in">
                  <td>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-destructive/20 text-destructive font-bold text-sm">
                      {slot.id}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-primary">
                      {slot.vehicleNumber}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDuration(slot.entryTime!)}
                    </span>
                  </td>
                  <td className="text-muted-foreground text-xs">
                    {new Date(slot.entryTime!).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ScrollArea>
    </div>
  );
}
