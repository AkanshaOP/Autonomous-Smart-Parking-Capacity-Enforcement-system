export interface ParkingSlot {
  id: string;
  status: 'available' | 'occupied';
  vehicleNumber: string | null;
  entryTime: string | null;
  contractorId: string | null;
}

export interface LogEntry {
  id: string;
  slotId: string;
  vehicleNumber: string;
  eventType: 'entry' | 'exit' | 'violation';
  timestamp: string;
  previousHash: string;
  hash: string;
  contractorId?: string;
}

export interface Contractor {
  id: string;
  name: string;
  allowedCapacity: number;
  currentOccupancy: number;
  violations: number;
}

export interface SystemConfig {
  totalCapacity: number;
  demoMode: boolean;
  gateStatus: 'open' | 'locked';
}

export interface ANPRResult {
  plateNumber: string;
  confidence: number;
  timestamp: string;
  imageUrl?: string;
}
