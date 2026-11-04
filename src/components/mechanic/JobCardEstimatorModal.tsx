import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Plus, 
  Trash2, 
  Share2, 
  Sparkles, 
  Wrench, 
  Clock, 
  User, 
  Phone, 
  Car, 
  Copy, 
  Check
} from 'lucide-react';
import { Button } from '../common/Button';
import { 
  JobCardItem, 
  JobCardEstimate, 
  calculateJobCardTotals, 
  formatJobCardWhatsAppMessage, 
  shareJobCardOnWhatsApp,
  PRESET_SERVICE_TEMPLATES 
} from '../../utils/jobCard';

interface JobCardEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicle?: string;
  initialPartName?: string;
  initialPartNumber?: string;
  initialPartPrice?: number;
}

export const JobCardEstimatorModal: React.FC<JobCardEstimatorModalProps> = ({
  isOpen,
  onClose,
  initialVehicle = 'Tata Ace 2019',
  initialPartName = 'Clutch Release Bearing',
  initialPartNumber = '31210-87703',
  initialPartPrice = 850,
}) => {
  const [customerName, setCustomerName] = useState('Anand Kumar');
  const [customerPhone, setCustomerPhone] = useState('+91 98420 12345');
  const [vehiclePlate, setVehiclePlate] = useState('TN 54 AB 2940');
  const [vehicleMake, setVehicleMake] = useState(() => initialVehicle.split(' ')[0] || 'Tata');
  const [vehicleModel, setVehicleModel] = useState(() => initialVehicle.split(' ')[1] || 'Ace');
  const [vehicleYear, setVehicleYear] = useState(() => initialVehicle.split(' ')[2] || '2019');
  const [estimatedReadyTime, setEstimatedReadyTime] = useState('Today, 4:30 PM');
  const [copied, setCopied] = useState(false);

  const [items, setItems] = useState<JobCardItem[]>(() => [
    {
      id: 'item-1',
      type: 'part',
      description: initialPartName,
      partNumber: initialPartNumber,
      quantity: 1,
      unitPrice: initialPartPrice,
      totalPrice: initialPartPrice,
      isOemGenuine: true,
    },
    {
      id: 'item-2',
      type: 'labor',
      description: 'Clutch Assembly & Gearbox Dismantling Labor',
      quantity: 1,
      unitPrice: 600,
      totalPrice: 600,
    },
  ]);

  if (!isOpen) return null;

  const totals = calculateJobCardTotals(items);

  const handleAddItem = (type: 'part' | 'labor') => {
    const newItem: JobCardItem = {
      id: `item-${Date.now()}`,
      type,
      description: type === 'part' ? 'New Replacement Part' : 'Service Labor Charge',
      quantity: 1,
      unitPrice: type === 'part' ? 450 : 300,
      totalPrice: type === 'part' ? 450 : 300,
      isOemGenuine: type === 'part',
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, updates: Partial<JobCardItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.totalPrice = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleLoadTemplate = (tpl: typeof PRESET_SERVICE_TEMPLATES[0]) => {
    setCustomerName(tpl.customer);
    setCustomerPhone(tpl.phone);
    setVehiclePlate(tpl.plate);
    setVehicleMake(tpl.vehicle.split(' ')[0] || 'Tata');
    setVehicleModel(tpl.vehicle.split(' ')[1] || 'Ace');
    setVehicleYear(tpl.vehicle.split(' ')[2] || '2019');
    setItems(tpl.items.map((it, idx) => ({ ...it, id: `tpl-${Date.now()}-${idx}` })));
  };

  const currentEstimate: JobCardEstimate = {
    id: 'est-8842',
    jobCardNumber: 'JC-8842',
    createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    customerName,
    customerPhone,
    vehiclePlate,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    odometerKm: '64,210 km',
    mechanicName: 'Ramesh Kumar',
    workshopName: 'Apex Auto Workshop & Garage',
    workshopLocation: 'Plot 4A, Auto Nagar, 5 Roads, Salem',
    workshopPhone: '+91 98420 77890',
    items,
    partsSubtotal: totals.partsSubtotal,
    laborSubtotal: totals.laborSubtotal,
    grandTotal: totals.grandTotal,
    estimatedReadyTime,
    notes: 'All spares sourced via PartFinder verified Salem distributors with warranty.',
    status: 'draft',
  };

  const handleCopyEstimate = () => {
    const text = formatJobCardWhatsAppMessage(currentEstimate);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-navy-900 border border-slate-700/90 rounded-3xl shadow-2xl max-w-4xl w-full p-5 sm:p-7 space-y-5 relative overflow-hidden my-6">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-start justify-between relative z-10 pb-3 border-b border-slate-800 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 p-0.5 shadow-lg shadow-brand-600/30 shrink-0">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Workshop Digital Invoice & Job Card</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                Customer Cost Estimate & Job Card
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

        {/* 1-Click Service Pack Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Load Quick Service Pack Template:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_SERVICE_TEMPLATES.map(tpl => (
              <button
                key={tpl.name}
                type="button"
                onClick={() => handleLoadTemplate(tpl)}
                className="text-xs px-3 py-1.5 rounded-xl bg-navy-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-brand-500 transition-all font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <span>🔧</span>
                <span>{tpl.name}</span>
                <span className="text-[10px] opacity-75">({tpl.vehicle})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer & Vehicle Header Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-navy-950 border border-slate-800 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-navy-900 text-white font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              Customer WhatsApp
            </label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-navy-900 text-white font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
              <Car className="w-3 h-3 text-slate-400" />
              Registration Plate
            </label>
            <input
              type="text"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
              className="w-full bg-navy-900 text-amber-400 font-mono font-bold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Estimated Delivery
            </label>
            <input
              type="text"
              value={estimatedReadyTime}
              onChange={(e) => setEstimatedReadyTime(e.target.value)}
              className="w-full bg-navy-900 text-slate-200 font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Itemized Table of Parts & Labor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-brand-400" />
              Itemized Spares & Labor Breakdown:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddItem('part')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Spare Part</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddItem('labor')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Labor</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-navy-950 overflow-hidden divide-y divide-slate-800">
            {items.map((item) => (
              <div key={item.id} className="p-3 flex items-center gap-3 text-xs flex-wrap sm:flex-nowrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                  item.type === 'part' 
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' 
                    : 'bg-blue-500/15 text-blue-300 border border-blue-500/25'
                }`}>
                  {item.type}
                </span>

                <div className="flex-1 min-w-[180px]">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                    placeholder="Description / Part Name"
                    className="w-full bg-navy-900 text-white font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700/80 focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>

                {item.type === 'part' && (
                  <div className="w-28 shrink-0">
                    <input
                      type="text"
                      value={item.partNumber || ''}
                      onChange={(e) => handleUpdateItem(item.id, { partNumber: e.target.value })}
                      placeholder="OEM Ref #"
                      className="w-full bg-navy-900 text-slate-300 font-mono text-[11px] px-2 py-1.5 rounded-lg border border-slate-700/80 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                )}

                <div className="w-16 shrink-0 flex items-center gap-1">
                  <span className="text-slate-500 text-[11px]">Qty:</span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full bg-navy-900 text-white font-mono text-center py-1.5 rounded-lg border border-slate-700/80 text-xs"
                  />
                </div>

                <div className="w-24 shrink-0 flex items-center gap-1">
                  <span className="text-slate-500 text-[11px]">₹</span>
                  <input
                    type="number"
                    step="10"
                    value={item.unitPrice}
                    onChange={(e) => handleUpdateItem(item.id, { unitPrice: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full bg-navy-900 text-white font-bold font-mono px-2 py-1.5 rounded-lg border border-slate-700/80 text-xs"
                  />
                </div>

                <div className="w-24 text-right font-black text-white shrink-0 font-mono">
                  ₹{item.totalPrice}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={items.length <= 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Total Cost Summary Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Parts Total</span>
              <strong className="text-emerald-400 text-sm font-bold font-mono">₹{totals.partsSubtotal.toLocaleString('en-IN')}</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Labor Total</span>
              <strong className="text-blue-400 text-sm font-bold font-mono">₹{totals.laborSubtotal.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Estimated Grand Total (incl. tax):</span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight text-emerald-400">
              ₹{totals.grandTotal.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-2 pt-2 border-t border-slate-800 flex-wrap sm:flex-nowrap">
          <Button
            variant="secondary"
            size="md"
            className="flex-1 text-xs"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="outline"
            size="md"
            className="flex-1 text-xs border-slate-700 hover:border-slate-500"
            icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopyEstimate}
          >
            <span>{copied ? 'Estimate Copied!' : 'Copy Estimate Text'}</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            className="flex-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-600/30"
            icon={<Share2 className="w-3.5 h-3.5" />}
            onClick={() => shareJobCardOnWhatsApp(currentEstimate)}
          >
            <span>Send Estimate via WhatsApp</span>
          </Button>
        </div>

      </div>
    </div>
  );
};
