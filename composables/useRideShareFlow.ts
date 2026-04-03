import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import {
  defaultRidePreferences,
  defaultSafetyToolkit,
  deliveryServices,
  destinationSuggestions,
  driverProfile,
  eatsCategories,
  eatsMenus,
  eatsRestaurants,
  martCategories,
  martFeaturedStores,
  paymentMethods,
  perksSnapshot,
  rideCatalog,
  riderProfile,
  savedPlaces,
  sendPackageTypes,
  trackingCheckpoints,
  trendingRestaurants,
  recentFoodOrders,
  tripHistory,
} from '../data/rideshare'
import type {
  ActivePanel,
  AppService,
  CartItem,
  DeliveryServiceOption,
  DestinationSuggestion,
  EatsCategory,
  FlowStep,
  MartCategory,
  MartStore,
  MenuItem,
  PerksSnapshot,
  RidePreferences,
  RideQuote,
  SafetyToolkit,
  SavedPlace,
  SendPackageType,
  TrackingCheckpoint,
} from '../types/rideshare'

const STORAGE_KEY = 'rideshare-demo-state'

let trackingTimer: ReturnType<typeof setInterval> | null = null
let confirmTimer: ReturnType<typeof setTimeout> | null = null

function formatFare(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

function createSuggestionFromSavedPlace(place: SavedPlace): DestinationSuggestion {
  const matchingDestination = destinationSuggestions.find((suggestion) =>
    suggestion.title.toLowerCase().includes(place.label.toLowerCase()),
  )

  if (matchingDestination) {
    return {
      ...matchingDestination,
      type: 'saved',
    }
  }

  return {
    id: `saved-${place.id}`,
    title: place.label,
    subtitle: place.address,
    distanceMiles: 2.2,
    etaMinutes: 10,
    type: 'saved',
  }
}

const menuItemIndex = new Map(
  Object.values(eatsMenus).flat().map((menuItem) => [menuItem.id, menuItem]),
)

export function useRideShareFlow() {
  const step = useState<FlowStep>('rideshare-step', () => 'home')
  const activePanel = useState<ActivePanel>('rideshare-panel', () => 'ride')
  const activeService = useState<AppService>('rideshare-service', () => 'ride')
  const destinationQuery = useState('rideshare-query', () => '')
  const selectedDestination = useState<DestinationSuggestion | null>('rideshare-destination', () => null)
  const selectedRideId = useState('rideshare-ride', () => rideCatalog[0].id)
  const selectedPaymentId = useState('rideshare-payment', () => paymentMethods[0].id)
  const trackingProgress = useState('rideshare-progress', () => 0)
  const paymentMethodsState = useState('rideshare-payment-methods', () =>
    paymentMethods.map((method) => ({ ...method })),
  )
  const ridePreferences = useState<RidePreferences>('rideshare-preferences', () => ({ ...defaultRidePreferences }))
  const safetyToolkit = useState<SafetyToolkit>('rideshare-safety', () => ({ ...defaultSafetyToolkit }))
  const perksState = useState<PerksSnapshot>('rideshare-perks', () => ({ ...perksSnapshot }))
  const savedPlacesState = useState<SavedPlace[]>('rideshare-saved-places', () =>
    savedPlaces.map((place) => ({ ...place })),
  )

  // ── Eats sub-flow ──
  const eatsStep = useState<'home' | 'restaurant' | 'order'>('rideshare-eats-step', () => 'home')
  const selectedRestaurantId = useState<string | null>('rideshare-restaurant-id', () => null)
  const cartItems = useState<CartItem[]>('rideshare-cart', () => [])

  const selectedRestaurant = computed(() =>
    eatsRestaurants.find((restaurant) => restaurant.id === selectedRestaurantId.value) ?? null,
  )

  const eatsMenuItems = computed<MenuItem[]>(() => {
    if (!selectedRestaurantId.value) {
      return []
    }

    return eatsMenus[selectedRestaurantId.value] ?? []
  })

  const cartTotal = computed(() =>
    cartItems.value.reduce((total, item) => {
      const menuItem = menuItemIndex.get(item.menuItemId)
      return total + (menuItem?.price ?? 0) * item.quantity
    }, 0),
  )

  const cartCount = computed(() =>
    cartItems.value.reduce((total, item) => total + item.quantity, 0),
  )

  const selectedPaymentMethod = computed(() =>
    paymentMethodsState.value.find((method) => method.id === selectedPaymentId.value) ?? paymentMethodsState.value[0],
  )

  const filteredSuggestions = computed(() => {
    const query = destinationQuery.value.trim().toLowerCase()

    if (!query) {
      return destinationSuggestions.slice(0, 4)
    }

    return destinationSuggestions.filter((suggestion) => {
      return [suggestion.title, suggestion.subtitle].some((value) =>
        value.toLowerCase().includes(query),
      )
    })
  })

  const rideOptions = computed<RideQuote[]>(() => {
    const miles = selectedDestination.value?.distanceMiles ?? 2.4

    return rideCatalog.map((ride) => {
      const totalFare = Number((ride.baseFare + ride.pricePerMile * miles).toFixed(2))

      return {
        ...ride,
        totalFare,
        displayFare: formatFare(totalFare),
      }
    })
  })

  const selectedRide = computed(() => {
    return rideOptions.value.find((ride) => ride.id === selectedRideId.value) ?? rideOptions.value[0]
  })

  const currentCheckpoint = computed<TrackingCheckpoint>(() => {
    const checkpoints = [...trackingCheckpoints].reverse()

    return checkpoints.find((checkpoint) => trackingProgress.value >= checkpoint.threshold) ?? trackingCheckpoints[0]
  })

  const remainingMinutes = computed(() => {
    const totalMinutes = selectedDestination.value?.etaMinutes ?? 12
    const minutes = Math.max(2, Math.round(totalMinutes * (1 - trackingProgress.value)))

    return `${minutes} min`
  })

  const quickSummary = computed(() => {
    const paymentLabel = selectedPaymentMethod.value.last4
      ? `${selectedPaymentMethod.value.brand} •••• ${selectedPaymentMethod.value.last4}`
      : `${selectedPaymentMethod.value.brand} Pay`

    return {
      destination: selectedDestination.value?.title ?? 'Choose destination',
      ride: selectedRide.value?.name ?? 'Recommended',
      fare: selectedRide.value?.displayFare ?? formatFare(14.5),
      payment: paymentLabel,
    }
  })

  function clearTimers() {
    if (trackingTimer) {
      clearInterval(trackingTimer)
      trackingTimer = null
    }

    if (confirmTimer) {
      clearTimeout(confirmTimer)
      confirmTimer = null
    }
  }

  function setDestinationQuery(value: string) {
    destinationQuery.value = value
  }

  function chooseSuggestion(suggestion: DestinationSuggestion) {
    activeService.value = 'ride'
    selectedDestination.value = suggestion
    destinationQuery.value = suggestion.title
    activePanel.value = 'ride'
    step.value = 'rides'
    trackingProgress.value = 0
  }

  function chooseSavedPlace(place: SavedPlace) {
    chooseSuggestion(createSuggestionFromSavedPlace(place))
  }

  function proceedToRideOptions() {
    if (!selectedDestination.value) {
      const fallbackSuggestion = filteredSuggestions.value[0]

      if (fallbackSuggestion) {
        chooseSuggestion(fallbackSuggestion)
      }

      return
    }

    step.value = 'rides'
  }

  function selectRide(rideId: string) {
    selectedRideId.value = rideId
  }

  function selectPaymentMethod(paymentId: string) {
    if (paymentMethodsState.value.some((method) => method.id === paymentId)) {
      selectedPaymentId.value = paymentId
    }
  }

  function savePaymentMethod(input: {
    id?: string
    brand: string
    last4: string
    expiry: string
    label: string
  }) {
    const brand = input.brand.trim()
    const last4 = input.last4.trim().slice(-4)
    const expiry = input.expiry.trim()
    const label = input.label.trim()

    if (!brand || !label) {
      return
    }

    if (input.id) {
      paymentMethodsState.value = paymentMethodsState.value.map((method) =>
        method.id === input.id
          ? {
              ...method,
              brand,
              last4,
              expiry,
              label,
            }
          : method,
      )

      activePanel.value = 'profile'
      return
    }

    const newMethod = {
      id: `payment-${Date.now()}`,
      brand,
      last4,
      expiry,
      label,
    }

    paymentMethodsState.value = [newMethod, ...paymentMethodsState.value]
    selectedPaymentId.value = newMethod.id
    activePanel.value = 'profile'
  }

  function confirmRide() {
    clearTimers()
    step.value = 'confirming'

    confirmTimer = setTimeout(() => {
      step.value = 'tracking'
      trackingProgress.value = 0.18

      trackingTimer = setInterval(() => {
        if (trackingProgress.value >= 0.94) {
          clearTimers()
          trackingProgress.value = 0.94
          return
        }

        trackingProgress.value = Number((trackingProgress.value + 0.12).toFixed(2))
      }, 2200)
    }, 1600)
  }

  function openProfile() {
    activePanel.value = 'profile'
  }

  function switchService(service: AppService) {
    if (activeService.value === service) {
      return
    }

    activeService.value = service
    activePanel.value = 'ride'

    if (service !== 'ride') {
      clearTimers()
      step.value = 'home'
      trackingProgress.value = 0
    }

    // Reset eats sub-flow
    eatsStep.value = 'home'
    selectedRestaurantId.value = null
    cartItems.value = []
  }

  function openRestaurant(restaurantId: string) {
    if (selectedRestaurantId.value && selectedRestaurantId.value !== restaurantId) {
      cartItems.value = []
    }

    selectedRestaurantId.value = restaurantId
    eatsStep.value = 'restaurant'
  }

  function addToCart(menuItemId: string) {
    const existing = cartItems.value.find((item) => item.menuItemId === menuItemId)
    if (existing) {
      cartItems.value = cartItems.value.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity: item.quantity + 1 } : item,
      )
    } else {
      cartItems.value = [...cartItems.value, { menuItemId, quantity: 1 }]
    }
  }

  function removeFromCart(menuItemId: string) {
    cartItems.value = cartItems.value.filter((item) => item.menuItemId !== menuItemId)
  }

  function updateCartQuantity(menuItemId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(menuItemId)
      return
    }
    cartItems.value = cartItems.value.map((item) =>
      item.menuItemId === menuItemId ? { ...item, quantity } : item,
    )
  }

  function openEatsOrder() {
    eatsStep.value = 'order'
  }

  function closeEatsSubpanel() {
    if (eatsStep.value === 'order') {
      eatsStep.value = 'restaurant'
    } else {
      eatsStep.value = 'home'
      selectedRestaurantId.value = null
      cartItems.value = []
    }
  }

  function openMenu() {
    activePanel.value = 'menu'
  }

  function openMyRides() {
    activePanel.value = 'my-rides'
  }

  function openPreferences() {
    activePanel.value = 'preferences'
  }

  function openSafetyToolkit() {
    activePanel.value = 'safety'
  }

  function openPerks() {
    activePanel.value = 'perks'
  }

  function openPayments() {
    activePanel.value = 'payments'
  }

  function openAddPlaces() {
    activePanel.value = 'places'
  }

  function closeProfile() {
    activePanel.value = 'ride'
  }

  function closeMenu() {
    activePanel.value = 'ride'
    step.value = 'home'
  }

  function closeSubpanel() {
    activePanel.value = 'profile'
  }

  function closeMenuSubpanel() {
    activePanel.value = 'menu'
  }

  function closePlaces() {
    activePanel.value = 'ride'
    step.value = 'home'
  }

  function addSavedPlace(input: { label: string; address: string; icon: SavedPlace['icon'] }) {
    const label = input.label.trim()
    const address = input.address.trim()

    if (!label || !address) {
      return
    }

    savedPlacesState.value = [
      ...savedPlacesState.value,
      {
        id: `custom-${Date.now()}`,
        label,
        address,
        icon: input.icon,
      },
    ]

    activePanel.value = 'ride'
    step.value = 'home'
  }

  function updateRidePreferences(input: RidePreferences) {
    ridePreferences.value = {
      ...input,
    }
    activePanel.value = 'menu'
  }

  function updateSafetyToolkit(input: SafetyToolkit) {
    safetyToolkit.value = {
      ...input,
    }
    activePanel.value = 'menu'
  }

  function activateCommutePack() {
    perksState.value = {
      ...perksState.value,
      commutePackRides: perksState.value.commutePackRides + 4,
      progressLabel: 'Commute Pack refreshed for weekday pickups',
    }
    activePanel.value = 'menu'
  }

  function resetTrip() {
    clearTimers()
    activePanel.value = 'ride'
    step.value = 'home'
    trackingProgress.value = 0
  }

  onMounted(() => {
    if (!process.client) {
      return
    }

    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw) as {
        activeService?: AppService
        destinationId?: string
        paymentId?: string
        paymentMethods?: typeof paymentMethods
        ridePreferences?: RidePreferences
        safetyToolkit?: SafetyToolkit
        perks?: PerksSnapshot
        savedPlaces?: SavedPlace[]
      }

      if (parsed.destinationId) {
        const restoredDestination = destinationSuggestions.find(
          (suggestion) => suggestion.id === parsed.destinationId,
        )

        if (restoredDestination) {
          selectedDestination.value = restoredDestination
          destinationQuery.value = restoredDestination.title
        }
      }

      if (parsed.activeService) {
        activeService.value = parsed.activeService
      }

      if (Array.isArray(parsed.paymentMethods) && parsed.paymentMethods.length) {
        paymentMethodsState.value = parsed.paymentMethods.filter((method): method is (typeof paymentMethods)[number] => {
          return Boolean(method?.id && method?.brand && typeof method.label === 'string')
        })
      }

      if (parsed.paymentId && paymentMethodsState.value.some((method) => method.id === parsed.paymentId)) {
        selectedPaymentId.value = parsed.paymentId
      }

      if (parsed.ridePreferences?.preferredRideId) {
        ridePreferences.value = {
          ...defaultRidePreferences,
          ...parsed.ridePreferences,
        }
      }

      if (typeof parsed.safetyToolkit?.trustedContacts === 'number') {
        safetyToolkit.value = {
          ...defaultSafetyToolkit,
          ...parsed.safetyToolkit,
        }
      }

      if (parsed.perks?.tierLabel) {
        perksState.value = {
          ...perksSnapshot,
          ...parsed.perks,
        }
      }

      if (Array.isArray(parsed.savedPlaces) && parsed.savedPlaces.length) {
        savedPlacesState.value = parsed.savedPlaces.filter((place): place is SavedPlace => {
          return Boolean(place?.id && place?.label && place?.address && place?.icon)
        })
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  })

  watch([activeService, selectedDestination, selectedPaymentId, paymentMethodsState, ridePreferences, safetyToolkit, perksState, savedPlacesState], () => {
    if (!process.client) {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        activeService: activeService.value,
        destinationId: selectedDestination.value?.id,
        paymentId: selectedPaymentId.value,
        paymentMethods: paymentMethodsState.value,
        ridePreferences: ridePreferences.value,
        safetyToolkit: safetyToolkit.value,
        perks: perksState.value,
        savedPlaces: savedPlacesState.value,
      }),
    )
  })

  onBeforeUnmount(() => {
    clearTimers()
  })

  return {
    activeService,
    activePanel,
    cartCount,
    cartItems,
    cartTotal,
    currentCheckpoint,
    deliveryServices: deliveryServices as DeliveryServiceOption[],
    destinationQuery,
    driverProfile,
    eatsCategories: eatsCategories as EatsCategory[],
    eatsMenuItems,
    eatsStep,
    filteredSuggestions,
    martCategories: martCategories as MartCategory[],
    martFeaturedStores: martFeaturedStores as MartStore[],
    paymentMethods: paymentMethodsState,
    perks: perksState,
    quickSummary,
    remainingMinutes,
    ridePreferences,
    rideOptions,
    riderProfile,
    savedPlaces: savedPlacesState,
    selectedDestination,
    selectedPaymentId,
    selectedPaymentMethod,
    selectedRestaurant,
    selectedRide,
    selectedRideId,
    sendPackageTypes: sendPackageTypes as SendPackageType[],
    step,
    trackingProgress,
    trendingRestaurants,
    recentFoodOrders,
    tripHistory,
    safetyToolkit,
    chooseSavedPlace,
    chooseSuggestion,
    activateCommutePack,
    addSavedPlace,
    addToCart,
    closePlaces,
    closeEatsSubpanel,
    closeMenu,
    closeMenuSubpanel,
    closeSubpanel,
    closeProfile,
    confirmRide,
    openAddPlaces,
    openEatsOrder,
    openMenu,
    openPerks,
    openPayments,
    openPreferences,
    openProfile,
    openRestaurant,
    openSafetyToolkit,
    openMyRides,
    proceedToRideOptions,
    removeFromCart,
    resetTrip,
    savePaymentMethod,
    selectPaymentMethod,
    selectRide,
    setDestinationQuery,
    switchService,
    updateCartQuantity,
    updateRidePreferences,
    updateSafetyToolkit,
  }
}