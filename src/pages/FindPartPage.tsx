import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Car, 
  Wrench, 
  MapPin, 
  Search, 
  Sparkles, 
  AlertCircle, 
  Calendar, 
  Hash, 
  Radio, 
  ShieldCheck, 
  Clock, 
  RotateCcw,
  ArrowRight,
  Crosshair,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { 
  POPULAR_MAKES, 
  MODELS_BY_MAKE, 
  VEHICLE_YEARS, 
  QUICK_SEARCH_SUGGESTIONS, 
  POPULAR_CITIES, 
  RADIUS_OPTIONS 
} from '../data/mockData';
import { resolveCityCoordinates } from '../services/googlePlaces';

export const FindPartPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form State
  const [make, setMake] = useState(searchParams.get('make') || 'Tata');
  const [model, setModel] = useState(searchParams.get('model') || 'Ace');
  const [year, setYear] = useState(searchParams.get('year') || '2019');
  const [partName, setPartName] = useState(searchParams.get('part') || 'Clutch Release Bearing');
  const [partNumber, setPartNumber] = useState(searchParams.get('partNumber') || '');
  const [city, setCity] = useState(searchParams.get('city') || 'Salem');
  const [radius, setRadius] = useState(searchParams.get('radius') || '10');

  // Location Selection Mode: 'gps' (browser geolocation) or 'manual' (custom city)
  const [locationMode, setLocationMode] = useState<'gps' | 'manual'>(
    searchParams.get('locMode') === 'manual' ? 'manual' : 'gps'
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);

  // Validation Error State
  const [errors, setErrors] = useState<{
    model?: string;
    partName?: string;
    city?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle GPS Geolocation Test / Pinpoint
  const handleRequestLocation = () => {
    setLocationErrorMsg(null);
    setLocationSuccessMsg(null);

    if (!('geolocation' in navigator)) {
      setLocationErrorMsg('Geolocation is not supported by your browser. Enter your location manually.');
      setLocationMode('manual');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLocating(false);
        setLocationMode('gps');
        setLocationSuccessMsg(`Current location active (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`);
        console.log("PartFinder search coordinates:", {
          latitude,
          longitude
        });
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Location unavailable. Switched to manual location mode.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Switched to manual location mode.';
        }
        setLocationMode('manual');
        setLocationErrorMsg(msg);
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Sync available models based on selected make
  const availableModels = MODELS_BY_MAKE[make] || ['Custom Model'];

  // Handle Make change -> default to first model of that make
  const handleMakeChange = (selectedMake: string) => {
    setMake(selectedMake);
    const models = MODELS_BY_MAKE[selectedMake];
    if (models && models.length > 0) {
      setModel(models[0]);
    } else {
      setModel('');
    }
    if (errors.model) {
      setErrors(prev => ({ ...prev, model: undefined }));
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPartName(suggestion);
    if (errors.partName) {
      setErrors(prev => ({ ...prev, partName: undefined }));
    }
  };

  const handleApplyPreset = (presetMake: string, presetModel: string, presetYear: string, presetPart: string, presetCity: string, presetRadius: string) => {
    setMake(presetMake);
    setModel(presetModel);
    setYear(presetYear);
    setPartName(presetPart);
    setPartNumber('');
    setCity(presetCity);
    setRadius(presetRadius);
    setLocationMode('manual');
    setErrors({});
    setLocationSuccessMsg(null);
    setLocationErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { model?: string; partName?: string; city?: string } = {};

    if (!model || model.trim() === '') {
      newErrors.model = 'Please select or enter the vehicle model';
    }

    if (!partName || partName.trim() === '') {
      newErrors.partName = 'Please enter the spare part name';
    }

    if (locationMode === 'manual' && (!city || city.trim() === '')) {
      newErrors.city = 'Please specify the workshop city or location';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // If GPS Mode is active, ALWAYS obtain the freshest browser coordinates at search submit time
    if (locationMode === 'gps') {
      if (!('geolocation' in navigator)) {
        const fallbackCoords = resolveCityCoordinates(city || 'Salem');
        console.log("PartFinder search coordinates:", {
          latitude: fallbackCoords.lat,
          longitude: fallbackCoords.lng
        });
        const queryParams = new URLSearchParams({
          make,
          model,
          year,
          part: partName.trim(),
          ...(partNumber.trim() ? { partNumber: partNumber.trim() } : {}),
          city: city || 'Salem Auto Cluster',
          radius,
          lat: fallbackCoords.lat.toString(),
          lng: fallbackCoords.lng.toString(),
          locMode: 'manual',
          t: Date.now().toString(),
        });
        setIsSubmitting(false);
        navigate(`/search-results?${queryParams.toString()}`);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Log coordinates to console as required
          console.log("PartFinder search coordinates:", {
            latitude,
            longitude
          });

          const queryParams = new URLSearchParams({
            make,
            model,
            year,
            part: partName.trim(),
            ...(partNumber.trim() ? { partNumber: partNumber.trim() } : {}),
            city: 'My Current Location (GPS)',
            radius,
            lat: latitude.toString(),
            lng: longitude.toString(),
            locMode: 'gps',
            t: Date.now().toString(),
          });

          setIsSubmitting(false);
          navigate(`/search-results?${queryParams.toString()}`);
        },
        (_error) => {
          // If GPS is unavailable/denied, smoothly fallback to default or entered city without blocking search
          const fallbackCoords = resolveCityCoordinates(city || 'Salem');
          console.log("PartFinder search coordinates (GPS fallback):", {
            latitude: fallbackCoords.lat,
            longitude: fallbackCoords.lng
          });

          const queryParams = new URLSearchParams({
            make,
            model,
            year,
            part: partName.trim(),
            ...(partNumber.trim() ? { partNumber: partNumber.trim() } : {}),
            city: city || 'Salem Auto Hub',
            radius,
            lat: fallbackCoords.lat.toString(),
            lng: fallbackCoords.lng.toString(),
            locMode: 'manual',
            t: Date.now().toString(),
          });

          setIsSubmitting(false);
          navigate(`/search-results?${queryParams.toString()}`);
        },
        { timeout: 5000, enableHighAccuracy: true, maximumAge: 0 }
      );
      return;
    }

    // Manual Mode: Resolve city coordinates
    const resolvedCoords = resolveCityCoordinates(city);

    // Log coordinates to console as required
    console.log("PartFinder search coordinates:", {
      latitude: resolvedCoords.lat,
      longitude: resolvedCoords.lng
    });

    const queryParams = new URLSearchParams({
      make,
      model,
      year,
      part: partName.trim(),
      ...(partNumber.trim() ? { partNumber: partNumber.trim() } : {}),
      city: city.trim(),
      radius,
      lat: resolvedCoords.lat.toString(),
      lng: resolvedCoords.lng.toString(),
      locMode: 'manual',
      t: Date.now().toString(),
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/search-results?${queryParams.toString()}`);
    }, 200);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-navy-950 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Wrench className="w-3.5 h-3.5 text-brand-400" />
            <span>Mechanic Rapid Search Terminal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Find Compatible Spare Parts Nearby
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Specify the vehicle, part name, and your workshop area. PartFinder scans verified local shops in real-time.
          </p>
        </div>

        {/* 1-Click Workshop Presets */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Try Workshop Presets:
          </span>
          <button
            type="button"
            onClick={() => handleApplyPreset('Tata', 'Ace', '2019', 'Clutch Bearing', 'Salem', '10')}
            className="text-xs px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-brand-500 transition-all font-medium"
          >
            Tata Ace (2019) • Clutch Bearing • Salem (10 km)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('Mahindra', 'Bolero', '2021', 'Brake Pads', 'Coimbatore', '15')}
            className="text-xs px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-brand-500 transition-all font-medium"
          >
            Mahindra Bolero (2021) • Brake Pads • Coimbatore (15 km)
          </button>
        </div>

        {/* Main Search Card */}
        <div className="bg-navy-900/95 rounded-3xl border border-slate-700/90 shadow-2xl p-6 sm:p-8 md:p-10 backdrop-blur-xl relative">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* SECTION 1: VEHICLE DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">1. Vehicle Specification</h3>
                  <p className="text-xs text-slate-400">Select make, model and manufacturing year for exact OEM match</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Make */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Vehicle Make <span className="text-brand-400">*</span>
                  </label>
                  <select
                    value={make}
                    onChange={(e) => handleMakeChange(e.target.value)}
                    className="w-full bg-navy-950 text-white text-sm font-medium px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer"
                  >
                    {POPULAR_MAKES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Model <span className="text-brand-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => {
                        setModel(e.target.value);
                        if (errors.model) setErrors(prev => ({ ...prev, model: undefined }));
                      }}
                      placeholder="e.g. Ace, Bolero, Swift"
                      className={`w-full bg-navy-950 text-white placeholder-slate-500 text-sm font-medium px-4 py-3 rounded-xl border ${
                        errors.model ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-brand-500'
                      } focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all`}
                      list="available-models-list"
                    />
                    <datalist id="available-models-list">
                      {availableModels.map((mod) => (
                        <option key={mod} value={mod} />
                      ))}
                    </datalist>
                  </div>
                  {errors.model && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.model}</span>
                    </p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Model Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-navy-950 text-white text-sm font-medium px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer"
                  >
                    {VEHICLE_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: PART DETAILS & QUICK SUGGESTIONS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">2. Spare Part Information</h3>
                  <p className="text-xs text-slate-400">Enter the requested component or OEM reference</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Part Name */}
                <div className="sm:col-span-8">
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Part Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={partName}
                    onChange={(e) => {
                      setPartName(e.target.value);
                      if (errors.partName) setErrors(prev => ({ ...prev, partName: undefined }));
                    }}
                    placeholder="e.g. Clutch Bearing, Front Brake Pads, Alternator"
                    className={`w-full bg-navy-950 text-white placeholder-slate-500 text-sm font-medium px-4 py-3 rounded-xl border ${
                      errors.partName ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-brand-500'
                    } focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all`}
                  />
                  {errors.partName && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.partName}</span>
                    </p>
                  )}
                </div>

                {/* Part Number (Optional) */}
                <div className="sm:col-span-4">
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-slate-400" />
                    Part Number <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    placeholder="e.g. 2527-2500"
                    className="w-full bg-navy-950 text-white placeholder-slate-500 text-sm font-medium px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Quick Search Suggestions */}
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Quick Search Suggestions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SEARCH_SUGGESTIONS.map((suggestion) => {
                    const isSelected = partName.toLowerCase() === suggestion.toLowerCase();
                    return (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                            : 'bg-navy-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        + {suggestion}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 3: LOCATION & RADIUS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">3. Workshop Location & Radius</h3>
                    <p className="text-xs text-slate-400">Find real auto-parts stores near your repair bay</p>
                  </div>
                </div>

                {/* Location Mode Selector Tabs */}
                <div className="flex items-center gap-1.5 bg-navy-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setLocationMode('gps');
                      setLocationErrorMsg(null);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      locationMode === 'gps'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>GPS Mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationMode('manual');
                      setLocationSuccessMsg(null);
                      setLocationErrorMsg(null);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      locationMode === 'manual'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Manual City</span>
                  </button>
                </div>
              </div>

              {/* Geolocation Notice / Status Alerts */}
              {locationMode === 'gps' ? (
                <div className="p-3.5 rounded-2xl bg-brand-600/10 border border-brand-500/30 text-xs text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-ping" />
                    <div>
                      <strong className="text-white block font-semibold">Live GPS Mode Active</strong>
                      <span className="text-slate-300">
                        When you click Search, PartFinder captures your real-time browser coordinates and passes them directly to Google Places API (New).
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRequestLocation}
                    disabled={isLocating}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/40 border border-brand-500/40 text-brand-300 text-xs font-semibold shrink-0"
                  >
                    <Crosshair className={`w-3.5 h-3.5 text-brand-400 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Testing GPS...' : 'Test Pinpoint'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Manual Mode:</strong> Enter any city or auto-market hub name. Coordinates will be resolved dynamically for the search radius.
                  </span>
                </div>
              )}

              {locationSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{locationSuccessMsg} • Ready for live Google Places search</span>
                </div>
              )}

              {locationErrorMsg && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{locationErrorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City (Only editable in Manual Mode or shown disabled in GPS Mode) */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    {locationMode === 'gps' ? 'Location Detection' : 'City / Auto Cluster Area'} <span className="text-amber-400">*</span>
                  </label>
                  {locationMode === 'gps' ? (
                    <div className="w-full bg-navy-950/70 text-slate-300 text-sm font-medium px-4 py-3 rounded-xl border border-brand-500/30 flex items-center gap-2">
                      <Crosshair className="w-4 h-4 text-brand-400" />
                      <span>Live Device GPS Coordinates (Captured on Search)</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (errors.city) setErrors(prev => ({ ...prev, city: undefined }));
                        }}
                        placeholder="e.g. Salem, Coimbatore, Chennai, Bangalore"
                        className={`w-full bg-navy-950 text-white placeholder-slate-500 text-sm font-medium px-4 py-3 rounded-xl border ${
                          errors.city ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-brand-500'
                        } focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all`}
                        list="cities-list"
                      />
                      <datalist id="cities-list">
                        {POPULAR_CITIES.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>
                  )}
                  {errors.city && locationMode === 'manual' && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                {/* Search Radius */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-slate-400" />
                    Search Radius
                  </label>
                  <select
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full bg-navy-950 text-white text-sm font-medium px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer"
                  >
                    {RADIUS_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* LARGE PROFESSIONAL SEARCH BUTTON */}
            <div className="pt-2">
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
                    <span>Scanning Local Shops...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Search Parts</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>

            {/* Reassurances strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Live stock from 426 verified distributors
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-4 h-4 text-brand-400" />
                Updated minutes ago
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
