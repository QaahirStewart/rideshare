<script setup lang="ts">
import RideshareServiceTabs from './ServiceTabs.vue'
import type { AppService, MartCategory, MartStore } from '../../types/rideshare'

defineProps<{
  activeService: AppService
  address: string
  categories: MartCategory[]
  featuredStores: MartStore[]
}>()

defineEmits<{
  switchService: [service: AppService]
}>()
</script>

<template>
  <section class="sheet sheet-service">
    <RideshareServiceTabs :active-service="activeService" @select="$emit('switchService', $event)" />

    <button class="address-card" type="button">
      <span class="address-icon-wrap" aria-hidden="true">
        <UIcon name="i-material-symbols-location-on-rounded" class="address-icon" />
      </span>

      <span class="address-copy">
        <small>Deliver to</small>
        <strong>{{ address }}</strong>
      </span>

      <UIcon name="i-material-symbols-expand-more-rounded" class="address-caret" aria-hidden="true" />
    </button>

    <div class="section-head">
      <span>Featured stores near you</span>
    </div>

    <div class="store-scroller">
      <article v-for="store in featuredStores" :key="store.id" class="store-card">
        <div class="store-banner" :style="{ background: store.accent }">
          <span class="rating-pill">{{ store.rating.toFixed(1) }}</span>
        </div>

        <div class="store-footer">
          <span class="store-badge" aria-hidden="true">
            <UIcon name="i-material-symbols-storefront-outline-rounded" class="store-badge-icon" />
          </span>

          <div class="store-copy">
            <strong>{{ store.name }}</strong>
            <span>{{ store.etaLabel }} • {{ store.deliveryFeeLabel }}</span>
          </div>
        </div>
      </article>
    </div>

    <div class="section-head section-head-spaced">
      <span>What are you looking for?</span>
    </div>

    <div class="category-row">
      <button v-for="category in categories" :key="category.id" class="category-pill" type="button">
        {{ category.label }}
      </button>
    </div>

    <div class="section-head section-head-spaced">
      <span>Popular categories</span>
      <button class="section-link" type="button">See all</button>
    </div>

    <button class="search-cta" type="button">
      <UIcon name="i-material-symbols-search-rounded" class="search-cta-icon" aria-hidden="true" />
      Search stores and items
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

.address-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  min-height: 72px;
  padding: 12px 14px;
  border: 0;
  border-radius: 18px;
  background: #2a2a2a;
  color: #f4f0ec;
  text-align: left;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

.address-icon-wrap {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #111111;
}

.address-icon,
.address-caret,
.store-badge-icon,
.search-cta-icon {
  width: 20px;
  height: 20px;
}

.address-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.address-copy small {
  color: rgba(255, 255, 255, 0.44);
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.address-copy strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.98rem;
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

.store-scroller {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 82%;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
}

.store-scroller::-webkit-scrollbar {
  display: none;
}

.store-card {
  border-radius: 20px;
  overflow: hidden;
  background: #2a2a2a;
}

.store-banner {
  position: relative;
  min-height: 132px;
}

.store-banner::before {
  content: '';
  position: absolute;
  inset: 16px auto auto 18px;
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.16);
}

.store-banner::after {
  content: '';
  position: absolute;
  right: 18px;
  bottom: 18px;
  width: 72px;
  height: 72px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  filter: blur(1px);
}

.rating-pill {
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(22, 22, 22, 0.88);
  font-size: 0.74rem;
  font-weight: 800;
}

.store-footer {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 14px;
}

.store-badge {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #f2eeea;
  color: #171717;
}

.store-copy {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.store-copy strong {
  font-size: 0.96rem;
}

.store-copy span {
  color: rgba(255, 255, 255, 0.52);
  font-size: 0.72rem;
}

.category-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-pill {
  min-height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: #2a2a2a;
  color: #f4f0ec;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
}

.search-cta {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  min-height: 56px;
  margin-top: auto;
  border: 0;
  border-radius: 18px;
  padding: 0 18px;
  background: #414141;
  color: #f0ece8;
  font: inherit;
  font-size: 0.94rem;
  font-weight: 800;
}

.search-cta-icon {
  color: #2f7cf6;
}
</style>