<script setup lang="ts">
import { computed } from 'vue'
import RideshareServiceTabs from './ServiceTabs.vue'
import type { AppService, EatsCategory, RestaurantSpot } from '../../types/rideshare'

const props = defineProps<{
  activeService: AppService
  riderName: string
  categories: EatsCategory[]
  trendingRestaurants: RestaurantSpot[]
  recentOrders: RestaurantSpot[]
}>()

defineEmits<{
  switchService: [service: AppService]
  openRestaurant: [id: string]
}>()

const firstName = computed(() => props.riderName.split(' ')[0] ?? props.riderName)
</script>

<template>
  <section class="sheet sheet-service">
    <div class="sheet-service-top">
      <RideshareServiceTabs :active-service="activeService" @select="$emit('switchService', $event)" />

      <header class="hero-copy">
        <h2>Hungry, {{ firstName }}?</h2>
        <p>Find your favorites in seconds</p>
      </header>
    </div>

    <div class="sheet-service-body">
      <div class="section-head">
        <span>Quick categories</span>
      </div>

      <div class="pill-row">
        <button v-for="category in categories" :key="category.id" class="tag-pill" type="button">
          <UIcon :name="category.icon" class="tag-pill-icon" aria-hidden="true" />
          {{ category.label }}
        </button>
      </div>

      <div class="section-head section-head-spaced">
        <span>Trending restaurants</span>
        <button class="section-link" type="button">View all</button>
      </div>

      <div class="card-list">
        <button v-for="restaurant in trendingRestaurants" :key="restaurant.id" class="merchant-card" type="button" @click="$emit('openRestaurant', restaurant.id)">
          <div class="merchant-icon">
            <div class="merchant-icon-inner">
            <UIcon :name="restaurant.icon" class="merchant-icon-svg" aria-hidden="true" />
            </div>
          </div>

          <div class="merchant-copy">
            <strong>{{ restaurant.name }}</strong>
            <span>{{ restaurant.cuisine }} • {{ restaurant.etaLabel }}</span>
          </div>

          <UIcon name="i-material-symbols-arrow-forward-rounded" class="merchant-arrow" aria-hidden="true" />
        </button>
      </div>

      <div class="section-head section-head-spaced">
        <span>Recent food orders</span>
      </div>

      <div class="recent-grid">
        <button v-for="order in recentOrders" :key="order.id" class="recent-card" type="button" @click="$emit('openRestaurant', order.id)">
          <div class="recent-card-head">
            <span class="recent-card-badge" aria-hidden="true">
              <UIcon :name="order.icon" class="recent-card-icon" aria-hidden="true" />
            </span>
          </div>
          <div class="recent-card-footer">
            <strong>{{ order.name }}</strong>
            <span>{{ order.cuisine }}</span>
          </div>
        </button>
      </div>
    </div>

    <div class="sheet-service-footer">
      <button class="cta cta-muted" type="button">
        <UIcon name="i-material-symbols-search-rounded" class="cta-icon" aria-hidden="true" />
        Find your next meal
      </button>
    </div>
  </section>
</template>

<style scoped>
.sheet-service {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 12px 16px 16px;
  border-radius: 30px;
  background: #171717;
  color: #f3f1ec;
  box-shadow: 0 24px 44px rgba(0, 0, 0, 0.32);
  overflow: hidden;
  position: relative;
}

.sheet-service-top {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  padding-bottom: 16px;
  background: linear-gradient(180deg, #171717 0%, #171717 84%, rgba(23, 23, 23, 0) 100%);
}

.sheet-service-body {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  padding: 2px 0 10px;
}

.sheet-service-body::-webkit-scrollbar {
  display: none;
}

.sheet-service-footer {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  padding-top: 14px;
  background: linear-gradient(180deg, rgba(23, 23, 23, 0) 0%, rgba(23, 23, 23, 0.9) 28%, #171717 58%);
}

.hero-copy {
  margin: 8px 0 0;
}

.hero-copy h2 {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.025em;
}

.hero-copy p {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.48);
  font-size: 0.78rem;
  line-height: 1.35;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.44);
  font-size: 0.57rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.section-head-spaced {
  margin-top: 26px;
}

.section-link {
  border: 0;
  background: none;
  color: #ffffff;
  font: inherit;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.pill-row {
  display: flex;
  gap: 10px;
  margin-bottom: 0;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 7px;
  min-height: 42px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: #252525;
  color: #f6f4f1;
  font: inherit;
  font-size: 0.77rem;
  font-weight: 700;
}

.tag-pill-icon {
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.72);
}

.card-list {
  display: grid;
  gap: 12px;
}

.merchant-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 14px 14px;
  border: 0;
  border-radius: 20px;
  background: #242424;
  color: #E5E2E1;
  text-align: left;
  cursor: pointer;
  transition: background 150ms ease;
}

.merchant-card:hover {
  background: #2e2e2e;
}

.merchant-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #111111;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.merchant-icon-inner {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #111111;
}

.merchant-icon-svg,
.merchant-arrow,
.cta-icon {
  width: 20px;
  height: 20px;
}

.merchant-icon-svg {
  width: 24px;
  height: 24px;
  color: #E5E2E1;
}

.merchant-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.merchant-copy strong {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #E5E2E1;
}

.merchant-copy span {
  color: #988E90;
  font-size: 0.72rem;
}

.merchant-arrow {
  color: rgba(255, 255, 255, 0.46);
}

.recent-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.recent-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 0;
  border-radius: 20px;
  background: #252525;
  cursor: pointer;
  padding: 14px;
  min-height: 138px;
  text-align: left;
  transition: background 150ms ease;
}

.recent-card:hover {
  background: #2d2d2d;
}

.recent-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.recent-card-badge {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: #101010;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.recent-card-icon {
  width: 27px;
  height: 27px;
  color: #E5E2E1;
}

.recent-card-footer {
  padding: 0;
}

.recent-card-footer strong {
  display: block;
  font-size: 0.88rem;
  font-weight: 700;
  color: #E5E2E1;
  letter-spacing: -0.01em;
}

.recent-card-footer span {
  display: block;
  margin-top: 4px;
  color: #988E90;
  font-size: 0.73rem;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  min-height: 56px;
  width: 100%;
  margin-top: 0;
  border: 0;
  border-radius: 18px;
  padding: 0 18px;
  font: inherit;
  font-size: 0.94rem;
  font-weight: 800;
}

.cta-muted {
  min-height: 64px;
  border-radius: 20px;
  background: #242424;
  color: rgba(255, 255, 255, 0.58);
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.cta-icon {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}
</style>