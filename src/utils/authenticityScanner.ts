/**
 * OEM Spare Part Authenticity Scanner & Hologram Verifier for PartFinder
 * Simulates ACMA (Automotive Component Manufacturers Association of India)
 * anti-counterfeit central registry verification.
 */

export interface PartVerificationResult {
  code: string;
  partName: string;
  partNumber: string;
  brand: string;
  manufacturer: string;
  status: 'genuine' | 'counterfeit_suspect';
  authenticityScore: number;
  securityHologramVerified: boolean;
  hologramId: string;
  batchNumber: string;
  manufacturingDate: string;
  mrpPrice: number;
  warrantyPeriod: string;
  sealStatus: 'Intact & Tamper-Proof' | 'Broken / Tampered' | 'Unregistered';
  compatibleMake: string;
  compatibleModel: string;
  compatibleVehicles: string[];
  verificationAuthority: string;
  antiCounterfeitFeatures: string[];
}

export const GENUINE_PARTS_REGISTRY: Record<string, PartVerificationResult> = {
  // Tata Motors Genuine Parts
  '8901234567890': {
    code: '8901234567890',
    partName: 'Clutch Release Bearing',
    partNumber: '31210-87703',
    brand: 'Tata Motors Genuine Parts',
    manufacturer: 'Tata Motors Limited (Pimpri Pune Plant)',
    status: 'genuine',
    authenticityScore: 99.4,
    securityHologramVerified: true,
    hologramId: 'TMGP-IND-99412-B',
    batchNumber: 'BT-2024-08X',
    manufacturingDate: '12-Aug-2024',
    mrpPrice: 920,
    warrantyPeriod: '6 Months / 20,000 km',
    sealStatus: 'Intact & Tamper-Proof',
    compatibleMake: 'Tata',
    compatibleModel: 'Ace',
    compatibleVehicles: ['Tata Ace (2018-2024)', 'Tata Ace Zip', 'Tata Super Ace'],
    verificationAuthority: 'ACMA • Tata Genuine Anti-Counterfeit Registry',
    antiCounterfeitFeatures: [
      'Micro-text Holographic Seal',
      'Tamper-evident VOID backing',
      'Laser-etched QR code on bearing body',
      'Govt. of India Legal Metrology registered'
    ],
  },
  'TAT-GEN-8842': {
    code: 'TAT-GEN-8842',
    partName: 'Clutch Release Bearing',
    partNumber: '31210-87703',
    brand: 'Tata Motors Genuine Parts',
    manufacturer: 'Tata Motors Limited (Pimpri Pune Plant)',
    status: 'genuine',
    authenticityScore: 99.4,
    securityHologramVerified: true,
    hologramId: 'TMGP-IND-99412-B',
    batchNumber: 'BT-2024-08X',
    manufacturingDate: '12-Aug-2024',
    mrpPrice: 920,
    warrantyPeriod: '6 Months / 20,000 km',
    sealStatus: 'Intact & Tamper-Proof',
    compatibleMake: 'Tata',
    compatibleModel: 'Ace',
    compatibleVehicles: ['Tata Ace (2018-2024)', 'Tata Ace Zip', 'Tata Super Ace'],
    verificationAuthority: 'ACMA • Tata Genuine Anti-Counterfeit Registry',
    antiCounterfeitFeatures: [
      'Micro-text Holographic Seal',
      'Tamper-evident VOID backing',
      'Laser-etched QR code on bearing body',
      'Govt. of India Legal Metrology registered'
    ],
  },

  // Bosch India Genuine Spares
  '4047024123456': {
    code: '4047024123456',
    partName: 'Front Brake Pad Kit (Ceramic Low-Metallic)',
    partNumber: 'BP-2044',
    brand: 'Bosch Automotive',
    manufacturer: 'Bosch Limited (Adugodi Bengaluru)',
    status: 'genuine',
    authenticityScore: 98.9,
    securityHologramVerified: true,
    hologramId: 'BOS-SEC-88104',
    batchNumber: 'BC-55219-Q',
    manufacturingDate: '24-Sep-2024',
    mrpPrice: 1350,
    warrantyPeriod: '1 Year / 30,000 km',
    sealStatus: 'Intact & Tamper-Proof',
    compatibleMake: 'Mahindra',
    compatibleModel: 'Bolero',
    compatibleVehicles: ['Mahindra Bolero (2016-2023)', 'Bolero Camper', 'Bolero Maxi Truck'],
    verificationAuthority: 'Bosch SecureCode Global Registry (ISO 9001/IATF 16949)',
    antiCounterfeitFeatures: [
      'Dual-color SecureCode QR label',
      'Rainbow optical reflection under white light',
      'Encrypted serial pairing with inner shim',
      'Anti-dust ceramic compound certification'
    ],
  },

  // SKF Automotive Bearings
  '7316571234567': {
    code: '7316571234567',
    partName: 'Front Wheel Hub Bearing Kit',
    partNumber: 'VKBA-3401',
    brand: 'SKF India Genuine',
    manufacturer: 'SKF India Ltd (Chinchwad Pune)',
    status: 'genuine',
    authenticityScore: 99.8,
    securityHologramVerified: true,
    hologramId: 'SKF-ORIG-44021',
    batchNumber: 'SKF-IN-2024-C',
    manufacturingDate: '05-Jul-2024',
    mrpPrice: 1680,
    warrantyPeriod: '1 Year / Unlimited km',
    sealStatus: 'Intact & Tamper-Proof',
    compatibleMake: 'Toyota',
    compatibleModel: 'Innova Crysta',
    compatibleVehicles: ['Toyota Innova Crysta (2016-2023)', 'Toyota Fortuner 4x2'],
    verificationAuthority: 'SKF Authenticate App Cloud Integration',
    antiCounterfeitFeatures: [
      'Micro-engraved race groove serial',
      'SKF Blue security seal with thermal color change',
      'Tamper-evident carton tear strip'
    ],
  },

  // Mahindra Genuine Parts
  '8909876543210': {
    code: '8909876543210',
    partName: 'Fuel Filter Element (Water Separator)',
    partNumber: 'FF-8812',
    brand: 'Mahindra Genuine Parts (MGP)',
    manufacturer: 'Mahindra & Mahindra Spares Div (Zaheerabad)',
    status: 'genuine',
    authenticityScore: 97.6,
    securityHologramVerified: true,
    hologramId: 'MGP-HOLO-3391',
    batchNumber: 'M&M-7710-F',
    manufacturingDate: '18-Oct-2024',
    mrpPrice: 580,
    warrantyPeriod: '6 Months / 15,000 km',
    sealStatus: 'Intact & Tamper-Proof',
    compatibleMake: 'Mahindra',
    compatibleModel: 'Bolero',
    compatibleVehicles: ['Mahindra Bolero (2018-2024)', 'Bolero Neo', 'Scorpio Classic'],
    verificationAuthority: 'Mahindra Genuine Parts Verification Network',
    antiCounterfeitFeatures: [
      '3D Mahindra Shield Hologram',
      'Scratch-and-check SMS authentication code',
      'UV-reactive genuine watermark'
    ],
  },

  // Lucas TVS Starter / Electrical
  '4005108123456': {
    code: '4005108123456',
    partName: 'Starter Motor Solenoid Switch (12V)',
    partNumber: 'SS-5401',
    brand: 'Lucas TVS Genuine',
    manufacturer: 'Lucas-TVS Limited (Padi Chennai)',
    status: 'genuine',
    authenticityScore: 98.2,
    securityHologramVerified: true,
    hologramId: 'LTVS-AUTH-1092',
    batchNumber: 'L-2024-11',
    manufacturingDate: '02-Aug-2024',
    mrpPrice: 1420,
    warrantyPeriod: '1 Year / 25,000 km',
    sealStatus: 'Intact & Tamper-Proof',
    compatibleMake: 'Ashok Leyland',
    compatibleModel: 'Dost',
    compatibleVehicles: ['Ashok Leyland Dost (2018-2024)', 'Dost Strong', 'Bada Dost'],
    verificationAuthority: 'Lucas TVS Anti-Counterfeit Cell',
    antiCounterfeitFeatures: [
      'Silver foil optical security ribbon',
      'QR code mapped to production machine ID',
      'Authorized workshop warranty card inside'
    ],
  },

  // Pre-configured Counterfeit / Duplicate Warning Demo
  'SUSPECT-8899': {
    code: 'SUSPECT-8899',
    partName: 'Unverified Clutch Plate Assembly',
    partNumber: 'DUP-UNKNOWN-99',
    brand: 'Suspect Counterfeit / Duplicate Packaging',
    manufacturer: 'Unknown / Unauthorized Copy Workshop',
    status: 'counterfeit_suspect',
    authenticityScore: 12.0,
    securityHologramVerified: false,
    hologramId: 'INVALID-REPLICATED-SEAL',
    batchNumber: 'UNKNOWN',
    manufacturingDate: 'Not registered',
    mrpPrice: 450,
    warrantyPeriod: 'None / No Manufacturer Warranty',
    sealStatus: 'Broken / Tampered',
    compatibleMake: 'Tata',
    compatibleModel: 'Ace',
    compatibleVehicles: ['Uncertified dimensions may damage gearbox & flywheel'],
    verificationAuthority: 'ACMA Alert: Duplicate Part Packaging Warning',
    antiCounterfeitFeatures: [
      '❌ Missing microscopic hologram dot matrix',
      '❌ Duplicate serial number previously flagged in Salem cluster',
      '❌ Inferior friction material with fire hazard risk',
      '❌ Barcode check-digit mathematical mismatch'
    ],
  },
};

/**
 * Normalizes input code (strips spaces, dashes, uppercase)
 */
export function normalizeBarcode(input: string): string {
  return input.trim().replace(/\s+/g, '');
}

/**
 * Verifies any barcode or QR serial string against the registry
 */
export function verifyPartBarcode(inputCode: string): PartVerificationResult {
  const cleanCode = normalizeBarcode(inputCode);

  // Check direct match
  if (GENUINE_PARTS_REGISTRY[cleanCode]) {
    return GENUINE_PARTS_REGISTRY[cleanCode];
  }

  // Check case-insensitive match
  const matchKey = Object.keys(GENUINE_PARTS_REGISTRY).find(
    k => k.toLowerCase() === cleanCode.toLowerCase()
  );
  if (matchKey) {
    return GENUINE_PARTS_REGISTRY[matchKey];
  }

  // Unknown barcode fallback (flags as unverified / suspect duplicate)
  return {
    code: cleanCode || 'UNKNOWN',
    partName: 'Unregistered Automotive Component',
    partNumber: cleanCode.slice(0, 10).toUpperCase(),
    brand: 'Unregistered Brand / Independent Packaging',
    manufacturer: 'Manufacturer Not Found in ACMA OEM Database',
    status: 'counterfeit_suspect',
    authenticityScore: 18.5,
    securityHologramVerified: false,
    hologramId: 'NO-OFFICIAL-HOLOGRAM',
    batchNumber: 'UNVERIFIED',
    manufacturingDate: 'Unknown',
    mrpPrice: 0,
    warrantyPeriod: 'No OEM Warranty',
    sealStatus: 'Unregistered',
    compatibleMake: 'Universal',
    compatibleModel: 'Auto Spare',
    compatibleVehicles: ['Please verify with an authorized distributor counter before installation'],
    verificationAuthority: 'PartFinder Automated Barcode Inspection System',
    antiCounterfeitFeatures: [
      '❌ Barcode not registered with official OEM parts database',
      '❌ No verifiable tamper-proof security seal found',
      '⚠️ Exercise caution: Inspect physical casing for manufacturer stamp'
    ],
  };
}
