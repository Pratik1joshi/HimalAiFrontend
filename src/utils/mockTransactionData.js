// This file contains mock transaction data for testing purposes

// Helper function to generate a random UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Generate random date within a range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Categories with their probability weights
const expenseCategories = [
  { name: 'Food & Dining', weight: 25 },
  { name: 'Transportation', weight: 15 },
  { name: 'Shopping', weight: 15 },
  { name: 'Housing', weight: 10 },
  { name: 'Utilities', weight: 10 },
  { name: 'Entertainment', weight: 8 },
  { name: 'Healthcare', weight: 5 },
  { name: 'Education', weight: 3 },
  { name: 'Travel', weight: 5 },
  { name: 'Personal Care', weight: 4 }
];

const incomeCategories = [
  { name: 'Salary', weight: 70 },
  { name: 'Freelance', weight: 10 },
  { name: 'Interest', weight: 5 },
  { name: 'Dividends', weight: 5 },
  { name: 'Gifts', weight: 5 },
  { name: 'Other Income', weight: 5 }
];

// Payment methods with their probability weights
const paymentMethods = [
  { name: 'Credit Card', weight: 30 },
  { name: 'Cash', weight: 15 },
  { name: 'Debit Card', weight: 20 },
  { name: 'Bank Transfer', weight: 10 },
  { name: 'PayPal', weight: 8 },
  { name: 'Venmo', weight: 5 },
  { name: 'eSewa', weight: 5 },
  { name: 'Khalti', weight: 4 },
  { name: 'IME Pay', weight: 3 }
];

// Sample descriptions for each category
const descriptions = {
  'Food & Dining': [
    'Grocery shopping', 'Restaurant dinner', 'Coffee shop', 'Food delivery', 
    'Lunch with colleagues', 'Bakery', 'Ice cream', 'Fast food'
  ],
  'Transportation': [
    'Gas refill', 'Bus ticket', 'Taxi ride', 'Car maintenance', 'Parking fee',
    'Highway toll', 'Train ticket', 'Ride sharing'
  ],
  'Shopping': [
    'Clothing purchase', 'Electronics', 'Home decor', 'Books', 'Online shopping',
    'Department store', 'Gift purchase', 'Accessories'
  ],
  'Housing': [
    'Rent payment', 'Mortgage', 'Property tax', 'Home insurance', 'Home repairs',
    'Furniture', 'Cleaning services', 'Moving expenses'
  ],
  'Utilities': [
    'Electricity bill', 'Water bill', 'Internet service', 'Phone bill', 'Gas bill',
    'Streaming subscription', 'Waste management', 'Cable TV'
  ],
  'Entertainment': [
    'Movie tickets', 'Concert', 'Streaming subscription', 'Game purchase', 
    'Museum entry', 'Theme park', 'Sporting event', 'Music purchase'
  ],
  'Healthcare': [
    'Doctor visit', 'Prescription', 'Dental care', 'Health insurance', 'Eye care',
    'Therapy session', 'Gym membership', 'Vitamins & supplements'
  ],
  'Education': [
    'Tuition fee', 'Books', 'Online course', 'School supplies', 'Tutoring',
    'Workshop fee', 'Professional certification', 'Student loan payment'
  ],
  'Travel': [
    'Flight tickets', 'Hotel booking', 'Travel insurance', 'Vacation activities',
    'Car rental', 'Souvenirs', 'Cruise tickets', 'Travel gear'
  ],
  'Personal Care': [
    'Haircut', 'Spa treatment', 'Beauty products', 'Cosmetics', 'Massage',
    'Nail salon', 'Grooming products', 'Fitness equipment'
  ],
  'Salary': [
    'Monthly salary', 'Weekly wages', 'Paycheck', 'Income', 'Employment compensation',
    'Bi-weekly pay', 'Direct deposit', 'Wages'
  ],
  'Freelance': [
    'Client payment', 'Project fee', 'Consulting income', 'Contract work', 
    'Gig payment', 'Independent work', 'Service fee', 'Freelance gig'
  ],
  'Interest': [
    'Savings interest', 'CD maturity', 'Investment return', 'Account interest',
    'Bond interest', 'Deposit interest', 'Money market interest', 'Interest income'
  ],
  'Dividends': [
    'Stock dividend', 'Shareholder payment', 'ETF dividend', 'Investment return',
    'Mutual fund dividend', 'Quarterly dividend', 'Annual dividend', 'Dividend income'
  ],
  'Gifts': [
    'Birthday gift', 'Holiday gift', 'Reward', 'Bonus', 'Cash gift',
    'Present', 'Money gift', 'Gift money'
  ],
  'Other Income': [
    'Refund', 'Rebate', 'Tax return', 'Reimbursement', 'Cash back',
    'Prize money', 'Sale proceeds', 'Miscellaneous income'
  ]
};

// Generate a weighted random selection from an array of objects with weight properties
const weightedRandom = (items) => {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item.name;
    }
  }
  
  return items[0].name; // Fallback
};

// Generate a random amount within a range based on category
const randomAmount = (category, isIncome) => {
  if (isIncome) {
    switch (category) {
      case 'Salary':
        return Math.floor(2000 + Math.random() * 3000);
      case 'Freelance':
        return Math.floor(100 + Math.random() * 400);
      case 'Interest':
      case 'Dividends':
        return Math.floor(10 + Math.random() * 90);
      default:
        return Math.floor(50 + Math.random() * 150);
    }
  } else {
    switch (category) {
      case 'Housing':
        return -Math.floor(500 + Math.random() * 1000);
      case 'Transportation':
        return -Math.floor(20 + Math.random() * 100);
      case 'Food & Dining':
        return -Math.floor(10 + Math.random() * 70);
      case 'Utilities':
        return -Math.floor(50 + Math.random() * 150);
      case 'Travel':
        return -Math.floor(200 + Math.random() * 800);
      default:
        return -Math.floor(10 + Math.random() * 100);
    }
  }
};

// Generate a random description for a category
const randomDescription = (category) => {
  const options = descriptions[category] || ['Payment'];
  return options[Math.floor(Math.random() * options.length)];
};

// Generate mock transactions for the past month
export const generateMockTransactions = (count = 100) => {
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const transactions = [];

  // Generate expense transactions (about 75% of all transactions)
  const expenseCount = Math.floor(count * 0.75);
  for (let i = 0; i < expenseCount; i++) {
    const category = weightedRandom(expenseCategories);
    const paymentMethod = weightedRandom(paymentMethods);
    const date = randomDate(oneMonthAgo, now);
    
    transactions.push({
      id: generateUUID(),
      amount: randomAmount(category, false),  // negative amount for expenses
      category: category,
      payment_method: paymentMethod,
      description: randomDescription(category),
      date: date.toISOString(),
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
      notes: '',
      tags: []
    });
  }

  // Generate income transactions (about 25% of all transactions)
  const incomeCount = count - expenseCount;
  for (let i = 0; i < incomeCount; i++) {
    const category = weightedRandom(incomeCategories);
    const paymentMethod = weightedRandom(paymentMethods);
    const date = randomDate(oneMonthAgo, now);
    
    // For salary, set it to beginning of month
    let transactionDate = date;
    if (category === 'Salary') {
      transactionDate = new Date(date.getFullYear(), date.getMonth(), 1);
    }
    
    transactions.push({
      id: generateUUID(),
      amount: randomAmount(category, true),  // positive amount for income
      category: category,
      payment_method: paymentMethod,
      description: randomDescription(category),
      date: transactionDate.toISOString(),
      created_at: transactionDate.toISOString(),
      updated_at: transactionDate.toISOString(),
      notes: '',
      tags: []
    });
  }

  // Sort transactions by date (newest first)
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return transactions;
};

// Generate a predefined set of transactions for testing
export const MOCK_TRANSACTIONS = generateMockTransactions(150);

export default MOCK_TRANSACTIONS;
