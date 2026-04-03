import type {
  AppService,
  DeliveryServiceOption,
  DestinationSuggestion,
  DriverProfile,
  EatsCategory,
  EatsMenuCategory,
  MartCategory,
  MartStore,
  MenuItem,
  PaymentMethod,
  PerksSnapshot,
  RideCatalogItem,
  RidePreferences,
  RiderProfile,
  RestaurantSpot,
  SafetyToolkit,
  SavedPlace,
  SendPackageType,
  ServiceTab,
  TrackingCheckpoint,
  TripHistoryItem,
} from '../types/rideshare'

export const savedPlaces: SavedPlace[] = [
  {
    id: 'home',
    label: 'Home',
    address: '88 Harbour St, Toronto',
    icon: 'home',
  },
  {
    id: 'office',
    label: 'Office',
    address: '100 King St W, Toronto',
    icon: 'briefcase',
  },
  {
    id: 'gym',
    label: 'Gym',
    address: '18 Yonge St, Toronto',
    icon: 'gym',
  },
]

export const destinationSuggestions: DestinationSuggestion[] = [
  {
    id: 'cn-tower',
    title: 'CN Tower',
    subtitle: '290 Bremner Blvd, Toronto',
    distanceMiles: 1.2,
    etaMinutes: 6,
    type: 'recent',
  },
  {
    id: 'distillery',
    title: 'Distillery District',
    subtitle: '55 Mill St, Toronto',
    distanceMiles: 2.1,
    etaMinutes: 10,
    type: 'suggested',
  },
  {
    id: 'kensington',
    title: 'Kensington Market',
    subtitle: 'Kensington Ave, Toronto',
    distanceMiles: 1.8,
    etaMinutes: 9,
    type: 'suggested',
  },
  {
    id: 'union-station',
    title: 'Union Station',
    subtitle: '65 Front St W, Toronto',
    distanceMiles: 0.8,
    etaMinutes: 4,
    type: 'suggested',
  },
  {
    id: 'eaton-centre',
    title: 'Eaton Centre',
    subtitle: '220 Yonge St, Toronto',
    distanceMiles: 1.4,
    etaMinutes: 7,
    type: 'suggested',
  },
  {
    id: 'rogers-centre',
    title: 'Rogers Centre',
    subtitle: '1 Blue Jays Way, Toronto',
    distanceMiles: 1.5,
    etaMinutes: 8,
    type: 'suggested',
  },
  {
    id: 'st-lawrence',
    title: 'St. Lawrence Market',
    subtitle: '93 Front St E, Toronto',
    distanceMiles: 1.9,
    etaMinutes: 9,
    type: 'suggested',
  },
  {
    id: 'rom',
    title: 'Royal Ontario Museum',
    subtitle: '100 Queens Park, Toronto',
    distanceMiles: 2.8,
    etaMinutes: 14,
    type: 'suggested',
  },
]

export const rideCatalog: RideCatalogItem[] = [
  {
    id: 'recommended',
    name: 'Recommended',
    icon: 'car',
    capacity: 4,
    description: 'Fastest pickup nearby',
    baseFare: 8.5,
    pricePerMile: 2.5,
    arrivalMinutes: 3,
    recommended: true,
  },
  {
    id: 'economy',
    name: 'Economy',
    icon: 'van',
    capacity: 6,
    description: 'Best for groups',
    baseFare: 10,
    pricePerMile: 3.1,
    arrivalMinutes: 5,
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: 'premium',
    capacity: 4,
    description: 'Luxury sedan experience',
    baseFare: 18,
    pricePerMile: 4.75,
    arrivalMinutes: 8,
  },
]

export const serviceTabs: ServiceTab[] = [
  {
    id: 'ride',
    label: 'Ride',
    icon: 'i-material-symbols-directions-car-rounded',
    headerLabel: 'Ride',
  },
  {
    id: 'eats',
    label: 'Eats',
    icon: 'i-material-symbols-restaurant-rounded',
    headerLabel: 'Eats',
  },
  {
    id: 'send',
    label: 'Send',
    icon: 'i-material-symbols-inventory-2-rounded',
    headerLabel: 'Send',
  },
  {
    id: 'mart',
    label: 'Mart',
    icon: 'i-material-symbols-local-convenience-store-rounded',
    headerLabel: 'Mart',
  },
]

export const serviceAddresses: Record<AppService, string> = {
  ride: '88 Harbour St, Toronto',
  eats: '742 Evergreen Terrace',
  send: '555 King St W',
  mart: '742 Evergreen Terrace',
}

const burgerJointCategories: EatsMenuCategory[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'combos', label: 'Combos' },
  { id: 'burgers', label: 'Burgers' },
  { id: 'sides', label: 'Sides' },
  { id: 'drinks', label: 'Drinks' },
]

const artisanBakeryCategories: EatsMenuCategory[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'boxes', label: 'Boxes' },
  { id: 'sandwiches', label: 'Sandwiches' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'drinks', label: 'Drinks' },
]

const noriHouseCategories: EatsMenuCategory[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'platters', label: 'Platters' },
  { id: 'rolls', label: 'Rolls' },
  { id: 'sides', label: 'Sides' },
  { id: 'drinks', label: 'Drinks' },
]

const midnightRamenCategories: EatsMenuCategory[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'combos', label: 'Combos' },
  { id: 'ramen', label: 'Ramen' },
  { id: 'sides', label: 'Sides' },
  { id: 'drinks', label: 'Drinks' },
]

const sproutBowlCategories: EatsMenuCategory[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'bundles', label: 'Bundles' },
  { id: 'bowls', label: 'Bowls' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'drinks', label: 'Drinks' },
]

export const eatsCategories: EatsCategory[] = [
  {
    id: 'pizza',
    label: 'Pizza',
    icon: 'i-material-symbols-local-pizza-outline-rounded',
  },
  {
    id: 'burgers',
    label: 'Burgers',
    icon: 'i-material-symbols-lunch-dining-outline-rounded',
  },
  {
    id: 'vegan',
    label: 'Vegan',
    icon: 'i-material-symbols-eco-outline-rounded',
  },
]

export const eatsRestaurants: RestaurantSpot[] = [
  {
    id: 'burger-joint',
    name: 'The Burger Joint',
    cuisine: 'American',
    etaLabel: '15-25 min',
    rating: 4.8,
    accent: 'linear-gradient(135deg, #3c2f26, #0d0d0d)',
    icon: 'i-material-symbols-lunch-dining-rounded',
    deliveryFee: 4.99,
    serviceFee: 1.50,
    menuCategories: burgerJointCategories,
  },
  {
    id: 'artisan-bakery',
    name: 'Artisan Bakery',
    cuisine: 'Bakery & Cafe',
    etaLabel: '10-20 min',
    rating: 4.8,
    accent: 'linear-gradient(135deg, #4b3a23, #111111)',
    icon: 'material-symbols:bakery-dining',
    deliveryFee: 2.99,
    serviceFee: 1.15,
    menuCategories: artisanBakeryCategories,
  },
  {
    id: 'nori-house',
    name: 'Nori House',
    cuisine: 'Sushi',
    etaLabel: '20-30 min',
    rating: 4.9,
    accent: 'linear-gradient(135deg, #24403a, #111111)',
    icon: 'i-material-symbols-set-meal-rounded',
    deliveryFee: 3.49,
    serviceFee: 1.35,
    menuCategories: noriHouseCategories,
  },
  {
    id: 'midnight-ramen',
    name: 'Midnight Ramen',
    cuisine: 'Japanese',
    etaLabel: '18-28 min',
    rating: 4.6,
    accent: 'linear-gradient(135deg, #5a281c, #101010)',
    icon: 'i-material-symbols-ramen-dining-rounded',
    deliveryFee: 3.99,
    serviceFee: 1.25,
    menuCategories: midnightRamenCategories,
  },
  {
    id: 'sprout-bowl',
    name: 'Sprout Bowl',
    cuisine: 'Healthy',
    etaLabel: '12-22 min',
    rating: 4.5,
    accent: 'linear-gradient(135deg, #2b4a31, #101010)',
    icon: 'i-material-symbols-eco-rounded',
    deliveryFee: 2.49,
    serviceFee: 1.10,
    menuCategories: sproutBowlCategories,
  },
]

export const trendingRestaurants: RestaurantSpot[] = eatsRestaurants.filter((restaurant) =>
  ['burger-joint', 'artisan-bakery', 'nori-house'].includes(restaurant.id),
)

export const recentFoodOrders: RestaurantSpot[] = eatsRestaurants.filter((restaurant) =>
  ['midnight-ramen', 'sprout-bowl'].includes(restaurant.id),
)

export const eatsMenus: Record<string, MenuItem[]> = {
  'burger-joint': [
    {
      id: 'classic-bacon-smash',
      name: 'Classic Bacon Smash',
      description: 'Double patty, aged cheddar, crispy bacon, house sauce.',
      price: 14.50,
      category: 'popular',
      accent: '#3d2c1f',
      image: '/Classic.png',
    },
    {
      id: 'truffle-umami-burger',
      name: 'Truffle Umami Burger',
      description: 'Truffle aioli, sauteed mushrooms, swiss cheese.',
      price: 16.25,
      category: 'popular',
      accent: '#2a2a2a',
      image: '/Truffle.png',
    },
    {
      id: 'spicy-hot-chicken',
      name: 'Spicy Hot Chicken',
      description: 'Crispy chicken, slaw, pickles, spicy mayo.',
      price: 12.99,
      category: 'popular',
      accent: '#3d2418',
      image: '/Chicken.png',
    },
    {
      id: 'weekender-combo',
      name: 'Weekender Combo',
      description: 'Classic smash, fries, and a fountain drink.',
      price: 18.50,
      category: 'combos',
      accent: '#33261d',
      image: '/eats/burger-combo.svg',
    },
    {
      id: 'double-stacked-house',
      name: 'Double Stacked House',
      description: 'Two smashed patties, onions, cheddar, and pickles.',
      price: 15.75,
      category: 'burgers',
      accent: '#2b211b',
      image: '/eats/burger-double.svg',
    },
    {
      id: 'smash-fries',
      name: 'Smash Fries',
      description: 'Crisp fries tossed with sea salt and garlic pepper.',
      price: 5.50,
      category: 'sides',
      accent: '#2f2b26',
      image: '/eats/fries.svg',
    },
    {
      id: 'brown-butter-shake',
      name: 'Brown Butter Shake',
      description: 'Vanilla shake finished with brown butter caramel.',
      price: 6.25,
      category: 'drinks',
      accent: '#36271d',
      image: '/eats/shake.svg',
    },
  ],
  'artisan-bakery': [
    {
      id: 'butter-croissant',
      name: 'Butter Croissant',
      description: 'Flaky laminated pastry with cultured butter layers.',
      price: 4.75,
      category: 'popular',
      accent: '#4a3621',
      image: '/eats/croissant.svg',
    },
    {
      id: 'almond-morning-box',
      name: 'Almond Morning Box',
      description: 'Croissant, kouign-amann, and jam for two.',
      price: 13.50,
      category: 'boxes',
      accent: '#4f3b24',
      image: '/eats/pastry-box.svg',
    },
    {
      id: 'turkey-brie-ciabatta',
      name: 'Turkey Brie Ciabatta',
      description: 'Roasted turkey, brie, greens, and fig mustard.',
      price: 11.99,
      category: 'sandwiches',
      accent: '#3e2d1f',
      image: '/eats/sandwich.svg',
    },
    {
      id: 'maple-flat-white',
      name: 'Maple Flat White',
      description: 'Double ristretto with steamed milk and maple foam.',
      price: 5.75,
      category: 'coffee',
      accent: '#2d221d',
      image: '/eats/coffee.svg',
    },
    {
      id: 'blood-orange-sparkler',
      name: 'Blood Orange Sparkler',
      description: 'Bright citrus soda with orange blossom.',
      price: 4.95,
      category: 'drinks',
      accent: '#532d22',
      image: '/eats/sparkling-drink.svg',
    },
  ],
  'nori-house': [
    {
      id: 'salmon-aburi-box',
      name: 'Salmon Aburi Box',
      description: 'Seared salmon nigiri, rice, pickles, and tamago.',
      price: 18.95,
      category: 'popular',
      accent: '#19332f',
      image: '/eats/sushi-box.svg',
    },
    {
      id: 'tokyo-lunch-set',
      name: 'Tokyo Lunch Set',
      description: 'California roll, karaage, salad, and miso soup.',
      price: 21.50,
      category: 'platters',
      accent: '#203833',
      image: '/eats/sushi-box.svg',
    },
    {
      id: 'spicy-crunch-roll',
      name: 'Spicy Crunch Roll',
      description: 'Spicy tuna, tempura flakes, avocado, and chili oil.',
      price: 14.25,
      category: 'rolls',
      accent: '#213a34',
      image: '/eats/sushi-roll.svg',
    },
    {
      id: 'miso-cucumber',
      name: 'Miso Cucumber',
      description: 'Crushed cucumber with white miso sesame dressing.',
      price: 5.25,
      category: 'sides',
      accent: '#25433d',
      image: '/eats/veggie-side.svg',
    },
    {
      id: 'yuzu-soda',
      name: 'Yuzu Soda',
      description: 'Sparkling citrus soda with a bright yuzu finish.',
      price: 4.50,
      category: 'drinks',
      accent: '#39504a',
      image: '/eats/sparkling-drink.svg',
    },
  ],
  'midnight-ramen': [
    {
      id: 'garlic-tonkotsu',
      name: 'Garlic Tonkotsu',
      description: 'Rich pork broth, black garlic oil, and chashu.',
      price: 16.95,
      category: 'popular',
      accent: '#47261e',
      image: '/eats/ramen-bowl.svg',
    },
    {
      id: 'late-night-combo',
      name: 'Late Night Combo',
      description: 'Tonkotsu ramen with gyoza and a soda.',
      price: 19.95,
      category: 'combos',
      accent: '#512820',
      image: '/eats/ramen-combo.svg',
    },
    {
      id: 'spicy-miso-ramen',
      name: 'Spicy Miso Ramen',
      description: 'Miso broth, pork mince, corn, scallions, and chili.',
      price: 15.95,
      category: 'ramen',
      accent: '#5b2c20',
      image: '/eats/ramen-bowl.svg',
    },
    {
      id: 'crispy-gyoza',
      name: 'Crispy Gyoza',
      description: 'Pan-seared pork dumplings with soy vinegar.',
      price: 6.95,
      category: 'sides',
      accent: '#3a221c',
      image: '/eats/gyoza.svg',
    },
    {
      id: 'ume-cola',
      name: 'Ume Cola',
      description: 'Japanese cola with plum syrup and citrus peel.',
      price: 4.25,
      category: 'drinks',
      accent: '#4f3226',
      image: '/eats/sparkling-drink.svg',
    },
  ],
  'sprout-bowl': [
    {
      id: 'green-goddess-bowl',
      name: 'Green Goddess Bowl',
      description: 'Herb rice, avocado, greens, cucumber, and tahini.',
      price: 13.95,
      category: 'popular',
      accent: '#27412f',
      image: '/eats/veggie-bowl.svg',
    },
    {
      id: 'weekly-reset-bundle',
      name: 'Weekly Reset Bundle',
      description: 'Two bowls, sparkling water, and protein bites.',
      price: 24.95,
      category: 'bundles',
      accent: '#2b4732',
      image: '/eats/bundle.svg',
    },
    {
      id: 'charred-salmon-bowl',
      name: 'Charred Salmon Bowl',
      description: 'Farro, kale, salmon, fennel, and lemon yogurt.',
      price: 16.50,
      category: 'bowls',
      accent: '#32503a',
      image: '/eats/salmon-bowl.svg',
    },
    {
      id: 'sesame-snap-peas',
      name: 'Sesame Snap Peas',
      description: 'Chilled snap peas with toasted sesame and lime.',
      price: 5.50,
      category: 'snacks',
      accent: '#23412c',
      image: '/eats/veggie-side.svg',
    },
    {
      id: 'citrus-kombucha',
      name: 'Citrus Kombucha',
      description: 'House kombucha with grapefruit and basil.',
      price: 4.95,
      category: 'drinks',
      accent: '#426248',
      image: '/eats/sparkling-drink.svg',
    },
  ],
}

export const sendPackageTypes: SendPackageType[] = [
  {
    id: 'documents',
    label: 'Documents',
    icon: 'i-material-symbols-description-outline-rounded',
  },
  {
    id: 'small-parcel',
    label: 'Small Parcel',
    icon: 'i-material-symbols-inventory-2-outline-rounded',
  },
  {
    id: 'fragile',
    label: 'Fragile Item',
    icon: 'i-material-symbols-warning-amber-rounded',
  },
]

export const deliveryServices: DeliveryServiceOption[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Economical',
    etaLabel: '2-4 hours',
    icon: 'i-material-symbols-local-shipping-rounded',
  },
  {
    id: 'express',
    name: 'Express',
    description: 'Priority',
    etaLabel: '45-90 min',
    icon: 'i-material-symbols-moped-rounded',
  },
  {
    id: 'overnight',
    name: 'Overnight',
    description: 'Next day',
    etaLabel: 'Pre-book only',
    icon: 'i-material-symbols-airport-shuttle-rounded',
  },
]

export const martCategories: MartCategory[] = [
  { id: 'retail', label: 'Retail' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'healthy', label: 'Healthy' },
]

export const martFeaturedStores: MartStore[] = [
  {
    id: 'green-apple-market',
    name: 'Green Apple Market',
    etaLabel: '15-25 min',
    deliveryFeeLabel: 'Delivery: $0.99',
    rating: 4.8,
    accent: 'linear-gradient(135deg, rgba(124, 92, 28, 0.85), rgba(39, 92, 72, 0.82))',
  },
  {
    id: 'daily-basket',
    name: 'Daily Basket',
    etaLabel: '20-35 min',
    deliveryFeeLabel: 'Delivery: $1.49',
    rating: 4.6,
    accent: 'linear-gradient(135deg, rgba(43, 85, 57, 0.88), rgba(18, 26, 24, 0.86))',
  },
  {
    id: 'city-pantry',
    name: 'City Pantry',
    etaLabel: '10-18 min',
    deliveryFeeLabel: 'Delivery: $2.49',
    rating: 4.9,
    accent: 'linear-gradient(135deg, rgba(36, 69, 90, 0.88), rgba(18, 22, 30, 0.88))',
  },
]

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'apple-pay',
    brand: 'Apple',
    last4: '',
    expiry: '',
    label: 'Default payment method',
  },
  {
    id: 'amex-1008',
    brand: 'Amex',
    last4: '1008',
    expiry: '04/27',
    label: 'Travel rewards',
  },
]

export const riderProfile: RiderProfile = {
  name: 'Alex Carter',
  tier: 'Gold',
  memberSince: 'Since 2022',
}

export const driverProfile: DriverProfile = {
  name: 'Jordan Lee',
  rating: 4.97,
  vehicle: 'Black Tesla Model Y',
  licensePlate: 'NYC-4821',
  vehicleColor: 'Midnight Silver',
}

export const tripHistory: TripHistoryItem[] = [
  {
    id: 'trip-1',
    pickup: 'Lower East Side',
    dropoff: 'Midtown Manhattan',
    amount: 24.5,
    status: 'Completed',
    completedAt: '2023-10-26T14:45:00',
  },
  {
    id: 'trip-2',
    pickup: 'Central Park North',
    dropoff: "Hell's Kitchen",
    amount: 18.9,
    status: 'Completed',
    completedAt: '2023-10-25T18:12:00',
  },
  {
    id: 'trip-3',
    pickup: 'Brooklyn Heights',
    dropoff: 'Financial District',
    amount: 32,
    status: 'Completed',
    completedAt: '2023-10-24T09:30:00',
  },
  {
    id: 'trip-4',
    pickup: 'Upper West Side',
    dropoff: 'Chelsea Market',
    amount: 74.6,
    status: 'Completed',
    completedAt: '2023-10-21T20:10:00',
  },
]

export const trackingCheckpoints: TrackingCheckpoint[] = [
  {
    id: 'accepted',
    title: 'Driver accepted',
    detail: 'Jordan is heading to your pickup point.',
    threshold: 0,
  },
  {
    id: 'pickup',
    title: 'Driver is arriving',
    detail: 'Vehicle is less than two minutes away.',
    threshold: 0.34,
  },
  {
    id: 'en-route',
    title: 'Trip in progress',
    detail: 'Heading toward your destination via fastest route.',
    threshold: 0.58,
  },
  {
    id: 'approaching',
    title: 'Approaching destination',
    detail: 'Final blocks before arrival.',
    threshold: 0.82,
  },
]

export const defaultRidePreferences: RidePreferences = {
  preferredRideId: 'recommended',
  quietMode: true,
  petFriendly: false,
  extraTrunkSpace: false,
  temperature: 'Balanced',
}

export const defaultSafetyToolkit: SafetyToolkit = {
  shareTripByDefault: true,
  pinVerification: true,
  rideCheckIns: true,
  audioRecording: false,
  trustedContacts: 2,
  contacts: [
    { id: 'sarah', name: 'Sarah Jenkins', role: 'Primary Contact' },
    { id: 'mark', name: 'Mark Thompson', role: 'Emergency Contact' },
  ],
  rideMonitoring: true,
  adasOptimized: true,
  encryptionEnabled: true,
}

export const perksSnapshot: PerksSnapshot = {
  tierLabel: 'Blue Access',
  progressLabel: '3 rides away from Priority tier',
  airportPriority: true,
  priceLockPass: true,
  commutePackRides: 6,
}