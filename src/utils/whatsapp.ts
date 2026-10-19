/**
 * WhatsApp message generator for PartFinder Digital Hold Slips
 */
export function generateWhatsAppHoldMessage(order: {
  id: string;
  partName: string;
  vehicle: string;
  partNumber?: string;
  shopName: string;
  shopAddress?: string;
  shopPhone?: string;
  totalPrice: number;
  quantity?: number;
  fulfillmentType?: 'pickup' | 'delivery';
  mechanicName?: string;
  workshopName?: string;
}): string {
  const lines = [
    '🔧 *PartFinder Digital Hold Slip* 🏷️',
    `*Reservation ID:* #${order.id}`,
    `*Part:* ${order.partName} (${order.quantity || 1} unit)`,
    `*Vehicle:* ${order.vehicle}`,
    `*OEM Ref:* #${order.partNumber || 'Counter Verify'}`,
    `*Shop Counter:* ${order.shopName}`,
    `*Address:* ${order.shopAddress || 'Local Auto Market'}`,
    `*Total Payable:* ₹${order.totalPrice}`,
    `*Fulfillment:* ${order.fulfillmentType === 'delivery' ? 'Workshop Bay Delivery (+₹50)' : '30-Min Counter Pickup'}`,
    `*Mechanic:* ${order.mechanicName || 'Workshop Technician'} (${order.workshopName || 'Garage Bay'})`,
    '',
    '_Present this digital pass at the counter or show to your pickup runner._',
    '⚡ _Powered by PartFinder Mechanic Spares Network_',
  ];

  return encodeURIComponent(lines.join('\n'));
}

export function openWhatsAppShare(order: Parameters<typeof generateWhatsAppHoldMessage>[0]) {
  const encodedText = generateWhatsAppHoldMessage(order);
  const cleanPhone = order.shopPhone ? order.shopPhone.replace(/[^0-9]/g, '') : '';
  
  // If clean 10-12 digit phone number exists, target directly or open general share
  const url = cleanPhone && cleanPhone.length >= 10
    ? `https://api.whatsapp.com/send?phone=${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}
