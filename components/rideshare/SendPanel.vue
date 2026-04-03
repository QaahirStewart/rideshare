<script setup lang="ts">
import { computed } from 'vue'
import RideshareServiceTabs from './ServiceTabs.vue'
import type { AppService, DeliveryServiceOption, SendPackageType } from '../../types/rideshare'

const props = defineProps<{
  activeService: AppService
  riderName: string
  packageTypes: SendPackageType[]
  deliveryServices: DeliveryServiceOption[]
}>()

defineEmits<{
  switchService: [service: AppService]
}>()

const firstName = computed(() => props.riderName.split(' ')[0] ?? props.riderName)
</script>

<template>
  <section class="sheet sheet-service">
    <RideshareServiceTabs :active-service="activeService" @select="$emit('switchService', $event)" />

    <header class="hero-copy">
      <h2>Ready to send, {{ firstName }}?</h2>
      <p>Fast and reliable deliveries</p>
    </header>

    <div class="section-head">
      <span>What are you sending?</span>
    </div>

    <div class="pill-grid">
      <button v-for="item in packageTypes" :key="item.id" class="package-pill" type="button">
        <UIcon :name="item.icon" class="package-pill-icon" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </button>
    </div>

    <div class="section-head section-head-spaced">
      <span>Delivery services</span>
      <button class="section-link" type="button">Compare</button>
    </div>

    <div class="service-list">
      <article
        v-for="service in deliveryServices"
        :key="service.id"
        class="delivery-card"
        :class="{ 'delivery-card-featured': service.id === 'standard' }"
      >
        <div class="delivery-icon-wrap">
          <UIcon :name="service.icon" class="delivery-icon" aria-hidden="true" />
        </div>

        <div class="delivery-copy">
          <strong>{{ service.name }}</strong>
          <span>{{ service.description }} • {{ service.etaLabel }}</span>
        </div>

        <UIcon name="i-material-symbols-arrow-forward-rounded" class="delivery-arrow" aria-hidden="true" />
      </article>
    </div>

    <button class="cta cta-disabled" type="button">
      <UIcon name="i-material-symbols-local-shipping-outline-rounded" class="cta-icon" aria-hidden="true" />
      Start a new delivery
    </button>
  </section>
</template>

<style scoped>
.sheet-service {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 14px 14px;
  border-radius: 30px;
  background: rgba(29, 29, 29, 0.98);
  color: #f4f0ec;
  box-shadow: 0 28px 48px rgba(0, 0, 0, 0.34);
  overflow-y: auto;
  scrollbar-width: none;
}

.sheet-service::-webkit-scrollbar {
  display: none;
}

.hero-copy h2 {
  margin: 0;
  font-size: 1.62rem;
  line-height: 1.02;
}

.hero-copy p {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.48);
  font-size: 0.78rem;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.63rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.section-head-spaced {
  margin-top: 4px;
}

.section-link {
  border: 0;
  background: none;
  color: #ffffff;
  font: inherit;
  text-transform: uppercase;
}

.pill-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.package-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 80px;
  padding: 10px 10px;
  border: 0;
  border-radius: 18px;
  background: #2a2a2a;
  color: #f4f1ee;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 700;
  text-align: center;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

.package-pill-icon,
.delivery-icon,
.delivery-arrow,
.cta-icon {
  width: 20px;
  height: 20px;
}

.service-list {
  display: grid;
  gap: 10px;
}

.delivery-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 15px 16px;
  border-radius: 22px;
  background: #2a2a2a;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

.delivery-card-featured {
  background: linear-gradient(180deg, #2d2d2d, #292929);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.14);
}

.delivery-icon-wrap {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #111111;
  color: #f3f0ec;
}

.delivery-copy {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.delivery-copy strong {
  font-size: 0.98rem;
}

.delivery-copy span {
  color: rgba(255, 255, 255, 0.52);
  font-size: 0.74rem;
}

.delivery-arrow {
  color: rgba(255, 255, 255, 0.46);
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 56px;
  margin-top: auto;
  border: 0;
  border-radius: 18px;
  padding: 0 18px;
  font: inherit;
  font-size: 0.94rem;
  font-weight: 800;
}

.cta-disabled {
  background: #4a4a4a;
  color: rgba(255, 255, 255, 0.68);
}
</style>