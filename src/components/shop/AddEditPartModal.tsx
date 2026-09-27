import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ShopInventoryItem } from '../../types';

interface AddEditPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ShopInventoryItem>) => void;
  initialItem?: ShopInventoryItem | null;
}

export const AddEditPartModal: React.FC<AddEditPartModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
}) => {
  const [partName, setPartName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState(500);

  const [errors, setErrors] = useState<{
    partName?: string;
    vehicle?: string;
    partNumber?: string;
  }>({});

  useEffect(() => {
    if (initialItem) {
      setPartName(initialItem.partName);
      setVehicle(initialItem.vehicle);
      setPartNumber(initialItem.partNumber);
      setStock(initialItem.stock);
      setPrice(initialItem.price);
    } else {
      setPartName('');
      setVehicle('Tata Ace');
      setPartNumber('');
      setStock(2);
      setPrice(750);
    }
    setErrors({});
  }, [initialItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { partName?: string; vehicle?: string; partNumber?: string } = {};
    if (!partName.trim()) newErrors.partName = 'Part name is required';
    if (!vehicle.trim()) newErrors.vehicle = 'Vehicle compatibility is required';
    if (!partNumber.trim()) newErrors.partNumber = 'Part number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const calculatedStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 
      stock === 0 ? 'Out of Stock' : stock <= 2 ? 'Low Stock' : 'In Stock';

    onSave({
      ...(initialItem?.id ? { id: initialItem.id } : {}),
      partName: partName.trim(),
      vehicle: vehicle.trim(),
      partNumber: partNumber.trim(),
      stock: Number(stock),
      price: Number(price),
      status: calculatedStatus,
      lastUpdated: 'Just now',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem ? 'Edit Spare Part' : 'Add New Spare Part to Inventory'}
      subtitle="Stock and price updates reflect immediately on mechanic searches in Salem"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Part Name */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Part Name <span className="text-brand-400">*</span>
          </label>
          <input
            type="text"
            value={partName}
            onChange={(e) => setPartName(e.target.value)}
            placeholder="e.g. Starter Motor, Alternator 12V"
            className="w-full bg-navy-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
            required
          />
          {errors.partName && <span className="text-xs text-red-400 mt-1">{errors.partName}</span>}
        </div>

        {/* Vehicle */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Compatible Vehicle <span className="text-brand-400">*</span>
          </label>
          <input
            type="text"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            placeholder="e.g. Tata Ace 2019, Mahindra Bolero"
            className="w-full bg-navy-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
            required
          />
          {errors.vehicle && <span className="text-xs text-red-400 mt-1">{errors.vehicle}</span>}
        </div>

        {/* Part Number */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Part Number / OEM Ref <span className="text-brand-400">*</span>
          </label>
          <input
            type="text"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            placeholder="e.g. 31210-87703 or BP-2044"
            className="w-full bg-navy-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 font-mono"
            required
          />
          {errors.partNumber && <span className="text-xs text-red-400 mt-1">{errors.partNumber}</span>}
        </div>

        {/* Stock & Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Shelf Stock Count
            </label>
            <input
              type="number"
              min={0}
              max={999}
              value={stock}
              onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-navy-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Counter Price (₹)
            </label>
            <input
              type="number"
              min={1}
              value={price}
              onChange={(e) => setPrice(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-navy-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 font-mono"
              required
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            {initialItem ? 'Save Changes' : 'Add to Inventory'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
