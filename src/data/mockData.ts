import { VehicleOption, PartSearchResult, StatItem, HowItWorksStep, FeatureCard, SearchQueryParams, ShopResult } from '../types';

export const POPULAR_MAKES = [
  'Tata',
  'Mahindra',
  'Maruti Suzuki',
  'Hyundai',
  'Ashok Leyland',
  'Toyota',
  'Honda',
  'Force Motors',
  'Eicher',
];

export const MODELS_BY_MAKE: Record<string, string[]> = {
  'Tata': ['Ace', 'Ace Gold', 'Ace Zip', '407 SFC Turbo', 'Intra V30', 'Intra V50', 'Harrier', 'Nexon', 'Tiago', 'Punch'],
  'Mahindra': ['Bolero', 'Bolero Maxi Truck Plus', 'Scorpio Classic', 'Scorpio-N', 'XUV700', 'Thar', 'Supro Profit Truck', 'Jeeto'],
  'Maruti Suzuki': ['Swift', 'Dzire', 'WagonR', 'Ertiga', 'Brezza', 'Baleno', 'Super Carry', 'Eeco'],
  'Hyundai': ['i20', 'Creta', 'Venue', 'Grand i10 Nios', 'Verna', 'Aura'],
  'Ashok Leyland': ['Dost+', 'Dost Strong', 'Bada Dost i3', 'Bada Dost i4', 'Ecomet 1615', 'Partner 4 Tyre'],
  'Toyota': ['Innova Crysta', 'Innova Hycross', 'Fortuner', 'Hilux', 'Glanza', 'Urban Cruiser'],
  'Honda': ['City', 'Amaze', 'Elevate', 'WR-V', 'Jazz'],
  'Force Motors': ['Traveller 3050', 'Traveller 3350', 'Trax Cruiser', 'Gurkha', 'Urbania'],
  'Eicher': ['Pro 2049', 'Pro 3015', 'Pro 2110', 'Pro 6028', 'Pro 1059'],
};

export const VEHICLE_YEARS = [
  '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2010'
];

export const QUICK_SEARCH_SUGGESTIONS = [
  'Brake Pads',
  'Clutch Bearing',
  'Oil Filter',
  'Alternator',
  'Air Filter',
  'Headlight',
];

export const POPULAR_CITIES = [
  'Salem',
  'Coimbatore',
  'Chennai',
  'Bangalore',
  'Madurai',
  'Trichy',
  'Erode',
  'Tirupur',
  'Hosur',
  'Hyderabad'
];

export const RADIUS_OPTIONS = [
  { value: '5', label: 'Within 5 km (Fastest)' },
  { value: '10', label: 'Within 10 km (Recommended)' },
  { value: '15', label: 'Within 15 km' },
  { value: '25', label: 'Within 25 km' },
  { value: '50', label: 'Within 50 km (Broad Hub)' },
];

export const POPULAR_VEHICLES: VehicleOption[] = [
  { id: 'tata-ace', name: 'Tata Ace (Gold / HT / Mega)', category: 'Commercial' },
  { id: 'mahindra-bolero', name: 'Mahindra Bolero Maxi Truck', category: 'Commercial' },
  { id: 'ashok-leyland-dost', name: 'Ashok Leyland Dost+', category: 'Commercial' },
  { id: 'maruti-swift', name: 'Maruti Suzuki Swift', category: 'Passenger' },
  { id: 'hyundai-i20', name: 'Hyundai i20', category: 'Passenger' },
  { id: 'tata-407', name: 'Tata 407 SFC Turbo', category: 'Heavy Vehicle' },
  { id: 'eicher-pro', name: 'Eicher Pro 2049', category: 'Heavy Vehicle' },
  { id: 'mahindra-scorpio', name: 'Mahindra Scorpio Classic', category: 'Passenger' },
];

export const POPULAR_PARTS: string[] = [
  'Clutch Release Bearing',
  'Front Brake Pad Set (Ceramic)',
  'Alternator 12V 75A',
  'Water Pump Assembly with Gasket',
  'Tie Rod End Outer',
  'Starter Motor Assembly',
  'Fuel Injection Pump Filter',
  'Suspension Lower Control Arm',
  'Rear Shock Absorber',
  'Master Cylinder Brake Kit',
];

export const POPULAR_LOCATIONS: string[] = [
  'Salem - Meyyanur / 5-Roads Auto Hub',
  'Coimbatore - Gandhipuram Auto Nagar',
  'Chennai - Pudupet / GP Road Market',
  'Bangalore - JC Road Auto Cluster',
  'Madurai - Simmakkal Spare Parts Market',
  'Trichy - Palakkarai Hub',
  'Erode - Brough Road',
];

export const DEFAULT_SEARCH_PRESET = {
  vehicle: 'Tata Ace (Gold / HT / Mega)',
  part: 'Clutch Release Bearing',
  location: 'Salem - Meyyanur / 5-Roads Auto Hub',
};

// ================= EXACT DEMO SHOPS FOR SALEM =================
export const SALEM_DEMO_SHOPS: ShopResult[] = [
  {
    id: 'shop-1',
    shopName: 'Sri Lakshmi Auto Spares',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 124,
    distanceKm: 1.8,
    stockCount: 2,
    stockStatus: 'in-stock',
    price: 850,
    lastUpdated: '8 min ago',
    openingHours: '8:00 AM - 8:00 PM',
    phone: '+91 98427 11223',
    address: '14/B, 5 Roads Main Junction, Near New Flyover',
    area: '5 Roads, Salem',
    partName: 'Clutch Release Bearing (Heavy Duty)',
    partNumber: 'TATA-2527-2500',
    brand: 'SKF / Tata Genuine Spares',
    compatibleVehicle: 'Tata Ace 2019 (Gold / HT / Mega)',
    coordinates: { lat: 11.6643, lng: 78.1460, x: 42, y: 38 },
    specialties: ['Tata Commercial', 'SKF Bearings', 'OES Clutch Systems', 'Express Counter'],
  },
  {
    id: 'shop-2',
    shopName: 'Kumar Automobiles',
    isVerified: true,
    rating: 4.6,
    reviewsCount: 89,
    distanceKm: 3.4,
    stockCount: 1,
    stockStatus: 'limited-stock',
    price: 890,
    lastUpdated: '21 min ago',
    openingHours: '8:30 AM - 8:30 PM',
    phone: '+91 94432 45678',
    address: '82, Meyyanur Bypass Road, Opp. Central Bus Stand',
    area: 'Meyyanur Bypass, Salem',
    partName: 'Clutch Release Bearing Assembly',
    partNumber: 'VAL-804533',
    brand: 'Valeo OEM',
    compatibleVehicle: 'Tata Ace 2019 (All Variants)',
    coordinates: { lat: 11.6698, lng: 78.1320, x: 28, y: 55 },
    specialties: ['Valeo Authorized', 'Mahindra & Tata Spares', 'Brake & Clutch Specialists'],
  },
  {
    id: 'shop-3',
    shopName: 'ABC Auto Spares',
    isVerified: false,
    rating: 4.2,
    reviewsCount: 45,
    distanceKm: 5.7,
    stockCount: 0,
    stockStatus: 'out-of-stock',
    price: 920,
    lastUpdated: '12 min ago',
    openingHours: '9:00 AM - 7:30 PM',
    phone: '+91 98421 98765',
    address: '104, Omalur Main Road, Near Salem Railway Junction',
    area: 'Omalur Main Road, Salem',
    partName: 'OEM Clutch Bearing Unit',
    partNumber: 'NRB-CRB-1082',
    brand: 'NRB Bearings',
    compatibleVehicle: 'Tata Ace 2019',
    coordinates: { lat: 11.6850, lng: 78.1250, x: 68, y: 72 },
    specialties: ['General Spares', 'Commercial Vehicle Hardware', 'Engine Belts & Bearings'],
  },
];

export const getShopsForQuery = (params: Partial<SearchQueryParams> & { coords?: { lat: number; lng: number } }): ShopResult[] => {
  const make = params.make || 'Tata';
  const model = params.model || 'Ace';
  const year = params.year || '2019';
  const part = params.partName || 'Clutch Release Bearing';
  const city = params.city || 'Salem';
  const centerLat = params.coords?.lat || 11.6643;
  const centerLng = params.coords?.lng || 78.1460;

  const offsets = [
    { dLat: 0.008, dLng: -0.006, x: 42, y: 38 },
    { dLat: -0.012, dLng: 0.015, x: 28, y: 55 },
    { dLat: 0.018, dLng: 0.022, x: 68, y: 72 },
  ];

  // Dynamic brand generator matching vehicle make
  const getBrandForMake = (vehicleMake: string, idx: number): string => {
    switch (vehicleMake.toLowerCase()) {
      case 'toyota':
        return ['Toyota Genuine / Denso', 'Denso OEM Japan', 'Valeo Premium'][idx % 3];
      case 'mahindra':
        return ['Mahindra Genuine Spares', 'Bosch OEM India', 'Mando Automotive'][idx % 3];
      case 'maruti suzuki':
      case 'maruti':
        return ['Maruti Genuine Spares (MGP)', 'Bosch OEM', 'Lumax / Subros'][idx % 3];
      case 'tata':
        return ['Tata Genuine Spares', 'SKF Bearings OEM', 'Valeo OES'][idx % 3];
      case 'ashok leyland':
        return ['Ashok Leyland Genuine', 'Lucas-TVS OEM', 'Rane Holdings'][idx % 3];
      case 'hyundai':
        return ['Hyundai Mobis Genuine', 'Mando Korea', 'Bosch Tier-1'][idx % 3];
      case 'honda':
        return ['Honda Genuine Spares', 'Showa OEM', 'Nissin Japan'][idx % 3];
      default:
        return ['OEM Quality Spares', 'Tier-1 Certified', 'Authorized OES'][idx % 3];
    }
  };

  // Dynamic OEM Part number generator
  const getPartNumber = (vehicleMake: string, partTitle: string, idx: number): string => {
    if (params.partNumber && params.partNumber.trim() !== '') return params.partNumber.trim();
    
    const pLower = partTitle.toLowerCase();
    if (pLower.includes('alternator')) {
      if (vehicleMake.toLowerCase() === 'toyota') return ['TOY-27060-0L080', 'DEN-27060-8801', 'VAL-ALT-4920'][idx % 3];
      if (vehicleMake.toLowerCase() === 'tata') return ['TATA-ALT-2527-12V', 'LUCAS-2412-ALT', 'BOSCH-AL-0124'][idx % 3];
      return [`${vehicleMake.slice(0, 3).toUpperCase()}-ALT-12V75`, `BOSCH-ALT-${year}`, `LUCAS-ALT-90A`][idx % 3];
    }
    if (pLower.includes('brake') || pLower.includes('pad')) {
      if (vehicleMake.toLowerCase() === 'mahindra') return ['0303-BA-2210N', 'BOSCH-BP-4412', 'TVS-GIR-9901'][idx % 3];
      if (vehicleMake.toLowerCase() === 'toyota') return ['TOY-04465-0K280', 'DEN-BP-8812', 'BREM-BP-9920'][idx % 3];
      return [`${vehicleMake.slice(0, 3).toUpperCase()}-BP-2044`, `KBX-BP-${year}`, `TVS-BP-102`][idx % 3];
    }
    if (pLower.includes('clutch') || pLower.includes('bearing')) {
      return ['31210-87703', 'VAL-804533', 'NRB-CRB-1082'][idx % 3];
    }
    if (pLower.includes('filter')) {
      return ['2527-1813-0104', 'BOSCH-OF-0941', 'MANN-W712-43'][idx % 3];
    }

    const prefix = vehicleMake.slice(0, 3).toUpperCase();
    const code = Math.floor(1000 + idx * 420);
    return `${prefix}-${code}-${year}`;
  };

  // Return tailored shops with dynamically calculated coordinates & distances
  return SALEM_DEMO_SHOPS.map((shop, idx) => {
    const offset = offsets[idx % offsets.length];
    const shopLat = centerLat + offset.dLat;
    const shopLng = centerLng + offset.dLng;

    // Haversine / coordinate distance in km
    const dLat = (shopLat - centerLat) * 111;
    const dLng = (shopLng - centerLng) * 111 * Math.cos(centerLat * (Math.PI / 180));
    const distanceKm = Math.round(Math.max(Math.sqrt(dLat * dLat + dLng * dLng), 0.8) * 10) / 10;

    let price = shop.price;
    const pLower = part.toLowerCase();
    if (pLower.includes('filter')) price = [280, 320, 350][idx % 3];
    else if (pLower.includes('pad') || pLower.includes('brake')) price = [1150, 1280, 1340][idx % 3];
    else if (pLower.includes('alternator')) price = [4100, 4350, 4600][idx % 3];
    else if (pLower.includes('starter')) price = [3800, 3950, 4200][idx % 3];
    else if (pLower.includes('water pump') || pLower.includes('pump')) price = [1850, 1980, 2150][idx % 3];
    else if (pLower.includes('headlight') || pLower.includes('lamp')) price = [1450, 1600, 1720][idx % 3];

    const brand = getBrandForMake(make, idx);
    const partNumber = getPartNumber(make, part, idx);

    return {
      ...shop,
      distanceKm,
      coordinates: {
        lat: shopLat,
        lng: shopLng,
        x: offset.x,
        y: offset.y,
      },
      discoverySource: 'google_places' as const,
      stockVerificationNote: 'Stock not verified • Contact shop to confirm availability',
      partName: `${part} (${brand})`,
      partNumber,
      brand,
      compatibleVehicle: `${make} ${model} ${year}`,
      area: `${shop.area.split(',')[0]}, ${city}`,
      specialties: [`${make} OEM Spares`, `${brand} Authorized`, 'Express Counter Pickup'],
      price,
    };
  });
};

export const MOCK_SEARCH_RESULTS: PartSearchResult[] = [
  {
    id: 'res-1',
    partName: 'Clutch Release Bearing (Heavy Duty)',
    partNumber: 'TATA-2527-2500',
    brand: 'SKF / Tata Genuine Spares',
    compatibleVehicle: 'Tata Ace (Gold / HT / Mega / Dicor)',
    shopName: 'Sri Lakshmi Auto Spares',
    shopLocation: '5 Roads, Salem (1.8 km away)',
    distanceKm: 1.8,
    price: 850,
    inStock: true,
    stockCount: 2,
    lastUpdated: 'Updated 8 min ago',
    isVerified: true,
    rating: 4.8,
    reviewCount: 124,
    deliveryAvailable: true,
    deliveryTimeMins: 20,
  },
  {
    id: 'res-2',
    partName: 'Clutch Release Bearing Assembly',
    partNumber: 'VAL-804533',
    brand: 'Valeo OEM',
    compatibleVehicle: 'Tata Ace / Super Ace HT',
    shopName: 'Kumar Automobiles',
    shopLocation: 'Meyyanur Bypass, Salem (3.4 km away)',
    distanceKm: 3.4,
    price: 890,
    inStock: true,
    stockCount: 1,
    lastUpdated: 'Updated 21 min ago',
    isVerified: true,
    rating: 4.6,
    reviewCount: 89,
    deliveryAvailable: true,
    deliveryTimeMins: 35,
  },
  {
    id: 'res-3',
    partName: 'OEM Clutch Bearing Unit',
    partNumber: 'NRB-CRB-1082',
    brand: 'NRB Bearings',
    compatibleVehicle: 'Tata Ace Zip / Ace HT 0.7L',
    shopName: 'ABC Auto Spares',
    shopLocation: 'Omalur Main Rd, Salem (5.7 km away)',
    distanceKm: 5.7,
    price: 920,
    inStock: false,
    stockCount: 0,
    lastUpdated: 'Updated 12 min ago',
    isVerified: false,
    rating: 4.2,
    reviewCount: 45,
    deliveryAvailable: false,
    deliveryTimeMins: 0,
  },
];

export const generateDynamicResults = (params: Partial<SearchQueryParams>): PartSearchResult[] => {
  const make = params.make || 'Tata';
  const model = params.model || 'Ace';
  const year = params.year || '2019';
  const part = params.partName || 'Clutch Release Bearing';
  const city = params.city || 'Salem';

  const vehicleStr = `${make} ${model} (${year})`;

  return [
    {
      id: 'res-1',
      partName: `${part} (Heavy Duty OEM Spec)`,
      partNumber: 'TATA-2527-2500',
      brand: 'SKF / Tata Genuine Spares',
      compatibleVehicle: vehicleStr,
      shopName: 'Sri Lakshmi Auto Spares',
      shopLocation: `5 Roads, ${city} (1.8 km away)`,
      distanceKm: 1.8,
      price: 850,
      inStock: true,
      stockCount: 2,
      lastUpdated: 'Updated 8 min ago',
      isVerified: true,
      rating: 4.8,
      reviewCount: 124,
      deliveryAvailable: true,
      deliveryTimeMins: 20,
    },
    {
      id: 'res-2',
      partName: `Premium ${part} Kit`,
      partNumber: 'VAL-804533',
      brand: 'Valeo OEM',
      compatibleVehicle: vehicleStr,
      shopName: 'Kumar Automobiles',
      shopLocation: `Meyyanur Bypass, ${city} (3.4 km away)`,
      distanceKm: 3.4,
      price: 890,
      inStock: true,
      stockCount: 1,
      lastUpdated: 'Updated 21 min ago',
      isVerified: true,
      rating: 4.6,
      reviewCount: 89,
      deliveryAvailable: true,
      deliveryTimeMins: 35,
    },
    {
      id: 'res-3',
      partName: `Standard Replacement ${part}`,
      partNumber: 'NRB-CRB-1082',
      brand: 'NRB Bearings',
      compatibleVehicle: vehicleStr,
      shopName: 'ABC Auto Spares',
      shopLocation: `Omalur Main Rd, ${city} (5.7 km away)`,
      distanceKm: 5.7,
      price: 920,
      inStock: false,
      stockCount: 0,
      lastUpdated: 'Updated 12 min ago',
      isVerified: false,
      rating: 4.2,
      reviewCount: 45,
      deliveryAvailable: false,
      deliveryTimeMins: 0,
    },
  ];
};

export const STATS_DATA: StatItem[] = [
  {
    id: 'parts',
    value: '2,847+',
    label: 'Parts Listed',
    sublabel: 'OEM & OES cross-referenced parts in live inventory',
    iconName: 'Boxes',
  },
  {
    id: 'shops',
    value: '426',
    label: 'Verified Shops',
    sublabel: 'Vetted distributors & trusted neighborhood retailers',
    iconName: 'ShieldCheck',
  },
  {
    id: 'time',
    value: '18 min',
    label: 'Average Search Time',
    sublabel: 'Down from 2.5 hours of manual shop calling',
    iconName: 'Timer',
  },
  {
    id: 'satisfaction',
    value: '98%',
    label: 'Customer Satisfaction',
    sublabel: 'Mechanics & fleet owners rated 4.8/5 on speed',
    iconName: 'TrendingUp',
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    stepNumber: '01',
    title: 'Search',
    tagline: 'Instant Vehicle & Part Match',
    description: 'Select your vehicle make, model, or enter the exact part number. PartFinder instantly cross-references compatible OEM and aftermarket part variants.',
    icon: 'Search',
    highlight: 'Vehicle-specific OEM compatibility',
  },
  {
    stepNumber: '02',
    title: 'Compare',
    tagline: 'Live Inventory & Distance',
    description: 'View nearby spare parts shops with confirmed stock counts, live timestamped inventory updates, transparent pricing, and distance from your garage bay.',
    icon: 'Layers',
    highlight: 'Live timestamps (e.g., "Updated 4m ago")',
  },
  {
    stepNumber: '03',
    title: 'Reserve',
    tagline: 'Guaranteed Counter Hold',
    description: 'Lock in the part with a single tap. The seller gets immediate notification and holds the exact item behind the counter so it is never sold out while you drive.',
    icon: 'CheckCircle2',
    highlight: 'Zero risk of wasted round trips',
  },
  {
    stepNumber: '04',
    title: 'Track',
    tagline: 'Pickup or Workshop Delivery',
    description: 'Choose instant counter pickup with QR handover or request express motorbike/van delivery straight to your workshop with real-time ETA dispatch.',
    icon: 'Truck',
    highlight: 'Live ETA & doorstep drop-off',
  },
];

export const FEATURES_DATA: FeatureCard[] = [
  {
    id: 'nearby-stock',
    title: 'Nearby Stock',
    tagline: 'Hyperlocal Real-time Inventory',
    description: 'Know exactly who has the part within 5 km before leaving your repair bay. Every stock item displays an active timestamp so you never chase ghost inventory.',
    badge: 'Live Stock Engine',
    icon: 'MapPin',
    statBadge: 'Real-time Stock Timestamps',
  },
  {
    id: 'verified-shops',
    title: 'Verified Shops',
    tagline: '100% Vetted Distributors',
    description: 'Every parts retailer is physically verified and categorized by OEM/OES brand specialties (Tata, Mahindra, Hyundai, Maruti, Commercial & Heavy Duty).',
    badge: 'Quality Assurance',
    icon: 'BadgeCheck',
    statBadge: '426+ Vetted Retailers',
  },
  {
    id: 'fast-reservation',
    title: 'Fast Reservation',
    tagline: 'Instant 1-Click Hold',
    description: 'Reserve critical components instantly while the vehicle is on your lift. Your parts are set aside in the shop staging area with a unique reservation code.',
    badge: 'Zero Waiting',
    icon: 'Clock',
    statBadge: '< 60 Sec Hold Confirmation',
  },
  {
    id: 'workshop-delivery',
    title: 'Workshop Delivery',
    tagline: 'Direct-to-Bay Dispatch',
    description: 'Keep your mechanics turning wrenches instead of running parts errands. On-demand express couriers deliver parts directly to your garage work bay in under 30 minutes.',
    badge: 'Fleet Logistics',
    icon: 'Zap',
    statBadge: 'Avg 25 min Delivery',
  },
];
