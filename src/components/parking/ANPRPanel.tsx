import { useState, useRef } from 'react';
import { Camera, Upload, ScanLine, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ANPRResult } from '@/types/parking';

interface ANPRPanelProps {
  onSimulateANPR: (imageUrl?: string) => ANPRResult;
  lastResult: ANPRResult | null;
}

export function ANPRPanel({ onSimulateANPR, lastResult }: ANPRPanelProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      onSimulateANPR(uploadedImage || undefined);
      setIsScanning(false);
    }, 1500);
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
          <div 
            className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadedImage ? (
              <img src={uploadedImage} alt="Uploaded vehicle" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Click to upload vehicle image</p>
                <p className="text-xs">(Demo: simulates plate recognition)</p>
              </div>
            )}
            {isScanning && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <div className="text-center">
                  <ScanLine className="w-12 h-12 text-primary animate-pulse mx-auto" />
                  <p className="text-sm text-primary mt-2">Scanning...</p>
                </div>
              </div>
            )}
          </div>
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
          >
            {isScanning ? (
              <>
                <ScanLine className="w-4 h-4 mr-2 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Simulate ANPR Scan
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
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm text-success">Plate Detected</span>
                </div>
                <div className="bg-background rounded-lg p-3 border border-primary/30">
                  <p className="text-2xl font-mono font-bold text-primary tracking-wider">
                    {lastResult.plateNumber}
                  </p>
                </div>
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
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No scan results yet. Upload an image and click scan.
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            <strong>Demo Note:</strong> This simulates OpenCV + EasyOCR plate recognition. 
            In production, this would connect to camera feeds for real-time detection.
          </p>
        </div>
      </div>
    </div>
  );
}
