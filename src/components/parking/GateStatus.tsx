import { Lock, Unlock, DoorOpen, DoorClosed } from 'lucide-react';

interface GateStatusProps {
  status: 'open' | 'locked';
  occupiedCount: number;
  capacity: number;
}

export function GateStatus({ status, occupiedCount, capacity }: GateStatusProps) {
  const isOpen = status === 'open';

  return (
    <div className="dashboard-card">
      <h3 className="section-title">
        {isOpen ? <DoorOpen className="w-5 h-5 text-success" /> : <DoorClosed className="w-5 h-5 text-destructive" />}
        Entry Gate Status
      </h3>

      <div className={`gate-indicator ${isOpen ? 'gate-open' : 'gate-locked'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOpen ? (
              <Unlock className="w-10 h-10" />
            ) : (
              <Lock className="w-10 h-10" />
            )}
            <div>
              <p className="text-2xl font-bold uppercase tracking-wider">
                {isOpen ? 'OPEN' : 'LOCKED'}
              </p>
              <p className="text-sm opacity-80">
                {isOpen ? 'Accepting new vehicles' : 'No entry allowed'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-3xl font-mono font-bold">
              {occupiedCount}/{capacity}
            </p>
            <p className="text-xs uppercase tracking-wider opacity-70">
              Capacity
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Gate automatically locks when parking capacity is reached. 
        No manual override available in normal mode.
      </p>
    </div>
  );
}
