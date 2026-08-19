// ─── Placeholder Data for FlowClaim ───

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

export const FX_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
};

export const CATEGORIES = [
  { id: "travel", label: "Travel", icon: "Plane", color: "#3B82F6" },
  { id: "dining", label: "Dining", icon: "UtensilsCrossed", color: "#F59E0B" },
  { id: "supplies", label: "Supplies", icon: "Package", color: "#8B5CF6" },
  { id: "tech", label: "Tech", icon: "Monitor", color: "#06B6D4" },
  { id: "operations", label: "Operations", icon: "Settings", color: "#10B981" },
  { id: "transport", label: "Transport", icon: "Car", color: "#EC4899" },
  {
    id: "accommodation",
    label: "Accommodation",
    icon: "Building",
    color: "#F97316",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: "Music",
    color: "#6366F1",
  },
];

export const MOCK_USER_EMPLOYEE = {
  id: 1,
  name: "Marcus Chen",
  email: "marcus@ethereal.co",
  role: "EMPLOYEE",
  title: "Sr. Product Lead",
  avatar: null,
  companyId: 1,
  companyName: "FlowClaim",
};

export const MOCK_USER_MANAGER = {
  id: 2,
  name: "Marcus Vane",
  email: "mvane@ethereal.co",
  role: "MANAGER",
  title: "Finance Manager",
  avatar: null,
  companyId: 1,
  companyName: "FlowClaim",
};

export const MOCK_USER_ADMIN = {
  id: 3,
  name: "Alex Chen",
  email: "achen@ethereal.co",
  role: "ADMIN",
  title: "Finance Admin",
  avatar: null,
  companyId: 1,
  companyName: "FlowClaim",
};

export const RECENT_EXPENSES = [
  {
    id: "EXP-99122",
    title: "Blue Bottle Coffee",
    description: "Client meeting at SFO Terminal",
    category: "dining",
    amount: 14.5,
    currency: "USD",
    amountCompany: 1206.48,
    currencyCompany: "INR",
    date: "2024-11-15",
    status: "PENDING",
    timeAgo: "2 hours ago",
    approvalChain: [
      {
        step: 1,
        role: "Direct Manager",
        name: "Sarah Kim",
        status: "APPROVED",
      },
      { step: 2, role: "Finance", name: "Alex Chen", status: "CURRENT" },
      { step: 3, role: "CFO", name: "Jordan D'Amico", status: "PENDING" },
    ],
  },
  {
    id: "EXP-99118",
    title: "Uber Technologies",
    description: "Airport shuttle to Hyatt Regency",
    category: "travel",
    amount: 42.12,
    currency: "USD",
    amountCompany: 3500.69,
    currencyCompany: "INR",
    date: "2024-11-14",
    status: "APPROVED",
    timeAgo: "Verified",
    approvalChain: [
      {
        step: 1,
        role: "Direct Manager",
        name: "Sarah Kim",
        status: "APPROVED",
      },
      { step: 2, role: "Finance", name: "Alex Chen", status: "APPROVED" },
      { step: 3, role: "CFO", name: "Jordan D'Amico", status: "APPROVED" },
    ],
  },
  {
    id: "EXP-99105",
    title: "Apple Store",
    description: "USB-C Hub and Magic Mouse",
    category: "supplies",
    amount: 199.0,
    currency: "USD",
    amountCompany: 16541.88,
    currencyCompany: "INR",
    date: "2024-11-13",
    status: "PENDING",
    timeAgo: "AI Analyzed",
    approvalChain: [
      {
        step: 1,
        role: "Direct Manager",
        name: "Sarah Kim",
        status: "APPROVED",
      },
      { step: 2, role: "Finance", name: "Alex Chen", status: "PENDING" },
      { step: 3, role: "CFO", name: "Jordan D'Amico", status: "PENDING" },
    ],
  },
];

export const EXPENSE_LEDGER = [
  {
    id: "EXP-99122",
    title: "Q3 Hardware Stipend",
    date: "Nov 12, 2023",
    category: "operations",
    status: "IN_FINANCE",
    amount: 1240.0,
    currency: "USD",
    approvalChain: [
      { step: 1, role: "Manager", status: "APPROVED" },
      { step: 2, role: "Finance", status: "CURRENT" },
      { step: 3, role: "CFO", status: "PENDING" },
    ],
  },
  {
    id: "EXP-99118",
    title: "Team Dinner - Boston",
    date: "Nov 10, 2023",
    category: "dining",
    status: "APPROVED",
    amount: 485.2,
    currency: "USD",
    approvalChain: [
      { step: 1, role: "Manager", status: "APPROVED" },
      { step: 2, role: "Finance", status: "APPROVED" },
      { step: 3, role: "CFO", status: "APPROVED" },
    ],
  },
  {
    id: "EXP-96002",
    title: "AWS Hosting - Dev",
    date: "Nov 08, 2023",
    category: "tech",
    status: "PENDING_MANAGER",
    amount: 89.0,
    currency: "USD",
    approvalChain: [
      { step: 1, role: "Manager", status: "CURRENT" },
      { step: 2, role: "Finance", status: "PENDING" },
      { step: 3, role: "CFO", status: "PENDING" },
    ],
  },
  {
    id: "EXP-95890",
    title: "Figma Enterprise License",
    date: "Nov 05, 2023",
    category: "tech",
    status: "APPROVED",
    amount: 720.0,
    currency: "USD",
    approvalChain: [
      { step: 1, role: "Manager", status: "APPROVED" },
      { step: 2, role: "Finance", status: "APPROVED" },
      { step: 3, role: "CFO", status: "APPROVED" },
    ],
  },
  {
    id: "EXP-95712",
    title: "WeWork Day Pass - NYC",
    date: "Nov 02, 2023",
    category: "operations",
    status: "REJECTED",
    amount: 65.0,
    currency: "USD",
    approvalChain: [
      { step: 1, role: "Manager", status: "APPROVED" },
      { step: 2, role: "Finance", status: "REJECTED" },
      { step: 3, role: "CFO", status: "PENDING" },
    ],
  },
];

export const PENDING_QUEUE = [
  {
    id: "EXP-9902",
    employee: { name: "Elena Rodriguez", role: "Marketing Lead", avatar: null },
    merchant: "Lufthansa - Business Flight",
    merchantIcon: "Plane",
    purpose: "Q4 Conference in Berlin",
    amountOriginal: 1240.0,
    currencyOriginal: "EUR",
    amountCompany: 1348.52,
    currencyCompany: "USD",
    date: "2024-11-14",
    aiNote:
      "No policy violations detected. This expense is 12% lower than the typical flight for this route.",
    riskScore: "LOW",
  },
  {
    id: "EXP-9901",
    employee: { name: "James Park", role: "Engineering Lead", avatar: null },
    merchant: "Hilton Garden Inn",
    merchantIcon: "Building",
    purpose: "3-night stay for client onsite",
    amountOriginal: 890.0,
    currencyOriginal: "USD",
    amountCompany: 890.0,
    currencyCompany: "USD",
    date: "2024-11-13",
    aiNote:
      "Rate is within regional hotel caps. Duration matches calendar event.",
    riskScore: "LOW",
  },
  {
    id: "EXP-9899",
    employee: { name: "Priya Sharma", role: "Design Director", avatar: null },
    merchant: "Adobe Creative Cloud",
    merchantIcon: "Monitor",
    purpose: "Annual team subscription renewal",
    amountOriginal: 3200.0,
    currencyOriginal: "USD",
    amountCompany: 3200.0,
    currencyCompany: "USD",
    date: "2024-11-12",
    aiNote:
      "High amount flagged. Matches previous year subscription. Recurring expense detected.",
    riskScore: "MEDIUM",
  },
  {
    id: "EXP-9897",
    employee: { name: "Tom Wilson", role: "Sales Rep", avatar: null },
    merchant: "Delta Airlines",
    merchantIcon: "Plane",
    purpose: "Client visit - Chicago",
    amountOriginal: 456.0,
    currencyOriginal: "USD",
    amountCompany: 456.0,
    currencyCompany: "USD",
    date: "2024-11-11",
    aiNote: "Standard domestic flight. No anomalies detected.",
    riskScore: "LOW",
  },
];

export const ANALYTICS_CATEGORY_SPEND = [
  { name: "Travel", value: 12400, color: "#3B82F6" },
  { name: "Dining", value: 8200, color: "#F59E0B" },
  { name: "Tech", value: 15600, color: "#06B6D4" },
  { name: "Supplies", value: 4300, color: "#8B5CF6" },
  { name: "Operations", value: 6800, color: "#10B981" },
  { name: "Transport", value: 3200, color: "#EC4899" },
];

export const ANALYTICS_APPROVAL_RATE = [
  { month: "Jun", approved: 42, rejected: 5 },
  { month: "Jul", approved: 38, rejected: 8 },
  { month: "Aug", approved: 55, rejected: 3 },
  { month: "Sep", approved: 48, rejected: 6 },
  { month: "Oct", approved: 62, rejected: 4 },
  { month: "Nov", approved: 51, rejected: 7 },
];

export const ANALYTICS_MONTHLY_VELOCITY = [
  { day: "Mon", amount: 2400 },
  { day: "Tue", amount: 3100 },
  { day: "Wed", amount: 1800 },
  { day: "Thu", amount: 4200 },
  { day: "Fri", amount: 5600 },
];

export const ANALYTICS_TURNAROUND = {
  averageDays: 2.4,
  trend: -0.3,
  trendLabel: "faster than last month",
};

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Trip to Boston expense just approved by Manager!",
    type: "SOCKET_UPDATE",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    title: "New expense submitted by Elena Rodriguez",
    type: "NEW_EXPENSE",
    time: "15 min ago",
    read: false,
  },
  {
    id: 3,
    title: "Monthly analytics report is ready",
    type: "REPORT",
    time: "1 hour ago",
    read: true,
  },
];
