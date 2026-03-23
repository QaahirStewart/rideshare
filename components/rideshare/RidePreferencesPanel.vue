<script setup lang="ts">
import { ref } from 'vue'
import type { RidePreferences, RideQuote } from '../../types/rideshare'

const props = defineProps<{
  preferences: RidePreferences
  rideOptions: RideQuote[]
}>()

const emit = defineEmits<{
  close: []
  save: [value: RidePreferences]
}>()

const preferredRideId = ref(props.preferences.preferredRideId)
const quietMode = ref(props.preferences.quietMode)
const petFriendly = ref(props.preferences.petFriendly)
const extraTrunkSpace = ref(props.preferences.extraTrunkSpace)
const temperature = ref<RidePreferences['temperature']>(props.preferences.temperature)

function submit() {
  emit('save', {
    preferredRideId: preferredRideId.value,
    quietMode: quietMode.value,
    petFriendly: petFriendly.value,
    extraTrunkSpace: extraTrunkSpace.value,
    temperature: temperature.value,
  })
}
</script>

<template>
  <section class="sheet sheet-preferences">
    <div class="sheet-handle" aria-hidden="true" />

    <header class="panel-header">
      <p class="eyebrow">Ride Preferences</p>
      <h2>Set your default ride vibe</h2>
      <span>These preferences are applied before you confirm a trip.</span>
    </header>

    <div class="scroll-body">
      <section class="section-block">
        <p class="section-label">Preferred ride</p>
      <div class="option-grid option-grid-ride">
        <button
          v-for="option in rideOptions"
          :key="option.id"
          class="option-tile"
          :class="{ selected: option.id === preferredRideId }"
          type="button"
          @click="preferredRideId = option.id"
        >
          <strong>{{ option.name }}</strong>
          <span>{{ option.description }}</span>
        </button>
      </div>
    </section>

    <section class="section-block">
      <p class="section-label">Cabin temperature</p>
      <div class="temperature-row">
        <button
          v-for="value in ['Cool', 'Balanced', 'Warm']"
          :key="value"
          class="temp-chip"
          :class="{ active: value === temperature }"
          type="button"
          @click="temperature = value as RidePreferences['temperature']"
        >
          {{ value }}
        </button>
      </div>
    </section>

    <section class="section-block toggle-list">
      <label class="toggle-row">
        <span>
          <strong>Quiet ride</strong>
          <small>Keep conversation light unless you start it.</small>
        </span>
        <input v-model="quietMode" type="checkbox">
      </label>

      <label class="toggle-row">
        <span>
          <strong>Pet friendly</strong>
          <small>Prefer drivers open to pets and carriers.</small>
        </span>
        <input v-model="petFriendly" type="checkbox">
      </label>

      <label class="toggle-row">
        <span>
          <strong>Extra trunk space</strong>
          <small>Bias toward roomier vehicles when available.</small>
        </span>
        <input v-model="extraTrunkSpace" type="checkbox">
      </label>
      </section>
    </div>

    <div class="footer-actions">
      <button class="ghost-btn" type="button" @click="emit('close')">Back</button>
      <button class="cta" type="button" @click="submit">Save Preferences</button>
    </div>
  </section>
</template>

<style scoped>
.sheet {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 14px 16px 16px;
  border-radius: 34px;
  background: linear-gradient(180deg, #161616, #121212);
  color: #f3f1ec;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 28px 52px rgba(0, 0, 0, 0.42);
}

.sheet-preferences {
  overflow: hidden;
}

.sheet-handle {
  width: 52px;
  height: 4px;
  margin: 2px auto 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.panel-header {
  flex-shrink: 0;
  padding-bottom: 2px;
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

.panel-header h2 {
  margin: 8px 0 0;
  font-size: 1.28rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.eyebrow {
  margin: 0;
  color: #3b82f6;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.panel-header span {
  display: block;
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.78rem;
  line-height: 1.5;
}

.section-block {
  margin-top: 20px;
}

.section-label {
  margin: 0 0 10px;
  color: rgba(255, 255, 255, 0.64);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.option-grid {
  display: grid;
  gap: 10px;
}

.option-tile,
.temp-chip,
.ghost-btn,
.cta {
  font: inherit;
}

.option-tile {
  width: 100%;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  background: #1b1b1b;
  color: #f3f1ec;
  text-align: left;
}

.option-tile.selected {
  border-color: rgba(59, 130, 246, 0.34);
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.12);
}

.option-tile strong,
.toggle-row strong {
  display: block;
  font-size: 0.86rem;
}

.option-tile span,
.toggle-row small {
  color: rgba(255, 255, 255, 0.46);
  font-size: 0.72rem;
}

.toggle-row > span {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.temperature-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.temp-chip {
  min-height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  background: #1b1b1b;
  color: #f3f1ec;
}

.temp-chip.active {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.28);
}

.toggle-list {
  display: grid;
  gap: 6px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: #1b1b1b;
}

.toggle-row input {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
  flex-shrink: 0;
}

.footer-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  flex-shrink: 0;
  padding-top: 10px;
}

.ghost-btn,
.cta {
  min-height: 48px;
  border: 0;
  border-radius: 14px;
  font-weight: 800;
}

.ghost-btn {
  background: #1b1b1b;
  color: #f3f1ec;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.cta {
  background: #3b82f6;
  color: #f8fbff;
}
</style>
