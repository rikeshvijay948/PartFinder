export interface BreakdownEmergencyRequest {
  id: string;
  vehicle: string;
  plateNumber: string;
  driverPhone: string;
  highwayLocation: string;
  landmark: string;
  breakdownType: 'clutch_cable' | 'fan_belt' | 'radiator_hose' | 'alternator' | 'brake_line' | 'starter_motor';
  severity: 'critical' | 'high' | 'medium';
  requiredPartName: string;
  requiredPartNumber: string;
  timestamp: string;
  status: 'runner_dispatched' | 'counter_packing' | 'pending';
  assignedShop: {
    name: string;
    phone: string;
    distanceKm: number;
    etaMinutes: number;
    runnerName: string;
  };
}

export const SALEM_HIGHWAY_ZONES = [
  'NH-44 Sankari Toll Plaza (Salem-Coimbatore Hwy)',
  'NH-44 Omalur Bypass Junction (Salem-Bangalore Hwy)',
  'NH-544 Seelanaickenpatti Ring Road Junction',
  'NH-79 Vazhapadi Toll (Salem-Chennai Hwy)',
  'Kandhampatti Flyover Service Road, Salem',
  'Mallur Bypass (Salem-Namakkal Hwy)',
];

export const COMMON_HIGHWAY_BREAKDOWN_PARTS = [
  {
    type: 'clutch_cable' as const,
    label: 'Clutch Cable Snapped',
    defaultVehicle: 'Tata Ace 2019 Diesel',
    partName: 'Heavy-Duty Clutch Release Cable',
    partNumber: '2525-2910-0102',
    approxPrice: 420,
    severity: 'critical' as const,
  },
  {
    type: 'fan_belt' as const,
    label: 'Alternator / Water Pump Fan Belt Torn',
    defaultVehicle: 'Mahindra Bolero Pickup',
    partName: 'Ribbed V-Belt (EPDM Heat Resistant)',
    partNumber: '0054-FB-7740',
    approxPrice: 380,
    severity: 'critical' as const,
  },
  {
    type: 'radiator_hose' as const,
    label: 'Radiator Coolant Hose Burst / Overheating',
    defaultVehicle: 'Tata Ace / Super Ace',
    partName: 'Upper Radiator Molded Hose + Clamp Set',
    partNumber: '2525-5012-0045',
    approxPrice: 290,
    severity: 'high' as const,
  },
  {
    type: 'alternator' as const,
    label: 'Alternator Charging / Battery Dying',
    defaultVehicle: 'Maruti Suzuki Super Carry',
    partName: '12V 55A Compact Alternator Assembly',
    partNumber: '31400M79F10',
    approxPrice: 3850,
    severity: 'high' as const,
  },
  {
    type: 'brake_line' as const,
    label: 'Brake Fluid Pipe Leak / Zero Pedal Pressure',
    defaultVehicle: 'Ashok Leyland Dost+',
    partName: 'Reinforced Front Hydraulic Brake Hose',
    partNumber: 'B320-1840-02',
    approxPrice: 480,
    severity: 'critical' as const,
  },
];

export const DEMO_STANDBY_SHOPS = [
  {
    name: 'Sri Lakshmi Highway Auto Spares (24x7)',
    phone: '+91 98427 11223',
    distanceKm: 2.1,
    etaMinutes: 18,
    runnerName: 'Suresh (Bike Runner #04)',
  },
  {
    name: 'Balaji Express Truck & Tractor Spares',
    phone: '+91 94432 88990',
    distanceKm: 3.4,
    etaMinutes: 24,
    runnerName: 'Karthik (Runner #09)',
  },
  {
    name: 'Salem Auto Nagar Rapid Dispatch Hub',
    phone: '+91 98420 55432',
    distanceKm: 4.8,
    etaMinutes: 29,
    runnerName: 'Ramesh (Runner #12)',
  },
];

export const formatHighwaySOSWhatsAppMessage = (
  req: BreakdownEmergencyRequest
): string => {
  let msg = `*🚨 EMERGENCY ROADSIDE SPARE SOS - PARTFINDER SALEM*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `*HIGHWAY BREAKDOWN AT:* ${req.highwayLocation}\n`;
  msg += `*Landmark:* ${req.landmark || 'Near Toll Service Road'}\n`;
  msg += `*Vehicle:* ${req.vehicle} (${req.plateNumber.toUpperCase()})\n`;
  msg += `*Driver / Mechanic SOS Contact:* ${req.driverPhone}\n\n`;

  msg += `*CRITICAL PART NEEDED IMMEDIATELY:*\n`;
  msg += `• *Part Name:* ${req.requiredPartName}\n`;
  msg += `• *OEM Part Number:* ${req.requiredPartNumber}\n`;
  msg += `• *Breakdown Reason:* ${req.breakdownType.replace('_', ' ').toUpperCase()}\n`;
  msg += `• *Urgency:* ⚡ ${req.severity.toUpperCase()} (Stranded on Highway)\n\n`;

  msg += `*ASSIGNED DISPATCH COUNTER:*\n`;
  msg += `• ${req.assignedShop.name} (${req.assignedShop.distanceKm} km away)\n`;
  msg += `• *Runner On Duty:* ${req.assignedShop.runnerName}\n`;
  msg += `• *Estimated Delivery to Highway:* ~${req.assignedShop.etaMinutes} Minutes\n`;
  msg += `• *Counter Direct Line:* ${req.assignedShop.phone}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `_Dispatched via PartFinder Salem Highway Emergency Network._`;

  return msg;
};

export const dispatchSOSAlertOnWhatsApp = (
  req: BreakdownEmergencyRequest
): void => {
  const text = encodeURIComponent(formatHighwaySOSWhatsAppMessage(req));
  const cleanPhone = req.assignedShop.phone.replace(/[^0-9]/g, '');
  const url = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(url, '_blank');
};
