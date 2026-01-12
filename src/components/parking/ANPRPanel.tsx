import { useState, useRef } from 'react';
import { Camera, Upload, ScanLine, CheckCircle, DoorOpen, DoorClosed, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ANPRResult } from '@/types/parking';
import { motion, AnimatePresence } from 'framer-motion';

interface ANPRPanelProps {
  onSimulateANPR: (imageUrl?: string) => Promise<ANPRResult>;
  lastResult: ANPRResult | null;
  isFull?: boolean;
  gateStatus: 'open' | 'locked';
  onScanStart?: () => void;
  onScanEnd?: () => void;
}

export function ANPRPanel({ onSimulateANPR, lastResult, isFull, gateStatus, onScanStart, onScanEnd }: ANPRPanelProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState<'idle' | 'detecting' | 'reading' | 'complete'>('idle');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isFullResult = lastResult?.plateNumber === 'FULL';

  const handleScan = async () => {
    setIsScanning(true);
    setScanPhase('detecting');
    onScanStart?.();
    
    // Phase 1: Detecting vehicle
    await new Promise(resolve => setTimeout(resolve, 1000));
    setScanPhase('reading');
    
    // Phase 2: Reading plate
    await new Promise(resolve => setTimeout(resolve, 1000));
    setScanPhase('complete');
    await onSimulateANPR(uploadedImage || undefined);
    
    // Reset after showing result
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsScanning(false);
    setScanPhase('idle');
    onScanEnd?.();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dashboard-card">
      <h3 className="section-title">
        <Camera className="w-5 h-5 text-primary" />
        ANPR Vehicle Recognition
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* Camera View */}
          <div 
            className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-border flex items-center justify-center"
          >
            {/* Camera feed simulation */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
              
              {/* Camera label */}
              <div className="absolute top-2 left-2 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-xs text-green-400 font-mono">CAM-01 LIVE</span>
              </div>
              
              {/* Timestamp */}
              <div className="absolute top-2 right-2">
                <span className="text-xs text-green-400 font-mono">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              
              {/* Car visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {scanPhase === 'idle' && !lastResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <Car className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                      <p className="text-xs text-muted-foreground mt-2">Waiting for vehicle...</p>
                    </motion.div>
                  )}
                  
                  {scanPhase === 'detecting' && (
                    <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-center"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      >
                        <Car className="w-20 h-20 text-primary mx-auto" />
                      </motion.div>
                      <p className="text-sm text-primary mt-2 font-semibold">Vehicle Detected!</p>
                    </motion.div>
                  )}
                  
                  {scanPhase === 'reading' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <Car className="w-20 h-20 text-primary mx-auto" />
                      {/* Scanning line effect */}
                      <motion.div
                        className="absolute left-1/4 right-1/4 h-1 bg-primary/80"
                        animate={{ top: ['40%', '60%', '40%'] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        style={{ boxShadow: '0 0 20px 5px hsl(var(--primary))' }}
                      />
                      <p className="text-sm text-primary mt-2 font-semibold animate-pulse">Reading Plate...</p>
                    </motion.div>
                  )}
                  
                  {(scanPhase === 'complete' || (scanPhase === 'idle' && lastResult)) && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <Car className={`w-20 h-20 mx-auto ${isFullResult ? 'text-destructive' : 'text-success'}`} />
                      {/* Plate display on camera */}
                      <motion.div 
                        className={`mt-2 px-4 py-1 rounded border-2 ${isFullResult ? 'border-destructive bg-destructive/20' : 'border-success bg-success/20'}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <p className={`text-lg font-mono font-bold ${isFullResult ? 'text-destructive' : 'text-success'}`}>
                          {lastResult?.plateNumber}
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Scan frame overlay */}
              {isScanning && (
                <motion.div 
                  className="absolute inset-8 border-2 border-primary rounded-lg"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </div>
          </div>

          {/* Gate Status Indicator */}
          <motion.div 
            className={`flex items-center justify-center gap-3 p-3 rounded-lg border-2 ${
              gateStatus === 'open' 
                ? 'bg-success/10 border-success text-success' 
                : 'bg-destructive/10 border-destructive text-destructive'
            }`}
            animate={lastResult && !isFullResult ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {gateStatus === 'open' ? (
              <>
                <DoorOpen className="w-6 h-6" />
                <span className="font-bold uppercase tracking-wider">Gate OPEN</span>
              </>
            ) : (
              <>
                <DoorClosed className="w-6 h-6" />
                <span className="font-bold uppercase tracking-wider">Gate LOCKED</span>
              </>
            )}
          </motion.div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <Button 
            onClick={handleScan} 
            disabled={isScanning}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {isScanning ? (
              <>
                <ScanLine className="w-5 h-5 mr-2 animate-pulse" />
                Scanning Vehicle...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Scan Vehicle (ANPR)
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Recognition Result
            </p>
            {lastResult ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {isFullResult ? (
                    <>
                      <motion.div 
                        className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <span className="text-xs font-bold text-white">!</span>
                      </motion.div>
                      <span className="text-sm text-destructive font-semibold">PARKING FULL</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 text-success" />
                      <span className="text-sm text-success font-semibold">Entry Approved</span>
                    </>
                  )}
                </div>
                <div className={`rounded-lg p-4 border-2 ${isFullResult ? 'bg-destructive/20 border-destructive' : 'bg-success/10 border-success'}`}>
                  <p className={`text-3xl font-mono font-bold tracking-wider text-center ${isFullResult ? 'text-destructive' : 'text-success'}`}>
                    {lastResult.plateNumber}
                  </p>
                  {isFullResult && (
                    <p className="text-sm text-destructive mt-2 text-center">No spaces available - Entry Denied</p>
                  )}
                </div>
                {!isFullResult && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className={lastResult.confidence > 90 ? 'text-success' : 'text-warning'}>
                        {lastResult.confidence.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Scanned:</span>
                      <span className="font-mono text-xs">
                        {new Date(lastResult.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-success">
                      <DoorOpen className="w-4 h-4" />
                      <span>Gate opened for entry</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Camera className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click "Scan Vehicle" to detect incoming car
                </p>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
            <p className="font-semibold mb-1">System Info:</p>
            <ul className="space-y-1">
              <li>• AI-powered license plate recognition</li>
              <li>• Automatic gate control based on capacity</li>
              <li>• Real-time violation detection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
