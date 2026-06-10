/**
 * Carbon Footprint Platform — Data Constants
 * All emission factors in kg CO₂e per unit
 * Sources: IPCC AR6, DEFRA 2023, IEA 2023, EPA eGRID 2022
 */

export const INDIA_GRID_INTENSITY = 0.716; // kg CO₂e/kWh (CEA 2022)
export const GLOBAL_AVG_FOOTPRINT = 4900; // kg CO₂e/year per capita

// ─── Emission Factors ─────────────────────────────────────────────────────────

export const EMISSION_FACTORS = {
  transport: {
    car_petrol_small:  { factor: 0.154, unit: "km", label: "Petrol Car (small)" },
    car_petrol_medium: { factor: 0.192, unit: "km", label: "Petrol Car (medium)" },
    car_diesel:        { factor: 0.171, unit: "km", label: "Diesel Car" },
    car_electric:      { factor: 0.053, unit: "km", label: "Electric Car" },
    two_wheeler:       { factor: 0.089, unit: "km", label: "Two-Wheeler" },
    bus:               { factor: 0.089, unit: "km", label: "City Bus" },
    metro_rail:        { factor: 0.028, unit: "km", label: "Metro/Rail" },
    auto_rickshaw:     { factor: 0.112, unit: "km", label: "Auto-Rickshaw" },
    flight_domestic:   { factor: 0.255, unit: "km", label: "Domestic Flight" },
    flight_short:      { factor: 0.195, unit: "km", label: "Short-Haul Flight (<3h)" },
    flight_long:       { factor: 0.195, unit: "km", label: "Long-Haul Flight (>3h)" },
  },
  energy: {
    electricity:     { factor: INDIA_GRID_INTENSITY, unit: "kWh", label: "Electricity" },
    lpg:             { factor: 2.983, unit: "kg",  label: "LPG Cylinder" },
    natural_gas:     { factor: 2.040, unit: "m3",  label: "Natural Gas" },
    firewood:        { factor: 1.890, unit: "kg",  label: "Firewood" },
    solar:           { factor: 0.041, unit: "kWh", label: "Solar (off-grid)" },
  },
  food: {
    beef:        { factor: 27.00, unit: "kg", label: "Beef" },
    lamb:        { factor: 39.20, unit: "kg", label: "Lamb/Mutton" },
    pork:        { factor: 12.10, unit: "kg", label: "Pork" },
    chicken:     { factor: 6.90,  unit: "kg", label: "Chicken" },
    fish:        { factor: 6.10,  unit: "kg", label: "Fish/Seafood" },
    dairy_milk:  { factor: 3.15,  unit: "L",  label: "Dairy Milk" },
    eggs:        { factor: 4.80,  unit: "kg", label: "Eggs" },
    cheese:      { factor: 13.50, unit: "kg", label: "Cheese" },
    rice:        { factor: 2.70,  unit: "kg", label: "Rice" },
    wheat:       { factor: 1.57,  unit: "kg", label: "Wheat/Bread" },
    vegetables:  { factor: 2.00,  unit: "kg", label: "Vegetables" },
    fruits:      { factor: 1.10,  unit: "kg", label: "Fruits" },
    legumes:     { factor: 0.90,  unit: "kg", label: "Legumes/Dal" },
    food_waste:  { factor: 2.53,  unit: "kg", label: "Food Waste" },
  },
  shopping: {
    clothing:      { factor: 30.0,  unit: "item", label: "Clothing Item" },
    electronics:   { factor: 300.0, unit: "item", label: "Electronics (phone/tablet)" },
    laptop:        { factor: 420.0, unit: "item", label: "Laptop/PC" },
    streaming:     { factor: 0.036, unit: "hour", label: "Video Streaming" },
    paper:         { factor: 0.93,  unit: "kg",   label: "Paper/Printing" },
    plastic_waste: { factor: 6.00,  unit: "kg",   label: "Plastic Waste" },
  },
};

// ─── Categories Metadata ─────────────────────────────────────────────────────

export const CATEGORIES = [
  {
    id: "transport",
    label: "Transport",
    icon: "🚗",
    color: "#2563eb",
    description: "Daily commutes, trips, and flights",
    avgShare: 29,
  },
  {
    id: "energy",
    label: "Home Energy",
    icon: "⚡",
    color: "#16a34a",
    description: "Electricity, gas, and fuel at home",
    avgShare: 26,
  },
  {
    id: "food",
    label: "Food & Diet",
    icon: "🍽️",
    color: "#d97706",
    description: "What and how much you eat",
    avgShare: 31,
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: "🛍️",
    color: "#7c3aed",
    description: "Products, clothes, electronics",
    avgShare: 14,
  },
];

// ─── Eco Tips ─────────────────────────────────────────────────────────────────

export const ECO_TIPS = [
  {
    id: "t1",
    category: "transport",
    title: "Switch to Metro for daily commute",
    impact: 680,
    difficulty: "easy",
    timeframe: "monthly",
    description: "Metro emits 94% less CO₂ than a petrol car per km. A 10 km daily commute saves ~680 kg/year.",
    action: "Find your metro route",
    tag: "High Impact",
  },
  {
    id: "t2",
    category: "transport",
    title: "Work from home 2 days/week",
    impact: 320,
    difficulty: "medium",
    timeframe: "monthly",
    description: "Eliminating commutes twice weekly can save significant fuel and CO₂ annually.",
    action: "Request hybrid policy",
    tag: "Lifestyle",
  },
  {
    id: "t3",
    category: "energy",
    title: "Install a 2kW solar rooftop",
    impact: 1800,
    difficulty: "hard",
    timeframe: "yearly",
    description: "India's solar irradiance averages 5-6 kWh/m²/day. A 2kW system offsets ~1800 kg CO₂/year.",
    action: "Get solar quote",
    tag: "Investment",
  },
  {
    id: "t4",
    category: "energy",
    title: "Switch to LED bulbs everywhere",
    impact: 120,
    difficulty: "easy",
    timeframe: "yearly",
    description: "LEDs use 75% less energy than incandescent. Full home swap saves ~120 kg/year.",
    action: "Shop LEDs",
    tag: "Quick Win",
  },
  {
    id: "t5",
    category: "food",
    title: "Go vegetarian on weekdays",
    impact: 800,
    difficulty: "medium",
    timeframe: "yearly",
    description: "Plant-based diets emit 50-70% less than meat-heavy diets. 5 veg days/week saves ~800 kg/year.",
    action: "Try veg recipes",
    tag: "High Impact",
  },
  {
    id: "t6",
    category: "food",
    title: "Cut food waste by meal planning",
    impact: 230,
    difficulty: "easy",
    timeframe: "yearly",
    description: "~40% of food in India is wasted. Planning meals reduces landfill methane emissions.",
    action: "Download meal planner",
    tag: "Quick Win",
  },
  {
    id: "t7",
    category: "shopping",
    title: "Buy second-hand electronics",
    impact: 300,
    difficulty: "easy",
    timeframe: "per purchase",
    description: "Manufacturing a smartphone emits ~70 kg CO₂. Refurbished devices cut that by 80%.",
    action: "Browse refurbished",
    tag: "Savings",
  },
  {
    id: "t8",
    category: "shopping",
    title: "Reduce streaming resolution",
    impact: 45,
    difficulty: "easy",
    timeframe: "yearly",
    description: "4K streaming uses 3x energy of 1080p. Lowering resolution 2 hrs/day saves ~45 kg/year.",
    action: "Update settings",
    tag: "Digital",
  },
];

// ─── Challenges ───────────────────────────────────────────────────────────────

export const CHALLENGES = [
  {
    id: "c1",
    title: "No-Meat Monday",
    duration: "4 weeks",
    savingsEstimate: 68,
    icon: "🥗",
    description: "Skip meat every Monday for a month.",
    difficulty: "easy",
    participants: 1247,
  },
  {
    id: "c2",
    title: "Car-Free Week",
    duration: "7 days",
    savingsEstimate: 45,
    icon: "🚶",
    description: "Walk, cycle, or take public transport all week.",
    difficulty: "medium",
    participants: 892,
  },
  {
    id: "c3",
    title: "Energy Audit Month",
    duration: "30 days",
    savingsEstimate: 120,
    icon: "💡",
    description: "Track and cut home energy use by 20%.",
    difficulty: "hard",
    participants: 534,
  },
  {
    id: "c4",
    title: "Zero Food Waste Week",
    duration: "7 days",
    savingsEstimate: 25,
    icon: "♻️",
    description: "Use up all food before buying more.",
    difficulty: "easy",
    participants: 2108,
  },
];

// ─── India Benchmark Data ─────────────────────────────────────────────────────

export const BENCHMARKS = {
  india_urban_avg: 2200,   // kg CO₂e/year
  india_rural_avg: 1100,
  global_avg: 4900,
  paris_target_2030: 2000, // ~2 tonne/person for 1.5°C pathway
  india_top10_pct: 14400,  // top 10% income emitters
};

// ─── Historical Monthly Data (demo) ──────────────────────────────────────────

export const MONTHLY_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const DEMO_MONTHLY_DATA = [
  { month: "Jan", transport: 185, energy: 210, food: 260, shopping: 95, total: 750 },
  { month: "Feb", transport: 175, energy: 195, food: 250, shopping: 40, total: 660 },
  { month: "Mar", transport: 200, energy: 170, food: 255, shopping: 125, total: 750 },
  { month: "Apr", transport: 195, energy: 140, food: 245, shopping: 55, total: 635 },
  { month: "May", transport: 180, energy: 185, food: 240, shopping: 70, total: 675 },
  { month: "Jun", transport: 170, energy: 220, food: 235, shopping: 45, total: 670 },
];
