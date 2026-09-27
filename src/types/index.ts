export type UserRole = 'MECHANIC' | 'SHOP' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  workshopName?: string;
  shopName?: string;
  location?: string;
  avatarUrl?: string;
  joinedDate?: string;
}

export interface VehicleOption {
  id: string;
  name: string;
  category: 'Commercial' | 'Passenger' | 'Heavy Vehicle' | 'Two-Wheeler';
}

export interface SearchQueryParams {
  make: string;
  model: string;
  year: string;
  partName: string;
  partNumber?: string;
  city: string;
  radius: string;
}

export type StockStatus = 'in-stock' | 'limited-stock' | 'out-of-stock' | 'unverified';

export type DiscoverySource = 'google_places' | 'partfinder_verified' | 'demo';

export interface GooglePlace {
  id: string;
  displayName?: {
    text: string;
    languageCode?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  googleMapsUri?: string;
  businessStatus?: string;
  currentOpeningHours?: {
    openNow?: boolean;
    weekdayDescriptions?: string[];
  };
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  primaryType?: string;
  types?: string[];
}

export interface GooglePlacesSearchResponse {
  places?: GooglePlace[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

export interface ShopResult {
  id: string;
  shopName: string;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  stockCount: number;
  stockStatus: StockStatus;
  price: number;
  lastUpdated: string;
  openingHours: string;
  phone: string;
  address: string;
  area: string;
  partName: string;
  partNumber: string;
  brand: string;
  compatibleVehicle: string;
  coordinates: {
    lat: number;
    lng: number;
    x: number;
    y: number;
  };
  specialties: string[];
  googleMapsUri?: string;
  discoverySource?: DiscoverySource;
  businessStatus?: string;
  isOpenNow?: boolean;
  phoneAvailable?: boolean;
  stockVerificationNote?: string;
}

export interface PartSearchResult {
  id: string;
  partName: string;
  partNumber: string;
  brand: string;
  compatibleVehicle: string;
  shopName: string;
  shopLocation: string;
  distanceKm: number;
  price: number;
  inStock: boolean;
  stockCount: number;
  lastUpdated: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  deliveryAvailable: boolean;
  deliveryTimeMins: number;
}

export type OrderStatus = 'request_sent' | 'shop_confirmed' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'rejected';

export interface DriverInfo {
  name: string;
  phone: string;
  vehicleModel: string;
  rating: number;
  photoUrl?: string;
  currentLocationDesc?: string;
}

export interface ReservationOrder {
  id: string;
  shopName: string;
  shopId?: string;
  vehicle: string;
  partName: string;
  partNumber: string;
  pricePerUnit: number;
  quantity: number;
  deliveryFee: number;
  totalPrice: number;
  fulfillmentType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryDistanceKm?: number;
  deliveryEtaMins?: number;
  driver?: DriverInfo;
  mechanicId?: string;
  mechanicName: string;
  mechanicPhone: string;
  workshopName: string;
  workshopLocation: string;
  status: OrderStatus;
  createdAt: string;
  expiresAt: string;
  shopPhone: string;
  shopAddress: string;
  estimatedConfirmationTime: string;
}

export interface ShopInventoryItem {
  id: string;
  partName: string;
  vehicle: string;
  partNumber: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

export interface ShopReservationRequest {
  id: string;
  mechanicName: string;
  workshopName: string;
  vehicle: string;
  partName: string;
  partNumber: string;
  quantity: number;
  price: number;
  timeAgo: string;
  fulfillment: string;
  status: 'Pending' | 'Confirmed' | 'Rejected';
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  sublabel: string;
  iconName: string;
}

export interface HowItWorksStep {
  stepNumber: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  highlight: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  icon: string;
  statBadge?: string;
}

export interface AdminStats {
  totalMechanics: number;
  totalShops: number;
  totalParts: number;
  activeReservations: number;
  activeDeliveries: number;
  completedOrders: number;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  type: 'reservation' | 'order' | 'inventory' | 'user';
  description: string;
  user: string;
  location: string;
}
