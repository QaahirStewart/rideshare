<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SavedPlace } from '../../types/rideshare'

const emit = defineEmits<{
  close: []
  save: [payload: { label: string; address: string; icon: SavedPlace['icon'] }]
}>()

const label = ref('')
const address = ref('')
const icon = ref<SavedPlace['icon']>('home')

const placeOptions: Array<{ icon: SavedPlace['icon']; label: string; description: string; symbol: string }> = [
  { icon: 'home', label: 'Home', description: 'Apartment or house', symbol: 'i-material-symbols-home-outline-rounded' },
  { icon: 'briefcase', label: 'Work', description: 'Office or co-working', symbol: 'i-material-symbols-work-outline-rounded' },
  { icon: 'star', label: 'Favorite', description: 'Frequent destination', symbol: 'i-material-symbols-star-outline-rounded' },
]

const isValid = computed(() => {
  return label.value.trim().length > 1 && address.value.trim().length > 4
})

function submitPlace() {
  if (!isValid.value) {
    return
  }

  emit('save', {
    label: label.value,
    address: address.value,
    icon: icon.value,
  })

  label.value = ''
  address.value = ''
  icon.value = 'home'
}
</script>

<template>
  <section class="sheet sheet-places">
    <div class="sheet-handle" aria-hidden="true" />

    <header class="panel-header">
      <div>
        <p class="eyebrow">Saved Places</p>
        <h2>Add Place</h2>
        <span>Create a shortcut for home, work, or your next regular stop.</span>
      </div>
    </header>

    <section class="field-block">
      <label class="field-label" for="place-label">Place name</label>
      <input id="place-label" v-model="label" class="field-input" type="text" placeholder="Home, Office, Pilates" />
    </section>

    <section class="field-block">
      <label class="field-label" for="place-address">Address</label>
      <textarea id="place-address" v-model="address" class="field-textarea" rows="3" placeholder="101 W 58th St, New York" />
    </section>

    <section class="field-block">
      <p class="field-label">Category</p>
      <div class="option-grid">
        <button
          v-for="option in placeOptions"
          :key="option.icon"
          class="option-tile"
          :class="{ selected: option.icon === icon }"
          type="button"
          @click="icon = option.icon"
        >
          <UIcon :name="option.symbol" class="option-icon" aria-hidden="true" />
          <strong>{{ option.label }}</strong>
          <span>{{ option.description }}</span>
        </button>
      </div>
    </section>

    <div class="footer-actions">
      <button class="ghost-btn" type="button" @click="emit('close')">Cancel</button>
      <button class="cta" type="button" :disabled="!isValid" @click="submitPlace">Save Place</button>
    </div>
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
  background: linear-gradient(180deg, #161616, #121212);
  color: #f3f1ec;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 28px 52px rgba(0, 0, 0, 0.42);
}

.sheet-places {
  overflow: auto;
  scrollbar-width: none;
}

.sheet-places::-webkit-scrollbar {
  display: none;
}

.sheet-handle {
  width: 52px;
  height: 4px;
  margin: 2px auto 24px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.panel-header h2 {
  margin: 0;
  font-size: 1.32rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.eyebrow {
  margin: 0 0 8px;
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

.field-block {
  margin-top: 20px;
}

.field-label {
  display: block;
  margin: 0 0 10px;
  color: rgba(255, 255, 255, 0.64);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.field-input,
.field-textarea {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: #1b1b1b;
  color: #f3f1ec;
  font: inherit;
}

.field-input {
  min-height: 54px;
  padding: 0 16px;
}

.field-textarea {
  min-height: 98px;
  padding: 14px 16px;
  resize: none;
}

.field-input::placeholder,
.field-textarea::placeholder {
  color: rgba(255, 255, 255, 0.34);
}

.field-input:focus,
.field-textarea:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.34);
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.14);
}

.option-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.option-tile {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 12px;
  row-gap: 4px;
  align-items: center;
  width: 100%;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  background: #1b1b1b;
  color: #f3f1ec;
  text-align: left;
  cursor: pointer;
}

.option-tile.selected {
  border-color: rgba(59, 130, 246, 0.34);
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.12);
}

.option-icon {
  grid-row: 1 / span 2;
  width: 18px;
  height: 18px;
  color: #3b82f6;
}

.option-tile strong {
  font-size: 0.82rem;
}

.option-tile span {
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.66rem;
}

.footer-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: auto;
  padding-top: 24px;
}

.ghost-btn,
.cta {
  min-height: 54px;
  border: 0;
  border-radius: 16px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
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

.cta:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>