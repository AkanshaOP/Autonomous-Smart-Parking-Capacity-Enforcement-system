import { useState, useCallback, useEffect } from 'react';
import { ParkingSlot, LogEntry, Contractor, SystemConfig, ANPRResult } from '@/types/parking';
import { generateHash, generateSlotId, generateVehicleNumber } from '@/utils/hashUtils';

const INITIAL_SLOTS = 20;
const CONTRACTORS: Contractor[] = [
  { id: 'CTR001', name: 'Metro Parking Co.', allowedCapacity: 8, currentOccupancy: 0, violations: 0 },
  { id: 'CTR002', name: 'City Park Services', allowedCapacity: 6, currentOccupancy: 0, violations: 0 },
  { id: 'CTR003', name: 'Urban Lot Mgmt', allowedCapacity: 6, currentOccupancy: 0, violations: 0 },
];

export function useParkingSystem() {
  const [slots, setSlots] = useState<ParkingSlot[]>(() => 
    Array.from({ length: INITIAL_SLOTS }, (_, i) => ({
      id: generateSlotId(i),
      status: 'available',
      vehicleNumber: null,
      entryTime: null,
      contractorId: CONTRACTORS[i % CONTRACTORS.length].id,
    }))
  );

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>(CONTRACTORS);
  const [config, setConfig] = useState<SystemConfig>({
    totalCapacity: 15, // Less than total slots to demonstrate enforcement
    demoMode: true,
    gateStatus: 'open',
  });
  const [alerts, setAlerts] = useState<string[]>([]);
  const [lastANPRResult, setLastANPRResult] = useState<ANPRResult | null>(null);

  const occupiedCount = slots.filter(s => s.status === 'occupied').length;
  const availableCount = config.totalCapacity - occupiedCount;
  const violationCount = logs.filter(l => l.eventType === 'violation').length;

  // Update gate status based on capacity
  useEffect(() => {
    const shouldLock = occupiedCount >= config.totalCapacity;
    setConfig(prev => ({
      ...prev,
      gateStatus: shouldLock ? 'locked' : 'open',
    }));
  }, [occupiedCount, config.totalCapacity]);

  // Update contractor occupancy
  useEffect(() => {
    const occupancyByContractor = slots.reduce((acc, slot) => {
      if (slot.status === 'occupied' && slot.contractorId) {
        acc[slot.contractorId] = (acc[slot.contractorId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    setContractors(prev => prev.map(c => ({
      ...c,
      currentOccupancy: occupancyByContractor[c.id] || 0,
    })));
  }, [slots]);

  const addLogEntry = useCallback(async (
    slotId: string,
    vehicleNumber: string,
    eventType: LogEntry['eventType'],
    contractorId?: string
  ) => {
    const timestamp = new Date().toISOString();
    const previousHash = logs.length > 0 ? logs[logs.length - 1].hash : '0000000000000000';
    
    const dataToHash = `${slotId}-${vehicleNumber}-${eventType}-${timestamp}-${previousHash}`;
    const hash = await generateHash(dataToHash);

    const newEntry: LogEntry = {
      id: `LOG-${Date.now()}`,
      slotId,
      vehicleNumber,
      eventType,
      timestamp,
      previousHash,
      hash,
      contractorId,
    };

    setLogs(prev => [...prev, newEntry]);
    return newEntry;
  }, [logs]);

  const toggleSlot = useCallback(async (slotId: string, vehicleNumber?: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    if (slot.status === 'available') {
      // Check capacity before allowing entry
      if (occupiedCount >= config.totalCapacity) {
        // Log violation
        const plateNum = vehicleNumber || generateVehicleNumber();
        await addLogEntry(slotId, plateNum, 'violation', slot.contractorId || undefined);
        
        // Add alert
        setAlerts(prev => [...prev, `VIOLATION: Capacity exceeded! Vehicle ${plateNum} denied entry.`]);
        
        // Update contractor violations
        if (slot.contractorId) {
          setContractors(prev => prev.map(c => 
            c.id === slot.contractorId 
              ? { ...c, violations: c.violations + 1 }
              : c
          ));
        }
        return;
      }

      // Allow entry
      const plateNum = vehicleNumber || lastANPRResult?.plateNumber || generateVehicleNumber();
      setSlots(prev => prev.map(s => 
        s.id === slotId 
          ? { ...s, status: 'occupied', vehicleNumber: plateNum, entryTime: new Date().toISOString() }
          : s
      ));
      await addLogEntry(slotId, plateNum, 'entry', slot.contractorId || undefined);
    } else {
      // Exit
      if (slot.vehicleNumber) {
        await addLogEntry(slotId, slot.vehicleNumber, 'exit', slot.contractorId || undefined);
      }
      setSlots(prev => prev.map(s => 
        s.id === slotId 
          ? { ...s, status: 'available', vehicleNumber: null, entryTime: null }
          : s
      ));
    }
  }, [slots, occupiedCount, config.totalCapacity, addLogEntry, lastANPRResult]);

  const simulateANPR = useCallback((imageUrl?: string): ANPRResult => {
    const result: ANPRResult = {
      plateNumber: generateVehicleNumber(),
      confidence: Math.random() * 20 + 80, // 80-100%
      timestamp: new Date().toISOString(),
      imageUrl,
    };
    setLastANPRResult(result);
    return result;
  }, []);

  const setCapacity = useCallback((capacity: number) => {
    setConfig(prev => ({ ...prev, totalCapacity: Math.max(1, Math.min(capacity, INITIAL_SLOTS)) }));
  }, []);

  const toggleDemoMode = useCallback(() => {
    setConfig(prev => ({ ...prev, demoMode: !prev.demoMode }));
  }, []);

  const resetLogs = useCallback(() => {
    setLogs([]);
    setAlerts([]);
  }, []);

  const resetSystem = useCallback(() => {
    setSlots(Array.from({ length: INITIAL_SLOTS }, (_, i) => ({
      id: generateSlotId(i),
      status: 'available',
      vehicleNumber: null,
      entryTime: null,
      contractorId: CONTRACTORS[i % CONTRACTORS.length].id,
    })));
    setLogs([]);
    setAlerts([]);
    setContractors(CONTRACTORS);
    setLastANPRResult(null);
  }, []);

  const dismissAlert = useCallback((index: number) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  }, []);

  const getComplianceScore = useCallback((contractorId: string): number => {
    const contractor = contractors.find(c => c.id === contractorId);
    if (!contractor) return 100;
    
    const totalEvents = logs.filter(l => l.contractorId === contractorId).length;
    const violations = logs.filter(l => l.contractorId === contractorId && l.eventType === 'violation').length;
    
    if (totalEvents === 0) return 100;
    return Math.round((1 - violations / totalEvents) * 100);
  }, [contractors, logs]);

  return {
    slots,
    logs,
    contractors,
    config,
    alerts,
    lastANPRResult,
    occupiedCount,
    availableCount,
    violationCount,
    toggleSlot,
    simulateANPR,
    setCapacity,
    toggleDemoMode,
    resetLogs,
    resetSystem,
    dismissAlert,
    getComplianceScore,
  };
}
