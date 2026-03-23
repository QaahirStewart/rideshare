import type {
  DestinationSuggestion,
  DriverProfile,
  PaymentMethod,
  PerksSnapshot,
  RideCatalogItem,
  RidePreferences,
  RiderProfile,
  SafetyToolkit,
  SavedPlace,
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