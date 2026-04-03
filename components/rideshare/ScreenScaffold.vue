<script setup lang="ts">
import RideshareMapStage from './MapStage.vue'

defineProps<{
  activeService: import('../../types/rideshare').AppService
  activePanel: 'ride' | 'menu' | 'preferences' | 'safety' | 'perks' | 'profile' | 'my-rides' | 'places' | 'payments'
  step: 'home' | 'rides' | 'confirming' | 'tracking'
  destinationTitle?: string
  trackingProgress: number
  headerLabel?: string
  headerRight?: 'avatar' | 'heart' | 'close'
  headerForceBack?: boolean
}>()

defineEmits<{
  back: []
  profile: []
  menu: []
  mapTap: []
  choosePoi: [suggestion: import('../../types/rideshare').DestinationSuggestion]
}>()

</script>

<template>
  <main class="mock-scene">
    <div class="scene-shell">
      <section class="phone-lane">
        <div class="phone-frame">
          <RideshareMapStage
            :active-service="activeService"
            :active-panel="activePanel"
            :destination-title="destinationTitle"
            :header-label="headerLabel"
            :header-right="headerRight"
            :header-force-back="headerForceBack"
            :step="step"
            :tracking-progress="trackingProgress"
            @back="$emit('back')"
            @choose-poi="(s: any) => $emit('choosePoi', s)"
            @map-tap="$emit('mapTap')"
            @menu="$emit('menu')"
            @profile="$emit('profile')"
          />

          <slot />
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:global(body) {
  margin: 0;
  min-width: 320px;
  background:
    radial-gradient(circle at top left, rgba(48, 255, 132, 0.12), transparent 22%),
    radial-gradient(circle at top right, rgba(98, 200, 255, 0.14), transparent 26%),
    #141519;
  color: #f4f5f0;
  font-family: 'Inter', sans-serif;
}

:global(*) {
  box-sizing: border-box;
}

:global(a) {
  color: inherit;
  text-decoration: none;
}

.mock-scene {
  min-height: 100vh;
  padding: 28px 18px 40px;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 28%);
  background-size: 14px 14px, 100% 100%;
}

.scene-shell {
  width: min(392px, 100%);
  margin: 0 auto;
}

.phone-frame {
  position: relative;
  isolation: isolate;
  height: min(78vh, 720px);
  min-height: 680px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background: #e9f3fb;
  box-shadow:
    0 28px 80px rgba(0, 0, 0, 0.42),
    inset 0 0 0 1px rgba(255, 255, 255, 0.26);
}

.phone-frame::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  width: 112px;
  height: 18px;
  border-radius: 0 0 14px 14px;
  background: #201f1f;
  transform: translateX(-50%);
  z-index: 4;
}

@media (max-width: 560px) {
  .mock-scene {
    padding-inline: 10px;
  }

  .phone-frame {
    height: min(76vh, 700px);
    min-height: 640px;
  }
}

@media (max-width: 480px) {
  .mock-scene {
    padding: 0;
    background-image: none;
  }

  .scene-shell {
    width: 100%;
  }

  .phone-frame {
    height: 100dvh;
    min-height: 100dvh;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }

  .phone-frame::before {
    display: none;
  }
}
</style>