<script setup lang="ts">
defineProps<{
  destinationTitle?: string
  rideLabel?: string
}>()
</script>

<template>
  <section class="sheet sheet-confirming">
    <div class="spinner" aria-hidden="true" />
    <p class="eyebrow">Finding your driver</p>
    <h2>Confirming your {{ rideLabel || 'Recommended' }} ride</h2>
    <p>
      Heading to {{ destinationTitle || 'your destination' }}
    </p>
  </section>
</template>

<style scoped>
.sheet {
  width: 100%;
  padding: 20px 16px;
  border-radius: 30px;
  background: #171717;
  color: #f3f1ec;
  box-shadow: 0 24px 44px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(16px);
  text-align: center;
}

.spinner {
  width: 44px;
  height: 44px;
  margin: 0 auto 14px;
  border: 4px solid rgba(255, 255, 255, 0.12);
  border-top-color: #65ff91;
  border-radius: 50%;
  animation: spin 1100ms cubic-bezier(0.55, 0.08, 0.32, 0.99) infinite;
}

.eyebrow {
  margin: 0;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.sheet h2 {
  margin: 10px 0 6px;
  font-size: 1.1rem;
  font-weight: 700;
}

.sheet p:last-child {
  margin: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.78rem;
  line-height: 1.6;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>