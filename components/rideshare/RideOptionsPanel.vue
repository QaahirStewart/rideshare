<script setup lang="ts">
import type { DestinationSuggestion, PaymentMethod, RideQuote } from '../../types/rideshare'

defineProps<{
  destination: DestinationSuggestion | null
  rideOptions: RideQuote[]
  selectedRideId: string
  paymentMethod: PaymentMethod
}>()

defineEmits<{
  back: []
  confirm: []
  selectRide: [rideId: string]
}>()
</script>

<template>
  <section class="sheet sheet-options">
    <div class="sheet-handle" aria-hidden="true" />

    <header class="sheet-copy">
      <h2>Choose a ride</h2>
      <p v-if="destination">{{ destination.title }} • {{ destination.distanceMiles.toFixed(1) }} miles</p>
      <p v-else>Select a destination to continue</p>
    </header>

    <div class="scroll-body">

    <div class="options-list">
      <!-- Top recommended ride -->
      <button
        v-if="rideOptions.length > 0"
        class="ride-card"
        :class="{ featured: rideOptions[0].id === selectedRideId }"
        type="button"
        @click="$emit('selectRide', rideOptions[0].id)"
      >
        <div class="ride-card-left">
          <div class="ride-icon-wrap" :class="{ 'icon-featured': rideOptions[0].id === selectedRideId }">
            <UIcon v-if="rideOptions[0].icon === 'car'" name="i-material-symbols-directions-car-rounded" class="ride-type-icon" aria-hidden="true" />
            <UIcon v-else-if="rideOptions[0].icon === 'van'" name="i-material-symbols-airport-shuttle-rounded" class="ride-type-icon" aria-hidden="true" />
            <UIcon v-else name="i-material-symbols-workspace-premium-rounded" class="ride-type-icon" aria-hidden="true" />
          </div>
          <div class="ride-details">
            <strong>{{ rideOptions[0].name }}</strong>
            <span>{{ rideOptions[0].arrivalMinutes }} min away • {{ rideOptions[0].description }}</span>
          </div>
        </div>
        <div class="ride-pricing">
          <span class="ride-price">{{ rideOptions[0].displayFare }}</span>
        </div>
      </button>

      <div class="section-head" v-if="rideOptions.length > 1">
        <span>More options</span>
      </div>

      <!-- More options -->
      <button
        v-for="ride in rideOptions.slice(1)"
        :key="ride.id"
        class="ride-card"
        :class="{ featured: ride.id === selectedRideId }"
        type="button"
        @click="$emit('selectRide', ride.id)"
      >
        <div class="ride-card-left">
          <div class="ride-icon-wrap" :class="{ 'icon-featured': ride.id === selectedRideId }">
            <UIcon v-if="ride.icon === 'car'" name="i-material-symbols-directions-car-rounded" class="ride-type-icon" aria-hidden="true" />
            <UIcon v-else-if="ride.icon === 'van'" name="i-material-symbols-airport-shuttle-rounded" class="ride-type-icon" aria-hidden="true" />
            <UIcon v-else name="i-material-symbols-workspace-premium-rounded" class="ride-type-icon" aria-hidden="true" />
          </div>
          <div class="ride-details">
            <strong>{{ ride.name }}</strong>
            <span>{{ ride.arrivalMinutes }} min away • {{ ride.description === 'Near you' ? 'Seats '+ride.capacity : ride.description }}</span>
          </div>
        </div>
        <div class="ride-pricing">
          <span class="ride-price">{{ ride.displayFare }}</span>
        </div>
      </button>
    </div>
    </div>

    <button class="cta" type="button" @click="$emit('confirm')">
      Confirm {{ rideOptions.find((ride) => ride.id === selectedRideId)?.name || 'ride' }}
      <UIcon name="i-material-symbols-check-circle-outline-rounded" class="cta-icon" aria-hidden="true" />
    </button>
  </section>
</template>

<style scoped>
.sheet {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  background: #171717;
  color: #f3f1ec;
  box-shadow: 0 24px 44px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(16px);
}

.sheet-options {
  padding: 12px 16px 16px;
  overflow: hidden;
}

.sheet-handle {
  width: 42px;
  height: 5px;
  margin: 2px auto 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.sheet-copy {
  margin: 2px 0 6px;
  flex-shrink: 0;
}

.scroll-body {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  min-height: 0;
}

.scroll-body::-webkit-scrollbar {
  display: none;
}

.sheet-copy h2 {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
}

.sheet-copy p {
  margin: 3px 0 0;
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.75rem;
}

.options-list {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.ride-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 18px;
  background: #1b1b1b;
  color: #f3f1ec;
  text-align: left;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.ride-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 28px rgba(0, 0, 0, 0.14);
}

.ride-card:active {
  transform: translateY(1px) scale(0.992);
}

.ride-card.featured {
  border-color: rgba(59, 130, 246, 0.42);
  background: linear-gradient(to right, rgba(59, 130, 246, 0.06) 0%, rgba(59, 130, 246, 0.02) 30%, #202020 100%);
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.12);
  overflow: visible;
}

.ride-card.featured::before {
  content: "";
  position: absolute;
  left: -3px;
  top: 50%;
  transform: translateY(-50%);
  height: 40%;
  width: 5px;
  background: #3b82f6;
  border-radius: 999px;
}

.ride-card-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ride-icon-wrap {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: #0d0d0d;
  color: #9d959a;
  flex-shrink: 0;
}

.ride-icon-wrap.icon-featured {
  background: #0b0b0b;
  color: #3b82f6;
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.08);
}

.ride-type-icon {
  width: 24px;
  height: 24px;
}

.cta-icon {
  width: 18px;
  height: 18px;
}

.ride-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ride-details strong {
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.ride-details span {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.78rem;
}

.ride-pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  padding-left: 12px;
}

.ride-price {
  font-size: 0.98rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
}

.ride-card.featured .ride-price {
  font-size: 1.02rem;
}

.selected-label {
  display: block;
  color: #3b82f6;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1;
  text-align: right;
}

.seats-label {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.72rem;
  white-space: nowrap;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0 4px;
  color: #a0a0a0;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.section-head::after {
  content: '';
  height: 1px;
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
}

.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 14px;
  min-height: 64px;
  padding: 16px 20px;
  border: 0;
  border-radius: 20px;
  background: #3b82f6;
  color: #f8fbff;
  font-family: inherit;
  font-size: 0.98rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 18px 34px rgba(59, 130, 246, 0.22);
  flex-shrink: 0;
  transition:
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 180ms ease,
    filter 180ms ease;
}

.cta:hover {
  box-shadow: 0 22px 38px rgba(59, 130, 246, 0.3);
  filter: saturate(1.03);
}

.cta:active {
  transform: translateY(1px) scale(0.988);
  box-shadow: 0 12px 20px rgba(59, 130, 246, 0.18);
}

.cta-icon {
  width: 24px;
  height: 24px;
}
</style>