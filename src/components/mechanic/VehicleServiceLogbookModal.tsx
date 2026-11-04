import React, { useState } from 'react';
import { 
  X, 
  History, 
  Car, 
  Calendar, 
  Gauge, 
  Wrench, 
  ShieldCheck, 
  Plus, 
  Share2, 
  Copy, 
  Check, 
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';
import { 
  ServiceRecord, 
  INITIAL_SERVICE_RECORDS, 
  shareServicePassportOnWhatsApp, 
  formatServiceHistoryWhatsAppMessage 
} from '../../utils/serviceHistory';

interface VehicleServiceLogbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlate?: string;
}

export const VehicleServiceLogbookModal: React.FC<VehicleServiceLogbookModalProps> = ({
  isOpen,
  onClose,
  initialPlate = 'TN 54 AB 2940',
}) => {
  const [selectedPlate, setSelectedPlate] = useState(initialPlate);
  const [customPlateInput, setCustomPlateInput] = useState(initialPlate);
  const [records, setRecords] = useState<ServiceRecord[]>(INITIAL_SERVICE_RECORDS);
  const [copied, setCopied] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Record Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ServiceRecord['serviceType']>('periodic_service');
  const [newOdometer, setNewOdometer] = useState<number>(72000);
  const [newCost, setNewCost] = useState<number>(2500);
  const [newPartName, setNewPartName] = useState('Front Brake Pads');
  const [newPartBrand, setNewPartBrand] = useState('Bosch OEM');

  if (!isOpen) return null;

  const currentRecords = records.filter(
    (r) => r.plateNumber.replace(/\s+/g, '').toUpperCase() === selectedPlate.replace(/\s+/g, '').toUpperCase()
  );

  const vehicleName = currentRecords[0]?.vehicle || 'Verified Indian Commercial Vehicle';

  const handleApplySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPlateInput.trim()) {
      setSelectedPlate(customPlateInput.trim().toUpperCase());
    }
  };

  const handleSelectQuickPlate = (plate: string) => {
    setSelectedPlate(plate);
    setCustomPlateInput(plate);
  };

  const handleCopyMessage = () => {
    const text = formatServiceHistoryWhatsAppMessage(selectedPlate, records);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRecord: ServiceRecord = {
      id: `rec-${Date.now()}`,
      plateNumber: selectedPlate,
      vehicle: vehicleName,
      serviceDate: new Date().toISOString().split('T')[0],
      odometerKm: Number(newOdometer) || 70000,
      serviceType: newType,
      title: newTitle.trim(),
      description: `Workshop serviced under PartFinder Salem verified standards.`,
      replacedParts: newPartName ? [
        {
          partName: newPartName.trim(),
          partNumber: 'PF-GEN-2026',
          brand: newPartBrand.trim(),
          warrantyMonths: 12,
        }
      ] : [],
      totalCost: Number(newCost) || 1500,
      mechanicWorkshop: 'Apex Auto Garage, Salem',
      nextServiceDueKm: (Number(newOdometer) || 70000) + 10000,
      nextServiceDueDate: '2027-05-04',
    };

    setRecords([newRecord, ...records]);
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-navy-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Vehicle Maintenance Logbook
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Service Passport
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Track past part replacements, warranties, and mileage history by registration plate
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

        {/* Plate Selector Bar */}
        <div className="p-4 sm:p-5 bg-navy-950/70 border-b border-slate-800/80 space-y-3">
          <form onSubmit={handleApplySearch} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Car className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="text"
                value={customPlateInput}
                onChange={(e) => setCustomPlateInput(e.target.value)}
                placeholder="Enter Plate Number (e.g., TN 54 AB 2940)"
                className="w-full pl-9 pr-4 py-2.5 bg-navy-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="text-xs font-bold px-4"
            >
              Lookup Plate
            </Button>
          </form>

          {/* Quick Demo Plate Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Quick Garages:</span>
            {[
              { plate: 'TN 54 AB 2940', label: 'Tata Ace (2 Recs)' },
              { plate: 'TN 30 BD 1044', label: 'Bolero (1 Rec)' },
              { plate: 'TN 27 CE 8821', label: 'Swift (1 Rec)' },
            ].map((chip) => (
              <button
                key={chip.plate}
                type="button"
                onClick={() => handleSelectQuickPlate(chip.plate)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  selectedPlate === chip.plate
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {chip.plate} • <span className="font-normal opacity-80">{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Active Vehicle Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-700 text-white font-mono text-xs px-2.5 py-1.5 rounded-lg border border-white/20 font-bold tracking-wider shadow">
                IND • {selectedPlate}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{vehicleName}</h4>
                <p className="text-[11px] text-slate-400">
                  {currentRecords.length} recorded repairs in Salem Garage Network
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? 'Cancel Entry' : 'Log New Repair'}
              </Button>
            </div>
          </div>

          {/* Add New Record Collapsible Form */}
          {showAddForm && (
            <form onSubmit={handleAddNewRecord} className="p-4 rounded-2xl bg-navy-950/90 border border-amber-500/30 space-y-4 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Log Service or Part Replacement for {selectedPlate}</span>
                </span>
                <span className="text-[10px] text-slate-400">Today: {new Date().toISOString().split('T')[0]}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Work Done / Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Brake Pad & Caliper Overhaul"
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Service Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ServiceRecord['serviceType'])}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
                  >
                    <option value="periodic_service">Periodic Maintenance Service</option>
                    <option value="clutch_overhaul">Clutch & Transmission</option>
                    <option value="brake_service">Brake System</option>
                    <option value="major_repair">Major Mechanical Repair</option>
                    <option value="electrical">Electrical & Sensor Repair</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Current Odometer (KM)</label>
                  <input
                    type="number"
                    value={newOdometer}
                    onChange={(e) => setNewOdometer(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Total Cost (₹ Parts + Labor)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Installed Part Name</label>
                  <input
                    type="text"
                    value={newPartName}
                    onChange={(e) => setNewPartName(e.target.value)}
                    placeholder="e.g., Brake Friction Disc Pad"
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Part Brand & Warranty</label>
                  <input
                    type="text"
                    value={newPartBrand}
                    onChange={(e) => setNewPartBrand(e.target.value)}
                    placeholder="e.g., Bosch OEM (12m warranty)"
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="text-xs font-bold px-4 shadow-lg shadow-brand-600/30"
                  icon={<Check className="w-3.5 h-3.5" />}
                >
                  Save Service Record
                </Button>
              </div>
            </form>
          )}

          {/* Records Timeline */}
          {currentRecords.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-navy-950/50 border border-slate-800 space-y-2">
              <History className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-white">No Prior Records for {selectedPlate}</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No past maintenance logged yet. Click "Log New Repair" to create this vehicle's first digital service passport entry.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentRecords.map((rec, idx) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-2xl bg-navy-950/80 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3 relative group"
                >
                  {/* Top Bar of Record */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold">
                        #{currentRecords.length - idx}
                      </div>
                      <h5 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                        {rec.title}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{rec.serviceDate}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        <Gauge className="w-3 h-3" />
                        <span>{rec.odometerKm.toLocaleString()} KM</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Replaced Parts Grid */}
                  {rec.replacedParts.length > 0 && (
                    <div className="p-3 rounded-xl bg-navy-900/90 border border-slate-800 text-xs space-y-2">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                        <span>Verified Replacement Spares:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rec.replacedParts.map((p, pIdx) => (
                          <div key={pIdx} className="flex items-center justify-between p-2 rounded-lg bg-navy-950/60 border border-slate-800/80 text-[11px]">
                            <div>
                              <div className="font-semibold text-white truncate">{p.partName}</div>
                              <div className="font-mono text-slate-400 text-[10px]">{p.partNumber} • {p.brand}</div>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              {p.warrantyMonths}m Warranty
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Info Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <span>Serviced at: <strong className="text-slate-200">{rec.mechanicWorkshop}</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Next Due: {rec.nextServiceDueDate} (~{rec.nextServiceDueKm.toLocaleString()} KM)</span>
                      </div>

                      <div className="font-mono font-bold text-white text-sm">
                        ₹{rec.totalCost.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-navy-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital maintenance passport protected by Salem Garage Registry.</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold"
              icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopyMessage}
            >
              {copied ? 'Copied' : 'Copy Passport'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
              icon={<Share2 className="w-3.5 h-3.5" />}
              onClick={() => shareServicePassportOnWhatsApp(selectedPlate, records)}
            >
              WhatsApp Customer Passport
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
