import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  Search, 
  MapPin, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Truck, 
  Navigation, 
  RotateCcw,
  CheckCircle2,
  Store
} from 'lucide-react';
import { Button } from '../common/Button';
import { 
  POPULAR_VEHICLES, 
  POPULAR_PARTS, 
  POPULAR_LOCATIONS, 
  DEFAULT_SEARCH_PRESET, 
  MOCK_SEARCH_RESULTS 
} from '../../data/mockData';
import { PartSearchResult } from '../../types';

interface SearchPreviewCardProps {
  onReservePart: (part: PartSearchResult) => void;
}

export const SearchPreviewCard: React.FC<SearchPreviewCardProps> = ({
  onReservePart,
}) => {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(DEFAULT_SEARCH_PRESET.vehicle);
  const [partQuery, setPartQuery] = useState(DEFAULT_SEARCH_PRESET.part);
  const [location, setLocation] = useState(DEFAULT_SEARCH_PRESET.location);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);
  const [results, setResults] = useState<PartSearchResult[]>(MOCK_SEARCH_RESULTS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'inStock' | 'delivery'>('all');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);

    const cleanCity = location.split('-')[0]?.trim() || 'Salem';
    const query = new URLSearchParams({
      part: partQuery || 'Clutch Release Bearing',
      city: cleanCity,
      radius: '10',
    });
    navigate(`/search-results?${query.toString()}`);
  };

  const handleApplyPreset = () => {
    setVehicle(DEFAULT_SEARCH_PRESET.vehicle);
    setPartQuery(DEFAULT_SEARCH_PRESET.part);
    setLocation(DEFAULT_SEARCH_PRESET.location);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      setResults(MOCK_SEARCH_RESULTS);
    }, 300);
  };

  const filteredResults = results.filter(item => {
    if (selectedFilter === 'inStock') return item.inStock && item.stockCount > 2;
    if (selectedFilter === 'delivery') return item.deliveryAvailable;
    return true;
  });

  return (
    <section id="find-part" className="relative py-12 -mt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Search Container */}
        <div className="bg-navy-900/90 rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
          {/* Subtle gradient accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header & Preset Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live Stock Search Engine
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Find Compatible Parts Across Local Shops
              </h2>
            </div>

            {/* Quick Preset Chip */}
            <button
              onClick={handleApplyPreset}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs group self-start md:self-auto"
            >
              <Sparkles className="w-4 h-4 text-brand-400 group-hover:rotate-12 transition-transform" />
              <span>Example: <strong className="text-white">Tata Ace • Clutch Bearing • Salem</strong></span>
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              {/* Vehicle Input */}
              <div className="md:col-span-4 flex flex-col">
                <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-brand-400" />
                  Vehicle Model
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="e.g. Tata Ace, Mahindra Bolero, Swift"
                    className="w-full bg-navy-950/90 text-white placeholder-slate-500 text-sm font-medium px-4 py-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    list="vehicles-list"
                  />
                  <datalist id="vehicles-list">
                    {POPULAR_VEHICLES.map((v) => (
                      <option key={v.id} value={v.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Part Name / Number Input */}
              <div className="md:col-span-4 flex flex-col">
                <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                  Part Name or Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={partQuery}
                    onChange={(e) => setPartQuery(e.target.value)}
                    placeholder="e.g. Clutch Release Bearing, Brake Pads"
                    className="w-full bg-navy-950/90 text-white placeholder-slate-500 text-sm font-medium px-4 py-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    list="parts-list"
                  />
                  <datalist id="parts-list">
                    {POPULAR_PARTS.map((p, idx) => (
                      <option key={idx} value={p} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Location Input */}
              <div className="md:col-span-3 flex flex-col">
                <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Location / Hub
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Salem, Coimbatore"
                    className="w-full bg-navy-950/90 text-white placeholder-slate-500 text-sm font-medium px-4 py-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    list="locations-list"
                  />
                  <datalist id="locations-list">
                    {POPULAR_LOCATIONS.map((loc, idx) => (
                      <option key={idx} value={loc} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Search Submit Button */}
              <div className="md:col-span-1 flex items-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSearching}
                  className="w-full h-[48px] rounded-xl flex items-center justify-center p-0"
                  aria-label="Search Spares"
                >
                  {isSearching ? (
                    <RotateCcw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Search Results Display Area */}
          {hasSearched && (
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">
                    Found {filteredResults.length} shops with stock for <span className="text-brand-400">{vehicle || 'Tata Ace'}</span>:
                  </span>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1.5 bg-navy-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      selectedFilter === 'all'
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All Nearby ({results.length})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('inStock')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      selectedFilter === 'inStock'
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    High Stock (3+)
                  </button>
                  <button
                    onClick={() => setSelectedFilter('delivery')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      selectedFilter === 'delivery'
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Express Delivery
                  </button>
                </div>
              </div>

              {/* Results Cards List */}
              <div className="space-y-3.5">
                {filteredResults.map((item) => (
                  <div
                    key={item.id}
                    className="bg-navy-950/70 hover:bg-navy-800/60 rounded-2xl p-4 sm:p-5 border border-slate-800/90 hover:border-slate-700 transition-all duration-200 shadow-md group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Part & Shop Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                            {item.partName}
                          </h4>
                          <span className="text-xs font-mono bg-navy-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                            #{item.partNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-300 bg-brand-500/10 text-brand-300 px-2 py-0.5 rounded">
                            {item.brand}
                          </span>
                        </div>

                        {/* Shop and Distance */}
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                            <Store className="w-3.5 h-3.5 text-brand-400" />
                            <span>{item.shopName}</span>
                          </div>

                          {item.isVerified && (
                            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verified Dealer</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-slate-400">
                            <Navigation className="w-3 h-3 text-slate-500" />
                            <span>{item.shopLocation}</span>
                          </div>

                          <div className="flex items-center gap-1 text-amber-400 font-medium">
                            <span>★ {item.rating}</span>
                            <span className="text-slate-500">({item.reviewCount})</span>
                          </div>
                        </div>

                        {/* Live Stock & Update Timestamp */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{item.stockCount} units in stock</span>
                          </div>

                          <div className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{item.lastUpdated}</span>
                          </div>

                          {item.deliveryAvailable && (
                            <div className="inline-flex items-center gap-1 text-[11px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                              <Truck className="w-3 h-3 text-blue-400" />
                              <span>Bay Delivery in {item.deliveryTimeMins}m</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Pricing & Actions */}
                      <div className="flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between lg:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                        <div className="text-left lg:text-right">
                          <div className="text-xs text-slate-400 font-medium">Counter Price</div>
                          <div className="text-2xl font-extrabold text-white tracking-tight">
                            ₹{item.price}
                            <span className="text-xs font-normal text-slate-400 ml-1">incl. tax</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs px-3.5 py-2 whitespace-nowrap"
                            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                            onClick={() => onReservePart(item)}
                          >
                            Reserve Part
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
