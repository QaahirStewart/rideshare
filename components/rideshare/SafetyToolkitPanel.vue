<script setup lang="ts">
import { ref } from 'vue'
import type { SafetyToolkit } from '../../types/rideshare'

const props = defineProps<{
  settings: SafetyToolkit
}>()

const emit = defineEmits<{
  close: []
  save: [value: SafetyToolkit]
}>()

const shareTripByDefault = ref(props.settings.shareTripByDefault)
const pinVerification = ref(props.settings.pinVerification)
const rideCheckIns = ref(props.settings.rideCheckIns)
const audioRecording = ref(props.settings.audioRecording)
const trustedContacts = ref(props.settings.trustedContacts)
const contacts = ref([...props.settings.contacts])
const rideMonitoring = ref(props.settings.rideMonitoring)
const adasOptimized = ref(props.settings.adasOptimized)
const encryptionEnabled = ref(props.settings.encryptionEnabled)

function adjustContacts(delta: number) {
  trustedContacts.value = Math.max(0, Math.min(5, trustedContacts.value + delta))
}

function submit() {
  emit('save', {
    shareTripByDefault: shareTripByDefault.value,
    pinVerification: pinVerification.value,
    rideCheckIns: rideCheckIns.value,
    audioRecording: audioRecording.value,
    trustedContacts: trustedContacts.value,
    contacts: contacts.value,
    rideMonitoring: rideMonitoring.value,
    adasOptimized: adasOptimized.value,
    encryptionEnabled: encryptionEnabled.value,
  })
}
</script>

<template>
  <section class="sheet sheet-safety">
    <div class="sheet-handle" aria-hidden="true" />

    <header class="panel-header">
      <p class="eyebrow">Safety Toolkit</p>
      <h2>Safety First</h2>
      <span>Your security is our priority. Manage your trusted contacts and real-time monitoring.</span>
    </header>

    <div class="scroll-body">
      <!-- Share Trip Details -->
      <div class="section-row">
        <h3 class="section-title">Share Trip Details</h3>
        <span class="section-badge">Contacts</span>
      </div>

      <div class="contact-list">
        <div v-for="(c, i) in contacts" :key="c.id" class="contact-row">
          <div class="contact-avatar">
            <UIcon name="i-material-symbols-person-rounded" class="contact-icon" aria-hidden="true" />
          </div>
          <span class="contact-info">
            <strong>{{ c.name }}</strong>
            <small>{{ c.role }}</small>
          </span>
          <UIcon v-if="i === 0" name="i-material-symbols-verified-rounded" class="contact-badge primary" aria-hidden="true" />
          <UIcon v-else name="i-material-symbols-more-vert-rounded" class="contact-badge" aria-hidden="true" />
        </div>
        <button class="add-contact-btn" type="button" @click="adjustContacts(1)">
          + Add Trusted Contact
        </button>
      </div>

      <!-- Safety Tools -->
      <div class="section-row">
        <h3 class="section-title">Safety Tools</h3>
        <span class="section-badge">Active Systems</span>
      </div>

      <div class="monitoring-card">
        <div class="monitoring-header">
          <UIcon name="i-material-symbols-radar-rounded" class="tool-icon" aria-hidden="true" />
          <span class="monitoring-dot active" />
        </div>
        <strong>Ride Monitoring</strong>
        <small>Automatic GPS tracking active for all active Ride Share trips.</small>
      </div>

      <div class="tools-grid">
        <div class="tool-tile">
          <UIcon name="i-material-symbols-shield-with-heart-rounded" class="tool-icon" aria-hidden="true" />
          <strong>ADAS Status</strong>
          <small class="status-optimized">Optimized</small>
        </div>
        <div class="tool-tile">
          <UIcon name="i-material-symbols-pin-rounded" class="tool-icon" aria-hidden="true" />
          <strong>Pin Check</strong>
          <small>Mandatory for night departures.</small>
        </div>
      </div>

      <!-- Toggle settings -->
      <section class="toggle-list">
        <label class="toggle-row">
          <span>
            <strong>Share trip automatically</strong>
            <small>Send your route to trusted contacts at pickup.</small>
          </span>
          <input v-model="shareTripByDefault" type="checkbox">
        </label>

        <label class="toggle-row">
          <span>
            <strong>PIN verification</strong>
            <small>Ask for a ride PIN before entering the car.</small>
          </span>
          <input v-model="pinVerification" type="checkbox">
        </label>

        <label class="toggle-row">
          <span>
            <strong>Ride check-ins</strong>
            <small>Get prompts if the route stops unexpectedly.</small>
          </span>
          <input v-model="rideCheckIns" type="checkbox">
        </label>

        <label class="toggle-row">
          <span>
            <strong>Audio recording shortcut</strong>
            <small>Keep the safety recorder one tap away.</small>
          </span>
          <input v-model="audioRecording" type="checkbox">
        </label>
      </section>

      <!-- Secure Encryption -->
      <div class="encryption-banner">
        <UIcon name="i-material-symbols-verified-user-rounded" class="encryption-icon" aria-hidden="true" />
        <span>
          <strong>Secure Encryption</strong>
          <small>All safety data is encrypted and shared only with authorized law enforcement and your trusted contacts during emergencies.</small>
        </span>
      </div>
    </div>

    <button class="sos-btn" type="button">SOS &nbsp;Emergency Assistance</button>

    <div class="footer-actions">
      <button class="ghost-btn" type="button" @click="emit('close')">Back</button>
      <button class="cta" type="button" @click="submit">Save Toolkit</button>
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

.sheet-safety {
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
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.panel-header h2 {
  margin: 6px 0 0;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.panel-header > span {
  display: block;
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.72rem;
  line-height: 1.35;
}

/* ── Section headers ── */
.section-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 14px 0 8px;
}

.section-title {
  margin: 0;
  color: #3b82f6;
  font-size: 0.78rem;
  font-weight: 700;
}

.section-badge {
  color: rgba(255, 255, 255, 0.36);
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ── Contacts ── */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #1b1b1b;
  border-radius: 14px;
  overflow: hidden;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
}

.contact-row + .contact-row {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.contact-avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.14);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.contact-icon {
  width: 18px;
  height: 18px;
  color: #3b82f6;
}

.contact-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.contact-info strong {
  font-size: 0.78rem;
}

.contact-info small {
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.66rem;
}

.contact-badge {
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.28);
  flex-shrink: 0;
}

.contact-badge.primary {
  color: #22c55e;
}

.add-contact-btn {
  border: 0;
  background: none;
  color: rgba(255, 255, 255, 0.5);
  font: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 10px 12px;
  text-align: left;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.add-contact-btn:hover {
  color: #3b82f6;
}

/* ── Monitoring card ── */
.monitoring-card {
  padding: 12px 14px;
  border-radius: 14px;
  background: #1b1b1b;
  margin-bottom: 8px;
}

.monitoring-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.monitoring-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #555;
}

.monitoring-dot.active {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
}

.monitoring-card strong {
  display: block;
  font-size: 0.82rem;
  margin-bottom: 2px;
}

.monitoring-card small {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.68rem;
  line-height: 1.3;
}

/* ── Tools grid ── */
.tools-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.tool-tile {
  padding: 12px;
  border-radius: 14px;
  background: #1b1b1b;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tool-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

.tool-tile strong {
  font-size: 0.74rem;
}

.tool-tile small {
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.62rem;
  line-height: 1.3;
}

.status-optimized {
  color: #22c55e !important;
  font-weight: 700;
  font-style: italic;
  text-transform: uppercase;
  font-size: 0.58rem !important;
  letter-spacing: 0.04em;
}

/* ── Toggle rows ── */
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

.toggle-row > span {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.toggle-row strong {
  font-size: 0.78rem;
}

.toggle-row small {
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.66rem;
}

.toggle-row input {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
  flex-shrink: 0;
}

/* ── Encryption banner ── */
.encryption-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.15);
}

.encryption-icon {
  width: 22px;
  height: 22px;
  color: #22c55e;
  flex-shrink: 0;
  margin-top: 1px;
}

.encryption-banner span {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.encryption-banner strong {
  font-size: 0.76rem;
}

.encryption-banner small {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.62rem;
  line-height: 1.35;
}

/* ── SOS button ── */
.sos-btn {
  flex-shrink: 0;
  width: 100%;
  margin-top: 10px;
  min-height: 44px;
  border: 0;
  border-radius: 14px;
  background: rgba(239, 68, 68, 0.18);
  color: #ef4444;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

.sos-btn:hover {
  background: rgba(239, 68, 68, 0.28);
}

/* ── Footer ── */
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
