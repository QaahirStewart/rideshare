<script setup lang="ts">
import { computed, ref } from 'vue'
import RideshareConfirmingPanel from '../../components/rideshare/ConfirmingPanel.vue'
import RidesharePaymentPanel from '../../components/rideshare/PaymentPanel.vue'
import RidesharePerksPanel from '../../components/rideshare/PerksPanel.vue'
import RideshareHomePanel from '../../components/rideshare/HomePanel.vue'
import RideshareAddPlacesPanel from '../../components/rideshare/AddPlacesPanel.vue'
import RideshareMenuPanel from '../../components/rideshare/MenuPanel.vue'
import RideshareMyRidesPanel from '../../components/rideshare/MyRidesPanel.vue'
import RideshareProfilePanel from '../../components/rideshare/ProfilePanel.vue'
import RideshareRidePreferencesPanel from '../../components/rideshare/RidePreferencesPanel.vue'
import RideshareRideOptionsPanel from '../../components/rideshare/RideOptionsPanel.vue'
import RideshareSafetyToolkitPanel from '../../components/rideshare/SafetyToolkitPanel.vue'
import RideshareScreenScaffold from '../../components/rideshare/ScreenScaffold.vue'
import RideshareTrackingPanel from '../../components/rideshare/TrackingPanel.vue'
import { useRideShareFlow } from '../../composables/useRideShareFlow'

const {
  activePanel,
  currentCheckpoint,
  destinationQuery,
  driverProfile,
  filteredSuggestions,
  paymentMethods,
  perks,
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

const panelTransitionName = computed(() => {
  if (activePanel.value === 'menu' || activePanel.value === 'preferences' || activePanel.value === 'safety' || activePanel.value === 'perks' || activePanel.value === 'profile' || activePanel.value === 'my-rides' || activePanel.value === 'places' || activePanel.value === 'payments') {
    return 'panel-fade'
  }

  if (step.value === 'tracking') {
    return 'panel-drift'
  }

  if (step.value === 'confirming') {
    return 'panel-soft'
  }

  return 'panel-sheet'
})

const panelKey = computed(() => {
  return activePanel.value === 'ride' ? step.value : activePanel.value
})

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

  if (step.value === 'confirming') {
    step.value = 'rides'
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
  <RideshareScreenScaffold
    :active-panel="activePanel"
    :destination-title="selectedDestination?.title"
    :step="step"
    :tracking-progress="trackingProgress"
    @back="handleBack"
    @choose-poi="chooseSuggestion"
    @map-tap="handleMapTap"
    @menu="openMenu"
    @profile="openProfile"
  >
    <Transition :name="panelTransitionName">
      <section v-if="activePanel === 'menu'" :key="panelKey" class="panel-wrap panel-wrap-profile">
        <RideshareMenuPanel
          @close="closeMenu"
          @open-perks="openPerks"
          @open-preferences="openPreferences"
          @open-safety="openSafetyToolkit"
        />
      </section>

      <section v-else-if="activePanel === 'preferences'" :key="panelKey" class="panel-wrap panel-wrap-profile">
        <RideshareRidePreferencesPanel
          :preferences="ridePreferences"
          :ride-options="rideOptions"
          @close="closeMenuSubpanel"
          @save="updateRidePreferences"
        />
      </section>

      <section v-else-if="activePanel === 'safety'" :key="panelKey" class="panel-wrap panel-wrap-profile">
        <RideshareSafetyToolkitPanel
          :settings="safetyToolkit"
          @close="closeMenuSubpanel"
          @save="updateSafetyToolkit"
        />
      </section>

      <section v-else-if="activePanel === 'perks'" :key="panelKey" class="panel-wrap panel-wrap-profile">
        <RidesharePerksPanel
          :perks="perks"
          @activate="activateCommutePack"
          @close="closeMenuSubpanel"
        />
      </section>

      <section v-else-if="activePanel === 'profile'" :key="panelKey" class="panel-wrap panel-wrap-profile">
        <RideshareProfilePanel
          :payment-methods="paymentMethods"
          :rider-profile="riderProfile"
          :selected-payment-id="selectedPaymentId"
          :trip-history="tripHistory"
          @close="closeProfile"
          @open-payments="openPayments"
          @open-rides="openMyRides"
        />
      </section>

      <section v-else-if="activePanel === 'my-rides'" :key="panelKey" class="panel-wrap panel-wrap-profile">
        <RideshareMyRidesPanel
          :rider-profile="riderProfile"
          :trip-history="tripHistory"
        />
      </section>

      <section v-else-if="activePanel === 'payments'" :key="panelKey" class="panel-wrap panel-wrap-profile">
        <RidesharePaymentPanel
          :payment-methods="paymentMethods"
          :selected-payment-id="selectedPaymentId"
          @close="closeSubpanel"
          @save-method="savePaymentMethod"
          @select-payment="selectPaymentMethod"
        />
      </section>

      <section v-else-if="activePanel === 'places'" :key="panelKey" class="panel-wrap panel-wrap-profile">
        <RideshareAddPlacesPanel
          @close="closePlaces"
          @save="addSavedPlace"
        />
      </section>

      <section v-else-if="step === 'home'" :key="panelKey" class="panel-wrap">
        <button class="locate-btn" type="button" aria-label="Center map">
          <UIcon name="i-material-symbols-near-me-rounded" class="locate-icon" aria-hidden="true" />
        </button>
        <RideshareHomePanel
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
      </section>

      <section v-else-if="step === 'rides'" :key="panelKey" class="panel-wrap">
        <button class="locate-btn" type="button" aria-label="Center map">
          <UIcon name="i-material-symbols-near-me-rounded" class="locate-icon" aria-hidden="true" />
        </button>
        <RideshareRideOptionsPanel
          :destination="selectedDestination"
          :payment-method="selectedPaymentMethod"
          :ride-options="rideOptions"
          :selected-ride-id="selectedRideId"
          @back="step = 'home'"
          @confirm="confirmRide"
          @select-ride="selectRide"
        />
      </section>

      <section v-else-if="step === 'confirming'" :key="panelKey" class="panel-wrap">
        <button class="locate-btn" type="button" aria-label="Center map">
          <UIcon name="i-material-symbols-near-me-rounded" class="locate-icon" aria-hidden="true" />
        </button>
        <RideshareConfirmingPanel
          :destination-title="selectedDestination?.title"
          :ride-label="selectedRide.name"
        />
      </section>

      <section v-else :key="panelKey" class="panel-wrap">
        <button class="locate-btn" type="button" aria-label="Center map">
          <UIcon name="i-material-symbols-near-me-rounded" class="locate-icon" aria-hidden="true" />
        </button>
        <RideshareTrackingPanel
          :checkpoint="currentCheckpoint"
          :destination="selectedDestination"
          :driver="driverProfile"
          :remaining-minutes="remainingMinutes"
          :ride="selectedRide"
          :tracking-progress="trackingProgress"
          @new-trip="resetTrip"
        />
      </section>
    </Transition>
  </RideshareScreenScaffold>
</template>

<style scoped>
.panel-wrap {
  position: absolute;
  bottom: 14px;
  left: 14px;
  right: 14px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.panel-wrap-profile {
  top: 72px;
  bottom: 16px;
  justify-content: flex-end;
}

.locate-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 14px;
  background: #201f1f;
  color: #f6f8f4;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.locate-icon {
  width: 18px;
  height: 18px;
}

.panel-sheet-enter-active,
.panel-sheet-leave-active,
.panel-soft-enter-active,
.panel-soft-leave-active,
.panel-fade-enter-active,
.panel-fade-leave-active,
.panel-drift-enter-active,
.panel-drift-leave-active {
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.panel-sheet-enter-from {
  transform: translateY(18px) scale(0.996);
}

.panel-sheet-leave-to {
  transform: translateY(-8px) scale(0.998);
}

.panel-soft-enter-from {
  transform: translateY(12px) scale(0.995);
}

.panel-soft-leave-to {
  transform: translateY(-6px) scale(0.998);
}

.panel-drift-enter-from {
  transform: translateY(10px) translateX(6px) scale(0.996);
}

.panel-drift-leave-to {
  transform: translateY(-6px) translateX(-4px) scale(0.998);
}

.panel-fade-enter-from {
  transform: translateX(22px) scale(0.997);
}

.panel-fade-leave-to {
  transform: translateX(-18px) scale(0.999);
}
</style>