import React from 'react';
import { 
  Boxes, 
  CheckCircle2, 
  AlertTriangle, 
  BookmarkCheck, 
  ShoppingBag 
} from 'lucide-react';
import { ShopInventoryItem } from '../../types';

interface DashboardMetricsProps {
  inventory: ShopInventoryItem[];
  reservationCount?: number;
  ordersCount?: number;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  inventory,
  reservationCount = 7,
  ordersCount = 12,
}) => {
  const totalParts = inventory.reduce((sum, item) => sum + item.stock, 0);
  const inStockItems = inventory.filter(item => item.status === 'In Stock').length;
  const lowStockItems = inventory.filter(item => item.status === 'Low Stock').length;

  const metrics = [
    {
      id: 'total-parts',
      label: 'Total Parts',
      value: inventory.length.toString(),
      subtext: `${totalParts} total units on shelf`,
      icon: Boxes,
      iconColor: 'text-brand-400',
      bgGlow: 'bg-brand-500/10',
      badge: '+4 added today',
    },
    {
      id: 'in-stock',
      label: 'In Stock',
      value: inStockItems.toString(),
      subtext: 'Ready for instant reserve',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/10',
      badge: '92% availability',
    },
    {
      id: 'low-stock',
      label: 'Low Stock',
      value: lowStockItems.toString(),
      subtext: 'Reorder suggested soon',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      bgGlow: 'bg-amber-500/10',
      badge: 'Action required',
    },
    {
      id: 'today-reservations',
      label: "Today's Reservations",
      value: reservationCount.toString(),
      subtext: '1 awaiting confirmation',
      icon: BookmarkCheck,
      iconColor: 'text-purple-400',
      bgGlow: 'bg-purple-500/10',
      badge: '⚡ Live queue',
    },
    {
      id: 'today-orders',
      label: "Today's Orders",
      value: ordersCount.toString(),
      subtext: '₹14,250 counter revenue',
      icon: ShoppingBag,
      iconColor: 'text-blue-400',
      bgGlow: 'bg-blue-500/10',
      badge: '+18% vs yesterday',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.id}
            className="bg-navy-900/85 hover:bg-navy-850/90 rounded-2xl p-5 border border-slate-800/90 hover:border-slate-700 transition-all duration-200 shadow-card-dark flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${metric.bgGlow} border border-white/5 flex items-center justify-center ${metric.iconColor} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-navy-950 px-2 py-0.5 rounded-full border border-slate-800">
                  {metric.badge}
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {metric.value}
              </div>

              <div className="text-xs font-bold text-slate-200 mt-1">
                {metric.label}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
              {metric.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
