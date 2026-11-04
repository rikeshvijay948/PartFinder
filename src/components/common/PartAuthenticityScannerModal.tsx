import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  ScanLine, 
  Barcode, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Tag, 
  Wrench,
  Calendar,
  Building
} from 'lucide-react';
import { Button } from './Button';
import { 
  verifyPartBarcode, 
  PartVerificationResult, 
  GENUINE_PARTS_REGISTRY 
} from '../../utils/authenticityScanner';

interface PartAuthenticityScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPart?: (result: PartVerificationResult) => void;
}

export const PartAuthenticityScannerModal: React.FC<PartAuthenticityScannerModalProps> = ({
  isOpen,
  onClose,
  onApplyPart,
}) => {
  const [inputCode, setInputCode] = useState<string>('8901234567890');
  const [result, setResult] = useState<PartVerificationResult | null>(() => verifyPartBarcode('8901234567890'));
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanMode, setScanMode] = useState<'barcode' | 'qr'>('barcode');

  if (!isOpen) return null;

  const handleScan = (codeToVerify?: string) => {
    const target = codeToVerify || inputCode;
    if (!target.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      const verified = verifyPartBarcode(target);
      setResult(verified);
      setInputCode(verified.code);
      setIsScanning(false);
    }, 400);
  };

  const handleSelectPreset = (code: string) => {
    setInputCode(code);
    handleScan(code);
  };

  const handleApply = () => {
    if (result && onApplyPart) {
      onApplyPart(result);
      onClose();
    }
  };

  const isGenuine = result?.status === 'genuine';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-navy-900 border border-slate-700/90 rounded-3xl shadow-2xl max-w-2xl w-full p-5 sm:p-7 space-y-5 relative overflow-hidden my-6">
        
        {/* Glow ambient background */}
        <div className={`absolute top-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all ${
          isGenuine ? 'bg-emerald-500/15' : 'bg-red-500/15'
        }`} />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between relative z-10 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl p-0.5 shadow-lg shrink-0 ${
              isGenuine 
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-brand-500 shadow-emerald-600/30' 
                : 'bg-gradient-to-tr from-red-500 via-amber-500 to-red-600 shadow-red-600/30'
            }`}>
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <QrCode className={`w-5 h-5 ${isGenuine ? 'text-emerald-400' : 'text-red-400'}`} />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-brand-400" />
                <span>ACMA National Anti-Counterfeit Registry</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                OEM Part Authenticity & QR/Barcode Verifier
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-navy-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Optical Scanner Viewfinder Simulation */}
        <div className="relative rounded-2xl bg-navy-950 border border-slate-800 p-4 overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <ScanLine className="w-4 h-4 text-brand-400 animate-pulse" />
              <span>Optical Box Scanner (Camera Active)</span>
            </div>
            <div className="flex rounded-lg bg-navy-900 p-0.5 border border-slate-800 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setScanMode('barcode')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  scanMode === 'barcode' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1D Barcode
              </button>
              <button
                type="button"
                onClick={() => setScanMode('qr')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  scanMode === 'qr' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2D Hologram QR
              </button>
            </div>
          </div>

          {/* Viewfinder Reticle & Laser */}
          <div className="relative h-28 w-full bg-slate-950/90 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center overflow-hidden">
            {/* Animated Laser Scanning Line */}
            <div className={`absolute left-0 right-0 h-0.5 shadow-lg transition-all animate-pulse ${
              isGenuine ? 'bg-emerald-400 shadow-emerald-400/80' : 'bg-red-400 shadow-red-400/80'
            }`} style={{ top: '50%' }} />

            {/* Corner Bracket Reticles */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-brand-400" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-brand-400" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-brand-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-brand-400" />

            {scanMode === 'barcode' ? (
              <div className="flex flex-col items-center gap-1 select-none opacity-85">
                <Barcode className="w-32 h-10 text-slate-300" />
                <span className="font-mono text-xs tracking-[0.3em] text-slate-400 font-bold">
                  {inputCode || 'SCANNING...'}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 select-none opacity-85">
                <QrCode className="w-12 h-12 text-slate-300" />
                <span className="font-mono text-[10px] tracking-wider text-slate-400">
                  ALIGN MANUFACTURER SECURITY QR
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Barcode Search / Serial Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">
            Enter Part Barcode, Security Seal ID, or QR Serial Number:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleScan(); }}
                placeholder="e.g. 8901234567890 or TAT-GEN-8842"
                className="w-full bg-navy-950 text-white placeholder-slate-500 text-sm font-mono font-bold px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 transition-all"
              />
              {inputCode && (
                <button
                  type="button"
                  onClick={() => setInputCode('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Button
              variant="primary"
              size="md"
              disabled={isScanning || !inputCode.trim()}
              onClick={() => handleScan()}
              className="text-xs font-bold px-5 shrink-0"
              icon={isScanning ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            >
              <span>{isScanning ? 'Verifying...' : 'Verify OEM'}</span>
            </Button>
          </div>
        </div>

        {/* 1-Click Quick Demo Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Or Click a Sample Workshop Spare Part:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(GENUINE_PARTS_REGISTRY).slice(0, 5).map(key => {
              const item = GENUINE_PARTS_REGISTRY[key];
              const isSelected = inputCode === key;
              const isSuspect = item.status === 'counterfeit_suspect';

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectPreset(key)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all font-medium cursor-pointer ${
                    isSelected
                      ? isSuspect
                        ? 'bg-red-600 text-white border-red-500 font-bold shadow-sm'
                        : 'bg-brand-600 text-white border-brand-500 font-bold shadow-sm'
                      : isSuspect
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-navy-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <span>{item.brand.split(' ')[0]} • {item.partName.split(' ')[0]}</span>
                  {isSuspect && <span className="text-[10px] ml-1 font-bold text-red-400">⚠️ Fake Demo</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Verification Result Sheet */}
        {result && (
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 animate-scale-up ${
            isGenuine 
              ? 'bg-navy-950 border-emerald-500/40 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/20' 
              : 'bg-navy-950 border-red-500/50 shadow-xl shadow-red-500/5 ring-1 ring-red-500/30'
          }`}>
            
            {/* Top Status Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {isGenuine ? (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <span className={`text-xs font-black uppercase tracking-wider block ${
                    isGenuine ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {isGenuine ? '100% Genuine OEM Certified' : 'Warning: Suspect Duplicate / Unregistered'}
                  </span>
                  <span className="text-[11px] text-slate-400">{result.verificationAuthority}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isGenuine 
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                    : 'bg-red-500/15 text-red-300 border-red-500/30'
                }`}>
                  Score: {result.authenticityScore}%
                </span>
              </div>
            </div>

            {/* Spec Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              
              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Component Name</span>
                <div className="font-bold text-white mt-0.5 truncate flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span>{result.partName}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Official OEM Part No</span>
                <div className="font-mono font-bold text-slate-200 mt-0.5 truncate">
                  #{result.partNumber}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Govt MRP Price Cap</span>
                <div className="font-black text-emerald-400 mt-0.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>₹{result.mrpPrice}</span>
                  <span className="text-[10px] text-slate-400 font-normal">incl. tax</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 col-span-2">
                <span className="text-[10px] text-slate-500 block uppercase">Manufacturer & Plant</span>
                <div className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5 truncate">
                  <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{result.manufacturer}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Warranty Period</span>
                <div className="font-semibold text-brand-300 mt-0.5 flex items-center gap-1 truncate">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span>{result.warrantyPeriod}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 col-span-2">
                <span className="text-[10px] text-slate-500 block uppercase">Hologram Seal Code</span>
                <div className="font-mono text-slate-200 mt-0.5 truncate">
                  {result.hologramId} ({result.sealStatus})
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Mfg Date / Batch</span>
                <div className="font-semibold text-slate-300 mt-0.5 flex items-center gap-1 truncate">
                  <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{result.manufacturingDate}</span>
                </div>
              </div>
            </div>

            {/* Anti-Counterfeit Verification Checklist */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Security Checklist:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {result.antiCounterfeitFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 p-2 rounded-lg bg-navy-900/70 border border-slate-800/80 text-slate-300">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compatible Vehicles */}
            <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
              <span>Verified Fitment: </span>
              <strong className="text-slate-200">{result.compatibleVehicles.join(' • ')}</strong>
            </div>

          </div>
        )}

        {/* Modal Actions */}
        <div className="flex gap-2 pt-2 border-t border-slate-800">
          <Button
            variant="secondary"
            size="md"
            className="flex-1 text-xs"
            onClick={onClose}
          >
            Close
          </Button>

          {isGenuine && onApplyPart && (
            <Button
              variant="primary"
              size="md"
              className="flex-1 text-xs font-bold shadow-lg shadow-brand-600/30"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={handleApply}
            >
              <span>Search Nearby for This Part</span>
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};
