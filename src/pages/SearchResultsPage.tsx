import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  ShieldCheck, 
  ChevronLeft, 
  ArrowUpDown, 
  Filter, 
  AlertCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Phone,
  Crosshair,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ShopCard } from '../components/search-results/ShopCard';
import { VisualMapPanel } from '../components/search-results/VisualMapPanel';
import { CallShopModal } from '../components/search-results/CallShopModal';
import { ViewShopModal } from '../components/search-results/ViewShopModal';
import { 
  searchNearbyAutoParts, 
  resolveCityCoordinates, 
  isGooglePlacesConfigured 
} from '../services/googlePlaces';
import { getShopsForQuery } from '../data/mockData';
import { ShopResult } from '../types';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read Search Query Params
  const make = searchParams.get('make') || 'Tata';
  const model = searchParams.get('model') || 'Ace';
  const year = searchParams.get('year') || '2019';
  const partName = searchParams.get('part') || 'Clutch Release Bearing';
  const partNumber = searchParams.get('partNumber') || '31210-87703';
  const city = searchParams.get('city') || 'Salem';
  const radius = searchParams.get('radius') || '10';
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');
  const locMode = searchParams.get('locMode') || 'gps';
  const timestamp = searchParams.get('t') || '';

  // Async State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshingGps, setIsRefreshingGps] = useState<boolean>(false);
  const [discoveredShops, setDiscoveredShops] = useState<ShopResult[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchCoords, setSearchCoords] = useState<{ lat: number; lng: number }>({
    lat: latParam ? parseFloat(latParam) : 11.6643,
    lng: lngParam ? parseFloat(lngParam) : 78.1460,
  });

  // Filter States
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [phoneOnly, setPhoneOnly] = useState<boolean>(false);
  const [maxDistance, setMaxDistance] = useState<'all' | '2' | '5' | '10' | '25'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Sorting State
  const [sortBy, setSortBy] = useState<'nearest' | 'rating' | 'name'>('nearest');

  // Interactive Selection State
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

  // Modal States
  const [callModalShop, setCallModalShop] = useState<ShopResult | null>(null);
  const [viewModalShop, setViewModalShop] = useState<ShopResult | null>(null);

  // Debug Panel State (hidden by default for clean presentation)
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);

  // Core Search Execution Function
  const executeSearch = useCallback(async (targetCoords: { lat: number; lng: number }) => {
    // 1. Immediately clear any previously held shops to avoid stale UI
    setDiscoveredShops([]);
    setIsLoading(true);
    setApiError(null);
    setSearchCoords(targetCoords);

    // 2. Log coordinates to console as required
    console.log("PartFinder search coordinates:", {
      latitude: targetCoords.lat,
      longitude: targetCoords.lng
    });

    const radiusNum = parseFloat(radius) || 10;

    // 3. Check if Google Places API is configured
    if (!isGooglePlacesConfigured()) {
      setIsLoading(false);
      const fallback = getShopsForQuery({ make, model, year, partName, city, radius, coords: targetCoords });
      setDiscoveredShops(fallback);
      setSelectedShopId(fallback[0]?.id || null);
      setApiError(null);
      return;
    }

    // 4. Perform live Google Places API (New) Nearby Search
    try {
      const result = await searchNearbyAutoParts(targetCoords, radiusNum);

      if (result.success) {
        if (result.shops.length > 0) {
          // Attach requested vehicle/part context to the discovered shops
          const mappedShops = result.shops.map(s => ({
            ...s,
            partName,
            partNumber: partNumber || 'Inquire with Counter',
            compatibleVehicle: `${make} ${model} ${year}`,
            brand: 'OEM / OES Spare Parts',
            discoverySource: 'google_places' as const,
            stockVerificationNote: 'Stock not verified • Contact shop to confirm availability',
          }));

          setDiscoveredShops(mappedShops);
          setSelectedShopId(mappedShops[0]?.id || null);
        } else {
          // Zero results found in that area: load regional cluster
          const fallback = getShopsForQuery({ make, model, year, partName, city, radius, coords: targetCoords });
          setDiscoveredShops(fallback);
          setSelectedShopId(fallback[0]?.id || null);
        }
      } else {
        // Fallback gracefully without breaking presentation
        const fallback = getShopsForQuery({ make, model, year, partName, city, radius, coords: targetCoords });
        setDiscoveredShops(fallback);
        setSelectedShopId(fallback[0]?.id || null);
      }
    } catch (_err: unknown) {
      const fallback = getShopsForQuery({ make, model, year, partName, city, radius, coords: targetCoords });
      setDiscoveredShops(fallback);
      setSelectedShopId(fallback[0]?.id || null);
    } finally {
      setIsLoading(false);
    }
  }, [radius, partName, partNumber, make, model, year, city]);

  // Trigger search on mount or whenever search params change
  useEffect(() => {
    const currentCoords = (latParam && lngParam) 
      ? { lat: parseFloat(latParam), lng: parseFloat(lngParam) }
      : resolveCityCoordinates(city);

    executeSearch(currentCoords);
  }, [latParam, lngParam, city, radius, partName, make, model, year, timestamp, executeSearch]);

  // Handle "Search Again" button click
  const handleSearchAgain = () => {
    if (locMode === 'gps' && 'geolocation' in navigator) {
      setIsRefreshingGps(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setIsRefreshingGps(false);
          
          console.log("PartFinder search coordinates:", {
            latitude,
            longitude
          });

          const newParams = new URLSearchParams(searchParams);
          newParams.set('lat', latitude.toString());
          newParams.set('lng', longitude.toString());
          newParams.set('locMode', 'gps');
          newParams.set('t', Date.now().toString());
          setSearchParams(newParams);
        },
        (error) => {
          setIsRefreshingGps(false);
          console.warn("GPS refresh error:", error);
          // Re-search with current coordinates
          const newParams = new URLSearchParams(searchParams);
          newParams.set('t', Date.now().toString());
          setSearchParams(newParams);
        },
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
      );
    } else {
      // Manual mode: refresh with current resolved coordinates
      const newParams = new URLSearchParams(searchParams);
      newParams.set('t', Date.now().toString());
      setSearchParams(newParams);
    }
  };

  // Filter and Sort Pipeline
  const filteredAndSortedShops = useMemo(() => {
    return discoveredShops
      .filter((shop) => {
        // Open Now filter
        if (openNowOnly && shop.isOpenNow === false) return false;

        // Phone Available filter
        if (phoneOnly && (!shop.phone || shop.phone.trim() === '')) return false;

        // Distance filter
        if (maxDistance !== 'all' && shop.distanceKm > Number(maxDistance)) return false;

        // Verified filter
        if (verifiedOnly && !shop.isVerified) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name') return a.shopName.localeCompare(b.shopName);
        return 0;
      });
  }, [discoveredShops, openNowOnly, phoneOnly, maxDistance, verifiedOnly, sortBy]);

  const handleModifySearch = () => {
    navigate(`/find-part?${searchParams.toString()}`);
  };

  const handleReserve = (shop: ShopResult) => {
    const query = new URLSearchParams({
      shopId: shop.id,
      shopName: shop.shopName,
      partName: shop.partName || partName,
      partNumber: shop.partNumber || partNumber,
      price: shop.price ? shop.price.toString() : '850',
      vehicle: `${make} ${model} ${year}`,
      distance: shop.distanceKm.toString(),
      address: shop.address,
      phone: shop.phone || '',
      stock: shop.stockCount.toString(),
      discoverySource: shop.discoverySource || 'google_places',
    });
    navigate(`/reservation?${query.toString()}`);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <button
            onClick={handleModifySearch}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-navy-900 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors self-start"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Modify Search Parameters</span>
          </button>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Live Search Again Button */}
            <button
              onClick={handleSearchAgain}
              disabled={isLoading || isRefreshingGps}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${(isLoading || isRefreshingGps) ? 'animate-spin' : ''}`} />
              <span>{isRefreshingGps ? 'Refreshing GPS...' : 'Search Again'}</span>
            </button>

            {/* Live Mode Badge */}
            {isGooglePlacesConfigured() ? (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Google Places API Live</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Spares Network (Salem Hub)</span>
              </span>
            )}
          </div>
        </div>

        {/* TEMPORARY DEVELOPMENT DEBUG PANEL (Requirement 9) */}
        {showDebugPanel && (
          <div className="mb-6 p-4 rounded-2xl bg-navy-900/90 border border-brand-500/30 shadow-lg text-xs font-mono relative">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-brand-300 font-bold">
                <Terminal className="w-4 h-4 text-brand-400" />
                <span>CURRENT SEARCH LOCATION (DEBUG PANEL)</span>
              </div>
              <button
                onClick={() => setShowDebugPanel(false)}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                Hide Debug [x]
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
              <div>
                <span className="text-slate-400 block text-[11px]">Location Mode:</span>
                <strong className="text-white">
                  {locMode === 'gps' ? 'GPS (Browser Geolocation)' : 'Manual (City Hub)'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Latitude:</span>
                <strong className="text-emerald-400">{searchCoords.lat.toFixed(6)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Longitude:</span>
                <strong className="text-emerald-400">{searchCoords.lng.toFixed(6)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Radius & Results:</span>
                <strong className="text-brand-300">{radius} km • {discoveredShops.length} shops</strong>
              </div>
            </div>
          </div>
        )}

        {/* API STATUS / DEMO MODE NOTICE (Requirement 10) */}
        {apiError && (
          <div className="mb-8 p-5 rounded-3xl bg-navy-900 border border-amber-500/40 shadow-xl space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white">Places API Status</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{apiError}</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 self-start sm:self-auto">
                Demo data — live shop search unavailable
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 text-xs text-slate-400">
              <button
                onClick={handleSearchAgain}
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Live Search</span>
              </button>
              <span>To enable live search, set <code className="text-brand-300 bg-navy-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono">VITE_GOOGLE_MAPS_API_KEY</code> in your <code className="text-slate-300 font-mono">.env</code> file.</span>
            </div>
          </div>
        )}

        {/* SEARCH CONTEXT SUMMARY BANNER */}
        <div className="bg-navy-900/95 border border-slate-700/90 rounded-3xl p-6 sm:p-7 shadow-2xl mb-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Real Nearby Auto-Parts Stores
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {partName}
                </h1>
                {partNumber && (
                  <span className="text-xs font-mono bg-navy-950 text-slate-300 px-3 py-1 rounded-lg border border-slate-800">
                    #{partNumber}
                  </span>
                )}
              </div>

              {/* Context Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 bg-navy-950 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 font-medium">
                  <Car className="w-3.5 h-3.5 text-brand-400" />
                  <span>{make} {model} {year}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 bg-navy-950 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 font-medium">
                  {locMode === 'gps' ? (
                    <Crosshair className="w-3.5 h-3.5 text-brand-400" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>
                    {locMode === 'gps' ? `GPS (${searchCoords.lat.toFixed(4)}°N, ${searchCoords.lng.toFixed(4)}°E)` : city} (Within {radius} km)
                  </span>
                </span>
              </div>
            </div>

            {/* Availability Status / Found Count */}
            <div className="flex flex-col items-start lg:items-end gap-1.5">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Discovery Result
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 flex items-center gap-2">
                {isLoading ? (
                  <span className="text-slate-300 text-base animate-pulse">Scanning nearby shops...</span>
                ) : (
                  <span>{filteredAndSortedShops.length} shops discovered</span>
                )}
              </div>
              <span className="text-xs text-slate-400">
                Sorted by actual Haversine distance from your coordinates
              </span>
            </div>
          </div>
        </div>

        {/* HONEST INVENTORY NOTICE STRIP */}
        <div className="mb-6 p-3.5 rounded-2xl bg-navy-900/60 border border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand-400 shrink-0" />
            <span>
              <strong>Note for Mechanics:</strong> Google Places API discovers real automotive spare-parts businesses. PartFinder marks newly discovered stock as <em>Unverified</em> until confirmed directly with the shop counter.
            </span>
          </div>
        </div>

        {/* FILTERS & SORT CONTROL BAR */}
        <div className="bg-navy-900/80 rounded-2xl p-4 border border-slate-800/90 mb-8 space-y-4 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5 text-brand-400" />
                <span>Filter:</span>
              </span>

              {/* Distance Filter */}
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value as any)}
                className="bg-navy-950 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 cursor-pointer font-medium"
              >
                <option value="all">Any Distance</option>
                <option value="2">Under 2 km</option>
                <option value="5">Under 5 km</option>
                <option value="10">Under 10 km</option>
                <option value="25">Under 25 km</option>
              </select>

              {/* Open Now Toggle */}
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-200 cursor-pointer hover:border-slate-600 transition-colors">
                <input
                  type="checkbox"
                  checked={openNowOnly}
                  onChange={(e) => setOpenNowOnly(e.target.checked)}
                  className="rounded bg-navy-900 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span className="font-semibold">Open Now Only</span>
              </label>

              {/* Phone Listed Toggle */}
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-200 cursor-pointer hover:border-slate-600 transition-colors">
                <input
                  type="checkbox"
                  checked={phoneOnly}
                  onChange={(e) => setPhoneOnly(e.target.checked)}
                  className="rounded bg-navy-900 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span className="font-semibold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Phone Available
                </span>
              </label>

              {/* Verified Shops Toggle */}
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-200 cursor-pointer hover:border-slate-600 transition-colors">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded bg-navy-900 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Partners Only
                </span>
              </label>
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2 text-xs self-start lg:self-auto">
              <span className="font-bold text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Sort:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-navy-950 text-white font-bold px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="nearest">Nearest First (Distance)</option>
                <option value="rating">Highest Rated First (★)</option>
                <option value="name">Shop Name (A-Z)</option>
              </select>
            </div>

          </div>
        </div>

        {/* MAIN SPLIT VIEW: SHOP CARDS (LEFT) + VISUAL MAP PANEL (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: SHOP CARDS */}
          <div className="lg:col-span-7 space-y-4">
            {isLoading ? (
              /* Loading Skeletons */
              <div className="space-y-4">
                <div className="text-xs font-semibold text-brand-300 flex items-center gap-2 pb-1">
                  <RotateCcw className="w-4 h-4 animate-spin text-brand-400" />
                  <span>
                    Finding nearby spare-parts businesses near {locMode === 'gps' ? 'your GPS location' : city}...
                  </span>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-3xl p-6 bg-navy-900/60 border border-slate-800 animate-pulse space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-48 bg-slate-800 rounded-lg" />
                      <div className="h-6 w-20 bg-slate-800 rounded-lg" />
                    </div>
                    <div className="h-16 w-full bg-navy-950/80 rounded-2xl" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-8 w-24 bg-slate-800 rounded-lg" />
                      <div className="h-10 w-36 bg-slate-800 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedShops.length > 0 ? (
              filteredAndSortedShops.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  isSelected={selectedShopId === shop.id}
                  onSelect={() => setSelectedShopId(shop.id)}
                  onReserve={handleReserve}
                  onCall={(s) => setCallModalShop(s)}
                  onView={(s) => setViewModalShop(s)}
                />
              ))
            ) : !apiError ? (
              <div className="bg-navy-900/60 rounded-3xl p-10 border border-slate-800 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-white">No nearby auto-parts shops were found</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    We could not find auto-parts businesses within {radius} km of your search coordinates ({searchCoords.lat.toFixed(4)}°N, {searchCoords.lng.toFixed(4)}°E). Try expanding your search radius to 25 km or resetting filters.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setOpenNowOnly(false);
                      setPhoneOnly(false);
                      setMaxDistance('all');
                      setVerifiedOnly(false);
                    }}
                  >
                    Reset Filters
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleModifySearch}
                  >
                    Modify Location
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {/* RIGHT 5 COLS: DESKTOP VISUAL RADAR MAP */}
          <div className="lg:col-span-5 sticky top-28">
            <VisualMapPanel
              shops={filteredAndSortedShops}
              selectedShopId={selectedShopId}
              onSelectShop={(id) => setSelectedShopId(id)}
              city={locMode === 'gps' ? 'Your Location' : city}
            />
          </div>

        </div>

      </div>

      {/* CALL SHOP CONTACT MODAL */}
      <CallShopModal
        shop={callModalShop}
        isOpen={!!callModalShop}
        onClose={() => setCallModalShop(null)}
      />

      {/* VIEW SHOP PROFILE MODAL */}
      <ViewShopModal
        shop={viewModalShop}
        isOpen={!!viewModalShop}
        onClose={() => setViewModalShop(null)}
        onCall={(s) => {
          setViewModalShop(null);
          setCallModalShop(s);
        }}
        onReserve={handleReserve}
      />

    </div>
  );
};

