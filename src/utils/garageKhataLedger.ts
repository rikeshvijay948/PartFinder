export interface KhataTransaction {
  id: string;
  date: string;
  partDescription: string;
  slipNumber: string;
  amount: number;
  type: 'debit_part_purchase' | 'credit_settlement';
  status: 'unsettled' | 'cleared';
}

export interface KhataCounterAccount {
  shopId: string;
  shopName: string;
  shopOwner: string;
  phone: string;
  upiId: string;
  totalOutstandingCredit: number;
  creditLimit: number;
  lastPaymentDate: string;
  transactions: KhataTransaction[];
}

export const INITIAL_KHATA_ACCOUNTS: KhataCounterAccount[] = [
  {
    shopId: 'shop-1',
    shopName: 'Sri Lakshmi Auto Spares',
    shopOwner: 'Murugesan (Counter In-Charge)',
    phone: '+91 98427 11223',
    upiId: 'srilakshmispares@oksbi',
    totalOutstandingCredit: 4850,
    creditLimit: 15000,
    lastPaymentDate: '2026-11-18',
    transactions: [
      {
        id: 'tx-101',
        date: '2026-11-23',
        partDescription: 'Clutch Release Bearing (Tata Ace) x2',
        slipNumber: 'MEMO-SLM-9912',
        amount: 1700,
        type: 'debit_part_purchase',
        status: 'unsettled',
      },
      {
        id: 'tx-102',
        date: '2026-11-21',
        partDescription: 'Valeo Clutch Plate & Pressure Cover',
        slipNumber: 'MEMO-SLM-9850',
        amount: 3150,
        type: 'debit_part_purchase',
        status: 'unsettled',
      },
      {
        id: 'tx-103',
        date: '2026-11-18',
        partDescription: 'Weekly Khata Payment via GPay UPI',
        slipNumber: 'UPI-REF-884102',
        amount: 5000,
        type: 'credit_settlement',
        status: 'cleared',
      }
    ],
  },
  {
    shopId: 'shop-2',
    shopName: 'Balaji Express Truck & Tractor Spares',
    shopOwner: 'K. Balaji',
    phone: '+91 94432 88990',
    upiId: 'balajispares.salem@icici',
    totalOutstandingCredit: 2400,
    creditLimit: 20000,
    lastPaymentDate: '2026-11-15',
    transactions: [
      {
        id: 'tx-201',
        date: '2026-11-20',
        partDescription: 'Front Brake Disc Friction Pads (Bolero)',
        slipNumber: 'MEMO-BAL-4412',
        amount: 1450,
        type: 'debit_part_purchase',
        status: 'unsettled',
      },
      {
        id: 'tx-202',
        date: '2026-11-17',
        partDescription: 'Brake Master Cylinder Kit (Genuine)',
        slipNumber: 'MEMO-BAL-4390',
        amount: 950,
        type: 'debit_part_purchase',
        status: 'unsettled',
      }
    ],
  },
  {
    shopId: 'shop-3',
    shopName: 'Salem Auto Nagar Parts Hub',
    shopOwner: 'P. Arumugam',
    phone: '+91 98420 55432',
    upiId: 'salemautonagar@axl',
    totalOutstandingCredit: 1250,
    creditLimit: 10000,
    lastPaymentDate: '2026-11-10',
    transactions: [
      {
        id: 'tx-301',
        date: '2026-11-19',
        partDescription: 'Castrol 15W-40 CRB Engine Oil (4.5L can)',
        slipNumber: 'MEMO-SAN-1102',
        amount: 1250,
        type: 'debit_part_purchase',
        status: 'unsettled',
      }
    ],
  }
];

export const formatKhataStatementWhatsAppMessage = (
  account: KhataCounterAccount
): string => {
  let msg = `*📒 GARAGE KHATA RECONCILIATION - APEX AUTO WORKSHOP*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `To: *${account.shopName}* (Attn: ${account.shopOwner})\n`;
  msg += `From: Ramesh Kumar (Apex Auto Garage, Salem)\n\n`;

  msg += `*CURRENT CREDIT BALANCE (KHATA):*\n`;
  msg += `• *Outstanding Due:* ₹${account.totalOutstandingCredit.toLocaleString()}\n`;
  msg += `• *Credit Limit Approved:* ₹${account.creditLimit.toLocaleString()}\n`;
  msg += `• *Last Payment Date:* ${account.lastPaymentDate}\n\n`;

  msg += `*RECENT UNSETTLED COUNTER MEMOS:*\n`;
  const unsettled = account.transactions.filter(t => t.status === 'unsettled');
  unsettled.forEach(t => {
    msg += `• ${t.date} | ${t.slipNumber}: ${t.partDescription} - ₹${t.amount.toLocaleString()}\n`;
  });

  msg += `\n*UPI ID on File:* ${account.upiId}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `_Digitally reconciled via PartFinder Salem Garage Counter Network._`;

  return msg;
};

export const shareKhataStatementOnWhatsApp = (
  account: KhataCounterAccount
): void => {
  const text = encodeURIComponent(formatKhataStatementWhatsAppMessage(account));
  const cleanPhone = account.phone.replace(/[^0-9]/g, '');
  const url = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(url, '_blank');
};
