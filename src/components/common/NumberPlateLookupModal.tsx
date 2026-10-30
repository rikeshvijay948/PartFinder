import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Car, 
  Calendar, 
  Fuel, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  RotateCcw,
  Wrench,
  FileCheck
} from 'lucide-react';
import { Button } from './Button';
import { 
  lookupVehicleRC, 
  VehicleRCDetails, 
  formatPlateDisplay, 
  normalizePlateNumber, 
  KNOWN_RC_DATABASE 
} from '../../utils/rcLookup';

interface NumberPlateLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (details: VehicleRCDetails, selectedPart?: string) => void;
}

export const NumberPlateLookupModal: React.FC<NumberPlateLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectVehicle,
}) => {
  const [inputPlate, setInputPlate] = useState('TN 54 AB 2940');
  const [rcResult, setRcResult] = useState<VehicleRCDetails | null>(() => lookupVehicleRC('TN 54 AB 2940'));
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | undefined>(undefined);

  if (!isOpen) return null;

  const handleLookup = (plateToSearch?: string) => {
    const target = plateToSearch || inputPlate;
    if (!target.trim()) return;

    setIsSearching(true);
    setSelectedPart(undefined);

    setTimeout(() => {
      const result = lookupVehicleRC(target);
      setRcResult(result);
      setInputPlate(result.plateNumber);
      setIsSearching(false);
    }, 350);
  };

  const handleSelectPreset = (key: string) => {
    const preset = KNOWN_RC_DATABASE[key];
    if (preset) {
      setInputPlate(preset.plateNumber);
      handleLookup(preset.plateNumber);
    }
  };

  const handleApply = () => {
    if (rcResult) {
      onSelectVehicle(rcResult, selectedPart);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-navy-900 border border-slate-700/80 rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 relative overflow-hidden my-8">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between relative z-10 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-brand-600 to-indigo-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Car className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-bold uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Parivahan Smart RC Decoder</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Vehicle Number Plate Lookup
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-navy-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realistic Indian HSRP Number Plate Display */}
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          <div 
            className={`w-full max-w-sm h-16 rounded-xl border-2 flex items-center shadow-lg transition-all ${
              rcResult?.isCommercial 
                ? 'bg-amber-400 border-amber-500 text-black shadow-amber-400/20' 
                : 'bg-white border-slate-300 text-black shadow-white/10'
            }`}
          >
            {/* Left Blue IND Band */}
            <div className="h-full w-12 bg-blue-700 flex flex-col items-center justify-between py-1.5 rounded-l-[10px] shrink-0 text-white select-none">
              <div className="w-4 h-4 rounded-full border border-white/80 flex items-center justify-center text-[7px] font-bold text-amber-300">
                ☸
              </div>
              <span className="text-[10px] font-black tracking-widest font-mono">IND</span>
              <span className="text-[7px] font-mono opacity-80">RTO</span>
            </div>

            {/* License Plate Text */}
            <div className="flex-1 flex items-center justify-center px-4 font-mono font-black text-2xl tracking-[0.22em] text-slate-900 uppercase">
              {rcResult?.plateNumber || formatPlateDisplay(inputPlate || 'TN 54 AB 2940')}
            </div>

            {/* Hologram Stamp */}
            <div className="pr-3 opacity-60">
              <div className="w-5 h-5 rounded border border-current flex items-center justify-center text-[8px] font-mono">
                🇮🇳
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className={`inline-block w-2 h-2 rounded-full ${rcResult?.isCommercial ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <span>
              {rcResult?.isCommercial ? 'Yellow Commercial Transport Plate' : 'White Private Registration Plate'}
            </span>
          </div>
        </div>

        {/* Plate Search Input Form */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Enter Indian Vehicle Registration Number:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputPlate}
                onChange={(e) => setInputPlate(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLookup(); }}
                placeholder="e.g. TN 54 AB 2940, TN 30 C 1234"
                className="w-full bg-navy-950 text-white placeholder-slate-500 text-sm font-mono font-bold uppercase tracking-wider pl-4 pr-10 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 transition-all"
              />
              {inputPlate && (
                <button
                  type="button"
                  onClick={() => setInputPlate('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Button
              variant="primary"
              size="md"
              disabled={isSearching || !inputPlate.trim()}
              onClick={() => handleLookup()}
              className="text-xs font-bold px-5 shrink-0"
              icon={isSearching ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            >
              <span>{isSearching ? 'Decoding...' : 'Lookup RC'}</span>
            </Button>
          </div>
        </div>

        {/* Quick Presets for Demo */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Or Click a Verified Workshop Vehicle:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(KNOWN_RC_DATABASE).map((key) => {
              const item = KNOWN_RC_DATABASE[key];
              const isSelected = normalizePlateNumber(inputPlate) === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectPreset(key)}
                  className={`text-[11px] font-mono px-2.5 py-1.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-500 font-bold shadow-sm'
                      : 'bg-navy-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  {item.plateNumber} ({item.make} {item.model})
                </button>
              );
            })}
          </div>
        </div>

        {/* Decoded RC Data Sheet */}
        {rcResult && (
          <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800 space-y-3 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified RC Specifications</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Active On Road
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Vehicle Make & Model</span>
                <div className="font-bold text-white mt-0.5 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span className="truncate">{rcResult.make} {rcResult.model}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Model Year</span>
                <div className="font-bold text-white mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{rcResult.year}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Engine & Fuel</span>
                <div className="font-bold text-white mt-0.5 flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{rcResult.fuelType}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 col-span-2">
                <span className="text-[10px] text-slate-500 block uppercase">Registered RTO & City</span>
                <div className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{rcResult.rtoName} • {rcResult.city}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Fitness Valid</span>
                <div className="font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{rcResult.fitnessValidUntil}</span>
                </div>
              </div>
            </div>

            {/* Quick 1-Tap Commonly Replaced Spares for this vehicle */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Wrench className="w-3 h-3 text-brand-400" />
                <span>Select Part to Auto-Fill (Optional):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {rcResult.suggestedCommonParts.map((part) => {
                  const isPartSelected = selectedPart === part;
                  return (
                    <button
                      key={part}
                      type="button"
                      onClick={() => setSelectedPart(isPartSelected ? undefined : part)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        isPartSelected
                          ? 'bg-emerald-500 text-white font-bold border-emerald-400 shadow-sm'
                          : 'bg-navy-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      {isPartSelected ? '✓ ' : '+ '}{part}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex gap-2 pt-1 border-t border-slate-800">
          <Button
            variant="secondary"
            size="md"
            className="flex-1 text-xs"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="md"
            disabled={!rcResult}
            className="flex-1 text-xs font-bold shadow-lg shadow-brand-600/30"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={handleApply}
          >
            <span>Apply Vehicle to Search</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
