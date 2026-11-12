import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Share2, 
  ShieldAlert, 
  Truck, 
  CheckCircle2, 
  Zap,
  Wrench
} from 'lucide-react';
import { Button } from '../common/Button';
import { 
  SALEM_HIGHWAY_ZONES, 
  COMMON_HIGHWAY_BREAKDOWN_PARTS, 
  DEMO_STANDBY_SHOPS, 
  BreakdownEmergencyRequest, 
  dispatchSOSAlertOnWhatsApp 
} from '../../utils/emergencySOS';

interface EmergencyBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlate?: string;
  initialVehicle?: string;
}

export const EmergencyBreakdownModal: React.FC<EmergencyBreakdownModalProps> = ({
  isOpen,
  onClose,
  initialPlate = 'TN 54 AB 2940',
  initialVehicle = 'Tata Ace 2019 Diesel',
}) => {
  const [plateNumber, setPlateNumber] = useState(initialPlate);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [driverPhone, setDriverPhone] = useState('+91 98420 77890');
  const [highwayLocation, setHighwayLocation] = useState(SALEM_HIGHWAY_ZONES[0]);
  const [landmark, setLandmark] = useState('200m before Toll Plaza, left shoulder');
  const [selectedBreakdown, setSelectedBreakdown] = useState(COMMON_HIGHWAY_BREAKDOWN_PARTS[0]);
  const [customPartName, setCustomPartName] = useState(COMMON_HIGHWAY_BREAKDOWN_PARTS[0].partName);
  const [customPartNumber, setCustomPartNumber] = useState(COMMON_HIGHWAY_BREAKDOWN_PARTS[0].partNumber);
  const [isDispatched, setIsDispatched] = useState(false);
  const [activeRequest, setActiveRequest] = useState<BreakdownEmergencyRequest | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof COMMON_HIGHWAY_BREAKDOWN_PARTS[0]) => {
    setSelectedBreakdown(preset);
    setCustomPartName(preset.partName);
    setCustomPartNumber(preset.partNumber);
  };

  const handleTriggerSOS = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedShop = DEMO_STANDBY_SHOPS[0];

    const req: BreakdownEmergencyRequest = {
      id: `sos-${Date.now()}`,
      vehicle,
      plateNumber,
      driverPhone,
      highwayLocation,
      landmark,
      breakdownType: selectedBreakdown.type,
      severity: selectedBreakdown.severity,
      requiredPartName: customPartName,
      requiredPartNumber: customPartNumber,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'runner_dispatched',
      assignedShop,
    };

    setActiveRequest(req);
    setIsDispatched(true);
  };

  const handleReset = () => {
    setIsDispatched(false);
    setActiveRequest(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-navy-900 border border-red-500/30 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-red-950/70 via-navy-950 to-navy-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Highway Breakdown SOS
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 uppercase tracking-wider">
                  24x7 Rapid Runner
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Urgent spare parts delivery to stranded vehicles on Salem highways
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {!isDispatched ? (
            <form onSubmit={handleTriggerSOS} className="space-y-4">
              
              {/* Presets Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Common Highway Breakdown Faults (Quick Pick):</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_HIGHWAY_BREAKDOWN_PARTS.map((preset) => {
                    const isSelected = selectedBreakdown.type === preset.type;
                    return (
                      <button
                        key={preset.type}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-red-500/15 border-red-500/50 text-white shadow-md shadow-red-500/10'
                            : 'bg-navy-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-navy-950'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{preset.label}</span>
                          {preset.severity === 'critical' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/30 text-red-300 font-bold uppercase">
                              Critical
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 truncate">
                          {preset.partName} • ₹{preset.approxPrice}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Highway Location & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Highway Location / Route</label>
                  <select
                    value={highwayLocation}
                    onChange={(e) => setHighwayLocation(e.target.value)}
                    className="w-full px-3 py-2.5 bg-navy-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                  >
                    {SALEM_HIGHWAY_ZONES.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Specific Landmark / Mile Marker</label>
                  <input
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Toll Booth lane 4, Left Shoulder"
                    className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Vehicle & Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Vehicle Reg Plate</label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-xl text-white font-mono font-bold text-xs uppercase focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Vehicle Model</label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Driver / Mechanic Contact</label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Required Part Details */}
              <div className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-red-400" />
                  <span>Dispatch Spare Item:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customPartName}
                    onChange={(e) => setCustomPartName(e.target.value)}
                    placeholder="Part Name"
                    className="px-3 py-1.5 bg-navy-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                  <input
                    type="text"
                    value={customPartNumber}
                    onChange={(e) => setCustomPartNumber(e.target.value)}
                    placeholder="Part Number"
                    className="px-3 py-1.5 bg-navy-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Standby Hub Preview */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-navy-950 to-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{DEMO_STANDBY_SHOPS[0].name}</div>
                    <div className="text-[11px] text-slate-400">
                      {DEMO_STANDBY_SHOPS[0].distanceKm} km away • {DEMO_STANDBY_SHOPS[0].runnerName} on standby
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400 text-sm">~18 Mins</span>
                  <div className="text-[10px] text-slate-400">Bike Runner ETA</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm tracking-wide shadow-xl shadow-red-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>BROADCAST HIGHWAY BREAKDOWN SOS NOW</span>
                </button>
              </div>
            </form>
          ) : (
            /* Active Live Dispatch Screen */
            activeRequest && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/40 via-navy-950 to-emerald-950/30 border border-emerald-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>RUNNER EN ROUTE TO HIGHWAY</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Dispatched at {activeRequest.timestamp}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-navy-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">Delivery Runner:</div>
                        <div className="text-sm font-bold text-white">{activeRequest.assignedShop.runnerName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Estimated Arrival:</div>
                        <div className="text-lg font-black text-emerald-400 font-mono">
                          ~{activeRequest.assignedShop.etaMinutes} Mins
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2 rounded-full w-2/3 animate-pulse"></div>
                    </div>

                    <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1">
                      <span>Counter: {activeRequest.assignedShop.name}</span>
                      <span className="font-mono text-brand-300">{activeRequest.assignedShop.phone}</span>
                    </div>
                  </div>

                  {/* Breakdown Details Recap */}
                  <div className="p-3.5 rounded-xl bg-navy-900/50 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Highway Spot:</span>
                      <span className="text-white font-semibold">{activeRequest.highwayLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Landmark:</span>
                      <span className="text-slate-200">{activeRequest.landmark}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vehicle:</span>
                      <span className="text-slate-200 font-mono">{activeRequest.vehicle} ({activeRequest.plateNumber})</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Required Part:</span>
                      <span className="text-amber-300 font-bold">{activeRequest.requiredPartName}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20"
                      icon={<Share2 className="w-4 h-4" />}
                      onClick={() => dispatchSOSAlertOnWhatsApp(activeRequest)}
                    >
                      Share SOS Tracking via WhatsApp
                    </Button>

                    <Button
                      variant="outline"
                      size="md"
                      className="text-xs"
                      onClick={handleReset}
                    >
                      New SOS Request
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-navy-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Connected to Salem 24/7 Highway Parts Standby Network.</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
