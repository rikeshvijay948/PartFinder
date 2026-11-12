export interface WarrantyClaimRecord {
  id: string;
  rmaNumber: string;
  partName: string;
  partNumber: string;
  brand: string;
  shopName: string;
  shopPhone: string;
  purchaseDate: string;
  warrantyDurationMonths: number;
  warrantyExpiryDate: string;
  claimReason: 'defective_manufacturing' | 'dimension_mismatch' | 'premature_wear' | 'customer_cancelled';
  claimStatus: 'approved_replacement' | 'under_review' | 'counter_credit_issued';
  vehicle: string;
  plateNumber: string;
  mechanicWorkshop: string;
  invoiceNumber: string;
  replacementValue: number;
  notes: string;
}

export const INITIAL_WARRANTY_CLAIMS: WarrantyClaimRecord[] = [
  {
    id: 'claim-1',
    rmaNumber: 'RMA-SLM-26-8841',
    partName: 'Clutch Release Bearing (Tata Ace)',
    partNumber: '31210-87703',
    brand: 'Tata OEM Genuine',
    shopName: 'Sri Lakshmi Auto Spares',
    shopPhone: '+91 98427 11223',
    purchaseDate: '2026-10-18',
    warrantyDurationMonths: 12,
    warrantyExpiryDate: '2027-10-18',
    claimReason: 'defective_manufacturing',
    claimStatus: 'approved_replacement',
    vehicle: 'Tata Ace 2019 Diesel',
    plateNumber: 'TN 54 AB 2940',
    mechanicWorkshop: 'Apex Auto Garage, Salem',
    invoiceNumber: 'INV-SLM-2026-4402',
    replacementValue: 850,
    notes: 'Bearing internal race rattling under test bench rotation. 1-to-1 OTC swap approved.',
  },
  {
    id: 'claim-2',
    rmaNumber: 'RMA-SLM-26-7210',
    partName: '12V Starter Solenoid Switch (Mahindra Bolero)',
    partNumber: '0060-SS-9912',
    brand: 'Lucas TVS Genuine',
    shopName: 'Balaji Express Truck & Tractor Spares',
    shopPhone: '+91 94432 88990',
    purchaseDate: '2026-09-12',
    warrantyDurationMonths: 6,
    warrantyExpiryDate: '2027-03-12',
    claimReason: 'premature_wear',
    claimStatus: 'under_review',
    vehicle: 'Mahindra Bolero Maxi Truck',
    plateNumber: 'TN 30 BD 1044',
    mechanicWorkshop: 'Apex Auto Garage, Salem',
    invoiceNumber: 'INV-BAL-9102',
    replacementValue: 1450,
    notes: 'Plunger sticking intermittently when engine reaches operating temperature.',
  },
  {
    id: 'claim-3',
    rmaNumber: 'RMA-SLM-26-5593',
    partName: 'Front Gas Shock Strut LH',
    partNumber: '41602M75J00',
    brand: 'Monroe OE',
    shopName: 'Salem Auto Nagar Parts Hub',
    shopPhone: '+91 98420 55432',
    purchaseDate: '2026-08-20',
    warrantyDurationMonths: 12,
    warrantyExpiryDate: '2027-08-20',
    claimReason: 'customer_cancelled',
    claimStatus: 'counter_credit_issued',
    vehicle: 'Maruti Suzuki Swift DDiS',
    plateNumber: 'TN 27 CE 8821',
    mechanicWorkshop: 'Apex Auto Garage, Salem',
    invoiceNumber: 'INV-SAN-1184',
    replacementValue: 2400,
    notes: 'Unopened sealed box. Vehicle owner postponed strut replacement; credit balance issued.',
  }
];

export const formatWarrantyClaimWhatsAppMessage = (
  claim: WarrantyClaimRecord
): string => {
  let msg = `*🛡️ PARTFINDER WARRANTY REPLACEMENT SLIP (RMA)*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `*RMA Number:* ${claim.rmaNumber}\n`;
  msg += `*Status:* ${claim.claimStatus.replace('_', ' ').toUpperCase()}\n`;
  msg += `*Counter Shop:* ${claim.shopName}\n`;
  msg += `*Workshop / Mechanic:* ${claim.mechanicWorkshop}\n\n`;

  msg += `*SPARE PART DETAILS:*\n`;
  msg += `• *Part Name:* ${claim.partName}\n`;
  msg += `• *Part Number:* ${claim.partNumber}\n`;
  msg += `• *Brand / OEM:* ${claim.brand}\n`;
  msg += `• *Orig. Purchase Date:* ${claim.purchaseDate} (Invoice: ${claim.invoiceNumber})\n`;
  msg += `• *Warranty Expiry:* ${claim.warrantyExpiryDate} (${claim.warrantyDurationMonths}m Total)\n`;
  msg += `• *Replacement Value:* ₹${claim.replacementValue.toLocaleString()}\n\n`;

  msg += `*CLAIM JUSTIFICATION:*\n`;
  msg += `• *Reason:* ${claim.claimReason.replace('_', ' ').toUpperCase()}\n`;
  msg += `• *Vehicle / Plate:* ${claim.vehicle} (${claim.plateNumber})\n`;
  msg += `• *Mechanic Inspection Notes:* ${claim.notes}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `_Digitally authenticated via PartFinder Salem OTC Warranty Network._`;

  return msg;
};

export const shareWarrantyClaimOnWhatsApp = (
  claim: WarrantyClaimRecord
): void => {
  const text = encodeURIComponent(formatWarrantyClaimWhatsAppMessage(claim));
  const cleanPhone = claim.shopPhone.replace(/[^0-9]/g, '');
  const url = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(url, '_blank');
};
