<script setup lang="ts">
import { serviceTabs } from '../../data/rideshare'
import type { AppService } from '../../types/rideshare'

defineProps<{
  activeService: AppService
}>()

defineEmits<{
  select: [service: AppService]
}>()
</script>

<template>
  <nav class="service-tabs" aria-label="Services">
    <span class="service-tabs-handle" aria-hidden="true" />

    <div class="service-tabs-grid">
      <button
        v-for="service in serviceTabs"
        :key="service.id"
        class="service-tab"
        :class="{ 'service-tab-active': service.id === activeService }"
        type="button"
        @click="$emit('select', service.id)"
      >
        <span class="service-tab-icon" aria-hidden="true">
          <UIcon :name="service.icon" class="service-tab-icon-svg" />
        </span>
        <span class="service-tab-label">{{ service.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.service-tabs {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.service-tabs-handle {
  width: 36px;
  height: 4px;
  margin: 0 auto 2px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
}

.service-tabs-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 10px;
  padding: 0 4px;
}

.service-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 86px;
  width: 100%;
  padding: 6px 0 10px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.42);
  font: inherit;
  transition:
    color 180ms ease,
    transform 180ms ease;
}

.service-tab:hover {
  transform: translateY(-1px);
}

.service-tab-active {
  color: #ffffff;
}

.service-tab-icon {
  display: grid;
  place-items: center;
  width: 62px;
  height: 62px;
  border-radius: 20px;
  background: #2a2a2a;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  transition:
    background-color 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease;
}

.service-tab-active .service-tab-icon {
  background: #2f7cf6;
  box-shadow: 0 12px 24px rgba(47, 124, 246, 0.3);
}

.service-tab-icon-svg {
  width: 28px;
  height: 28px;
}

.service-tab-label {
  font-size: 0.58rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
</style>