import { Shield, Activity } from 'lucide-react';

interface HeaderProps {
  gateStatus: 'open' | 'locked';
}

export function Header({ gateStatus }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Municipal Parking Enforcement
              </h1>
              <p className="text-xs text-muted-foreground">
                Real-time Capacity Monitoring & Control System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-success animate-pulse" />
              <span className="text-muted-foreground">System Active</span>
            </div>
            
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              gateStatus === 'open' 
                ? 'bg-success/20 text-success border border-success/30' 
                : 'bg-destructive/20 text-destructive border border-destructive/30 animate-pulse'
            }`}>
              Gate {gateStatus}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
