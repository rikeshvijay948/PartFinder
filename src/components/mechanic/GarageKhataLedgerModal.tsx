import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Store, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Share2, 
  Copy, 
  Check, 
  Plus, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { Button } from '../common/Button';
import { 
  KhataCounterAccount, 
  KhataTransaction, 
  INITIAL_KHATA_ACCOUNTS, 
  formatKhataStatementWhatsAppMessage, 
  shareKhataStatementOnWhatsApp 
} from '../../utils/garageKhataLedger';

interface GarageKhataLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GarageKhataLedgerModal: React.FC<GarageKhataLedgerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [accounts, setAccounts] = useState<KhataCounterAccount[]>(INITIAL_KHATA_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(INITIAL_KHATA_ACCOUNTS[0].shopId);
  const [copied, setCopied] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [settledSuccess, setSettledSuccess] = useState(false);

  // New Transaction State
  const [partDesc, setPartDesc] = useState('');
  const [amount, setAmount] = useState<number>(850);
  const [slipNumber, setSlipNumber] = useState(`MEMO-SLM-${Math.floor(1000 + Math.random() * 9000)}`);

  if (!isOpen) return null;

  const activeAccount = accounts.find(a => a.shopId === selectedAccountId) || accounts[0];

  const handleCopy = () => {
    const text = formatKhataStatementWhatsAppMessage(activeAccount);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partDesc.trim()) return;

    const newTx: KhataTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      partDescription: partDesc.trim(),
      slipNumber,
      amount: Number(amount) || 500,
      type: 'debit_part_purchase',
      status: 'unsettled',
    };

    setAccounts(accounts.map((acc) => {
      if (acc.shopId === selectedAccountId) {
        return {
          ...acc,
          totalOutstandingCredit: acc.totalOutstandingCredit + newTx.amount,
          transactions: [newTx, ...acc.transactions],
        };
      }
      return acc;
    }));

    setPartDesc('');
    setShowAddTx(false);
  };

  const handleCompleteUPISettlement = () => {
    setAccounts(accounts.map((acc) => {
      if (acc.shopId === selectedAccountId) {
        const settlementTx: KhataTransaction = {
          id: `tx-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          partDescription: 'Full Khata Clearance via UPI',
          slipNumber: `UPI-SETTLE-${Math.floor(100000 + Math.random() * 900000)}`,
          amount: acc.totalOutstandingCredit,
          type: 'credit_settlement',
          status: 'cleared',
        };
        return {
          ...acc,
          totalOutstandingCredit: 0,
          lastPaymentDate: new Date().toISOString().split('T')[0],
          transactions: [
            settlementTx,
            ...acc.transactions.map(t => ({ ...t, status: 'cleared' as const }))
          ],
        };
      }
      return acc;
    }));

    setSettledSuccess(true);
    setTimeout(() => {
      setSettledSuccess(false);
      setShowUPIModal(false);
    }, 2500);
  };

  const totalOutstandingAllShops = accounts.reduce((acc, a) => acc + a.totalOutstandingCredit, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-navy-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Garage Khata & Shop Counter Credit Ledger
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  Udhaar Book
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Track running spare parts credit balances, reconcile memos, and settle via UPI across Salem dealer counters
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

        {/* Counter Shops Selector Tabs */}
        <div className="p-4 bg-navy-950/90 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto">
            {accounts.map((acc) => {
              const isSelected = acc.shopId === activeAccount.shopId;
              return (
                <button
                  key={acc.shopId}
                  onClick={() => setSelectedAccountId(acc.shopId)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                      : 'bg-navy-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{acc.shopName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-white/20' : 'bg-slate-800 text-slate-300'}`}>
                    ₹{acc.totalOutstandingCredit.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Net Khata: </span>
            <span className="text-sm font-black text-amber-400 font-mono">
              ₹{totalOutstandingAllShops.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          
          {/* Active Counter Account Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-white">{activeAccount.shopName}</h4>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                  UPI: {activeAccount.upiId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Contact: <strong className="text-slate-300">{activeAccount.shopOwner}</strong> ({activeAccount.phone}) • Last Paid: {activeAccount.lastPaymentDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Current Outstanding</div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  ₹{activeAccount.totalOutstandingCredit.toLocaleString()}
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                icon={<QrCode className="w-3.5 h-3.5" />}
                onClick={() => setShowUPIModal(true)}
              >
                Pay via UPI
              </Button>
            </div>
          </div>

          {/* Quick Add Memo Action */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-300">
              Counter Transaction Memos ({activeAccount.transactions.length})
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setShowAddTx(!showAddTx)}
            >
              {showAddTx ? 'Cancel' : 'Record Counter Slip Memo'}
            </Button>
          </div>

          {/* Collapsible Form */}
          {showAddTx && (
            <form onSubmit={handleAddTransaction} className="p-4 rounded-2xl bg-navy-950/90 border border-emerald-500/30 space-y-3 animate-in slide-in-from-top-2 text-xs">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Store className="w-4 h-4" />
                <span>Add Counter Part Memo to Khata</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Spare Part Description</label>
                  <input
                    type="text"
                    required
                    value={partDesc}
                    onChange={(e) => setPartDesc(e.target.value)}
                    placeholder="e.g. Clutch Cable & Fan Belt Set"
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Counter Slip / Memo Number</label>
                  <input
                    type="text"
                    required
                    value={slipNumber}
                    onChange={(e) => setSlipNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Bill Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold"
                  icon={<Check className="w-3.5 h-3.5" />}
                >
                  Record to Ledger
                </Button>
              </div>
            </form>
          )}

          {/* Transactions Table */}
          <div className="space-y-2">
            {activeAccount.transactions.map((tx) => {
              const isDebit = tx.type === 'debit_part_purchase';
              const isCleared = tx.status === 'cleared';

              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      isDebit ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {isDebit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="font-bold text-white">{tx.partDescription}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {tx.slipNumber} • {tx.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isCleared
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                    }`}>
                      {tx.status}
                    </span>

                    <span className={`font-mono font-bold text-sm ${
                      isDebit ? 'text-white' : 'text-emerald-400'
                    }`}>
                      {isDebit ? `+ ₹${tx.amount.toLocaleString()}` : `- ₹${tx.amount.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-navy-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Salem OTC Credit Reconciliation Ledger • Apex Auto Garage</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold"
              icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy Statement'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
              icon={<Share2 className="w-3.5 h-3.5" />}
              onClick={() => shareKhataStatementOnWhatsApp(activeAccount)}
            >
              Send Khata Statement via WhatsApp
            </Button>
          </div>
        </div>

      </div>

      {/* UPI Settlement Modal Dialog */}
      {showUPIModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-navy-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Settle Counter Khata</h4>
              <p className="text-xs text-slate-400 mt-1">{activeAccount.shopName}</p>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
                ₹{activeAccount.totalOutstandingCredit.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl mx-auto w-44 h-44 flex flex-col items-center justify-center border-4 border-emerald-500/20 shadow-inner">
              <div className="w-32 h-32 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-mono font-bold">
                [UPI QR Code]
              </div>
              <span className="text-[10px] text-slate-800 font-mono font-bold mt-1">
                {activeAccount.upiId}
              </span>
            </div>

            {settledSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Payment Recorded! Khata Cleared.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
                  onClick={handleCompleteUPISettlement}
                >
                  Confirm Instant UPI Settlement
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setShowUPIModal(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
