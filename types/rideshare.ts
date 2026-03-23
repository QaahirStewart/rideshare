export type FlowStep = 'home' | 'rides' | 'confirming' | 'tracking'

export type ActivePanel = 'ride' | 'menu' | 'preferences' | 'safety' | 'perks' | 'profile' | 'my-rides' | 'places' | 'payments'

export type PlaceType = 'saved' | 'suggested' | 'recent'

export type RideIcon = 'car' | 'van' | 'premium'

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