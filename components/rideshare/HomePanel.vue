<script setup lang="ts">
import { computed } from 'vue'
import type { DestinationSuggestion, PaymentMethod, SavedPlace } from '../../types/rideshare'

const props = defineProps<{
  destinationQuery: string
  minimized?: boolean
  suggestions: DestinationSuggestion[]
  savedPlaces: SavedPlace[]
  paymentMethod: PaymentMethod
}>()

const lastTripSuggestion = computed(() =>
  props.suggestions.find((suggestion) => suggestion.type === 'recent') ?? props.suggestions[0] ?? null,
)

const visibleSavedPlaces = computed(() => props.savedPlaces.slice(0, 3))

defineEmits<{
  openAddPlaces: []
  updateQuery: [value: string]
  chooseSuggestion: [suggestion: DestinationSuggestion]
  chooseSavedPlace: [place: SavedPlace]
  continue: []
  expand: []
}>()
</script>

<template>
  <section class="sheet sheet-home" :class="{ 'sheet-minimized': minimized }">
    <div class="sheet-handle" aria-hidden="true" />

    <header v-if="!minimized" class="sheet-copy">
      <h2>Choose a destination</h2>
      <p>Search for a place or pick from your recent stops</p>
    </header>

    <div class="search-card" @click="minimized ? $emit('expand') : undefined">
      <div class="search-input-wrap">
        <span class="search-mark" aria-hidden="true">
          <UIcon name="i-material-symbols-search-rounded" class="app-icon search-icon" />
        </span>

        <input
          id="destination-search"
          :value="destinationQuery"
          type="text"
          placeholder="Where to?"
          @input="$emit('updateQuery', ($event.target as HTMLInputElement).value)"
        >

        <span class="input-divider" aria-hidden="true" />

        <span class="timing-pill">
          <UIcon name="i-material-symbols-schedule-outline-rounded" class="app-icon timing-icon" />
          Now
        </span>
      </div>
    </div>

    <template v-if="!minimized">
    <div class="saved-row">
      <button
        v-for="place in visibleSavedPlaces"
        :key="place.id"
        class="saved-chip"
        type="button"
        @click="$emit('chooseSavedPlace', place)"
      >
        <span class="saved-chip__icon" aria-hidden="true">
          <UIcon v-if="place.icon === 'home'" name="i-material-symbols-home-outline-rounded" class="app-icon" />
          <UIcon v-else-if="place.icon === 'briefcase'" name="i-material-symbols-business-center-outline-rounded" class="app-icon" />
          <UIcon v-else name="i-material-symbols-fitness-center-rounded" class="app-icon" />
        </span>
        <span class="saved-chip__title">{{ place.label }}</span>
      </button>

      <button class="saved-chip saved-chip-add" type="button" @click="$emit('openAddPlaces')">
        <span class="saved-chip__icon" aria-hidden="true">
          <UIcon name="i-material-symbols-add-location-alt-rounded" class="app-icon" />
        </span>
        <span class="saved-chip__title">Add</span>
      </button>
    </div>

    <div class="section-head">
      <span>Last trip</span>
    </div>

    <button
      v-if="lastTripSuggestion"
      class="suggestion-card suggestion-card-featured last-trip-card"
      type="button"
      @click="$emit('chooseSuggestion', lastTripSuggestion)"
    >
      <span class="suggestion-icon" aria-hidden="true">
        <UIcon name="i-material-symbols-history-rounded" class="app-icon last-trip-icon" />
      </span>

      <div class="suggestion-copy">
        <strong>{{ lastTripSuggestion.title }}</strong>
        <span>{{ lastTripSuggestion.subtitle }}</span>
      </div>

      <UIcon name="i-material-symbols-chevron-right-rounded" class="app-icon suggestion-arrow" aria-hidden="true" />
    </button>

    <button class="cta" type="button" @click="$emit('continue')">
      <span>Explore ride options</span>
      <UIcon name="i-material-symbols-arrow-forward-rounded" class="app-icon cta-icon" aria-hidden="true" />
    </button>
    </template>
  </section>
</template>

<style scoped>
.sheet {
  width: 100%;
  border-radius: 30px;
  background: #171717;
  color: #f3f1ec;
  box-shadow: 0 24px 44px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(16px);
}

.sheet-home {
  padding: 18px 16px 16px;
  transition: padding 250ms ease;
}

.sheet-minimized {
  padding: 10px 12px;
  border-radius: 22px;
}

.sheet-minimized .sheet-handle {
  display: none;
}

.sheet-handle {
  width: 42px;
  height: 5px;
  margin: 2px auto 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.sheet-copy {
  margin: 4px 0 14px;
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

.search-card {
  padding: 0;
  background: transparent;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 60px;
  padding: 0 16px;
  border-radius: 18px;
  background: #1f1f1f;
  transition:
    background-color 200ms ease,
    box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.search-input-wrap:focus-within {
  background: #252525;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.22), 0 16px 30px rgba(0, 0, 0, 0.18);
}

.search-mark {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.app-icon {
  width: 18px;
  height: 18px;
}

.search-icon {
  color: #3b82f6;
  width: 24px;
  height: 24px;
}

.search-input-wrap input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #ece8e4;
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.search-input-wrap input::placeholder {
  color: rgba(255, 255, 255, 0.58);
  font-weight: 700;
}

.input-divider {
  width: 1px;
  height: 34px;
  flex-shrink: 0;
  margin-left: 2px;
  background: rgba(255, 255, 255, 0.08);
}

.timing-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  height: 40px;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.84rem;
  font-weight: 600;
}

.timing-icon {
  width: 17px;
  height: 17px;
  color: rgba(255, 255, 255, 0.66);
}

.saved-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.saved-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border: 0;
  border-radius: 12px;
  background: #1f1f1f;
  color: #f1f2ef;
  text-align: center;
  transition:
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 180ms ease,
    box-shadow 180ms ease;
}

.saved-chip:hover {
  background: #252525;
}

.saved-chip:active {
  transform: translateY(1px) scale(0.985);
}

.saved-chip__icon {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #3b82f6;
}

.saved-chip__icon .app-icon {
  display: block;
}

.saved-chip__title {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.01em;
}

.saved-chip-add {
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.18);
}

@media (max-width: 420px) {
  .saved-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.section-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.section-head-secondary {
  margin-top: 12px;
}

.suggestion-list {
  display: grid;
  gap: 8px;
  margin-top: 8px;
}

.suggestion-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px 0 12px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: #f3f1ec;
  text-align: left;
  transition:
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 180ms ease;
}

.suggestion-card-featured {
  grid-template-columns: auto minmax(0, 1fr) auto;
  margin-top: 10px;
}

.last-trip-card {
  width: 100%;
  min-height: 64px;
}

.last-trip-card:hover {
  transform: translateY(-1px);
}

.last-trip-card:active {
  transform: translateY(1px) scale(0.99);
}

.suggestion-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #0d0d0d;
  color: rgba(255, 255, 255, 0.72);
  flex-shrink: 0;
}

.last-trip-card .suggestion-icon svg {
  width: 24px;
  height: 24px;
}

.last-trip-icon {
  width: 20px;
  height: 20px;
}

.suggestion-arrow {
  color: rgba(255, 255, 255, 0.26);
  width: 22px;
  height: 22px;
  margin-left: auto;
  justify-self: end;
  align-self: center;
}

.cta-icon {
  width: 24px;
  height: 24px;
}

.suggestion-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.suggestion-card strong {
  display: block;
  font-family: inherit;
  font-size: 0.94rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.suggestion-card span {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.78rem;
}

.last-trip-card .suggestion-copy span {
  line-height: 1.2;
}

.suggestion-meta {
  text-align: right;
}

.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 12px;
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

@media (max-width: 420px) {
  .saved-row {
    grid-template-columns: 1fr;
  }

  .section-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>