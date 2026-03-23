<script setup lang="ts">
import type { PerksSnapshot } from '../../types/rideshare'

defineProps<{
  perks: PerksSnapshot
}>()

defineEmits<{
  close: []
  activate: []
}>()
</script>

<template>
  <section class="sheet sheet-perks">
    <div class="sheet-handle" aria-hidden="true" />

    <header class="panel-header">
      <p class="eyebrow">Perks</p>
      <h2>Keep your home screen perks separate</h2>
      <span>Membership tools and passes that are not part of booking flow.</span>
    </header>

    <div class="scroll-body">
      <section class="hero-card">
      <p>{{ perks.tierLabel }}</p>
      <strong>{{ perks.progressLabel }}</strong>
    </section>

    <div class="perks-grid">
      <article class="perk-card">
        <strong>Airport priority</strong>
        <span>{{ perks.airportPriority ? 'Active at major terminals' : 'Not enabled' }}</span>
      </article>

      <article class="perk-card">
        <strong>Price lock pass</strong>
        <span>{{ perks.priceLockPass ? 'Rush-hour fares capped' : 'Unavailable' }}</span>
      </article>

      <article class="perk-card perk-card-wide">
        <strong>Commute Pack</strong>
        <span>{{ perks.commutePackRides }} rides ready for weekday pickups.</span>
      </article>
    </div>
    </div>

    <div class="footer-actions">
      <button class="ghost-btn" type="button" @click="$emit('close')">Back</button>
      <button class="cta" type="button" @click="$emit('activate')">Commute Pack</button>
    </div>
  </section>
</template>

<style scoped>
.sheet {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  margin-top: auto;
  padding: 14px 16px 16px;
  border-radius: 34px;
  background: linear-gradient(180deg, #161616, #121212);
  color: #f3f1ec;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 28px 52px rgba(0, 0, 0, 0.42);
}

.sheet-perks {
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

.eyebrow {
  margin: 0;
  color: #3b82f6;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.panel-header h2 {
  margin: 8px 0 0;
  font-size: 1.28rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.panel-header span,
.perk-card span {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.76rem;
}

.hero-card {
  margin-top: 12px;
  padding: 14px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.22), rgba(59, 130, 246, 0.08));
  border: 1px solid rgba(59, 130, 246, 0.18);
}

.hero-card p {
  margin: 0;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.hero-card strong {
  display: block;
  margin-top: 6px;
  font-size: 0.92rem;
}

.perks-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.perk-card {
  padding: 12px;
  border-radius: 14px;
  background: #1b1b1b;
}

.perk-card strong {
  display: block;
  font-size: 0.84rem;
}

.perk-card-wide {
  grid-column: 1 / -1;
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
  font: inherit;
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
