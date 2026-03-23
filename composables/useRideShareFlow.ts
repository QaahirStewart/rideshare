import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import {
  defaultRidePreferences,
  defaultSafetyToolkit,
  destinationSuggestions,
  driverProfile,
  paymentMethods,
  perksSnapshot,
  rideCatalog,
  riderProfile,
  savedPlaces,
  trackingCheckpoints,
  tripHistory,
} from '../data/rideshare'
import type {
  ActivePanel,
  DestinationSuggestion,
  FlowStep,
  PerksSnapshot,
  RidePreferences,
  RideQuote,
  SafetyToolkit,
  SavedPlace,
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

export function useRideShareFlow() {
  const step = useState<FlowStep>('rideshare-step', () => 'home')
  const activePanel = useState<ActivePanel>('rideshare-panel', () => 'ride')
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

  watch([selectedDestination, selectedPaymentId, paymentMethodsState, ridePreferences, safetyToolkit, perksState, savedPlacesState], () => {
    if (!process.client) {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
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
    activePanel,
    currentCheckpoint,
    destinationQuery,
    driverProfile,
    filteredSuggestions,
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
    selectedRide,
    selectedRideId,
    step,
    trackingProgress,
    tripHistory,
    safetyToolkit,
    chooseSavedPlace,
    chooseSuggestion,
    activateCommutePack,
    addSavedPlace,
    closePlaces,
    closeMenu,
    closeMenuSubpanel,
    closeSubpanel,
    closeProfile,
    confirmRide,
    openAddPlaces,
    openMenu,
    openPerks,
    openPayments,
    openPreferences,
    openProfile,
    openSafetyToolkit,
    openMyRides,
    proceedToRideOptions,
    resetTrip,
    savePaymentMethod,
    selectPaymentMethod,
    selectRide,
    setDestinationQuery,
    updateRidePreferences,
    updateSafetyToolkit,
  }
}