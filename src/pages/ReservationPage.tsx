import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Store, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Car, 
  Wrench, 
  ChevronLeft, 
  Phone, 
  Check, 
  Minus, 
  Plus, 
  ArrowRight, 
  MapPin, 
  User, 
  Building2, 
  RotateCcw,
  Hourglass,
  FileText
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ReservationOrder } from '../types';
import { useAuth } from '../context/AuthContext';

export const ReservationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read URL params with exact requested defaults
  const shopName = searchParams.get('shopName') || 'Sri Lakshmi Auto Spares';
  const vehicle = searchParams.get('vehicle') || 'Tata Ace 2019';
  const partName = searchParams.get('partName') || 'Clutch Release Bearing';
  const partNumber = searchParams.get('partNumber') || '31210-87703';
  const price = Number(searchParams.get('price')) || 850;
  const availableUnits = Number(searchParams.get('stock')) || 2;
  const shopAddress = searchParams.get('address') || '14/B, 5 Roads Main Junction, Salem';
  const shopPhone = searchParams.get('phone') || '+91 98427 11223';
  const discoverySource = searchParams.get('discoverySource') || 'partfinder_verified';

  const { user } = useAuth();
  const isGooglePlace = discoverySource === 'google_places';

  // Interactive State
  const [quantity, setQuantity] = useState<number>(1);
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  
  // Contact info state with auth fallback
  const [mechanicName, setMechanicName] = useState(user?.name || 'Ramesh Kumar');
  const [mechanicPhone, setMechanicPhone] = useState(user?.phone || '+91 98420 77890');
  const [workshopName, setWorkshopName] = useState(user?.workshopName || 'Apex Auto Workshop & Garage');
  const [workshopLocation, setWorkshopLocation] = useState(user?.location || 'Plot 4A, Auto Nagar Industrial Area, Salem');

  // Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ReservationOrder | null>(null);

  // Error validation
  const [errors, setErrors] = useState<{
    mechanicName?: string;
    mechanicPhone?: string;
    workshopName?: string;
    workshopLocation?: string;
  }>({});

  // Pricing calculations
  const deliveryFee = fulfillmentType === 'delivery' ? 50 : 0;
  const subtotal = price * quantity;
  const totalPrice = subtotal + deliveryFee;

  const handleIncrement = () => {
    if (quantity < availableUnits) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      mechanicName?: string;
      mechanicPhone?: string;
      workshopName?: string;
      workshopLocation?: string;
    } = {};

    if (!mechanicName.trim()) newErrors.mechanicName = 'Mechanic name is required';
    if (!mechanicPhone.trim()) newErrors.mechanicPhone = 'Phone number is required';
    if (!workshopName.trim()) newErrors.workshopName = 'Workshop name is required';
    if (!workshopLocation.trim()) newErrors.workshopLocation = 'Workshop location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const generatedId = 'PF-RES-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 60 * 1000); // 30 mins

    const newOrder: ReservationOrder = {
      id: generatedId,
      shopName,
      vehicle,
      partName,
      partNumber,
      pricePerUnit: price,
      quantity,
      deliveryFee,
      totalPrice,
      fulfillmentType,
      deliveryAddress: fulfillmentType === 'delivery' ? workshopLocation : undefined,
      deliveryDistanceKm: 2.4,
      deliveryEtaMins: 25,
      mechanicName: mechanicName.trim(),
      mechanicPhone: mechanicPhone.trim(),
      workshopName: workshopName.trim(),
      workshopLocation: workshopLocation.trim(),
      status: 'request_sent',
      createdAt: 'Just now',
      expiresAt: expiry.toISOString(),
      shopPhone,
      shopAddress,
      estimatedConfirmationTime: '< 2 mins',
      driver: {
        name: 'Murugan K.',
        phone: '+91 98421 88990',
        vehicleModel: 'Bajaj Pulsar 150 (TN-54-AB-2940)',
        rating: 4.9,
      },
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedOrder(newOrder);
      // Persist in active order & shared reservations
      localStorage.setItem('partfinder_active_order', JSON.stringify(newOrder));
      
      const savedOrders = localStorage.getItem('partfinder_reservations');
      let currentList: ReservationOrder[] = [];
      if (savedOrders) {
        try { currentList = JSON.parse(savedOrders); } catch (err) { console.error(err); }
      }
      localStorage.setItem('partfinder_reservations', JSON.stringify([newOrder, ...currentList]));

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleViewOrder = () => {
    if (confirmedOrder) {
      navigate(`/track/${confirmedOrder.id}`);
    } else {
      navigate('/track-order');
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-navy-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Link */}
        {!confirmedOrder && (
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Search Results</span>
            </button>
          </div>
        )}

        {!confirmedOrder ? (
          /* ================= RESERVATION FORM ================= */
          <div className="space-y-6">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant 30-Minute Counter Reservation</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Reserve Spare Part
              </h1>
              <p className="text-sm text-slate-300 mt-2">
                Lock this item in the shop staging area. Pay only upon counter pickup or bay delivery.
              </p>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-6">
              
              {/* 1. RESERVATION SUMMARY CARD */}
              <div className="bg-navy-900/90 rounded-3xl border border-slate-700/80 p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-brand-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Reservation Summary
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Duration: 30 minutes hold</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Specs */}
                  <div className="md:col-span-8 space-y-3">
                    
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-0.5">Part</span>
                      <h3 className="text-xl font-black text-white">{partName}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                        <span className="text-slate-500 block mb-0.5">Vehicle</span>
                        <div className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                          <span>{vehicle}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                        <span className="text-slate-500 block mb-0.5">Part Number</span>
                        <div className="font-bold font-mono text-slate-200">
                          #{partNumber}
                        </div>
                      </div>
                    </div>

                    {/* Shop details */}
                    <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 flex items-center justify-between gap-3 text-xs flex-wrap">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-bold text-white block">{shopName}</span>
                          <span className="text-[11px] text-slate-400">{shopAddress}</span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${
                        isGooglePlace 
                          ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' 
                          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      }`}>
                        {isGooglePlace ? 'Google Maps Discovered Counter' : 'PartFinder Verified Counter'}
                      </span>
                    </div>

                    {isGooglePlace && (
                      <div className="p-2.5 rounded-xl bg-navy-950 border border-amber-500/30 text-[11px] text-amber-300">
                        ⚡ <strong>Note:</strong> Exact stock availability and final counter price must be confirmed by the shop upon request acceptance.
                      </div>
                    )}

                  </div>

                  {/* Right Quantity & Price Calculator */}
                  <div className="md:col-span-4 p-5 rounded-2xl bg-navy-950 border border-slate-800 flex flex-col justify-between space-y-4">
                    
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Price per unit:</span>
                        <span className="text-white font-bold">₹{price}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                        <span>Stock status:</span>
                        <span className="text-emerald-400 font-bold">
                          {isGooglePlace ? 'Verify with Shop' : `${availableUnits} units on shelf`}
                        </span>
                      </div>

                      {/* QUANTITY SELECTOR */}
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1.5">
                          Quantity:
                        </label>
                        <div className="flex items-center justify-between bg-navy-900 border border-slate-700 rounded-xl p-1.5">
                          <button
                            type="button"
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                            className="w-8 h-8 rounded-lg bg-navy-950 hover:bg-slate-800 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors focus:outline-none"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="text-base font-black text-white px-3 font-mono">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={handleIncrement}
                            disabled={quantity >= availableUnits}
                            className="w-8 h-8 rounded-lg bg-navy-950 hover:bg-slate-800 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors focus:outline-none"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="pt-3 border-t border-slate-800 text-right">
                      <span className="text-[11px] text-slate-400">Subtotal ({quantity} {quantity === 1 ? 'unit' : 'units'})</span>
                      <div className="text-2xl font-black text-white">
                        ₹{subtotal}
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* 2. FULFILLMENT METHOD SELECTION */}
              <div className="bg-navy-900/90 rounded-3xl border border-slate-700/80 p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Select Fulfillment Option</h3>
                  <span className="text-xs text-slate-400">Choose how to receive the part</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Option 1: Pickup from Shop */}
                  <div
                    onClick={() => setFulfillmentType('pickup')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      fulfillmentType === 'pickup'
                        ? 'border-brand-500 bg-brand-500/10 shadow-glow-sm'
                        : 'border-slate-800 bg-navy-950 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                          <Store className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                          Free
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">Pickup from Shop</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Drive over to the shop counter. The part is kept aside behind the counter with guaranteed hold.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ready for immediate counter pickup</span>
                    </div>
                  </div>

                  {/* Option 2: Deliver to Workshop */}
                  <div
                    onClick={() => setFulfillmentType('delivery')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      fulfillmentType === 'delivery'
                        ? 'border-brand-500 bg-brand-500/10 shadow-glow-sm'
                        : 'border-slate-800 bg-navy-950 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                          <Truck className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-blue-400 bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-500/25">
                          +₹50 Express
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">Deliver to Workshop</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Stay at your workshop bay. An on-demand courier picks up the part and delivers directly to your garage.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-blue-400 flex items-center gap-1.5 font-semibold">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Estimated Doorstep ETA: ~25 mins</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. CONTACT INFORMATION */}
              <div className="bg-navy-900/90 rounded-3xl border border-slate-700/80 p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-white">Contact Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Mechanic Name */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Mechanic Name <span className="text-brand-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={mechanicName}
                      onChange={(e) => {
                        setMechanicName(e.target.value);
                        if (errors.mechanicName) setErrors(prev => ({ ...prev, mechanicName: undefined }));
                      }}
                      placeholder="e.g. Ramesh Kumar"
                      className={`w-full bg-navy-950 text-white text-sm px-4 py-3 rounded-xl border ${
                        errors.mechanicName ? 'border-red-500' : 'border-slate-700 focus:border-brand-500'
                      } focus:outline-none transition-all`}
                    />
                    {errors.mechanicName && <span className="text-xs text-red-400 mt-1">{errors.mechanicName}</span>}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number <span className="text-brand-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={mechanicPhone}
                      onChange={(e) => {
                        setMechanicPhone(e.target.value);
                        if (errors.mechanicPhone) setErrors(prev => ({ ...prev, mechanicPhone: undefined }));
                      }}
                      placeholder="+91 98420 XXXXX"
                      className={`w-full bg-navy-950 text-white text-sm px-4 py-3 rounded-xl border ${
                        errors.mechanicPhone ? 'border-red-500' : 'border-slate-700 focus:border-brand-500'
                      } focus:outline-none transition-all`}
                    />
                    {errors.mechanicPhone && <span className="text-xs text-red-400 mt-1">{errors.mechanicPhone}</span>}
                  </div>

                  {/* Workshop Name */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> Workshop Name <span className="text-brand-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={workshopName}
                      onChange={(e) => {
                        setWorkshopName(e.target.value);
                        if (errors.workshopName) setErrors(prev => ({ ...prev, workshopName: undefined }));
                      }}
                      placeholder="e.g. Apex Auto Workshop"
                      className={`w-full bg-navy-950 text-white text-sm px-4 py-3 rounded-xl border ${
                        errors.workshopName ? 'border-red-500' : 'border-slate-700 focus:border-brand-500'
                      } focus:outline-none transition-all`}
                    />
                    {errors.workshopName && <span className="text-xs text-red-400 mt-1">{errors.workshopName}</span>}
                  </div>

                  {/* Workshop Location */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Workshop Location <span className="text-brand-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={workshopLocation}
                      onChange={(e) => {
                        setWorkshopLocation(e.target.value);
                        if (errors.workshopLocation) setErrors(prev => ({ ...prev, workshopLocation: undefined }));
                      }}
                      placeholder="e.g. Auto Nagar, Salem"
                      className={`w-full bg-navy-950 text-white text-sm px-4 py-3 rounded-xl border ${
                        errors.workshopLocation ? 'border-red-500' : 'border-slate-700 focus:border-brand-500'
                      } focus:outline-none transition-all`}
                    />
                    {errors.workshopLocation && <span className="text-xs text-red-400 mt-1">{errors.workshopLocation}</span>}
                  </div>

                </div>
              </div>

              {/* 4. TOTAL & CONFIRM BUTTON */}
              <div className="bg-navy-900/90 rounded-3xl border border-brand-500/30 p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400">Total Payable at Counter/Drop</span>
                    <div className="text-3xl font-black text-white flex items-baseline gap-2">
                      <span>₹{totalPrice}</span>
                      <span className="text-xs font-normal text-slate-400">
                        ({quantity} x ₹{price}{fulfillmentType === 'delivery' ? ' + ₹50 delivery' : ''})
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 self-start sm:self-auto">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Zero upfront payment needed</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full py-4 text-base sm:text-lg font-bold shadow-2xl shadow-brand-600/30 rounded-2xl group flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="w-5 h-5 animate-spin" />
                      <span>Sending Reservation Request to Shop...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Confirm Reservation</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        ) : (
          /* ================= SUCCESS STATE ================= */
          <div className="space-y-6 animate-fade-in">
            
            <div className="bg-gradient-to-b from-navy-900 via-navy-850 to-navy-950 rounded-3xl border border-emerald-500/40 p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
              
              {/* Top status icon */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              {/* Exact required headline */}
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Reservation Request Sent!
              </h2>

              {/* Exact required status badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mt-3 shadow-sm">
                <Hourglass className="w-3.5 h-3.5 animate-spin" />
                <span>Status: Waiting for shop confirmation</span>
              </div>

              <p className="text-sm text-slate-300 max-w-lg mx-auto mt-3 leading-relaxed">
                We have notified <strong>{shopName}</strong>. The shop is verifying the physical stock count and preparing your reservation hold.
              </p>

              {/* RESERVATION ID & ESTIMATED CONFIRMATION TIME */}
              <div className="my-7 p-6 rounded-2xl bg-navy-950/90 border-2 border-dashed border-emerald-500/40 max-w-md mx-auto space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Reservation ID
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-widest">
                  {confirmedOrder.id}
                </div>
                
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Estimated confirmation time:</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{confirmedOrder.estimatedConfirmationTime}</span>
                  </span>
                </div>
              </div>

              {/* 4-STEP TIMELINE AS SPECIFIED IN PROMPT */}
              <div className="bg-navy-950 p-6 rounded-2xl border border-slate-800 max-w-xl mx-auto text-left mb-8">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
                  Live Reservation Progression
                </span>

                <div className="space-y-4 relative">
                  
                  {/* Step 1: Request Sent */}
                  <div className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-md shadow-emerald-500/30">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-emerald-400">1. Request Sent</div>
                      <div className="text-[11px] text-slate-400">Reservation request successfully dispatched to shop desk.</div>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="w-0.5 h-4 bg-emerald-500 ml-3.5 -my-2" />

                  {/* Step 2: Shop Confirmation */}
                  <div className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 animate-pulse">
                      <Hourglass className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-amber-400">2. Shop Confirmation</div>
                      <div className="text-[11px] text-slate-300 font-medium">Shop counter is currently confirming physical stock & hold ticket.</div>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="w-0.5 h-4 bg-slate-800 ml-3.5 -my-2" />

                  {/* Step 3: Ready for Pickup */}
                  <div className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full bg-navy-900 border border-slate-700 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-400">
                        {confirmedOrder.fulfillmentType === 'delivery' ? '3. Dispatched for Delivery' : '3. Ready for Pickup'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {confirmedOrder.fulfillmentType === 'delivery' ? 'Courier assigned for workshop drop-off.' : 'Counter hold ticket active for pickup.'}
                      </div>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="w-0.5 h-4 bg-slate-800 ml-3.5 -my-2" />

                  {/* Step 4: Delivered */}
                  <div className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full bg-navy-900 border border-slate-700 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      4
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-400">
                        {confirmedOrder.fulfillmentType === 'delivery' ? '4. Delivered to Workshop' : '4. Collected at Counter'}
                      </div>
                      <div className="text-[11px] text-slate-500">Receipt and payment finalized.</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2 text-slate-300 mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-400">Item:</span>
                  <span className="text-white font-bold">{confirmedOrder.partName} ({confirmedOrder.quantity}x)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="text-slate-200">{confirmedOrder.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shop Counter:</span>
                  <span className="text-brand-300 font-semibold">{confirmedOrder.shopName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fulfillment:</span>
                  <span className="text-emerald-400 font-bold">
                    {confirmedOrder.fulfillmentType === 'delivery' ? 'Deliver to Workshop' : 'Pickup from Shop'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="text-white font-black">₹{confirmedOrder.totalPrice}</span>
                </div>
              </div>

              {/* EXACT REQUIRED "View Order" BUTTON */}
              <div className="max-w-md mx-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full py-4 text-base font-bold shadow-2xl shadow-brand-600/30 rounded-2xl group flex items-center justify-center gap-3"
                  onClick={handleViewOrder}
                >
                  <FileText className="w-5 h-5" />
                  <span>View Order</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
