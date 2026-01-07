const fs = require('fs');
const path = require('path');

// Helper function to generate random date in a given month
function randomDate(year, month) {
  const day = Math.floor(Math.random() * 28) + 1;
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  const date = new Date(year, month, day, hour, minute);
  return date;
}

function formatDateTime(date) {
  return date.toISOString();
}

function formatDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = date.getHours() % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${year}-${month}-${day}, ${hour}:${minute} ${ampm}`;
}

// Sample names
const firstNames = ['Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'James', 'Michael', 'David', 'John', 'Robert', 'William', 'Joseph', 'Thomas', 'Charles', 'Daniel'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

function randomName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  return { firstName, lastName, email };
}

// Generate membership sales (no renewals)
function generateMembershipSalesNoRenewals() {
  const headers = '"Purchase ID","First Name","Last Name","Customer Email","Membership ID","Membership Name","Bought Date/Time (GMT)","Paid Amount","Membership Type","Remaining/ Expiry/ Renewal","Payment Token","Expired","Frozen","Refunded","Sold by"';
  
  const memberships = [
    { name: '4-Class Monthly Membership', price: 99.00 },
    { name: '8-Class Monthly Membership- $189', price: 189.00 },
    { name: '12-Class Monthly Membership-$269', price: 269.00 },
    { name: 'Unlimited Monthly Membership', price: 315.00 }
  ];
  
  const rows = [];
  const numMembers = 28; // Generate ~28 new members for September
  
  for (let i = 0; i < numMembers; i++) {
    const { firstName, lastName, email } = randomName();
    const membership = memberships[Math.floor(Math.random() * memberships.length)];
    const date = randomDate(2025, 8); // September 2025
    const expiryDate = new Date(date);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    const row = [
      `"${50000000 + i}"`,
      `"${firstName}"`,
      `"${lastName}"`,
      `"${email}"`,
      `"${200000 + i}"`,
      `"${membership.name}"`,
      `"${formatDateTime(date)}"`,
      `"${membership.price.toFixed(2)}"`,
      `"subscription"`,
      `"${formatDateTime(expiryDate)}"`,
      `"pi_${Math.random().toString(36).substring(2, 15)}"`,
      `"No"`,
      `"No"`,
      `"0.00"`,
      `""`
    ];
    
    rows.push(row.join(','));
  }
  
  return headers + '\n' + rows.join('\n');
}

// Generate membership sales (with renewals)
function generateMembershipSalesWithRenewals() {
  const headers = '"Purchase ID","First Name","Last Name","Customer Email","Membership ID","Membership Name","Bought Date/Time (GMT)","Paid Amount","Membership Type","Remaining/ Expiry/ Renewal","Payment Token","Expired","Frozen","Refunded","Sold by"';
  
  const memberships = [
    { name: '4-Class Monthly Membership', price: 99.00 },
    { name: '8-Class Monthly Membership- $189', price: 189.00 },
    { name: '12-Class Monthly Membership-$269', price: 269.00 },
    { name: 'Unlimited Monthly Membership', price: 315.00 }
  ];
  
  const rows = [];
  
  // Add new members (28)
  for (let i = 0; i < 28; i++) {
    const { firstName, lastName, email } = randomName();
    const membership = memberships[Math.floor(Math.random() * memberships.length)];
    const date = randomDate(2025, 8);
    const expiryDate = new Date(date);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    const row = [
      `"${50000000 + i}"`,
      `"${firstName}"`,
      `"${lastName}"`,
      `"${email}"`,
      `"${200000 + i}"`,
      `"${membership.name}"`,
      `"${formatDateTime(date)}"`,
      `"${membership.price.toFixed(2)}"`,
      `"subscription"`,
      `"${formatDateTime(expiryDate)}"`,
      `"pi_${Math.random().toString(36).substring(2, 15)}"`,
      `"No"`,
      `"No"`,
      `"0.00"`,
      `""`
    ];
    
    rows.push(row.join(','));
  }
  
  // Add renewals (simulating ~180 total active members)
  for (let i = 0; i < 152; i++) {
    const { firstName, lastName, email } = randomName();
    const membership = memberships[Math.floor(Math.random() * memberships.length)];
    const date = randomDate(2025, 8);
    const expiryDate = new Date(date);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    const row = [
      `"${40000000 + i}"`,
      `"${firstName}"`,
      `"${lastName}"`,
      `"${email}"`,
      `"${100000 + i}"`,
      `"${membership.name}"`,
      `"${formatDateTime(date)}"`,
      `"${membership.price.toFixed(2)}"`,
      `"subscription"`,
      `"${formatDateTime(expiryDate)}"`,
      `"pi_${Math.random().toString(36).substring(2, 15)}"`,
      `"No"`,
      `"No"`,
      `"0.00"`,
      `""`
    ];
    
    rows.push(row.join(','));
  }
  
  return headers + '\n' + rows.join('\n');
}

// Generate intro offers sales
function generateIntroOffersSales() {
  const headers = '"Purchase ID","First Name","Last Name","Customer Email","Intro Offer ID","Intro Offer Name","Purchase date","Paid Amount","Intro Offer Type","Remaining/ Expiry","Payment Token","Expired","Refunded","Sold by"';
  
  const introOffers = [
    { name: 'New Flyer 3 Class Pack', price: 59.00 },
    { name: 'Unlimited 14 Day Intro Package', price: 49.00 },
    { name: 'New Flyer 6 Class Pack', price: 69.00 }
  ];
  
  const rows = [];
  const numIntros = 85; // Generate ~85 intro sales for September
  
  for (let i = 0; i < numIntros; i++) {
    const { firstName, lastName, email } = randomName();
    const intro = introOffers[Math.floor(Math.random() * introOffers.length)];
    const date = randomDate(2025, 8);
    const expiryDate = new Date(date);
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    const row = [
      `"${60000000 + i}"`,
      `"${firstName}"`,
      `"${lastName}"`,
      `"${email}"`,
      `"${300000 + i}"`,
      `"${intro.name}"`,
      `"${formatDateTime(date)}"`,
      `"${intro.price.toFixed(2)}"`,
      `"pack"`,
      `"${formatDateTime(expiryDate)}"`,
      `"pi_${Math.random().toString(36).substring(2, 15)}"`,
      `"No"`,
      `"0.00"`,
      `""`
    ];
    
    rows.push(row.join(','));
  }
  
  return headers + '\n' + rows.join('\n');
}

// Generate new leads and customers
function generateLeadsCustomers() {
  const headers = '"Customer ID","First Name","Last Name","Email","Phone","Join date","First purchase","Total Spent","Location","Tags","Notes"';
  
  const introOffers = [
    'New Flyer 3 Class Pack',
    'Unlimited 14 Day Intro Package',
    'New Flyer 6 Class Pack',
    '4-Class Monthly Membership',
    'Drop-in Class',
    ''
  ];
  
  const rows = [];
  const numLeads = 240; // Generate ~240 leads for July-Sept (3 months)
  
  for (let i = 0; i < numLeads; i++) {
    const { firstName, lastName, email } = randomName();
    const month = 6 + Math.floor(Math.random() * 3); // July, Aug, Sept
    const date = randomDate(2025, month);
    const firstPurchase = introOffers[Math.floor(Math.random() * introOffers.length)];
    const totalSpent = firstPurchase ? (Math.random() * 200 + 50).toFixed(2) : '0.00';
    
    const row = [
      `"${400000 + i}"`,
      `"${firstName}"`,
      `"${lastName}"`,
      `"${email}"`,
      `"555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}"`,
      `"${formatDateTime(date)}"`,
      `"${firstPurchase}"`,
      `"${totalSpent}"`,
      `"Main Studio"`,
      `""`,
      `""`
    ];
    
    rows.push(row.join(','));
  }
  
  return headers + '\n' + rows.join('\n');
}

// Generate intro conversions
function generateIntroConversions() {
  const headers = '"Purchase ID","First Name","Last Name","Customer Email","Intro Offer Name","Purchase date","Converted to","Conversion date","Days to convert"';
  
  const introOffers = [
    'New Flyer 3 Class Pack',
    'Unlimited 14 Day Intro Package',
    'New Flyer 6 Class Pack'
  ];
  
  const conversions = [
    '4-Class Monthly Membership',
    '8-Class Monthly Membership- $189',
    '12-Class Monthly Membership-$269',
    'Unlimited Monthly Membership',
    '10 Class Package',
    '5 Class Package',
    ''
  ];
  
  const rows = [];
  const numConversions = 95; // Generate conversions for July-Sept
  
  for (let i = 0; i < numConversions; i++) {
    const { firstName, lastName, email } = randomName();
    const month = 6 + Math.floor(Math.random() * 3);
    const purchaseDate = randomDate(2025, month);
    const converted = conversions[Math.floor(Math.random() * conversions.length)];
    
    if (converted) {
      const conversionDate = new Date(purchaseDate);
      const daysToConvert = Math.floor(Math.random() * 30) + 1;
      conversionDate.setDate(conversionDate.getDate() + daysToConvert);
      
      const row = [
        `"${60000000 + i}"`,
        `"${firstName}"`,
        `"${lastName}"`,
        `"${email}"`,
        `"${introOffers[Math.floor(Math.random() * introOffers.length)]}"`,
        `"${formatDateTime(purchaseDate)}"`,
        `"${converted}"`,
        `"${formatDateTime(conversionDate)}"`,
        `"${daysToConvert}"`
      ];
      
      rows.push(row.join(','));
    }
  }
  
  return headers + '\n' + rows.join('\n');
}

// Generate payments
function generatePayments() {
  const headers = '"Category","Item","Date","Sale value","Tax","Refunded","Payment method","Payment status","Sale reference","Sold by","Paying Customer email","Paying Customer name","Customer email","Customer name","Location","Note"';
  
  const categories = [
    { category: 'Subscription', items: ['4-Class Monthly Membership', '8-Class Monthly Membership- $189', '12-Class Monthly Membership-$269', 'Unlimited Monthly Membership'], prices: [99, 189, 269, 315] },
    { category: 'Pack', items: ['New Flyer 3 Class Pack', 'New Flyer 6 Class Pack', '10 Class Package', '5 Class Package'], prices: [59, 69, 280, 150] },
    { category: 'Class', items: ['Pole Level 1', 'Pole Level 2', 'Intro to Pole: Dance'], prices: [35, 35, 35] },
    { category: 'Appointment', items: ['1 Hr Private Lesson', '30 Min Private Lesson'], prices: [95, 50] },
    { category: 'Product', items: ['Dry Hands 2oz', 'Grip Aid', 'Studio Merchandise'], prices: [11.40, 15.00, 25.00] }
  ];
  
  const rows = [];
  const numPayments = 450; // Generate ~450 payments for September
  
  for (let i = 0; i < numPayments; i++) {
    const { firstName, lastName, email } = randomName();
    const date = randomDate(2025, 8);
    const categoryData = categories[Math.floor(Math.random() * categories.length)];
    const itemIndex = Math.floor(Math.random() * categoryData.items.length);
    const item = categoryData.items[itemIndex];
    const price = categoryData.prices[itemIndex];
    
    const row = [
      `"${categoryData.category}"`,
      `"${item}"`,
      `"${formatDateTimeLocal(date)}"`,
      `"${price.toFixed(2)}"`,
      `"0.00"`,
      `"0.00"`,
      `"Card"`,
      `"Succeeded"`,
      `"${200000000 + i}"`,
      `""`,
      `"${email}"`,
      `"${firstName} ${lastName}"`,
      `"${email}"`,
      `"${firstName} ${lastName}"`,
      `"Main Studio"`,
      `""`
    ];
    
    rows.push(row.join(','));
  }
  
  return headers + '\n' + rows.join('\n');
}

// Create sample-data directory and write files
const sampleDir = path.join(__dirname, 'sample-data');

if (!fs.existsSync(sampleDir)) {
  fs.mkdirSync(sampleDir);
}

console.log('Generating sample data files...\n');

// Generate all files
const files = [
  { name: 'momence--membership-sales-export-norenewals.csv', generator: generateMembershipSalesNoRenewals },
  { name: 'momence--membership-sales-export-withrenewals.csv', generator: generateMembershipSalesWithRenewals },
  { name: 'momence-intro-offers-sales-report.csv', generator: generateIntroOffersSales },
  { name: 'momence-new-leads-and-customers.csv', generator: generateLeadsCustomers },
  { name: 'momence-intro-offers-conversions-report.csv', generator: generateIntroConversions },
  { name: 'momence-latest-payments-report.csv', generator: generatePayments }
];

files.forEach(file => {
  const content = file.generator();
  const filePath = path.join(sampleDir, file.name);
  fs.writeFileSync(filePath, content);
  console.log(`✓ Generated ${file.name}`);
});

console.log('\n✅ All sample data files generated successfully in the sample-data folder!');
console.log('\nYou can now use these files for your demo by uploading them through the file upload interface.');



