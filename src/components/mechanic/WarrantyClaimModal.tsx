import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Plus, 
  Share2, 
  Copy, 
  Check, 
  Store, 
  BadgeCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import { 
  WarrantyClaimRecord, 
  INITIAL_WARRANTY_CLAIMS, 
  formatWarrantyClaimWhatsAppMessage, 
  shareWarrantyClaimOnWhatsApp 
} from '../../utils/warrantyTracker';

interface WarrantyClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPartName?: string;
  initialPartNumber?: string;
  initialShopName?: string;
}

export const WarrantyClaimModal: React.FC<WarrantyClaimModalProps> = ({
  isOpen,
  onClose,
  initialPartName = 'Clutch Release Bearing',
  initialPartNumber = '31210-87703',
  initialShopName = 'Sri Lakshmi Auto Spares',
}) => {
  const [claims, setClaims] = useState<WarrantyClaimRecord[]>(INITIAL_WARRANTY_CLAIMS);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaimRecord>(INITIAL_WARRANTY_CLAIMS[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [copied, setCopied] = useState(false);

  // New Claim Form State
  const [partName, setPartName] = useState(initialPartName);
  const [partNumber, setPartNumber] = useState(initialPartNumber);
  const [brand, setBrand] = useState('Tata OEM Genuine');
  const [shopName, setShopName] = useState(initialShopName);
  const [reason, setReason] = useState<WarrantyClaimRecord['claimReason']>('defective_manufacturing');
  const [vehicle, setVehicle] = useState('Tata Ace 2019 Diesel');
  const [plateNumber, setPlateNumber] = useState('TN 54 AB 2940');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-SLM-2026-9041');
  const [replacementValue, setReplacementValue] = useState<number>(850);
  const [notes, setNotes] = useState('Excessive bearing play and mechanical friction out of packaging.');

  if (!isOpen) return null;

  const handleCopyClaim = (claim: WarrantyClaimRecord) => {
    const text = formatWarrantyClaimWhatsAppMessage(claim);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const newClaim: WarrantyClaimRecord = {
      id: `claim-${Date.now()}`,
      rmaNumber: `RMA-SLM-26-${Math.floor(1000 + Math.random() * 9000)}`,
      partName,
      partNumber,
      brand,
      shopName,
      shopPhone: '+91 98427 11223',
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyDurationMonths: 12,
      warrantyExpiryDate: '2027-11-12',
      claimReason: reason,
      claimStatus: 'under_review',
      vehicle,
      plateNumber,
      mechanicWorkshop: 'Apex Auto Garage, Salem',
      invoiceNumber,
      replacementValue: Number(replacementValue) || 850,
      notes,
    };

    setClaims([newClaim, ...claims]);
    setSelectedClaim(newClaim);
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-navy-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Spare Parts Warranty & RMA Center
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  Counter Claims
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate official return slips, manage OEM warranties, and process OTC shop replacements
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
        <div className="p-5 sm:p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Top Bar with Add Claim Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Active Warranty Claims: <strong className="text-white">{claims.length}</strong>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel Entry' : 'File New Warranty Claim'}
            </Button>
          </div>

          {/* New Claim Form */}
          {showAddForm && (
            <form onSubmit={handleCreateClaim} className="p-4 rounded-2xl bg-navy-950/90 border border-cyan-500/30 space-y-3 animate-in slide-in-from-top-2 text-xs">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4" />
                <span>File Warranty Replacement Claim (RMA)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Part Name</label>
                  <input
                    type="text"
                    required
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">OEM Part Number</label>
                  <input
                    type="text"
                    required
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Brand / OEM Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Vehicle Model</label>
                  <input
                    type="text"
                    required
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Vehicle Reg Plate</label>
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white font-mono text-xs uppercase focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Shop Counter Source</label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Claim Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as WarrantyClaimRecord['claimReason'])}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="defective_manufacturing">Manufacturing Defect / Rattling</option>
                    <option value="dimension_mismatch">Dimension / Fitting Mismatch</option>
                    <option value="premature_wear">Premature Wear Within Warranty</option>
                    <option value="customer_cancelled">Unopened Sealed Box (Customer Cancelled)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Purchase Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Replacement Value (₹)</label>
                  <input
                    type="number"
                    value={replacementValue}
                    onChange={(e) => setReplacementValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Inspection Notes / Problem Description</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="text-xs font-bold px-4 bg-cyan-600 hover:bg-cyan-500"
                  icon={<Check className="w-3.5 h-3.5" />}
                >
                  Generate Official RMA Slip
                </Button>
              </div>
            </form>
          )}

          {/* Claims List */}
          <div className="space-y-3">
            {claims.map((claim) => {
              const isSelected = selectedClaim?.id === claim.id;
              const statusBadge = {
                approved_replacement: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                under_review: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                counter_credit_issued: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
              }[claim.claimStatus];

              return (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-navy-950 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-navy-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {claim.rmaNumber}
                      </span>
                      <h4 className="text-sm font-bold text-white">{claim.partName}</h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider self-start sm:self-auto ${statusBadge}`}>
                      {claim.claimStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500 block">Shop:</span>
                      <span className="font-semibold text-slate-200 truncate block">{claim.shopName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">OEM Brand:</span>
                      <span className="font-semibold text-slate-200 truncate block">{claim.brand}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Warranty Until:</span>
                      <span className="font-mono text-emerald-400 block">{claim.warrantyExpiryDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Claim Value:</span>
                      <span className="font-mono font-bold text-white block">₹{claim.replacementValue}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in">
                      <p className="text-xs text-slate-300 bg-navy-900/80 p-3 rounded-xl border border-slate-800">
                        <strong className="text-cyan-300">Mechanic Report:</strong> {claim.notes}
                      </p>

                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyClaim(claim);
                          }}
                        >
                          {copied ? 'Copied' : 'Copy RMA Text'}
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                          icon={<Share2 className="w-3.5 h-3.5" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            shareWarrantyClaimOnWhatsApp(claim);
                          }}
                        >
                          Send RMA Slip to Counter via WhatsApp
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-navy-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Store className="w-4 h-4 text-cyan-400" />
            <span>Accepted across 420+ verified Salem spare parts dealer counters.</span>
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
