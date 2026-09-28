import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  MapPin, 
  Car, 
  Calendar, 
  Wrench, 
  Plus, 
  Minus, 
  Truck, 
  Store, 
  X, 
  ArrowRight,
  Sparkles,
  AlertCircle,
  Crosshair,
  CheckCircle2,
  BookmarkCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import { POPULAR_MAKES, MODELS_BY_MAKE, VEHICLE_YEARS, POPULAR_CITIES } from '../../data/mockData';
import { resolveCityCoordinates } from '../../services/googlePlaces';

interface InstantPartRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NearbyShopQuote {
  id: string;
  shopName: string;
  distanceKm: number;
  address: string;
  availabilityNote: string;
  price: number;
  phone: string;
  rating: number;
}

export const InstantPartRequestModal: React.FC<InstantPartRequestModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Form states initialized with requested defaults
  const [vehicleMake, setVehicleMake] = useState('Tata');
  const [vehicleModel, setVehicleModel] = useState('Ace');
  const [year, setYear] = useState('2019');
  const [partName, setPartName] = useState('Clutch Release Bearing');
  const [quantity, setQuantity] = useState<number>(1);
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [locationName, setLocationName] = useState('Current Location (Salem)');
  const [locationMode, setLocationMode] = useState<'gps' | 'city'>('gps');

  // Request status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [nearbyResults, setNearbyResults] = useState<NearbyShopQuote[]>([]);

  if (!isOpen) return null;

  const availableModels = MODELS_BY_MAKE[vehicleMake] || ['Ace'];

  const handleMakeChange = (newMake: string) => {
    setVehicleMake(newMake);
    const models = MODELS_BY_MAKE[newMake];
    if (models && models.length > 0) {
      setVehicleModel(models[0]);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock quick ping across nearby shops
    setTimeout(() => {
      setIsSubmitting(false);
      setRequestSent(true);

      const generatedQuotes: NearbyShopQuote[] = [
        {
          id: 'shop-1',
          shopName: 'Sri Lakshmi Auto Spares',
          distanceKm: 1.8,
          address: 'No. 14, 5 Roads Junction, Salem',
          availabilityNote: 'Availability not verified',
          price: 850,
          phone: '+91 98427 11223',
          rating: 4.8,
        },
        {
          id: 'shop-2',
          shopName: 'Kumar Automobiles',
          distanceKm: 3.4,
          address: 'Omalur Main Road, Meyyanur, Salem',
          availabilityNote: 'Availability not verified',
          price: 820,
          phone: '+91 94432 55667',
          rating: 4.6,
        },
        {
          id: 'shop-3',
          shopName: 'ABC Auto Spares & Bearing House',
          distanceKm: 4.9,
          address: 'Trichy Main Road, Dadagapatty, Salem',
          availabilityNote: 'Availability not verified',
          price: 900,
          phone: '+91 98420 44332',
          rating: 4.7,
        },
      ];

      setNearbyResults(generatedQuotes);
    }, 700);
  };

  const handleReserveFromShop = (shop: NearbyShopQuote) => {
    const query = new URLSearchParams({
      shopId: shop.id,
      shopName: shop.shopName,
      partName: partName,
      partNumber: '31210-87703',
      price: (shop.price * quantity).toString(),
      vehicle: `${vehicleMake} ${vehicleModel} ${year}`,
      distance: shop.distanceKm.toString(),
      address: shop.address,
      phone: shop.phone,
      stock: '2',
      fulfillment: fulfillmentType,
      quantity: quantity.toString(),
      discoverySource: 'instant_request',
    });
    onClose();
    navigate(`/reservation?${query.toString()}`);
  };

  const handleOpenFullSearch = () => {
    const resolved = resolveCityCoordinates('Salem');
    const query = new URLSearchParams({
      make: vehicleMake,
      model: vehicleModel,
      year: year,
      part: partName,
      city: locationName,
      radius: '10',
      lat: resolved.lat.toString(),
      lng: resolved.lng.toString(),
      locMode: locationMode === 'gps' ? 'gps' : 'manual',
      t: Date.now().toString(),
    });
    onClose();
    navigate(`/search-results?${query.toString()}`);
  };

  const handleResetForm = () => {
    setRequestSent(false);
    setNearbyResults([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-navy-900 border border-slate-700/80 rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden my-8">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-brand-600 to-indigo-600 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Send className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Instant Broadcast Network</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Instant Part Request
              </h3>
              <p className="text-xs text-slate-400">
                Broadcast an urgent spare part request directly to verified nearby shops.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-navy-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10">
          {!requestSent ? (
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                {/* Vehicle Make & Model */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-brand-400" />
                    Vehicle Make & Model
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={vehicleMake}
                      onChange={(e) => handleMakeChange(e.target.value)}
                      className="bg-navy-950 text-white text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      {POPULAR_MAKES.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="Model (e.g. Ace)"
                      className="bg-navy-950 text-white text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                      list="instant-request-models"
                    />
                    <datalist id="instant-request-models">
                      {availableModels.map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Manufacturing Year */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-navy-950 text-white text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    {VEHICLE_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Part Name & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                    Part Name
                  </label>
                  <input
                    type="text"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder="e.g. Clutch Release Bearing"
                    className="w-full bg-navy-950 text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                {/* Quantity Counter */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center bg-navy-950 rounded-xl border border-slate-700 p-1">
                    <button
                      type="button"
                      onClick={handleDecreaseQuantity}
                      className="p-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={handleIncreaseQuantity}
                      className="p-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pickup / Delivery Toggle */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Fulfillment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('pickup')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      fulfillmentType === 'pickup'
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-navy-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Counter Pickup (Free)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType('delivery')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      fulfillmentType === 'delivery'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                        : 'bg-navy-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Workshop Delivery (+₹50)</span>
                  </button>
                </div>
              </div>

              {/* Location Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Location
                  </label>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        setLocationMode('gps');
                        setLocationName('Current Location (Salem)');
                      }}
                      className={`px-2 py-0.5 rounded ${locationMode === 'gps' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      Current Location
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationMode('city');
                        setLocationName('Salem Auto Cluster');
                      }}
                      className={`px-2 py-0.5 rounded ${locationMode === 'city' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      City Hub
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Current Location or Salem Auto Cluster"
                    className="w-full bg-navy-950 text-white text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    list="instant-request-cities"
                  />
                  <datalist id="instant-request-cities">
                    {POPULAR_CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Crosshair className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                </div>
              </div>

              {/* Submit Request Button */}
              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-sm font-bold shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Broadcasting to Nearby Auto Shops...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Request From Nearby Shops</span>
                    </>
                  )}
                </Button>
              </div>

            </form>
          ) : (
            /* Request Sent & Matching Results View */
            <div className="space-y-4 animate-scale-up">
              
              {/* Summary Bar */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white">Broadcast Complete: </span>
                    <span className="text-emerald-300">{vehicleMake} {vehicleModel} {year} • {partName} ({quantity} unit{quantity > 1 ? 's' : ''})</span>
                  </div>
                </div>
                <button
                  onClick={handleResetForm}
                  className="text-[11px] font-semibold text-slate-400 hover:text-white underline ml-2"
                >
                  Edit
                </button>
              </div>

              {/* List of Nearby Shops with availability note, price, distance, and reserve button */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                  <span>Available Nearby Shops ({nearbyResults.length})</span>
                  <span className="text-brand-400 font-mono text-[11px]">Radius: ~5 km</span>
                </div>

                {nearbyResults.map((shop) => (
                  <div
                    key={shop.id}
                    className="p-4 rounded-2xl bg-navy-950 border border-slate-700/80 hover:border-brand-500/50 transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-brand-400 shrink-0" />
                        <span className="font-bold text-white text-sm">{shop.shopName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                          {shop.distanceKm} km away
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center gap-1 pl-6">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate max-w-sm">{shop.address}</span>
                      </div>

                      <div className="text-[11px] text-amber-400/90 font-medium pl-6 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>{shop.availabilityNote}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <div className="text-right">
                        <div className="text-base font-black text-white">
                          ₹{shop.price * quantity}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ₹{shop.price}/unit • {fulfillmentType === 'delivery' ? '+₹50 delivery' : 'pickup'}
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs font-bold px-4 py-2"
                        icon={<BookmarkCheck className="w-3.5 h-3.5" />}
                        onClick={() => handleReserveFromShop(shop)}
                      >
                        Reserve Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* View Full Interactive Search Results Button */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
                <span className="text-xs text-slate-400">Want full map view & all 400+ Salem retailers?</span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs font-semibold"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={handleOpenFullSearch}
                >
                  Open Full Search
                </Button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
