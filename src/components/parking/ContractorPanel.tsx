import { Contractor } from '@/types/parking';
import { Building2, AlertTriangle, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ContractorPanelProps {
  contractors: Contractor[];
  getComplianceScore: (id: string) => number;
}

export function ContractorPanel({ contractors, getComplianceScore }: ContractorPanelProps) {
  return (
    <div className="dashboard-card">
      <h3 className="section-title">
        <Building2 className="w-5 h-5 text-primary" />
        Contractor Compliance
      </h3>

      <div className="space-y-4">
        {contractors.map((contractor) => {
          const compliance = getComplianceScore(contractor.id);
          const utilizationPercent = (contractor.currentOccupancy / contractor.allowedCapacity) * 100;
          const isOverCapacity = contractor.currentOccupancy > contractor.allowedCapacity;

          return (
            <div 
              key={contractor.id} 
              className={`p-4 rounded-lg border transition-colors ${
                isOverCapacity 
                  ? 'border-destructive/50 bg-destructive/5' 
                  : 'border-border bg-muted/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{contractor.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{contractor.id}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`w-4 h-4 ${compliance >= 80 ? 'text-success' : compliance >= 50 ? 'text-warning' : 'text-destructive'}`} />
                    <span className={`text-lg font-bold ${compliance >= 80 ? 'text-success' : compliance >= 50 ? 'text-warning' : 'text-destructive'}`}>
                      {compliance}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Compliance</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity Usage</span>
                  <span className={isOverCapacity ? 'text-destructive font-bold' : ''}>
                    {contractor.currentOccupancy} / {contractor.allowedCapacity}
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, utilizationPercent)} 
                  className={`h-2 ${isOverCapacity ? '[&>div]:bg-destructive' : ''}`}
                />
              </div>

              {contractor.violations > 0 && (
                <div className="flex items-center gap-2 mt-3 text-destructive text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{contractor.violations} violation{contractor.violations > 1 ? 's' : ''} recorded</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
