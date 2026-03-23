<script setup lang="ts">
import { ref } from 'vue'
import RideshareConfirmingPanel from './ConfirmingPanel.vue'
import RidesharePaymentPanel from './PaymentPanel.vue'
import RidesharePerksPanel from './PerksPanel.vue'
import RideshareHomePanel from './HomePanel.vue'
import RideshareAddPlacesPanel from './AddPlacesPanel.vue'
import RideshareMenuPanel from './MenuPanel.vue'
import RideshareMapStage from './MapStage.vue'
import RideshareMyRidesPanel from './MyRidesPanel.vue'
import RideshareProfilePanel from './ProfilePanel.vue'
import RideshareRidePreferencesPanel from './RidePreferencesPanel.vue'
import RideshareRideOptionsPanel from './RideOptionsPanel.vue'
import RideshareSafetyToolkitPanel from './SafetyToolkitPanel.vue'
import RideshareTrackingPanel from './TrackingPanel.vue'
import { useRideShareFlow } from '../../composables/useRideShareFlow'

const {
  activePanel,
  currentCheckpoint,
  destinationQuery,
  driverProfile,
  filteredSuggestions,
  paymentMethods,
  perks,
  quickSummary,
  remainingMinutes,
  ridePreferences,
  rideOptions,
  riderProfile,
  savedPlaces,
  selectedDestination,
  selectedPaymentId,
  selectedPaymentMethod,
  selectedRide,
  selectedRideId,
  step,
  trackingProgress,
  tripHistory,
  safetyToolkit,
  activateCommutePack,
  chooseSavedPlace,
  chooseSuggestion,
  closePlaces,
  closeMenu,
  closeMenuSubpanel,
  closeProfile,
  closeSubpanel,
  confirmRide,
  addSavedPlace,
  openAddPlaces,
  openMenu,
  openPerks,
  openMyRides,
  openPayments,
  openPreferences,
  openProfile,
  openSafetyToolkit,
  proceedToRideOptions,
  resetTrip,
  savePaymentMethod,
  selectPaymentMethod,
  selectRide,
  setDestinationQuery,
  updateRidePreferences,
  updateSafetyToolkit,
} = useRideShareFlow()

function handleBack() {
  if (activePanel.value === 'profile') {
    closeProfile()
    return
  }

  if (activePanel.value === 'menu') {
    closeMenu()
    return
  }

  if (activePanel.value === 'preferences' || activePanel.value === 'safety' || activePanel.value === 'perks') {
    closeMenuSubpanel()
    return
  }

  if (activePanel.value === 'my-rides') {
    closeSubpanel()
    return
  }

  if (activePanel.value === 'payments') {
    closeSubpanel()
    return
  }

  if (activePanel.value === 'places') {
    closePlaces()
    return
  }

  if (step.value === 'rides') {
    step.value = 'home'
    return
  }

  if (step.value === 'tracking') {
    resetTrip()
  }
}

const homeMinimized = ref(false)

function handleMapTap() {
  if (step.value === 'home' && activePanel.value === 'ride') {
    homeMinimized.value = true
  }
}

function expandHome() {
  homeMinimized.value = false
}
</script>

<template>
  <main class="app-shell">
    <NuxtRouteAnnouncer />

    <section class="hero-copy">
      <p class="eyebrow">Ride Share</p>
      <h1>Book a ride in seconds, track it in real time.</h1>
      <p class="lede">
        Search destinations, compare ride options, confirm your booking,
        and follow your driver — all in one seamless flow.
      </p>
    </section>

    <section class="workspace-grid">
      <article class="phone-column">
        <header class="device-header">
          <span class="device-breadcrumb">
            {{ activePanel === 'menu' ? 'Home / Menu' : activePanel === 'preferences' ? 'Home / Ride Preferences' : activePanel === 'safety' ? 'Home / Safety Toolkit' : activePanel === 'perks' ? 'Home / Perks' : activePanel === 'profile' ? 'Profile / Payment' : activePanel === 'my-rides' ? 'Profile / My Rides' : activePanel === 'payments' ? 'Profile / Wallet' : activePanel === 'places' ? 'Profile / Add Place' : `Ride Flow / ${step}` }}
          </span>
        </header>

        <div class="phone-frame">
          <RideshareMapStage
            :active-panel="activePanel"
            :destination-title="selectedDestination?.title"
            :step="step"
            :tracking-progress="trackingProgress"
            @back="handleBack"
            @choose-poi="chooseSuggestion"
            @map-tap="handleMapTap"
            @menu="openMenu"
            @profile="openProfile"
          />

          <Transition name="sheet-fade" mode="out-in">
            <RideshareMenuPanel
              v-if="activePanel === 'menu'"
              @close="closeMenu"
              @open-perks="openPerks"
              @open-preferences="openPreferences"
              @open-safety="openSafetyToolkit"
            />

            <RideshareRidePreferencesPanel
              v-else-if="activePanel === 'preferences'"
              :preferences="ridePreferences"
              :ride-options="rideOptions"
              @close="closeMenuSubpanel"
              @save="updateRidePreferences"
            />

            <RideshareSafetyToolkitPanel
              v-else-if="activePanel === 'safety'"
              :settings="safetyToolkit"
              @close="closeMenuSubpanel"
              @save="updateSafetyToolkit"
            />

            <RidesharePerksPanel
              v-else-if="activePanel === 'perks'"
              :perks="perks"
              @activate="activateCommutePack"
              @close="closeMenuSubpanel"
            />

            <RideshareProfilePanel
              v-else-if="activePanel === 'profile'"
              :payment-methods="paymentMethods"
              :rider-profile="riderProfile"
              :selected-payment-id="selectedPaymentId"
              :trip-history="tripHistory"
              @close="closeProfile"
              @open-payments="openPayments"
              @open-rides="openMyRides"
            />

            <RideshareMyRidesPanel
              v-else-if="activePanel === 'my-rides'"
              :rider-profile="riderProfile"
              :trip-history="tripHistory"
            />

            <RidesharePaymentPanel
              v-else-if="activePanel === 'payments'"
              :payment-methods="paymentMethods"
              :selected-payment-id="selectedPaymentId"
              @close="closeSubpanel"
              @save-method="savePaymentMethod"
              @select-payment="selectPaymentMethod"
            />

            <RideshareAddPlacesPanel
              v-else-if="activePanel === 'places'"
              @close="closePlaces"
              @save="addSavedPlace"
            />

            <RideshareHomePanel
              v-else-if="step === 'home'"
              :destination-query="destinationQuery"
              :minimized="homeMinimized"
              :payment-method="selectedPaymentMethod"
              :saved-places="savedPlaces"
              :suggestions="filteredSuggestions"
              @choose-saved-place="chooseSavedPlace"
              @choose-suggestion="chooseSuggestion"
              @continue="proceedToRideOptions"
              @expand="expandHome"
              @open-add-places="openAddPlaces"
              @update-query="setDestinationQuery"
            />

            <RideshareRideOptionsPanel
              v-else-if="step === 'rides'"
              :destination="selectedDestination"
              :payment-method="selectedPaymentMethod"
              :ride-options="rideOptions"
              :selected-ride-id="selectedRideId"
              @back="step = 'home'"
              @confirm="confirmRide"
              @select-ride="selectRide"
            />

            <RideshareConfirmingPanel
              v-else-if="step === 'confirming'"
              :destination-title="selectedDestination?.title"
              :ride-label="selectedRide.name"
            />

            <RideshareTrackingPanel
              v-else
              :checkpoint="currentCheckpoint"
              :destination="selectedDestination"
              :driver="driverProfile"
              :remaining-minutes="remainingMinutes"
              :ride="selectedRide"
              :tracking-progress="trackingProgress"
              @new-trip="resetTrip"
            />
          </Transition>
        </div>
      </article>

      <aside class="summary-rail">
        <section class="summary-card summary-card-primary">
          <p class="summary-eyebrow">Trip overview</p>
          <h2>{{ quickSummary.destination }}</h2>
          <div class="summary-grid">
            <article>
              <span class="label">Ride type</span>
              <strong>{{ quickSummary.ride }}</strong>
            </article>
            <article>
              <span class="label">Estimated fare</span>
              <strong>{{ quickSummary.fare }}</strong>
            </article>
            <article>
              <span class="label">Payment</span>
              <strong>{{ quickSummary.payment }}</strong>
            </article>
            <article>
              <span class="label">Map</span>
              <strong>Mapbox-ready</strong>
            </article>
          </div>
        </section>

        <section class="summary-card">
          <p class="summary-eyebrow">Features</p>
          <ul class="notes-list">
            <li>Instant destination search with saved places</li>
            <li>Compare ride options by price, ETA, and type</li>
            <li>Live trip tracking with driver details</li>
            <li>Profile and payment management</li>
          </ul>
        </section>

        <section class="summary-card">
          <p class="summary-eyebrow">Live status</p>
          <div class="status-stack">
            <div class="status-item">
              <span class="label">Screen</span>
              <strong>{{ activePanel === 'ride' ? step : activePanel }}</strong>
            </div>
            <div class="status-item">
              <span class="label">Progress</span>
              <strong>{{ Math.round(trackingProgress * 100) }}%</strong>
            </div>
          </div>
        </section>
      </aside>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:global(body) {
  margin: 0;
  min-width: 320px;
  background:
    radial-gradient(circle at top left, rgba(41, 255, 142, 0.12), transparent 30%),
    radial-gradient(circle at bottom right, rgba(93, 177, 255, 0.16), transparent 35%),
    #111315;
  color: #f4f6f0;
  font-family: 'Inter', sans-serif;
}

:global(*) {
  box-sizing: border-box;
}

.app-shell {
  min-height: 100vh;
  padding: 48px 24px 64px;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
}

.hero-copy {
  width: min(760px, 100%);
  margin: 0 auto 32px;
  text-align: center;
}

.eyebrow,
.summary-eyebrow {
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 0;
  color: #f8faf7;
  font-size: clamp(2rem, 4vw, 3.6rem);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.lede {
  width: min(560px, 100%);
  margin: 14px auto 0;
  color: rgba(244, 246, 240, 0.6);
  font-size: 0.92rem;
  line-height: 1.6;
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(320px, 420px);
  justify-content: center;
  gap: 28px;
}

.device-header {
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.78rem;
  font-weight: 600;
}

.phone-frame {
  position: relative;
  min-height: 720px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background: linear-gradient(180deg, #bcefff 0%, #d8f4ff 45%, #d5efff 100%);
  box-shadow:
    0 28px 60px rgba(0, 0, 0, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.summary-rail {
  display: grid;
  gap: 16px;
  align-content: start;
}

.summary-card {
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  background: #201f1f;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
}

.summary-card-primary h2 {
  margin: 0 0 14px;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.summary-grid article,
.status-item {
  padding: 12px;
  border-radius: 14px;
  background: #242424;
}

.label {
  display: block;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.summary-grid strong,
.status-item strong {
  font-weight: 700;
}

.notes-list {
  margin: 0;
  padding-left: 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.82rem;
  line-height: 1.8;
}

.status-stack {
  display: grid;
  gap: 12px;
}

.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

@media (max-width: 980px) {
  .workspace-grid {
    grid-template-columns: minmax(280px, 360px);
  }

  .summary-rail {
    order: -1;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .app-shell {
    padding: 0;
    background-image: none;
  }

  .hero-copy,
  .summary-rail,
  .device-header {
    display: none;
  }

  .workspace-grid {
    display: block;
  }

  .phone-frame {
    min-height: 100dvh;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>