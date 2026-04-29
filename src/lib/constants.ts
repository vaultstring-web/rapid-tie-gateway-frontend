export const MOCK_TRANSACTIONS = [
  {
    id: 'TXN-001',
    amount: 125000.00,
    currency: 'MWK',
    status: 'success',
    method: 'Airtel Money',
    date: '2026-03-30T10:28:00Z',
    customer: {
      name: 'Banda Exports',
      email: 'info@bandaexports.com',
    },
    event: {
      id: 'evt_001',
      name: 'Business Summit 2026',
    },
  },
  {
    id: 'TXN-002',
    amount: 45000.00,
    currency: 'MWK',
    status: 'pending',
    method: 'TNM Mpamba',
    date: '2026-03-29T14:22:00Z',
    customer: {
      name: 'Lilongwe Agro',
      email: 'sales@lilongweagro.com',
    },
    event: null,
  },
  {
    id: 'TXN-003',
    amount: 89000.00,
    currency: 'MWK',
    status: 'refunded',
    method: 'National Bank',
    date: '2026-03-28T09:15:00Z',
    customer: {
      name: 'Zomba Retail',
      email: 'info@zombaretail.com',
    },
    event: {
      id: 'evt_002',
      name: 'Retail Expo 2026',
    },
  },
];

export const MOCK_EVENTS = [
  {
    id: 'evt_001',
    name: 'Business Summit 2026',
    date: 'Apr 15, 2026',
    sponsorAmount: 2500000,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop',
  },
  {
    id: 'evt_002',
    name: 'Retail Expo 2026',
    date: 'May 5, 2026',
    sponsorAmount: 1500000,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop',
  },
];

export const MOCK_API_KEYS = [
  {
    id: 'key_001',
    name: 'Production Key',
    key: 'pk_live_abc123def456',
    createdAt: 'Jan 15, 2026',
    lastUsed: 'Today',
    usage: 12450,
  },
  {
    id: 'key_002',
    name: 'Development Key',
    key: 'pk_test_xyz789ghi012',
    createdAt: 'Feb 1, 2026',
    lastUsed: 'Yesterday',
    usage: 3450,
  },
];

export const MOCK_WEBHOOKS = [
  {
    id: 'wh_001',
    url: 'https://api.merchant.com/webhooks/payments',
    events: ['payment.succeeded', 'payment.failed'],
    lastDelivery: {
      date: '2026-03-30T10:30:00Z',
      status: 'success',
    },
  },
];

export const MOCK_REFUNDS = [
  {
    id: 'ref_001',
    transactionId: 'TXN-003',
    amount: 89000,
    reason: 'Customer Request',
    status: 'pending',
    date: 'Mar 29, 2026',
  },
];

export const MOCK_TEAM = [
  {
    id: 'user_001',
    name: 'Jane Doe',
    email: 'jane@merchant.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    eventAccess: ['all'],
  },
  {
    id: 'user_002',
    name: 'Mike Smith',
    email: 'mike@merchant.com',
    role: 'editor',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    eventAccess: ['evt_001'],
  },
];

export const MOCK_PAYMENT_LINKS = [
  {
    id: 'pl_001',
    title: 'Early Bird Ticket',
    amount: 45000,
    currency: 'MWK',
    event: 'Business Summit 2026',
    clicks: 245,
    conversions: 12,
    createdAt: '2026-03-25',
  },
  {
    id: 'pl_002',
    title: 'VIP Pass',
    amount: 150000,
    currency: 'MWK',
    event: null,
    clicks: 89,
    conversions: 5,
    createdAt: '2026-03-20',
  },
];
