export interface ServiceRecord {
  id: string;
  plateNumber: string;
  vehicle: string; // e.g. Tata Ace 2019
  serviceDate: string; // YYYY-MM-DD
  odometerKm: number;
  serviceType: 'periodic_service' | 'major_repair' | 'clutch_overhaul' | 'brake_service' | 'electrical';
  title: string;
  description: string;
  replacedParts: {
    partName: string;
    partNumber: string;
    brand: string;
    warrantyMonths: number;
  }[];
  totalCost: number;
  mechanicWorkshop: string;
  nextServiceDueKm: number;
  nextServiceDueDate: string;
}

export const INITIAL_SERVICE_RECORDS: ServiceRecord[] = [
  {
    id: 'rec-1',
    plateNumber: 'TN 54 AB 2940',
    vehicle: 'Tata Ace 2019 Diesel',
    serviceDate: '2026-10-18',
    odometerKm: 68450,
    serviceType: 'clutch_overhaul',
    title: 'Clutch Assembly Replacement & Bearing Change',
    description: 'Replaced worn clutch friction plate, pressure plate, and release bearing due to slippage on inclines.',
    replacedParts: [
      {
        partName: 'Clutch Release Bearing',
        partNumber: '31210-87703',
        brand: 'Tata OEM (Genuine)',
        warrantyMonths: 12,
      },
      {
        partName: 'Clutch Plate & Cover Assembly',
        partNumber: '2525-2500-0114',
        brand: 'Valeo OEM',
        warrantyMonths: 12,
      }
    ],
    totalCost: 3850,
    mechanicWorkshop: 'Apex Auto Garage, Salem',
    nextServiceDueKm: 78450,
    nextServiceDueDate: '2027-04-18',
  },
  {
    id: 'rec-2',
    plateNumber: 'TN 54 AB 2940',
    vehicle: 'Tata Ace 2019 Diesel',
    serviceDate: '2026-06-12',
    odometerKm: 60200,
    serviceType: 'periodic_service',
    title: '60,000 KM Major Periodic Service',
    description: 'Replaced engine oil 15W-40, oil filter, primary diesel fuel filter, and cleaned brake drums.',
    replacedParts: [
      {
        partName: 'Engine Oil 15W-40 (4.5L)',
        partNumber: 'LUB-15W40-04',
        brand: 'Castrol CRB Turbomax',
        warrantyMonths: 6,
      },
      {
        partName: 'Spin-On Oil Filter',
        partNumber: '2525-1813-0112',
        brand: 'Purolator',
        warrantyMonths: 6,
      }
    ],
    totalCost: 2650,
    mechanicWorkshop: 'Apex Auto Garage, Salem',
    nextServiceDueKm: 70000,
    nextServiceDueDate: '2026-12-12',
  },
  {
    id: 'rec-3',
    plateNumber: 'TN 30 BD 1044',
    vehicle: 'Mahindra Bolero Maxi Truck Plus',
    serviceDate: '2026-09-05',
    odometerKm: 94200,
    serviceType: 'brake_service',
    title: 'Front Disc Brake Pad Overhaul',
    description: 'Replaced front ceramic brake friction pads and flushed hydraulic brake circuit with DOT 4 fluid.',
    replacedParts: [
      {
        partName: 'Front Disc Brake Pads (Set)',
        partNumber: '0060-BP-8812',
        brand: 'Bosch Genuine',
        warrantyMonths: 12,
      },
      {
        partName: 'Brake Fluid DOT 4 (500ml)',
        partNumber: 'BF-DOT4-500',
        brand: 'Bosch SafeTech',
        warrantyMonths: 12,
      }
    ],
    totalCost: 1950,
    mechanicWorkshop: 'Sri Murugan Diesel Works, Salem',
    nextServiceDueKm: 104200,
    nextServiceDueDate: '2027-03-05',
  },
  {
    id: 'rec-4',
    plateNumber: 'TN 27 CE 8821',
    vehicle: 'Maruti Suzuki Swift DDiS',
    serviceDate: '2026-08-20',
    odometerKm: 82100,
    serviceType: 'major_repair',
    title: 'Suspension Strut & Lower Arm Bushing Replacement',
    description: 'Addressed front left thudding noise over road speed breakers. Replaced gas strut and rubber arm bushes.',
    replacedParts: [
      {
        partName: 'Front Left Gas Shock Absorber',
        partNumber: '41602M75J00',
        brand: 'Monroe OE',
        warrantyMonths: 12,
      }
    ],
    totalCost: 4400,
    mechanicWorkshop: 'Apex Auto Garage, Salem',
    nextServiceDueKm: 92000,
    nextServiceDueDate: '2027-02-20',
  }
];

export const formatServiceHistoryWhatsAppMessage = (
  plateNumber: string,
  records: ServiceRecord[]
): string => {
  const plateRecords = records.filter(
    (r) => r.plateNumber.replace(/\s+/g, '').toUpperCase() === plateNumber.replace(/\s+/g, '').toUpperCase()
  );

  const vehicleName = plateRecords[0]?.vehicle || 'Vehicle';
  const latestRecord = plateRecords[0];

  let message = `*🚗 DIGITAL VEHICLE SERVICE PASSPORT - PARTFINDER*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Reg Plate:* ${plateNumber.toUpperCase()}\n`;
  message += `*Vehicle:* ${vehicleName}\n`;
  message += `*Verified Workshop:* Apex Auto Garage, Salem\n\n`;

  if (latestRecord) {
    message += `*LATEST SERVICE RECORD:*\n`;
    message += `• *Date:* ${latestRecord.serviceDate} (${latestRecord.odometerKm.toLocaleString()} KM)\n`;
    message += `• *Work Done:* ${latestRecord.title}\n`;
    message += `• *Total Amount:* ₹${latestRecord.totalCost}\n`;
    if (latestRecord.replacedParts.length > 0) {
      message += `• *Verified Parts Installed:*\n`;
      latestRecord.replacedParts.forEach((p) => {
        message += `   - ${p.partName} (${p.brand}) [${p.warrantyMonths}m warranty]\n`;
      });
    }
    message += `• *Next Service Due:* ${latestRecord.nextServiceDueDate} (~${latestRecord.nextServiceDueKm.toLocaleString()} KM)\n\n`;
  }

  message += `*TOTAL LIFETIME RECORDS:* ${plateRecords.length} recorded repairs\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `_Digitally verified via PartFinder Garage Network Salem._`;

  return message;
};

export const shareServicePassportOnWhatsApp = (
  plateNumber: string,
  records: ServiceRecord[],
  customerPhone?: string
): void => {
  const text = encodeURIComponent(formatServiceHistoryWhatsAppMessage(plateNumber, records));
  const phoneClean = customerPhone ? customerPhone.replace(/[^0-9]/g, '') : '';
  const url = phoneClean
    ? `https://wa.me/${phoneClean}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(url, '_blank');
};
