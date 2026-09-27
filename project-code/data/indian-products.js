const catalog = {
  Electronics: [
    ['Wireless Noise Cancelling Headphones', 8999], ['Compact Bluetooth Speaker', 3499], ['Wireless Mechanical Keyboard', 6499], ['USB C Fast Charger 65W', 1999], ['Smart LED Desk Lamp', 2499], ['Smartwatch Active', 5499], ['Wireless Mouse Silent', 899], ['1080p Webcam', 2799], ['Power Bank 20000mAh', 2199], ['Bluetooth Neckband', 1499], ['4K Streaming Stick', 3999], ['Portable SSD 1TB', 7299], ['WiFi Router Dual Band', 2899]
  ],
  Home: [
    ['Air Fryer Mini', 4999], ['Ceramic Coffee Mug Set', 1299], ['Cotton Throw Blanket', 1899], ['Indoor Plant Pot Set', 1499], ['Mixer Grinder 750W', 4199], ['Electric Kettle 1.5L', 1299], ['Non Stick Cookware Set', 2599], ['Microfiber Bedsheet King Size', 999], ['Laundry Basket Foldable', 699], ['Pressure Cooker 5L', 2299], ['Room Heater Compact', 2199], ['Aroma Diffuser', 1799], ['LED String Lights', 499]
  ],
  Sports: [
    ['Running Shoes Breeze', 2999], ['Yoga Mat Pro', 999], ['Insulated Water Bottle', 799], ['Resistance Band Set', 699], ['Cricket Bat Kashmir Willow', 2499], ['Cricket Tennis Ball Pack', 399], ['Badminton Racket Set', 1599], ['Football Size 5', 899], ['Skipping Rope Adjustable', 299], ['Gym Gloves Pair', 549], ['Trekking Backpack 45L', 3299], ['Cycling Helmet', 1499], ['Foam Roller', 849]
  ],
  Books: [
    ['The Productive Mind', 399], ['Introduction to Data Analytics', 599], ['Modern Marketing Essentials', 499], ['Atomic Habits', 499], ['Rich Dad Poor Dad', 399], ['Think Like a Monk', 450], ['The Psychology of Money', 429], ['Indian Polity', 899], ['Business Communication', 549], ['Python for Beginners', 699], ['English Grammar Workbook', 299], ['Cooking Made Easy', 350], ['Deep Work', 550]
  ],
  Office: [
    ['Ergonomic Office Chair', 10999], ['Weekly Planner Notebook', 349], ['Laptop Stand Aluminum', 1699], ['Desk Cable Organizer', 299], ['Gel Pen Pack', 199], ['A4 Copier Paper 500 Sheets', 379], ['Executive Laptop Bag', 2299], ['Stapler and Pin Set', 249], ['Whiteboard Magnetic 2x3 ft', 1899], ['Desk Organizer Wooden', 799], ['Wireless Presentation Clicker', 999], ['Ring Light 10 Inch', 1399], ['Calculator Desktop', 599]
  ],
  Fashion: [
    ['Cotton Kurta Men', 1299], ['Women Cotton Saree', 1599], ['Casual Cotton T Shirt', 499], ['Denim Jeans Slim Fit', 1799], ['Sports Shoes Women', 2199], ['Leather Wallet Brown', 799], ['Sunglasses Polarized', 999], ['Cotton Socks Pack', 349], ['Handbag Tote', 1899], ['Analog Wrist Watch', 2499], ['Men Formal Shirt', 1199], ['Women Ethnic Dupatta', 599]
  ],
  Beauty: [
    ['Aloe Vera Face Wash', 249], ['Vitamin C Serum', 599], ['Herbal Shampoo 650ml', 399], ['Body Lotion Cocoa', 349], ['Matte Lipstick Set', 799], ['Hair Dryer Compact', 1299], ['Beard Grooming Kit', 699], ['Sunscreen SPF 50', 449], ['Face Sheet Mask Pack', 299], ['Nail Paint Set', 399], ['Natural Kajal', 199], ['Rose Water Toner', 179]
  ],
  Grocery: [
    ['Green Tea 100 Bags', 349], ['Basmati Rice 5kg', 699], ['Cold Pressed Mustard Oil 1L', 219], ['Assorted Dry Fruits 500g', 899], ['Masala Tea Blend', 179], ['Toor Dal 1kg', 189], ['Peanut Butter Crunchy', 329], ['Dark Chocolate Bar Pack', 299], ['Instant Oats 1kg', 269], ['Honey Natural 500g', 299], ['Ghee Cow 1L', 799]
  ]
};

const categoryDescriptions = {
  Electronics: 'Reliable technology for work, entertainment, and everyday use.',
  Home: 'Practical Indian-home essential for comfortable daily living.',
  Sports: 'Useful gear for fitness, sport, travel, and active routines.',
  Books: 'Popular and useful reading for learning, career, or leisure.',
  Office: 'Practical item for study, productivity, and the workspace.',
  Fashion: 'Comfortable everyday Indian-market fashion accessory or apparel.',
  Beauty: 'Personal care product for a simple daily routine.',
  Grocery: 'Everyday food and pantry product for Indian kitchens.'
};

export default Object.entries(catalog).flatMap(([category, products]) =>
  products.map(([name, price], index) => ({
    id: `in-${category.toLowerCase()}-${index + 1}`,
    name,
    description: categoryDescriptions[category],
    category,
    price,
    rating: Number((4 + ((index % 9) / 10)).toFixed(1)),
    tags: [category.toLowerCase(), ...name.toLowerCase().split(' ').slice(0, 2)],
    imageUrl: ''
  }))
);
