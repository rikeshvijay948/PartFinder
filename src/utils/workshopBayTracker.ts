export interface WorkshopBay {
  id: string;
  bayNumber: number;
  bayName: string;
  vehicle: string;
  plateNumber: string;
  customerName: string;
  customerPhone: string;
  repairJob: string;
  assignedMechanic: string;
  partsStatus: 'awaiting_delivery' | 'parts_arrived' | 'installing' | 'completed';
  bayStatus: 'in_progress' | 'awaiting_spares' | 'final_inspection' | 'ready_for_pickup';
  estimatedReady: string;
  totalBill: number;
  installedParts: string[];
}

export const INITIAL_WORKSHOP_BAYS: WorkshopBay[] = [
  {
    id: 'bay-1',
    bayNumber: 1,
    bayName: 'Bay 1: Heavy Hydraulic Lift',
    vehicle: 'Tata Ace 2019 Diesel',
    plateNumber: 'TN 54 AB 2940',
    customerName: 'Anand Kumar',
    customerPhone: '+91 98420 12345',
    repairJob: 'Clutch Assembly Overhaul & Release Bearing Swap',
    assignedMechanic: 'Ramesh Kumar (Master Tech)',
    partsStatus: 'installing',
    bayStatus: 'in_progress',
    estimatedReady: 'Today, 4:30 PM',
    totalBill: 3850,
    installedParts: [
      'Clutch Release Bearing (Tata OEM)',
      'Clutch Friction Plate & Cover (Valeo)'
    ],
  },
  {
    id: 'bay-2',
    bayNumber: 2,
    bayName: 'Bay 2: Engine & Lube Pit',
    vehicle: 'Mahindra Bolero Maxi Truck',
    plateNumber: 'TN 30 BD 1044',
    customerName: 'Senthil Nathan',
    customerPhone: '+91 94433 78102',
    repairJob: '60,000 KM Periodic Service & Brake Bleeding',
    assignedMechanic: 'Murugan S (Lube Specialist)',
    partsStatus: 'parts_arrived',
    bayStatus: 'in_progress',
    estimatedReady: 'Today, 5:15 PM',
    totalBill: 2650,
    installedParts: [
      'Engine Oil 15W-40 Castrol CRB (4.5L)',
      'Spin-On Oil Filter Purolator',
      'Diesel Primary Filter'
    ],
  },
  {
    id: 'bay-3',
    bayNumber: 3,
    bayName: 'Bay 3: Quick Service & Suspension',
    vehicle: 'Maruti Suzuki Swift DDiS',
    plateNumber: 'TN 27 CE 8821',
    customerName: 'Karthik Raja',
    customerPhone: '+91 98421 99014',
    repairJob: 'Front Brake Friction Pad Replacement & Disc Skimming',
    assignedMechanic: 'Praveen V',
    partsStatus: 'completed',
    bayStatus: 'ready_for_pickup',
    estimatedReady: 'Ready for Collection',
    totalBill: 1950,
    installedParts: [
      'Front Disc Brake Pads Set (Bosch)',
      'Brake Fluid DOT 4 (500ml)'
    ],
  },
  {
    id: 'bay-4',
    bayNumber: 4,
    bayName: 'Bay 4: Electrical & Diagnostics Bay',
    vehicle: 'Ashok Leyland Dost+',
    plateNumber: 'TN 52 Z 4190',
    customerName: 'Venkatesh Babu',
    customerPhone: '+91 97890 33412',
    repairJob: 'Alternator Charging Circuit & Starter Solenoid Repair',
    assignedMechanic: 'Ramesh Kumar',
    partsStatus: 'awaiting_delivery',
    bayStatus: 'awaiting_spares',
    estimatedReady: 'Today, 6:30 PM',
    totalBill: 4200,
    installedParts: [
      '12V Starter Solenoid Switch (Lucas TVS)',
      'Alternator Voltage Regulator'
    ],
  }
];

export const formatCustomerPickupWhatsAppMessage = (bay: WorkshopBay): string => {
  let msg = `*🚗 VEHICLE READY FOR COLLECTION - APEX AUTO GARAGE*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `Dear *${bay.customerName}*,\n\n`;
  msg += `Great news! Your *${bay.vehicle}* (${bay.plateNumber.toUpperCase()}) is completely serviced, quality checked, and ready for pickup from our workshop bay.\n\n`;

  msg += `*WORK CARRIED OUT:*\n`;
  msg += `• *Repair:* ${bay.repairJob}\n`;
  msg += `• *Serviced At:* ${bay.bayName}\n`;
  msg += `• *Lead Technician:* ${bay.assignedMechanic}\n\n`;

  msg += `*VERIFIED PARTS INSTALLED:*\n`;
  bay.installedParts.forEach((part) => {
    msg += `• ${part}\n`;
  });

  msg += `\n*TOTAL FINAL BILL:* ₹${bay.totalBill.toLocaleString()}\n`;
  msg += `*Payment Accepted:* Cash / UPI (GPay/PhonePe)\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `*Workshop Location:* Apex Auto Garage, Auto Nagar Industrial Area, Salem\n`;
  msg += `*Direct Phone:* +91 98420 77890\n`;
  msg += `_Digitally verified through PartFinder Salem Garage Network._`;

  return msg;
};

export const sharePickupPassOnWhatsApp = (bay: WorkshopBay): void => {
  const text = encodeURIComponent(formatCustomerPickupWhatsAppMessage(bay));
  const cleanPhone = bay.customerPhone.replace(/[^0-9]/g, '');
  const url = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(url, '_blank');
};
