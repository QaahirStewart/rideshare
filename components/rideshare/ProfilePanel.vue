<script setup lang="ts">
import { computed } from 'vue'
import type { PaymentMethod, RiderProfile, TripHistoryItem } from '../../types/rideshare'

const props = defineProps<{
  paymentMethods: PaymentMethod[]
  riderProfile: RiderProfile
  selectedPaymentId: string
  tripHistory: TripHistoryItem[]
}>()

const emit = defineEmits<{
  close: []
  openPayments: []
  openRides: []
}>()

const featuredTrip = computed(() => props.tripHistory[0] ?? null)
const selectedPaymentMethod = computed(() => {
  return props.paymentMethods.find((method) => method.id === props.selectedPaymentId) ?? props.paymentMethods[0] ?? null
})

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}
</script>

<template>
  <section class="sheet sheet-profile">
    <div class="sheet-handle" aria-hidden="true" />

    <div class="profile-header">
      <div class="avatar-circle" aria-hidden="true">
        <span class="avatar-head" />
        <span class="avatar-body" />
      </div>
      <div class="profile-copy">
        <strong class="profile-name">{{ riderProfile.name }}</strong>
        <span class="profile-sub">Member {{ riderProfile.memberSince.toLowerCase() }}</span>
      </div>
    </div>

    <div class="scroll-body">

    <div class="section">
      <div class="section-header">
        <p class="section-label">MY RIDES</p>
        <span class="section-line" aria-hidden="true" />
      </div>
      <button
        v-if="featuredTrip"
        class="ride-card"
        type="button"
        @click="emit('openRides')"
      >
        <div class="ride-icon-tile">
          <UIcon name="i-material-symbols-history-rounded" class="ride-icon" aria-hidden="true" />
        </div>
        <div class="ride-copy">
          <strong>Recent Trip</strong>
          <span>To {{ featuredTrip.dropoff }}</span>
        </div>
        <div class="ride-meta">
          <strong>{{ formatCurrency(featuredTrip.amount) }}</strong>
          <span class="status-badge">{{ featuredTrip.status === 'Completed' ? 'COMPLETED' : featuredTrip.status }}</span>
        </div>
      </button>
    </div>

    <div class="section">
      <div class="section-header">
        <p class="section-label">PAYMENT</p>
        <span class="section-line" aria-hidden="true" />
      </div>
      <button
        v-if="selectedPaymentMethod"
        class="payment-row"
        :class="{ selected: selectedPaymentMethod.id === selectedPaymentId }"
        type="button"
        @click="emit('openPayments')"
      >
        <div class="pay-icon-tile">
          <UIcon name="i-material-symbols-credit-card-rounded" class="pay-icon" aria-hidden="true" />
        </div>
        <div class="pay-copy">
          <strong>{{ selectedPaymentMethod.last4 ? `${selectedPaymentMethod.brand} •••• ${selectedPaymentMethod.last4}` : `${selectedPaymentMethod.brand} Pay` }}</strong>
          <span>{{ selectedPaymentMethod.label }}</span>
        </div>
        <div class="pay-check">
          <UIcon name="i-material-symbols-chevron-right-rounded" class="check-icon" aria-hidden="true" />
        </div>
      </button>
    </div>

    <div class="actions-grid">
      <div class="action-tile">
        <div class="action-icon-wrap">
          <UIcon name="i-material-symbols-settings-rounded" class="action-tile-icon" aria-hidden="true" />
        </div>
        <strong>Settings</strong>
        <span>Preferences & security</span>
      </div>
      <div class="action-tile">
        <div class="action-icon-wrap">
          <UIcon name="i-material-symbols-help-rounded" class="action-tile-icon" aria-hidden="true" />
        </div>
        <strong>Support</strong>
        <span>Help, advice & safety</span>
      </div>
    </div>
    </div>

    <button class="cta" type="button" @click="emit('close')">
      LOG OUT
      <UIcon name="i-material-symbols-logout-rounded" class="cta-icon" aria-hidden="true" />
    </button>
  </section>
</template>

<style scoped>
.sheet {
  width: 100%;
  max-height: 100%;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  padding: 18px 18px 20px;
  border-radius: 34px;
  background: linear-gradient(180deg, #1a1a1a, #131313);
  color: #f3f1ec;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 28px 52px rgba(0, 0, 0, 0.42);
  overflow: hidden;
}

.sheet-handle {
  width: 52px;
  height: 4px;
  margin: 2px auto 26px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 2px 6px 6px;
  margin-bottom: 24px;
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

.avatar-circle {
  position: relative;
  flex: none;
  width: 76px;
  height: 76px;
  border-radius: 22px;
  background: linear-gradient(180deg, #f8f0df, #f1dcc0);
  border: 2px solid rgba(59, 130, 246, 0.94);
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.16),
    0 10px 24px rgba(59, 130, 246, 0.12);
  overflow: hidden;
}

.avatar-head {
  position: absolute;
  top: 14px;
  left: 24px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #2e1d10;
}

.avatar-body {
  position: absolute;
  left: 14px;
  bottom: -1px;
  width: 46px;
  height: 38px;
  border-radius: 20px 20px 8px 8px;
  background: linear-gradient(180deg, #cb8458, #a75b36);
}

.profile-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
  min-height: 76px;
  padding-top: 0;
}

.profile-name {
  color: #f5f1ec;
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.025em;
}

.profile-sub {
  margin-top: 7px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.section {
  padding: 0;
}

.profile-header + .section {
  margin-top: 8px;
}

.section + .section {
  margin-top: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px;
  margin: 0 0 12px;
}

.section-label {
  margin: 0;
  color: rgba(255, 255, 255, 0.36);
  font-size: 0.61rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
}

.section-line {
  height: 1px;
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
}

.ride-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 13px 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  background: #1b1b1b;
  color: #f3f1ec;
  text-align: left;
  cursor: pointer;
  transition:
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
    background 180ms ease;
}

.ride-card:hover {
  background: #202020;
}

.ride-card:active {
  transform: translateY(1px) scale(0.988);
}

.ride-icon-tile {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #141414;
}

.ride-icon {
  width: 18px;
  height: 18px;
  color: #3b82f6;
}

.ride-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
  min-height: 38px;
}

.ride-copy strong {
  font-size: 0.84rem;
  font-weight: 700;
}

.ride-copy span {
  color: rgba(255, 255, 255, 0.38);
  font-size: 0.62rem;
}

.ride-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  min-height: 38px;
}

.ride-meta strong {
  font-size: 0.9rem;
  font-weight: 700;
}

.status-badge {
  padding: 0;
  border-radius: 6px;
  color: #3b82f6;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.payment-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  background: #1b1b1b;
  color: #f3f1ec;
  text-align: left;
  cursor: pointer;
  transition:
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 180ms ease,
    background 180ms ease;
}

.payment-row:hover {
  background: #202020;
}

.payment-row:active {
  transform: translateY(1px) scale(0.988);
}

.payment-row.selected {
  border-color: rgba(255, 255, 255, 0.05);
}

.pay-icon-tile {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #141414;
}

.pay-icon {
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.82);
}

.pay-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
  min-height: 38px;
}

.pay-copy strong {
  font-size: 0.84rem;
  font-weight: 700;
}

.pay-copy span {
  color: rgba(255, 255, 255, 0.38);
  font-size: 0.62rem;
}

.pay-check {
  display: grid;
  place-items: center;
}

.check-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 22px;
  margin-bottom: 24px;
}

.action-tile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding: 20px 14px 14px;
  border-radius: 16px;
  background: #1b1b1b;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.action-icon-wrap {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #141414;
  margin-bottom: 12px;
}

.action-tile-icon {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.action-tile strong {
  font-size: 0.72rem;
  font-weight: 700;
}

.action-tile span {
  color: rgba(255, 255, 255, 0.34);
  font-size: 0.54rem;
  line-height: 1.35;
}

.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 58px;
  padding: 16px 20px;
  border: 0;
  border-radius: 14px;
  background: #3b82f6;
  color: #f8fbff;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  box-shadow: 0 16px 28px rgba(59, 130, 246, 0.22);
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 16px;
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
  width: 16px;
  height: 16px;
}
</style>