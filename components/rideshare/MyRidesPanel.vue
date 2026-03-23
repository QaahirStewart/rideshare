<script setup lang="ts">
import { computed } from 'vue'
import type { RiderProfile, TripHistoryItem } from '../../types/rideshare'

const props = defineProps<{
  riderProfile: RiderProfile
  tripHistory: TripHistoryItem[]
}>()

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

const recentTrips = computed(() => props.tripHistory.slice(0, 4))

const summaryAnchorDate = computed(() => {
  const latestTrip = props.tripHistory[0]

  return latestTrip ? new Date(latestTrip.completedAt) : new Date()
})

const monthlyTrips = computed(() => {
  const anchor = summaryAnchorDate.value

  return props.tripHistory.filter((trip) => {
    const tripDate = new Date(trip.completedAt)

    return tripDate.getMonth() === anchor.getMonth() && tripDate.getFullYear() === anchor.getFullYear()
  })
})

const monthlySpend = computed(() => {
  return monthlyTrips.value.reduce((total, trip) => total + trip.amount, 0)
})

const summaryMonth = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(summaryAnchorDate.value)
})

function formatCurrency(amount: number) {
  return currencyFormatter.format(amount)
}

function formatTripStamp(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}
</script>

<template>
  <section class="sheet sheet-rides">
    <div class="sheet-handle" aria-hidden="true" />

    <header class="rides-header">
      <div>
        <p class="eyebrow">My Rides</p>
        <h2>{{ riderProfile.name }}</h2>
        <span>{{ summaryMonth }}</span>
      </div>

      <UIcon name="i-material-symbols-history-rounded" class="header-icon" aria-hidden="true" />
    </header>

    <section class="summary-panel" aria-label="Monthly ride summary">
      <div class="summary-head">
        <div>
          <p class="summary-label">Monthly Ride Summary</p>
          <span class="summary-period">{{ summaryMonth }}</span>
        </div>

        <span class="summary-link">
          Details
          <UIcon name="i-material-symbols-chevron-right-rounded" class="summary-link-icon" aria-hidden="true" />
        </span>
      </div>

      <div class="summary-stats">
        <article class="summary-stat">
          <span>Total rides</span>
          <strong>{{ monthlyTrips.length }}</strong>
        </article>

        <article class="summary-stat">
          <span>Spent</span>
          <strong>{{ formatCurrency(monthlySpend) }}</strong>
        </article>
      </div>
    </section>

    <section class="rides-section">
      <div class="section-header">
        <p class="section-label">My Recent Rides</p>
        <UIcon name="i-material-symbols-history-rounded" class="section-icon" aria-hidden="true" />
      </div>

      <div class="rides-list">
        <article v-for="trip in recentTrips" :key="trip.id" class="ride-card">
          <div class="ride-head">
            <div class="route-line" aria-hidden="true">
              <span class="route-dot route-dot-start" />
              <span class="route-stem" />
              <span class="route-dot route-dot-end" />
            </div>

            <div class="ride-route-copy">
              <strong>{{ trip.pickup }}</strong>
              <span>{{ trip.dropoff }}</span>
            </div>

            <strong class="ride-total">{{ formatCurrency(trip.amount) }}</strong>
          </div>

          <div class="ride-footer">
            <span class="ride-time">{{ formatTripStamp(trip.completedAt) }}</span>
            <span class="status-badge">{{ trip.status.toUpperCase() }}</span>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
.sheet {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 18px 18px 20px;
  border-radius: 34px;
  background: linear-gradient(180deg, #111111 0%, #151515 48%, #161616 100%);
  color: #f3f1ec;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 28px 52px rgba(0, 0, 0, 0.42);
}

.sheet-rides {
  overflow: hidden;
}

.sheet-rides::-webkit-scrollbar {
  display: none;
}

.sheet-handle {
  width: 52px;
  height: 4px;
  margin: 2px auto 22px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.rides-header {
  flex: none;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #3b82f6;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.rides-header h2 {
  margin: 0;
  font-size: 1.38rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.rides-header span {
  display: block;
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
}

.header-icon {
  width: 22px;
  height: 22px;
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.46);
}

.summary-panel {
  flex: none;
  padding: 16px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(180deg, rgba(31, 31, 31, 0.98), rgba(24, 24, 24, 0.96));
}

.summary-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.summary-label {
  margin: 0;
  color: #3b82f6;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.summary-period {
  display: block;
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.82rem;
}

.summary-link {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #d9ded4;
  font-size: 0.78rem;
  font-weight: 700;
}

.summary-link-icon {
  width: 16px;
  height: 16px;
  color: #3b82f6;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.summary-stat {
  min-height: 96px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-stat span {
  display: block;
  color: rgba(255, 255, 255, 0.34);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.summary-stat strong {
  display: block;
  margin-top: 12px;
  font-size: 1.62rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.rides-section {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  margin-top: 24px;
}

.section-header {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.section-label {
  margin: 0;
  color: rgba(255, 255, 255, 0.46);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.section-icon {
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.42);
}

.rides-list {
  flex: 1;
  display: grid;
  gap: 12px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
}

.rides-list::-webkit-scrollbar {
  width: 4px;
}

.rides-list::-webkit-scrollbar-track {
  background: transparent;
}

.rides-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
}

.ride-card {
  padding: 16px;
  border-radius: 20px;
  background: linear-gradient(180deg, #2c2c2c, #292929);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.ride-head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
}

.route-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 10px;
  padding-top: 4px;
}

.route-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.route-dot-start {
  background: #3b82f6;
  border-color: rgba(59, 130, 246, 0.8);
}

.route-dot-end {
  background: transparent;
}

.route-stem {
  width: 1px;
  height: 28px;
  margin: 6px 0;
  background: rgba(255, 255, 255, 0.14);
}

.ride-route-copy {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.ride-route-copy strong,
.ride-route-copy span {
  display: block;
  position: relative;
  padding-bottom: 10px;
  font-size: 0.74rem;
  font-weight: 700;
  line-height: 1.2;
}

.ride-route-copy strong::after,
.ride-route-copy span::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.ride-route-copy strong {
  color: #f3f1ec;
}

.ride-route-copy span {
  color: rgba(255, 255, 255, 0.88);
}

.ride-total {
  color: #3b82f6;
  font-size: 0.92rem;
  font-weight: 800;
}

.ride-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
}

.ride-time {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.72rem;
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 26px;
  padding: 0 12px;
  border-radius: 8px;
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 360px) {
  .sheet {
    padding-inline: 14px;
  }

  .summary-stats {
    grid-template-columns: 1fr;
  }

  .ride-head {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .ride-total {
    grid-column: 2;
    margin-top: 2px;
  }
}
</style>