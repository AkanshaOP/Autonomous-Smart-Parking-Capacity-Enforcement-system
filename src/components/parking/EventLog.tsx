import { LogEntry } from '@/types/parking';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Link as LinkIcon } from 'lucide-react';
import { formatHash } from '@/utils/hashUtils';

interface EventLogProps {
  logs: LogEntry[];
}

export function EventLog({ logs }: EventLogProps) {
  const sortedLogs = [...logs].reverse();

  return (
    <div className="dashboard-card">
      <h3 className="section-title">
        <FileText className="w-5 h-5 text-primary" />
        Tamper-Proof Event Log
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Blockchain-style append-only log with SHA-256 hash chain
      </p>

      <ScrollArea className="h-[300px]">
        {sortedLogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No events logged yet. Interact with parking slots to generate entries.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedLogs.map((log, index) => (
              <div key={log.id} className="log-entry animate-fade-in">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`status-badge ${log.eventType}`}>
                        {log.eventType.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Slot {log.slotId}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-primary">
                      {log.vehicleNumber}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <LinkIcon className="w-3 h-3" />
                      <span className="hash-display font-mono">
                        {formatHash(log.previousHash)}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-primary/70 mt-1">
                      {formatHash(log.hash)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {logs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Integrity:</strong> Each entry's hash includes the previous entry's hash, 
            creating an immutable chain. Any modification would break the chain.
          </p>
        </div>
      )}
    </div>
  );
}
