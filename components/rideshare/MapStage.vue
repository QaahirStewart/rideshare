<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { serviceTabs } from '../../data/rideshare'
import type { ActivePanel, FlowStep, DestinationSuggestion } from '../../types/rideshare'

const props = defineProps<{
  activeService: import('../../types/rideshare').AppService
  activePanel: ActivePanel
  step: FlowStep
  destinationTitle?: string
  trackingProgress: number
  headerLabel?: string
  headerRight?: 'avatar' | 'heart' | 'close'
  headerForceBack?: boolean
}>()

const emit = defineEmits<{
  back: []
  profile: []
  menu: []
  mapTap: []
  choosePoi: [suggestion: DestinationSuggestion]
}>()

const activeServiceMeta = computed(() => serviceTabs.find((service) => service.id === props.activeService) ?? serviceTabs[0])
const headerUsesMenu = computed(() => props.activePanel === 'ride' && (props.activeService !== 'ride' || props.step === 'home'))
const showRoute = computed(() => props.activeService === 'ride' && props.step !== 'home')
const showDriver = computed(() => props.activeService === 'ride' && props.step === 'tracking')
const showPoiMarkers = computed(() => props.activeService === 'ride' && props.activePanel === 'ride' && props.step === 'home')
const driverOffset = computed(() => `${12 + props.trackingProgress * 58}%`)
const driverTop = computed(() => `${70 - props.trackingProgress * 36}%`)

// ── POI data (positions are % of the 220% surface) ──
const pois = [
  { id: 'cn-tower', label: 'CN Tower', icon: 'i-material-symbols-cell-tower-rounded', x: 36, y: 64, suggestion: { id: 'cn-tower', title: 'CN Tower', subtitle: '290 Bremner Blvd, Toronto', distanceMiles: 1.2, etaMinutes: 6, type: 'recent' as const } },
  { id: 'distillery', label: 'Distillery', icon: 'i-material-symbols-factory-rounded', x: 68, y: 62, suggestion: { id: 'distillery', title: 'Distillery District', subtitle: '55 Mill St, Toronto', distanceMiles: 2.1, etaMinutes: 10, type: 'suggested' as const } },
  { id: 'kensington', label: 'Kensington', icon: 'i-material-symbols-storefront-rounded', x: 18, y: 34, suggestion: { id: 'kensington', title: 'Kensington Market', subtitle: 'Kensington Ave, Toronto', distanceMiles: 1.8, etaMinutes: 9, type: 'suggested' as const } },
  { id: 'union-station', label: 'Union Stn', icon: 'i-material-symbols-train-rounded', x: 48, y: 68, suggestion: { id: 'union-station', title: 'Union Station', subtitle: '65 Front St W, Toronto', distanceMiles: 0.8, etaMinutes: 4, type: 'suggested' as const } },
  { id: 'eaton-centre', label: 'Eaton Centre', icon: 'i-material-symbols-shopping-bag-rounded', x: 52, y: 38, suggestion: { id: 'eaton-centre', title: 'Eaton Centre', subtitle: '220 Yonge St, Toronto', distanceMiles: 1.4, etaMinutes: 7, type: 'suggested' as const } },
  { id: 'rogers-centre', label: 'Rogers Centre', icon: 'i-material-symbols-stadium-rounded', x: 30, y: 70, suggestion: { id: 'rogers-centre', title: 'Rogers Centre', subtitle: '1 Blue Jays Way, Toronto', distanceMiles: 1.5, etaMinutes: 8, type: 'suggested' as const } },
  { id: 'st-lawrence', label: 'St. Lawrence', icon: 'i-material-symbols-local-grocery-store-rounded', x: 62, y: 56, suggestion: { id: 'st-lawrence', title: 'St. Lawrence Market', subtitle: '93 Front St E, Toronto', distanceMiles: 1.9, etaMinutes: 9, type: 'suggested' as const } },
  { id: 'rom', label: 'ROM', icon: 'i-material-symbols-museum-rounded', x: 42, y: 14, suggestion: { id: 'rom', title: 'Royal Ontario Museum', subtitle: '100 Queens Park, Toronto', distanceMiles: 2.8, etaMinutes: 14, type: 'suggested' as const } },
]

// ── Pan state ──
const mapSurface = ref<HTMLElement | null>(null)
const mapViewport = ref<HTMLElement | null>(null)
const panX = ref(0)
const panY = ref(0)
let dragging = false
let startX = 0
let startY = 0
let originX = 0
let originY = 0
let wasDragged = false

function clampPan(x: number, y: number) {
  if (!mapSurface.value || !mapViewport.value) return { x, y }
  const sw = mapSurface.value.offsetWidth
  const sh = mapSurface.value.offsetHeight
  const vw = mapViewport.value.offsetWidth
  const vh = mapViewport.value.offsetHeight
  return {
    x: Math.min(0, Math.max(-(sw - vw), x)),
    y: Math.min(0, Math.max(-(sh - vh), y)),
  }
}

function onPointerDown(e: PointerEvent) {
  if ((e.target as HTMLElement).closest('button, .destination-chip, .poi-marker')) return
  dragging = true
  wasDragged = false
  startX = e.clientX
  startY = e.clientY
  originX = panX.value
  originY = panY.value
  mapSurface.value?.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) wasDragged = true
  const clamped = clampPan(originX + dx, originY + dy)
  panX.value = clamped.x
  panY.value = clamped.y
}

function onPointerUp(e: PointerEvent) {
  dragging = false
  mapSurface.value?.releasePointerCapture(e.pointerId)
}

function handlePoiClick(suggestion: DestinationSuggestion) {
  if (!wasDragged) {
    emit('choosePoi', suggestion)
  }
}

// Center the larger map on mount
onMounted(() => {
  if (mapSurface.value && mapViewport.value) {
    const centered = clampPan(
      -(mapSurface.value.offsetWidth - mapViewport.value.offsetWidth) / 2,
      -(mapSurface.value.offsetHeight - mapViewport.value.offsetHeight) / 2,
    )
    panX.value = centered.x
    panY.value = centered.y
  }
})
</script>

<template>
  <div ref="mapViewport" class="map-viewport" @click.self="$emit('mapTap')">
    <!-- Fixed overlay (stays in place) -->
    <div v-if="activePanel !== 'ride'" class="profile-overlay" />

    <!-- Fixed header (stays in place) -->
    <div class="map-header-row">
      <button
        class="icon-button"
        type="button"
        :aria-label="(props.headerForceBack || !headerUsesMenu) ? 'Back' : 'Open menu'"
        @click="(props.headerForceBack || !headerUsesMenu) ? $emit('back') : $emit('menu')"
      >
        <UIcon v-if="!props.headerForceBack && headerUsesMenu" name="i-material-symbols-menu-rounded" class="header-icon" aria-hidden="true" />
        <UIcon v-else name="i-material-symbols-arrow-back-rounded" class="header-icon" aria-hidden="true" />
      </button>

      <div class="brand-pill">{{ props.headerLabel ?? activeServiceMeta.headerLabel }}</div>

      <button v-if="(props.headerRight ?? 'avatar') === 'heart'" class="icon-button" type="button" aria-label="Save">
        <UIcon name="i-material-symbols-favorite-outline-rounded" class="header-icon" aria-hidden="true" />
      </button>
      <button v-else-if="(props.headerRight ?? 'avatar') === 'close'" class="icon-button" type="button" aria-label="Close" @click="$emit('back')">
        <UIcon name="i-material-symbols-close-rounded" class="header-icon" aria-hidden="true" />
      </button>
      <button v-else class="avatar-badge" type="button" aria-label="Open profile" @click="$emit('profile')">
        <span class="avatar-head" />
        <span class="avatar-body" />
      </button>
    </div>

    <!-- Pannable map surface -->
    <div
      ref="mapSurface"
      class="map-surface"
      :style="{ transform: `translate(${panX}px, ${panY}px)` }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @click.self="!wasDragged && $emit('mapTap')"
    >
      <!-- Water: Lake Ontario (top) -->
      <div class="map-water map-water-lake" />

      <!-- Major roads grid -->
      <div class="map-road road-yonge" />
      <div class="map-road road-bay" />
      <div class="map-road road-university" />
      <div class="map-road road-spadina" />
      <div class="map-road road-bloor" />
      <div class="map-road road-queen" />
      <div class="map-road road-king" />
      <div class="map-road road-front" />
      <div class="map-road road-dundas" />
      <div class="map-road road-college" />
      <div class="map-road road-gardiner" />

      <!-- Parks -->
      <div class="map-park park-queens" />
      <div class="map-park park-trinity" />
      <div class="map-park park-allan" />

      <!-- Labels -->
      <span class="map-label label-lake">Lake Ontario</span>
      <span class="map-label label-downtown">DOWNTOWN</span>
      <span class="map-label label-yonge">Yonge St</span>
      <span class="map-label label-bloor">Bloor St W</span>
      <span class="map-label label-queen">Queen St W</span>
      <span class="map-label label-king">King St W</span>
      <span class="map-label label-spadina">Spadina</span>
      <span class="map-label label-cn">CN Tower</span>
      <span class="map-label label-distillery">Distillery</span>
      <span class="map-label label-kensington">Kensington</span>

      <!-- Clickable POI markers -->
      <button
        v-for="poi in showPoiMarkers ? pois : []"
        :key="poi.id"
        class="poi-marker"
        :style="{ left: poi.x + '%', top: poi.y + '%' }"
        :aria-label="poi.label"
        type="button"
        @click="handlePoiClick(poi.suggestion)"
      >
        <UIcon :name="poi.icon" class="poi-icon" aria-hidden="true" />
        <span class="poi-label">{{ poi.label }}</span>
      </button>

      <div v-if="activeService === 'ride'" class="pickup-pin" aria-hidden="true" />

      <template v-if="showRoute">
        <div class="route-dot route-dot-a" aria-hidden="true" />
        <div class="route-dot route-dot-b" aria-hidden="true" />
        <div class="route-line" aria-hidden="true" />

        <div v-if="destinationTitle" class="destination-chip">
          <span class="chip-label">Destination</span>
          <strong>{{ destinationTitle }}</strong>
        </div>
      </template>

      <div
        v-if="showDriver"
        class="driver-marker"
        :style="{ left: driverOffset, top: driverTop }"
        aria-hidden="true"
      >
        <UIcon name="i-material-symbols-directions-car-rounded" class="driver-marker-icon" />
      </div>
    </div>

  </div>
</template>

<style scoped>
.map-viewport {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background:
    repeating-linear-gradient(90deg, rgba(57, 73, 81, 0.07) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(0deg, rgba(57, 73, 81, 0.07) 0 1px, transparent 1px 18px),
    linear-gradient(180deg, #daeaf6 0%, #eaf3fb 40%, #f4f8fc 100%);
}

.map-surface {
  position: absolute;
  width: 220%;
  height: 220%;
  will-change: transform;
  touch-action: none;
  cursor: grab;
  background:
    repeating-linear-gradient(90deg, rgba(57, 73, 81, 0.07) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(0deg, rgba(57, 73, 81, 0.07) 0 1px, transparent 1px 18px),
    linear-gradient(180deg, #daeaf6 0%, #eaf3fb 40%, #f4f8fc 100%);
}

.map-surface:active {
  cursor: grabbing;
}

.profile-overlay {
  position: absolute;
  inset: 0;
  background: rgba(7, 8, 10, 0.42);
  z-index: 1;
}

/* ── Water: Lake Ontario ── */
.map-water {
  position: absolute;
  background: linear-gradient(180deg, rgba(80, 180, 230, 0.55), rgba(100, 195, 240, 0.35));
}

.map-water-lake {
  bottom: -20px;
  left: -20px;
  right: -20px;
  height: 160px;
  border-radius: 60px 60px 0 0;
}

/* ── Roads ── */
.map-road {
  position: absolute;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 0 0 1px rgba(96, 112, 122, 0.06);
}

/* Vertical streets (N-S) */
.road-yonge {
  left: 50%;
  top: 0;
  width: 14px;
  height: 100%;
}

.road-bay {
  left: 42%;
  top: 0;
  width: 8px;
  height: 100%;
}

.road-university {
  left: 34%;
  top: 0;
  width: 12px;
  height: 82%;
}

.road-spadina {
  left: 22%;
  top: 0;
  width: 10px;
  height: 100%;
}

/* Horizontal streets (E-W) */
.road-bloor {
  top: 16%;
  left: 0;
  width: 100%;
  height: 12px;
}

.road-college {
  top: 28%;
  left: 0;
  width: 100%;
  height: 7px;
}

.road-dundas {
  top: 38%;
  left: 0;
  width: 100%;
  height: 8px;
}

.road-queen {
  top: 48%;
  left: 0;
  width: 100%;
  height: 10px;
}

.road-king {
  top: 58%;
  left: 0;
  width: 100%;
  height: 8px;
}

.road-front {
  top: 68%;
  left: 0;
  width: 100%;
  height: 8px;
}

.road-gardiner {
  top: 78%;
  left: 0;
  width: 100%;
  height: 14px;
  background: rgba(255, 255, 255, 0.92);
}

/* ── Parks ── */
.map-park {
  position: absolute;
  border-radius: 12px;
  background: rgba(120, 200, 120, 0.28);
}

.park-queens {
  top: 47%;
  left: 33%;
  width: 38px;
  height: 32px;
  border-radius: 8px;
}

.park-trinity {
  top: 47%;
  left: 16%;
  width: 24px;
  height: 28px;
  border-radius: 6px;
}

.park-allan {
  top: 12%;
  left: 55%;
  width: 30px;
  height: 44px;
  border-radius: 10px;
}

/* ── Map labels ── */
.map-label {
  position: absolute;
  color: rgba(38, 38, 38, 0.52);
  font-size: 0.56rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  pointer-events: none;
}

.label-lake {
  bottom: 38px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(40, 120, 180, 0.5);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.label-downtown {
  top: 42%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: rgba(38, 38, 38, 0.22);
}

.label-yonge {
  top: 22%;
  left: calc(50% + 16px);
  writing-mode: vertical-rl;
  font-size: 0.5rem;
  color: rgba(38, 38, 38, 0.38);
}

.label-bloor {
  top: calc(16% - 14px);
  right: 14px;
  font-size: 0.5rem;
}

.label-queen {
  top: calc(48% - 14px);
  left: 6px;
  font-size: 0.5rem;
}

.label-king {
  top: calc(58% - 14px);
  right: 14px;
  font-size: 0.5rem;
}

.label-spadina {
  top: 30%;
  left: calc(22% - 4px);
  writing-mode: vertical-rl;
  font-size: 0.48rem;
  color: rgba(38, 38, 38, 0.34);
}

.label-cn {
  top: 64%;
  left: 36%;
  font-size: 0.52rem;
  color: rgba(59, 130, 246, 0.5);
  font-weight: 700;
}

.label-distillery {
  top: 62%;
  right: 8px;
  font-size: 0.48rem;
  color: rgba(38, 38, 38, 0.34);
}

.label-kensington {
  top: 34%;
  left: 10px;
  font-size: 0.48rem;
  color: rgba(38, 38, 38, 0.34);
}

.map-header-row {
  position: absolute;
  top: 16px;
  left: 18px;
  right: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
}

.icon-button,
.locate-button,
.avatar-badge {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 16px;
  background: rgba(32, 31, 31, 0.94);
  color: #f6f8f4;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.header-icon {
  width: 18px;
  height: 18px;
}

.icon-button svg,
.locate-button svg,
.driver-marker svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.brand-pill {
  min-width: 96px;
  padding: 11px 18px 10px;
  border-radius: 999px;
  background: rgba(50, 50, 50, 0.94);
  color: #f7f6f3;
  text-align: center;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
}

.avatar-badge {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #ffe7ca, #ffd4af);
}

.avatar-head {
  position: absolute;
  top: 7px;
  left: 13px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #1c1f26;
}

.avatar-body {
  position: absolute;
  bottom: -1px;
  left: 10px;
  width: 20px;
  height: 18px;
  border-radius: 10px 10px 0 0;
  background: #f3f2eb;
}

.pickup-pin,
.route-dot {
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 50% 50% 50% 0;
  border: 4px solid #2dff84;
  background: rgba(255, 255, 255, 0.92);
  transform: rotate(-45deg);
  box-shadow: 0 8px 18px rgba(21, 97, 56, 0.16);
}

.pickup-pin {
  bottom: 258px;
  left: 154px;
}

.pickup-pin::after,
.route-dot::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: #163523;
}

.route-dot-a {
  bottom: 232px;
  left: 64px;
}

.route-dot-b {
  top: 258px;
  right: 72px;
}

.route-line {
  position: absolute;
  top: 284px;
  left: 92px;
  width: 176px;
  height: 122px;
  border: 4px dashed rgba(39, 255, 126, 0.95);
  border-color: rgba(39, 255, 126, 0.95) transparent transparent transparent;
  border-radius: 90px 90px 0 0;
  transform: rotate(28deg);
}

.destination-chip {
  position: absolute;
  right: 18px;
  bottom: 344px;
  max-width: 180px;
  padding: 10px 14px;
  border-radius: 14px;
  background: #201f1f;
  color: #f3f1ec;
  box-shadow: 0 18px 32px rgba(0, 0, 0, 0.24);
}

.chip-label {
  display: block;
  margin-bottom: 2px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.destination-chip strong {
  font-size: 0.88rem;
  font-weight: 700;
}

.driver-marker {
  position: absolute;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #201f1f;
  color: #3b82f6;
  box-shadow: 0 18px 26px rgba(0, 0, 0, 0.22);
  transform: translate(-50%, -50%);
  animation: pulse 1800ms ease-in-out infinite;
  transition:
    left 1800ms cubic-bezier(0.22, 1, 0.36, 1),
    top 1800ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 220ms ease;
}



.driver-marker-icon {
  width: 20px;
  height: 20px;
}

@keyframes pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.06);
  }
}

/* ── POI markers ── */
.poi-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 0;
  z-index: 1;
  transition: transform 150ms ease;
}

.poi-marker:hover {
  transform: translate(-50%, -50%) scale(1.12);
}

.poi-marker:active {
  transform: translate(-50%, -50%) scale(0.95);
}

.poi-marker .poi-icon {
  width: 28px;
  height: 28px;
  padding: 5px;
  border-radius: 10px;
  background: #201f1f;
  color: #3b82f6;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.poi-label {
  font-size: 0.48rem;
  font-weight: 700;
  color: rgba(20, 20, 20, 0.72);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  letter-spacing: 0.02em;
}
</style>