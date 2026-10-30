/**
 * Vehicle Registration (RC) Plate Lookup & RTO Resolver for PartFinder
 * Simulates Parivahan/Vahan national vehicle registry for Indian automotive workshops
 */

export interface VehicleRCDetails {
  plateNumber: string;
  make: string;
  model: string;
  year: string;
  fuelType: 'Diesel' | 'Petrol' | 'CNG' | 'Electric';
  vehicleClass: 'Commercial Goods Carrier' | 'Light Commercial Vehicle' | 'Passenger Vehicle' | 'Heavy Motor Vehicle';
  engineCapacity: string;
  rtoName: string;
  city: string;
  state: string;
  isCommercial: boolean;
  insuranceValidUntil: string;
  fitnessValidUntil: string;
  suggestedCommonParts: string[];
}

export const KNOWN_RC_DATABASE: Record<string, VehicleRCDetails> = {
  'TN54AB2940': {
    plateNumber: 'TN 54 AB 2940',
    make: 'Tata',
    model: 'Ace',
    year: '2019',
    fuelType: 'Diesel',
    vehicleClass: 'Commercial Goods Carrier',
    engineCapacity: '798 cc (2-Cyl Dicor)',
    rtoName: 'Salem West RTO (TN-54)',
    city: 'Salem',
    state: 'Tamil Nadu',
    isCommercial: true,
    insuranceValidUntil: '14-Nov-2027',
    fitnessValidUntil: '22-Aug-2028',
    suggestedCommonParts: ['Clutch Release Bearing', 'Oil Filter', 'Brake Shoes', 'Air Filter'],
  },
  'TN30C1234': {
    plateNumber: 'TN 30 C 1234',
    make: 'Mahindra',
    model: 'Bolero',
    year: '2021',
    fuelType: 'Diesel',
    vehicleClass: 'Light Commercial Vehicle',
    engineCapacity: '2523 cc (m2DiCR)',
    rtoName: 'Salem RTO (TN-30)',
    city: 'Salem',
    state: 'Tamil Nadu',
    isCommercial: true,
    insuranceValidUntil: '18-Jan-2028',
    fitnessValidUntil: '10-Mar-2029',
    suggestedCommonParts: ['Front Brake Pad Kit', 'Fuel Filter Element', 'Alternator 12V', 'Suspension Bush Kit'],
  },
  'TN27E8899': {
    plateNumber: 'TN 27 E 8899',
    make: 'Toyota',
    model: 'Innova Crysta',
    year: '2022',
    fuelType: 'Diesel',
    vehicleClass: 'Passenger Vehicle',
    engineCapacity: '2393 cc (GD Series)',
    rtoName: 'Salem East RTO (TN-27)',
    city: 'Salem',
    state: 'Tamil Nadu',
    isCommercial: false,
    insuranceValidUntil: '30-Sep-2027',
    fitnessValidUntil: '15-Oct-2037',
    suggestedCommonParts: ['12V 75A Alternator Assembly', 'Engine Cooling Water Pump', 'Front Disc Rotor', 'Cabin AC Filter'],
  },
  'TN38K4512': {
    plateNumber: 'TN 38 K 4512',
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: '2020',
    fuelType: 'Petrol',
    vehicleClass: 'Passenger Vehicle',
    engineCapacity: '1197 cc (K12N DualJet)',
    rtoName: 'Coimbatore North RTO (TN-38)',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    isCommercial: false,
    insuranceValidUntil: '05-May-2027',
    fitnessValidUntil: '12-Jul-2035',
    suggestedCommonParts: ['Front Lower Control Arm', 'Clutch Plate & Cover', 'Spark Plug Set', 'Front Shock Absorber'],
  },
  'TN54D6789': {
    plateNumber: 'TN 54 D 6789',
    make: 'Ashok Leyland',
    model: 'Dost+',
    year: '2020',
    fuelType: 'Diesel',
    vehicleClass: 'Light Commercial Vehicle',
    engineCapacity: '1478 cc (3-Cylinder P15)',
    rtoName: 'Salem West RTO (TN-54)',
    city: 'Salem',
    state: 'Tamil Nadu',
    isCommercial: true,
    insuranceValidUntil: '20-Dec-2027',
    fitnessValidUntil: '04-Feb-2029',
    suggestedCommonParts: ['12V Heavy Duty Starter Motor', 'Water Pump Assembly', 'Propeller Shaft Universal Joint', 'Rear Leaf Spring Bush'],
  },
};

const RTO_CODE_MAPPINGS: Record<string, { rtoName: string; city: string; state: string }> = {
  'TN54': { rtoName: 'Salem West RTO', city: 'Salem', state: 'Tamil Nadu' },
  'TN30': { rtoName: 'Salem RTO', city: 'Salem', state: 'Tamil Nadu' },
  'TN27': { rtoName: 'Salem East RTO', city: 'Salem', state: 'Tamil Nadu' },
  'TN38': { rtoName: 'Coimbatore North RTO', city: 'Coimbatore', state: 'Tamil Nadu' },
  'TN37': { rtoName: 'Coimbatore South RTO', city: 'Coimbatore', state: 'Tamil Nadu' },
  'TN01': { rtoName: 'Chennai Central RTO', city: 'Chennai', state: 'Tamil Nadu' },
  'TN02': { rtoName: 'Chennai North West RTO', city: 'Chennai', state: 'Tamil Nadu' },
  'TN07': { rtoName: 'Chennai South RTO', city: 'Chennai', state: 'Tamil Nadu' },
  'TN09': { rtoName: 'Chennai West RTO', city: 'Chennai', state: 'Tamil Nadu' },
  'TN33': { rtoName: 'Erode RTO', city: 'Erode', state: 'Tamil Nadu' },
  'TN42': { rtoName: 'Tirupur RTO', city: 'Tirupur', state: 'Tamil Nadu' },
  'TN45': { rtoName: 'Tiruchirappalli RTO', city: 'Trichy', state: 'Tamil Nadu' },
  'TN58': { rtoName: 'Madurai South RTO', city: 'Madurai', state: 'Tamil Nadu' },
  'TN70': { rtoName: 'Hosur RTO', city: 'Hosur', state: 'Tamil Nadu' },
  'KA01': { rtoName: 'Bangalore Central RTO', city: 'Bangalore', state: 'Karnataka' },
  'KA03': { rtoName: 'Indiranagar RTO', city: 'Bangalore', state: 'Karnataka' },
  'KA05': { rtoName: 'Jayanagar RTO', city: 'Bangalore', state: 'Karnataka' },
};

/**
 * Normalizes an Indian number plate string by removing spaces and dashes
 */
export function normalizePlateNumber(plate: string): string {
  return plate.replace(/[\s-]/g, '').toUpperCase();
}

/**
 * Formats a clean alphanumeric string into standard Indian HSRP plate format
 * e.g. "TN54AB2940" -> "TN 54 AB 2940"
 */
export function formatPlateDisplay(plate: string): string {
  const clean = normalizePlateNumber(plate);
  if (clean.length < 4) return clean;

  const state = clean.slice(0, 2);
  const rto = clean.slice(2, 4);
  const rest = clean.slice(4);

  const lettersMatch = rest.match(/^[A-Z]+/);
  if (lettersMatch) {
    const series = lettersMatch[0];
    const digits = rest.slice(series.length);
    return `${state} ${rto} ${series} ${digits}`.trim();
  }

  return `${state} ${rto} ${rest}`.trim();
}

/**
 * Look up or dynamically resolve RC metadata for any Indian vehicle registration plate
 */
export function lookupVehicleRC(inputPlate: string): VehicleRCDetails {
  const clean = normalizePlateNumber(inputPlate);

  // 1. Direct hit in verified registry
  if (KNOWN_RC_DATABASE[clean]) {
    return KNOWN_RC_DATABASE[clean];
  }

  // 2. Resolve RTO Code
  const stateCode = clean.slice(0, 2);
  const rtoCode = clean.slice(0, 4);
  const rtoInfo = RTO_CODE_MAPPINGS[rtoCode] || {
    rtoName: `${stateCode} District Transport Office`,
    city: stateCode === 'TN' ? 'Salem Auto Cluster' : 'Metropolitan Region',
    state: stateCode === 'TN' ? 'Tamil Nadu' : stateCode === 'KA' ? 'Karnataka' : 'India',
  };

  // 3. Heuristic classification based on plate pattern
  const isCommercial = clean.includes('G') || clean.includes('T') || clean.includes('V') || clean.length % 2 === 0;

  return {
    plateNumber: formatPlateDisplay(clean || 'TN 54 AB 2940'),
    make: isCommercial ? 'Tata' : 'Toyota',
    model: isCommercial ? 'Ace' : 'Innova Crysta',
    year: '2021',
    fuelType: 'Diesel',
    vehicleClass: isCommercial ? 'Commercial Goods Carrier' : 'Passenger Vehicle',
    engineCapacity: isCommercial ? '798 cc (Dicor Engine)' : '2393 cc (D-4D Engine)',
    rtoName: rtoInfo.rtoName,
    city: rtoInfo.city,
    state: rtoInfo.state,
    isCommercial,
    insuranceValidUntil: '31-Dec-2027',
    fitnessValidUntil: '15-Aug-2029',
    suggestedCommonParts: isCommercial
      ? ['Clutch Release Bearing', 'Brake Shoe Set', 'Engine Oil Filter', 'Alternator 12V']
      : ['Front Disc Brake Pads', 'Alternator 12V 75A', 'Engine Water Pump', 'Suspension Bushing'],
  };
}
