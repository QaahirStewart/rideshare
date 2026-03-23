<script setup lang="ts">
defineEmits<{
  close: []
  openPreferences: []
  openSafety: []
  openPerks: []
}>()
</script>

<template>
  <section class="sheet sheet-menu">
    <div class="sheet-handle" aria-hidden="true" />

    <header class="panel-header">
      <p class="eyebrow">Menu</p>
      <h2>Before-you-book tools</h2>
      <span>Keep preferences, safety, and perks separate from the booking flow.</span>
    </header>

    <div class="scroll-body">
      <div class="menu-list">
      <button class="menu-item" type="button" @click="$emit('openPreferences')">
        <UIcon name="i-material-symbols-tune-rounded" class="menu-icon" aria-hidden="true" />
        <span>
          <strong>Ride preferences</strong>
          <small>Quiet mode, cabin temp, and default ride style.</small>
        </span>
      </button>

      <button class="menu-item" type="button" @click="$emit('openSafety')">
        <UIcon name="i-material-symbols-shield-with-heart-rounded" class="menu-icon" aria-hidden="true" />
        <span>
          <strong>Safety toolkit</strong>
          <small>Trip sharing, ride PINs, and check-in rules.</small>
        </span>
      </button>

      <button class="menu-item" type="button" @click="$emit('openPerks')">
        <UIcon name="i-material-symbols-stars-rounded" class="menu-icon" aria-hidden="true" />
        <span>
          <strong>Perks and passes</strong>
          <small>See home-screen benefits without opening your profile.</small>
        </span>
      </button>
    </div>
    </div>

    <button class="close-btn" type="button" @click="$emit('close')">Close</button>
  </section>
</template>

<style scoped>
.sheet {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  background: #171717;
  color: #f3f1ec;
  box-shadow: 0 24px 44px rgba(0, 0, 0, 0.32);
  margin-top: auto;
  max-height: 100%;
}

.sheet-menu {
  padding: 14px 16px 16px;
  overflow: hidden;
}

.sheet-handle {
  width: 42px;
  height: 5px;
  margin: 2px auto 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.panel-header {
  flex-shrink: 0;
  margin: 4px 0 10px;
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
  font-size: 1.1rem;
}

.panel-header span {
  display: block;
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.75rem;
}

.menu-list {
  display: grid;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  border: 0;
  border-radius: 14px;
  background: #1f1f1f;
  color: #f1f2ef;
  font: inherit;
  font-weight: 700;
  padding: 14px;
}

.menu-item:hover {
  background: #252525;
}

.menu-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  margin-top: 2px;
}

.menu-item span {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.menu-item strong {
  font-size: 0.86rem;
}

.menu-item small {
  color: rgba(255, 255, 255, 0.46);
  font-size: 0.72rem;
}

.close-btn {
  flex-shrink: 0;
  margin-top: 10px;
  width: 100%;
  min-height: 48px;
  border: 0;
  border-radius: 14px;
  background: #3b82f6;
  color: #f8fbff;
  font: inherit;
  font-weight: 800;
}
</style>
