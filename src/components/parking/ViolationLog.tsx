import { LogEntry } from '@/types/parking';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, FileWarning } from 'lucide-react';

interface ViolationLogProps {
  logs: LogEntry[];
}

export function ViolationLog({ logs }: ViolationLogProps) {
  const violations = logs.filter(l => l.eventType === 'violation').reverse();

  return (
    <div className="dashboard-card border-destructive/30">
      <h3 className="section-title">
        <FileWarning className="w-5 h-5 text-destructive" />
        Violation Log
      </h3>

      <ScrollArea className="h-[200px]">
        {violations.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No violations recorded. System operating normally.
          </p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Slot</th>
                <th>Vehicle</th>
                <th>Contractor</th>
              </tr>
            </thead>
            <tbody>
              {violations.map((violation) => (
                <tr key={violation.id} className="animate-fade-in">
                  <td className="text-xs font-mono text-muted-foreground">
                    {new Date(violation.timestamp).toLocaleTimeString()}
                  </td>
                  <td>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-destructive/20 text-destructive font-bold text-sm">
                      {violation.slotId}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-destructive">
                      {violation.vehicleNumber}
                    </span>
                  </td>
                  <td className="text-xs text-muted-foreground">
                    {violation.contractorId || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ScrollArea>

      {violations.length > 0 && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-xs text-destructive">
          <AlertTriangle className="w-4 h-4" />
          <span>{violations.length} capacity violation{violations.length > 1 ? 's' : ''} detected</span>
        </div>
      )}
    </div>
  );
}
