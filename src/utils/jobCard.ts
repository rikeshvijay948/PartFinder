/**
 * Workshop Digital Job Card & Customer Cost Estimator for PartFinder
 * Allows automotive garages to create itemized repair estimates combining
 * PartFinder verified spare parts counter prices with workshop labor charges.
 */

export interface JobCardItem {
  id: string;
  type: 'part' | 'labor';
  description: string;
  partNumber?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isOemGenuine?: boolean;
}

export interface JobCardEstimate {
  id: string;
  jobCardNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  vehiclePlate: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  odometerKm: string;
  mechanicName: string;
  workshopName: string;
  workshopLocation: string;
  workshopPhone: string;
  items: JobCardItem[];
  partsSubtotal: number;
  laborSubtotal: number;
  grandTotal: number;
  estimatedReadyTime: string;
  notes?: string;
  status: 'draft' | 'shared_whatsapp' | 'approved' | 'work_in_progress' | 'completed';
}

export const PRESET_SERVICE_TEMPLATES = [
  {
    name: 'Clutch Overhaul & Bearing',
    vehicle: 'Tata Ace 2019',
    plate: 'TN 54 AB 2940',
    customer: 'Anand Kumar',
    phone: '+91 98420 12345',
    items: [
      { id: '1', type: 'part' as const, description: 'Clutch Release Bearing (Tata Genuine)', partNumber: '31210-87703', quantity: 1, unitPrice: 850, totalPrice: 850, isOemGenuine: true },
      { id: '2', type: 'part' as const, description: 'Clutch Pressure Plate & Friction Disc', partNumber: 'CP-3102', quantity: 1, unitPrice: 1650, totalPrice: 1650, isOemGenuine: true },
      { id: '3', type: 'labor' as const, description: 'Gearbox Dismantling & Clutch Fitment Labor', quantity: 1, unitPrice: 650, totalPrice: 650 },
      { id: '4', type: 'labor' as const, description: 'Flywheel Facing & Clutch Bleeding', quantity: 1, unitPrice: 250, totalPrice: 250 },
    ],
  },
  {
    name: 'Front Brake System Overhaul',
    vehicle: 'Mahindra Bolero 2021',
    plate: 'TN 30 C 1234',
    customer: 'Murugan P.',
    phone: '+91 94432 98765',
    items: [
      { id: '1', type: 'part' as const, description: 'Front Brake Pad Kit (Bosch Ceramic)', partNumber: 'BP-2044', quantity: 1, unitPrice: 1200, totalPrice: 1200, isOemGenuine: true },
      { id: '2', type: 'part' as const, description: 'Brake Disc Rotor Pair (M&M Genuine)', partNumber: 'BR-8810', quantity: 2, unitPrice: 1100, totalPrice: 2200, isOemGenuine: true },
      { id: '3', type: 'part' as const, description: 'DOT 4 Brake Fluid (500ml)', partNumber: 'BF-500', quantity: 1, unitPrice: 220, totalPrice: 220, isOemGenuine: true },
      { id: '4', type: 'labor' as const, description: 'Front Brake Caliper Servicing & Bleeding Labor', quantity: 1, unitPrice: 450, totalPrice: 450 },
    ],
  },
  {
    name: 'Periodic Preventive Service',
    vehicle: 'Toyota Innova Crysta 2022',
    plate: 'TN 27 E 8899',
    customer: 'Senthil Nathan',
    phone: '+91 98421 55443',
    items: [
      { id: '1', type: 'part' as const, description: 'Synthetic Engine Oil 5W-30 (7 Liters)', partNumber: 'SYN-5W30', quantity: 1, unitPrice: 2850, totalPrice: 2850, isOemGenuine: true },
      { id: '2', type: 'part' as const, description: 'Oil Filter Element (Denso Genuine)', partNumber: 'OF-TY-102', quantity: 1, unitPrice: 420, totalPrice: 420, isOemGenuine: true },
      { id: '3', type: 'part' as const, description: 'Air Filter Cartridge', partNumber: 'AF-TY-301', quantity: 1, unitPrice: 650, totalPrice: 650, isOemGenuine: true },
      { id: '4', type: 'labor' as const, description: 'Full Periodic Service & 40-Point Inspection Labor', quantity: 1, unitPrice: 850, totalPrice: 850 },
    ],
  },
];

/**
 * Calculates subtotals for an estimate
 */
export function calculateJobCardTotals(items: JobCardItem[]): {
  partsSubtotal: number;
  laborSubtotal: number;
  grandTotal: number;
} {
  let partsSubtotal = 0;
  let laborSubtotal = 0;

  for (const item of items) {
    if (item.type === 'part') {
      partsSubtotal += item.totalPrice;
    } else {
      laborSubtotal += item.totalPrice;
    }
  }

  return {
    partsSubtotal,
    laborSubtotal,
    grandTotal: partsSubtotal + laborSubtotal,
  };
}

/**
 * Formats a clean, professional WhatsApp text message for the vehicle customer
 */
export function formatJobCardWhatsAppMessage(estimate: JobCardEstimate): string {
  const partsLines = estimate.items
    .filter(i => i.type === 'part')
    .map(i => `• ${i.description} ${i.partNumber ? `(#${i.partNumber})` : ''} — ${i.quantity}x ₹${i.unitPrice} = *₹${i.totalPrice}*`)
    .join('\n');

  const laborLines = estimate.items
    .filter(i => i.type === 'labor')
    .map(i => `• ${i.description} — *₹${i.totalPrice}*`)
    .join('\n');

  return `🔧 *${estimate.workshopName.toUpperCase()}*
📍 ${estimate.workshopLocation}
📞 ${estimate.workshopPhone}
----------------------------------------
📋 *DIGITAL REPAIR ESTIMATE*
Job Card: *#${estimate.jobCardNumber}*
Date: ${estimate.createdAt}

🚗 *Vehicle Details:*
• Model: *${estimate.vehicleMake} ${estimate.vehicleModel} (${estimate.vehicleYear})*
• Plate Number: *${estimate.vehiclePlate}*
• Odometer: ${estimate.odometerKm || 'Not Recorded'}
👤 *Customer:* ${estimate.customerName} (${estimate.customerPhone})

⚙️ *SPARE PARTS REQUIRED (Verified Genuine):*
${partsLines || '• No parts added'}
*Parts Subtotal: ₹${estimate.partsSubtotal.toLocaleString('en-IN')}*

🛠️ *WORKSHOP LABOR & SERVICE CHARGES:*
${laborLines || '• Labor included in parts'}
*Labor Subtotal: ₹${estimate.laborSubtotal.toLocaleString('en-IN')}*
----------------------------------------
💰 *ESTIMATED TOTAL AMOUNT: ₹${estimate.grandTotal.toLocaleString('en-IN')}*
⏱ *Estimated Vehicle Delivery:* ${estimate.estimatedReadyTime}

${estimate.notes ? `📝 *Workshop Notes:* ${estimate.notes}\n` : ''}
✅ *Parts verified live via PartFinder Salem Network.*
Please reply *APPROVE* to confirm and commence repair work.`.trim();
}

/**
 * Opens WhatsApp Web or App with pre-filled Job Card Estimate
 */
export function shareJobCardOnWhatsApp(estimate: JobCardEstimate): void {
  const text = formatJobCardWhatsAppMessage(estimate);
  const cleanPhone = estimate.customerPhone.replace(/[^0-9]/g, '');
  const url = cleanPhone.length >= 10
    ? `https://api.whatsapp.com/send?phone=${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}&text=${encodeURIComponent(text)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
