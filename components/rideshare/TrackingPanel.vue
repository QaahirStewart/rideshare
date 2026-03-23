<script setup lang="ts">
import { computed } from 'vue'
import type {
  DestinationSuggestion,
  DriverProfile,
  RideQuote,
  TrackingCheckpoint,
} from '../../types/rideshare'

const props = defineProps<{
  destination: DestinationSuggestion | null
  driver: DriverProfile
  ride: RideQuote
  checkpoint: TrackingCheckpoint
  remainingMinutes: string
  trackingProgress: number
}>()

defineEmits<{
  newTrip: []
}>()

const estimatedArrivalTime = computed(() => {
  const minutes = Number.parseInt(props.remainingMinutes.replace(/\D/g, ''), 10)

  if (!Number.isFinite(minutes)) {
    return '--:--'
  }

  const arrival = new Date()
  arrival.setMinutes(arrival.getMinutes() + minutes)

  return arrival.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
})
</script>

<template>
  <section class="sheet sheet-tracking">
    <!-- Driver card -->
    <div class="driver-card">
      <div class="driver-avatar" aria-hidden="true">
        <span class="avatar-head" />
        <span class="avatar-body" />
      </div>

      <div class="driver-copy">
        <strong class="driver-name">{{ driver.name }}</strong>
        <span class="driver-vehicle">{{ driver.vehicle }} • {{ driver.licensePlate }}</span>
        <span class="driver-meta">Driver • {{ driver.rating.toFixed(1) }} ★</span>
      </div>
    </div>

    <hr class="divider" />

    <!-- Countdown -->
    <div class="countdown-block">
      <p class="eyebrow">Arriving in</p>
      <div class="time-display">
        <span class="time-number">{{ remainingMinutes.replace(/\D/g, '') || '00' }}</span>
        <span class="time-unit">MIN</span>
      </div>
    </div>

    <!-- Route info -->
    <div class="route-row">
      <div class="route-col">
        <span class="route-label route-label-current">Current</span>
        <span class="route-status">{{ checkpoint.title }}</span>
      </div>
      <div class="route-col route-col-end">
        <span class="route-label route-label-destination">Destination</span>
        <span class="route-status">{{ destination?.title || '—' }}</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-rail" aria-hidden="true">
      <span class="progress-fill" :style="{ width: `${trackingProgress * 100}%` }" />
    </div>

    <p class="eta-text">
      <UIcon name="i-material-symbols-schedule-outline-rounded" class="eta-icon" aria-hidden="true" />
      <span>Estimated arrival time {{ estimatedArrivalTime }}</span>
    </p>

  

    <!-- Action buttons -->
    <div class="action-row">
      <button class="action-btn" type="button">
        <UIcon name="i-material-symbols-phone-in-talk-rounded" class="action-icon" aria-hidden="true" />
        Call
      </button>
      <button class="action-btn" type="button">
        <UIcon name="i-material-symbols-chat-rounded" class="action-icon" aria-hidden="true" />
        Message
      </button>
    </div>

    <!-- CTA -->
    <button class="cta" type="button" @click="$emit('newTrip')">
      Share trip status
      <UIcon name="i-material-symbols-person-add-rounded" class="cta-icon" aria-hidden="true" />
    </button>
  </section>
</template>

<style scoped>
.sheet {
  width: 100%;
  padding: 14px 18px 18px;
  border-radius: 30px;
  background: #171717;
  color: #f3f1ec;
  box-shadow: 0 24px 44px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(16px);
}

/* ── Driver card ── */
.driver-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 4px 0 2px;
}

.driver-avatar {
  position: relative;
  flex-shrink: 0;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg, #f8f0df, #f1dcc0);
  border: 2px solid rgba(59, 130, 246, 0.94);
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.14),
    0 10px 24px rgba(59, 130, 246, 0.1);
}

.avatar-head {
  position: absolute;
  top: 10px;
  left: 17px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #2e1d10;
}

.avatar-body {
  position: absolute;
  left: 9px;
  bottom: -1px;
  width: 36px;
  height: 30px;
  border-radius: 18px 18px 7px 7px;
  background: linear-gradient(180deg, #cb8458, #a75b36);
}

.driver-name {
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1.1;
}

.driver-vehicle {
  color: rgba(255, 255, 255, 0.56);
  font-size: 0.72rem;
  font-weight: 600;
}

.driver-meta {
  color: #3b82f6;
  font-size: 0.72rem;
  font-weight: 700;
}

.driver-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding-top: 2px;
}

.divider {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 18px -18px;
}

/* ── Countdown ── */
.countdown-block {
  text-align: center;
  padding: 24px 0 24px;
  margin: 24px 0 22px;
}

.eyebrow {
  margin: 0 0 10px;
  color: #3b82f6;
  font-size: 0.60rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.time-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
}

.time-number {
  font-size: 4.2rem;
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.05em;
  color: #f3efef;
}

.time-unit {
  font-size: 1.08rem;
  font-weight: 800;
  color: #3b82f6;
  letter-spacing: 0.04em;
}

/* ── Route row ── */
.route-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 16px;
  margin-bottom: 12px;
}

.route-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.route-col-end {
  text-align: right;
  max-width: 52%;
}

.route-label {
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.60rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.route-status {
  color: rgb(255, 255, 255);
  font-size: 0.60rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: capitalize;
}

.route-label-current {
  color: #3b82f6;
}

.route-label-destination {
  color: rgba(255, 255, 255, 0.24);
}

.route-col strong {
  color: rgba(255, 255, 255, 0.84);
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.2;
}

.route-col-end strong {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.74rem;
  font-weight: 600;
  line-height: 1.2;
}

/* ── Progress ── */
.progress-rail {
  height: 8px;
  margin: 0 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #7aff9e, #36ef79);
  transition: width 1400ms cubic-bezier(0.22, 1, 0.36, 1);
}

.eta-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 14px 14px 0;
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.8rem;
  font-weight: 500;
  padding-top: 10px;
  padding-bottom: 10px;
}

.eta-icon {
  width: 16px;
  height: 16px;
  flex: none;
  color: rgba(255, 255, 255, 0.34);
}

/* ── Action buttons ── */
.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 20px 0 14px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 56px;
  padding: 14px 14px;
  border: 0;
  border-radius: 18px;
  background: #1b1b1b;
  color: rgba(255, 255, 255, 0.92);
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
    background 180ms ease;
}

.action-btn:hover {
  background: #202020;
}

.action-btn:active {
  transform: translateY(1px) scale(0.988);
}

.action-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

/* ── CTA ── */
.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 64px;
  padding: 16px 20px;
  border: 0;
  border-radius: 20px;
  background: #3b82f6;
  color: #f8fbff;
  font-family: inherit;
  font-size: 0.98rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  box-shadow: 0 18px 34px rgba(59, 130, 246, 0.22);
  cursor: pointer;
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
  width: 20px;
  height: 20px;
}
</style>