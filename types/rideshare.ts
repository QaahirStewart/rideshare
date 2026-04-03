export type FlowStep = 'home' | 'rides' | 'confirming' | 'tracking'

export type ActivePanel = 'ride' | 'menu' | 'preferences' | 'safety' | 'perks' | 'profile' | 'my-rides' | 'places' | 'payments'

export type AppService = 'ride' | 'eats' | 'send' | 'mart'

export type PlaceType = 'saved' | 'suggested' | 'recent'

export type RideIcon = 'car' | 'van' | 'premium'

export interface ServiceTab {
  id: AppService
  label: string
  icon: string
  headerLabel: string
}

export interface SavedPlace {
  id: string
  label: string
  address: string
  icon: 'home' | 'briefcase' | 'gym'
}

export interface DestinationSuggestion {
  id: string
  title: string
  subtitle: string
  distanceMiles: number
  etaMinutes: number
  type: PlaceType
}

export interface RideCatalogItem {
  id: string
  name: string
  icon: RideIcon
  capacity: number
  description: string
  baseFare: number
  pricePerMile: number
  arrivalMinutes: number
  recommended?: boolean
}

export interface RideQuote extends RideCatalogItem {
  totalFare: number
  displayFare: string
}

export interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expiry: string
  label: string
}

export interface DriverProfile {
  name: string
  rating: number
  vehicle: string
  licensePlate: string
  vehicleColor: string
}

export interface TripHistoryItem {
  id: string
  pickup: string
  dropoff: string
  amount: number
  status: string
  completedAt: string
}

export interface RiderProfile {
  name: string
  tier: string
  memberSince: string
}

export interface TrackingCheckpoint {
  id: string
  title: string
  detail: string
  threshold: number
}

export interface RidePreferences {
  preferredRideId: string
  quietMode: boolean
  petFriendly: boolean
  extraTrunkSpace: boolean
  temperature: 'Cool' | 'Balanced' | 'Warm'
}

export interface TrustedContact {
  id: string
  name: string
  role: string
}

export interface SafetyToolkit {
  shareTripByDefault: boolean
  pinVerification: boolean
  rideCheckIns: boolean
  audioRecording: boolean
  trustedContacts: number
  contacts: TrustedContact[]
  rideMonitoring: boolean
  adasOptimized: boolean
  encryptionEnabled: boolean
}

export interface PerksSnapshot {
  tierLabel: string
  progressLabel: string
  airportPriority: boolean
  priceLockPass: boolean
  commutePackRides: number
}

export interface EatsCategory {
  id: string
  label: string
  icon: string
}

export interface EatsMenuCategory {
  id: string
  label: string
}

export interface RestaurantSpot {
  id: string
  name: string
  cuisine: string
  etaLabel: string
  rating: number
  accent: string
  icon: string
  deliveryFee: number
  serviceFee: number
  menuCategories: EatsMenuCategory[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  accent: string
  image: string
}

export interface CartItem {
  menuItemId: string
  quantity: number
}

export interface SendPackageType {
  id: string
  label: string
  icon: string
}

export interface DeliveryServiceOption {
  id: string
  name: string
  description: string
  etaLabel: string
  icon: string
}

export interface MartCategory {
  id: string
  label: string
}

export interface MartStore {
  id: string
  name: string
  etaLabel: string
  deliveryFeeLabel: string
  rating: number
  accent: string
}