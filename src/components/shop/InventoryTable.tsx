import React from 'react';
import { 
  Plus, 
  Minus, 
  Edit, 
  Trash2, 
  Boxes, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Car 
} from 'lucide-react';
import { Button } from '../common/Button';
import { ShopInventoryItem } from '../../types';

interface InventoryTableProps {
  items: ShopInventoryItem[];
  onIncreaseStock: (id: string) => void;
  onDecreaseStock: (id: string) => void;
  onEditPart: (item: ShopInventoryItem) => void;
  onAddPart: () => void;
  onDeletePart?: (id: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onIncreaseStock,
  onDecreaseStock,
  onEditPart,
  onAddPart,
  onDeletePart,
}) => {
  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0 || status === 'Out of Stock') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-[11px] font-bold">
          <XCircle className="w-3.5 h-3.5" />
          <span>Out of Stock</span>
        </span>
      );
    }
    if (stock <= 2 || status === 'Low Stock') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Low Stock</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>In Stock</span>
      </span>
    );
  };

  return (
    <div className="bg-navy-900/90 rounded-3xl border border-slate-700/80 shadow-2xl p-5 sm:p-6 backdrop-blur-xl space-y-5">
      
      {/* Table Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-brand-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Live Shop Inventory
            </h3>
            <span className="text-xs font-semibold text-slate-400 bg-navy-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
              {items.length} parts listed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stock counts mapped to workshop searches across Salem.
          </p>
        </div>

        {/* Action button: + Add Part */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            className="text-xs font-bold shadow-md shadow-brand-600/30"
            icon={<Plus className="w-4 h-4" />}
            onClick={onAddPart}
          >
            Add Part
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3">Part Name</th>
              <th className="py-3 px-3">Vehicle</th>
              <th className="py-3 px-3">Part Number</th>
              <th className="py-3 px-3 text-center">Stock</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Last Updated</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-navy-850/60 transition-colors group"
              >
                {/* Part Name */}
                <td className="py-3.5 px-3 font-bold text-white">
                  <div className="flex items-center gap-2">
                    <span>{item.partName}</span>
                  </div>
                </td>

                {/* Vehicle */}
                <td className="py-3.5 px-3 text-slate-300">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Car className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span>{item.vehicle}</span>
                  </div>
                </td>

                {/* Part Number */}
                <td className="py-3.5 px-3">
                  <span className="font-mono text-slate-300 bg-navy-950 px-2 py-0.5 rounded border border-slate-800">
                    #{item.partNumber}
                  </span>
                </td>

                {/* Stock Controls (Increase / Decrease) */}
                <td className="py-3.5 px-3 text-center">
                  <div className="inline-flex items-center gap-2 bg-navy-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => onDecreaseStock(item.id)}
                      disabled={item.stock === 0}
                      className="w-6 h-6 rounded-lg bg-navy-900 hover:bg-slate-800 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors focus:outline-none"
                      title="Decrease Stock"
                      aria-label={`Decrease stock for ${item.partName}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="font-mono font-bold text-sm text-white px-1.5 min-w-[20px] text-center">
                      {item.stock}
                    </span>

                    <button
                      onClick={() => onIncreaseStock(item.id)}
                      className="w-6 h-6 rounded-lg bg-navy-900 hover:bg-slate-800 text-emerald-400 hover:text-white flex items-center justify-center transition-colors focus:outline-none"
                      title="Increase Stock"
                      aria-label={`Increase stock for ${item.partName}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* Price */}
                <td className="py-3.5 px-3 font-bold text-white">
                  ₹{item.price}
                </td>

                {/* Status */}
                <td className="py-3.5 px-3">
                  {getStatusBadge(item.status, item.stock)}
                </td>

                {/* Last Updated */}
                <td className="py-3.5 px-3 text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className={item.lastUpdated === 'Just now' ? 'text-emerald-400 font-bold' : ''}>
                      {item.lastUpdated}
                    </span>
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-3 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => onEditPart(item)}
                      className="p-1.5 rounded-lg bg-navy-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                      title="Edit Part Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {onDeletePart && (
                      <button
                        onClick={() => onDeletePart(item.id)}
                        className="p-1.5 rounded-lg bg-navy-950 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
