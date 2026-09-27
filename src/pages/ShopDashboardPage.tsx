import React, { useState, useEffect } from 'react';
import { ShopSidebar } from '../components/shop/ShopSidebar';
import { ShopHeader } from '../components/shop/ShopHeader';
import { DashboardMetrics } from '../components/shop/DashboardMetrics';
import { InventoryAccuracyCard } from '../components/shop/InventoryAccuracyCard';
import { InventoryTable } from '../components/shop/InventoryTable';
import { ReservationRequests } from '../components/shop/ReservationRequests';
import { AddEditPartModal } from '../components/shop/AddEditPartModal';
import { ShopInventoryItem, ShopReservationRequest, ReservationOrder } from '../types';

export const ShopDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact required demo inventory data
  const initialInventory: ShopInventoryItem[] = [
    {
      id: 'inv-1',
      partName: 'Clutch Release Bearing',
      vehicle: 'Tata Ace 2019',
      partNumber: '31210-87703',
      stock: 2,
      price: 850,
      status: 'In Stock',
      lastUpdated: '8 min ago',
    },
    {
      id: 'inv-2',
      partName: 'Brake Pad',
      vehicle: 'Tata Ace',
      partNumber: 'BP-2044',
      stock: 4,
      price: 1200,
      status: 'In Stock',
      lastUpdated: '25 min ago',
    },
    {
      id: 'inv-3',
      partName: 'Oil Filter',
      vehicle: 'Tata Ace',
      partNumber: 'OF-102',
      stock: 0,
      price: 450,
      status: 'Out of Stock',
      lastUpdated: '1 hour ago',
    },
    {
      id: 'inv-4',
      partName: 'Air Filter',
      vehicle: 'Tata Ace',
      partNumber: 'AF-301',
      stock: 6,
      price: 650,
      status: 'In Stock',
      lastUpdated: '2 hours ago',
    },
  ];

  // State with localStorage recovery
  const [inventory, setInventory] = useState<ShopInventoryItem[]>(() => {
    const saved = localStorage.getItem('partfinder_shop_inventory');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialInventory;
  });

  const [requests, setRequests] = useState<ShopReservationRequest[]>([]);
  const [lastVerifiedText, setLastVerifiedText] = useState('8 minutes ago');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopInventoryItem | null>(null);

  // Load and sync shared reservations from localStorage
  const loadSharedReservations = () => {
    const savedOrders = localStorage.getItem('partfinder_reservations');
    if (savedOrders) {
      try {
        const parsed: ReservationOrder[] = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: ShopReservationRequest[] = parsed.map(o => ({
            id: o.id,
            mechanicName: o.mechanicName || 'Ramesh Kumar',
            workshopName: o.workshopName || 'Apex Auto Garage',
            vehicle: o.vehicle,
            partName: o.partName,
            partNumber: o.partNumber,
            quantity: o.quantity,
            price: o.totalPrice,
            timeAgo: o.createdAt || 'Just now',
            fulfillment: o.fulfillmentType === 'delivery' ? 'Express Bay Delivery (+₹50)' : 'Direct Counter Pickup',
            status: o.status === 'shop_confirmed' || o.status === 'ready_for_pickup' || o.status === 'out_for_delivery' || o.status === 'delivered'
              ? 'Confirmed'
              : o.status === 'rejected'
              ? 'Rejected'
              : 'Pending',
          }));
          setRequests(mapped);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Default demo request if none found
    const defaultReq: ShopReservationRequest[] = [
      {
        id: 'REQ-9421',
        mechanicName: 'Ramesh Kumar',
        workshopName: 'Apex Auto Garage (5 Roads, Salem)',
        vehicle: '2019 Tata Ace',
        partName: 'Clutch Release Bearing',
        partNumber: '31210-87703',
        quantity: 1,
        price: 850,
        timeAgo: '2 mins ago',
        fulfillment: 'Express Bay Delivery',
        status: 'Pending',
      },
    ];
    setRequests(defaultReq);
  };

  useEffect(() => {
    loadSharedReservations();
  }, []);

  // Sync inventory changes to localStorage
  useEffect(() => {
    localStorage.setItem('partfinder_shop_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Handle Increase Stock
  const handleIncreaseStock = (id: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = item.stock + 1;
        const newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 
          newStock === 0 ? 'Out of Stock' : newStock <= 2 ? 'Low Stock' : 'In Stock';
        return {
          ...item,
          stock: newStock,
          status: newStatus,
          lastUpdated: 'Just now',
        };
      }
      return item;
    }));
    setLastVerifiedText('just now');
  };

  // Handle Decrease Stock
  const handleDecreaseStock = (id: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id && item.stock > 0) {
        const newStock = item.stock - 1;
        const newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 
          newStock === 0 ? 'Out of Stock' : newStock <= 2 ? 'Low Stock' : 'In Stock';
        return {
          ...item,
          stock: newStock,
          status: newStatus,
          lastUpdated: 'Just now',
        };
      }
      return item;
    }));
    setLastVerifiedText('just now');
  };

  // Handle Add/Edit Save
  const handleSavePart = (savedItem: Partial<ShopInventoryItem>) => {
    if (savedItem.id) {
      setInventory(prev => prev.map(item => item.id === savedItem.id ? { ...item, ...savedItem } as ShopInventoryItem : item));
    } else {
      const newItem: ShopInventoryItem = {
        id: 'inv-' + Date.now(),
        partName: savedItem.partName || 'New Spare Part',
        vehicle: savedItem.vehicle || 'Tata Ace',
        partNumber: savedItem.partNumber || 'OEM-999',
        stock: savedItem.stock || 1,
        price: savedItem.price || 500,
        status: (savedItem.stock || 1) === 0 ? 'Out of Stock' : (savedItem.stock || 1) <= 2 ? 'Low Stock' : 'In Stock',
        lastUpdated: 'Just now',
      };
      setInventory(prev => [newItem, ...prev]);
    }
    setLastVerifiedText('just now');
  };

  // Handle Accept Reservation Request (Sync to shared localStorage)
  const handleAcceptRequest = (id: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: 'Confirmed' };
      }
      return req;
    }));

    // Update shared orders in localStorage
    const savedOrders = localStorage.getItem('partfinder_reservations');
    if (savedOrders) {
      try {
        const parsed: ReservationOrder[] = JSON.parse(savedOrders);
        const updated = parsed.map(o => {
          if (o.id === id) {
            return {
              ...o,
              status: 'shop_confirmed' as const,
            };
          }
          return o;
        });
        localStorage.setItem('partfinder_reservations', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Handle Reject Reservation Request
  const handleRejectRequest = (id: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: 'Rejected' };
      }
      return req;
    }));

    // Update shared orders in localStorage
    const savedOrders = localStorage.getItem('partfinder_reservations');
    if (savedOrders) {
      try {
        const parsed: ReservationOrder[] = JSON.parse(savedOrders);
        const updated = parsed.map(o => {
          if (o.id === id) {
            return {
              ...o,
              status: 'rejected' as const,
            };
          }
          return o;
        });
        localStorage.setItem('partfinder_reservations', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex">
      
      {/* 1. SIDEBAR */}
      <ShopSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* 2. HEADER */}
        <ShopHeader
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          shopName="Sri Lakshmi Auto Spares"
          location="Salem"
          isVerified={true}
        />

        {/* 3. DASHBOARD BODY */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* A. DASHBOARD METRICS */}
          <DashboardMetrics
            inventory={inventory}
            reservationCount={requests.filter(r => r.status === 'Pending' || r.status === 'Confirmed').length}
            ordersCount={12}
          />

          {/* B. INVENTORY ACCURACY CARD */}
          <InventoryAccuracyCard
            lastVerifiedText={lastVerifiedText}
            onSyncNow={() => setLastVerifiedText('just now')}
          />

          {/* C. INCOMING RESERVATION REQUESTS */}
          {(activeTab === 'dashboard' || activeTab === 'reservations') && (
            <ReservationRequests
              requests={requests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />
          )}

          {/* D. INVENTORY TABLE */}
          {(activeTab === 'dashboard' || activeTab === 'inventory') && (
            <InventoryTable
              items={inventory}
              onIncreaseStock={handleIncreaseStock}
              onDecreaseStock={handleDecreaseStock}
              onEditPart={(item) => {
                setEditingItem(item);
                setIsAddEditModalOpen(true);
              }}
              onAddPart={() => {
                setEditingItem(null);
                setIsAddEditModalOpen(true);
              }}
              onDeletePart={(id) => {
                setInventory(prev => prev.filter(i => i.id !== id));
              }}
            />
          )}

        </main>

      </div>

      {/* 4. ADD / EDIT PART MODAL */}
      <AddEditPartModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSavePart}
        initialItem={editingItem}
      />

    </div>
  );
};

