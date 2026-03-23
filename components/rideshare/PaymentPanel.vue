<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { PaymentMethod } from '../../types/rideshare'

const props = defineProps<{
  paymentMethods: PaymentMethod[]
  selectedPaymentId: string
}>()

const emit = defineEmits<{
  close: []
  saveMethod: [payload: { id?: string; brand: string; last4: string; expiry: string; label: string }]
  selectPayment: [paymentId: string]
}>()

const editor = reactive({
  id: '',
  brand: 'Visa',
  last4: '',
  expiry: '',
  label: '',
})

const editingExisting = computed(() => Boolean(editor.id))

function startNewMethod() {
  editor.id = ''
  editor.brand = 'Visa'
  editor.last4 = ''
  editor.expiry = ''
  editor.label = ''
}

function editMethod(method: PaymentMethod) {
  editor.id = method.id
  editor.brand = method.brand
  editor.last4 = method.last4
  editor.expiry = method.expiry
  editor.label = method.label
}

function submitMethod() {
  emit('saveMethod', {
    id: editor.id || undefined,
    brand: editor.brand,
    last4: editor.last4,
    expiry: editor.expiry,
    label: editor.label,
  })
}
</script>

<template>
  <section class="sheet sheet-payments">
    <div class="sheet-handle" aria-hidden="true" />

    <header class="panel-header">
      <div>
        <p class="eyebrow">Payment</p>
        <h2>Wallet</h2>
        <span>Add cards, update details, and switch the default payment method.</span>
      </div>

      <button class="add-method-btn" type="button" @click="startNewMethod">
        <UIcon name="i-material-symbols-add-rounded" class="add-method-icon" aria-hidden="true" />
        New
      </button>
    </header>

    <section class="methods-list">
      <button
        v-for="method in paymentMethods"
        :key="method.id"
        class="method-row"
        :class="{ selected: method.id === selectedPaymentId }"
        type="button"
        @click="emit('selectPayment', method.id)"
      >
        <div class="method-icon-tile">
          <UIcon name="i-material-symbols-credit-card-rounded" class="method-icon" aria-hidden="true" />
        </div>

        <div class="method-copy">
          <strong>{{ method.last4 ? `${method.brand} •••• ${method.last4}` : `${method.brand} Pay` }}</strong>
          <span>{{ method.label }}</span>
        </div>

        <div class="method-actions">
          <span v-if="method.id === selectedPaymentId" class="selected-pill">Default</span>
          <span class="edit-link" @click.stop="editMethod(method)">Edit</span>
        </div>
      </button>
    </section>

    <section class="editor-card">
      <div class="editor-head">
        <div>
          <p class="editor-eyebrow">{{ editingExisting ? 'Edit Method' : 'Add Method' }}</p>
          <strong>{{ editingExisting ? 'Update payment details' : 'Create a new payment method' }}</strong>
        </div>
      </div>

      <div class="field-grid field-grid-single">
        <label class="field-block">
          <span class="field-label">Brand</span>
          <select v-model="editor.brand" class="field-input field-select">
            <option>Visa</option>
            <option>Mastercard</option>
            <option>Amex</option>
            <option>Apple</option>
          </select>
        </label>
      </div>

      <div class="field-grid">
        <label class="field-block">
          <span class="field-label">Last 4</span>
          <input v-model="editor.last4" class="field-input" maxlength="4" placeholder="4242" type="text">
        </label>

        <label class="field-block">
          <span class="field-label">Expiry</span>
          <input v-model="editor.expiry" class="field-input" maxlength="5" placeholder="04/27" type="text">
        </label>
      </div>

      <label class="field-block field-block-spaced">
        <span class="field-label">Label</span>
        <input v-model="editor.label" class="field-input" placeholder="Travel rewards or Default payment method" type="text">
      </label>

      <div class="footer-actions">
        <button class="ghost-btn" type="button" @click="emit('close')">Close</button>
        <button class="cta" type="button" @click="submitMethod">{{ editingExisting ? 'Save Changes' : 'Add Method' }}</button>
      </div>
    </section>
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

.sheet-payments {
  overflow: auto;
  scrollbar-width: none;
}

.sheet-payments::-webkit-scrollbar {
  display: none;
}

.sheet-handle {
  width: 52px;
  height: 4px;
  margin: 2px auto 24px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #3b82f6;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.32rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.panel-header span {
  display: block;
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.78rem;
  line-height: 1.5;
}

.add-method-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid rgba(59, 130, 246, 0.22);
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.08);
  color: #3b82f6;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.add-method-icon {
  width: 18px;
  height: 18px;
}

.methods-list {
  display: grid;
  gap: 12px;
  margin-top: 22px;
}

.method-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 18px;
  background: #1b1b1b;
  color: #f3f1ec;
  text-align: left;
  cursor: pointer;
}

.method-row.selected {
  border-color: rgba(59, 130, 246, 0.24);
}

.method-icon-tile {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #141414;
}

.method-icon {
  width: 18px;
  height: 18px;
  color: #3b82f6;
}

.method-copy {
  display: grid;
  gap: 3px;
}

.method-copy strong {
  font-size: 0.86rem;
}

.method-copy span {
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.68rem;
}

.method-actions {
  display: grid;
  justify-items: end;
  gap: 6px;
}

.selected-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.edit-link {
  color: rgba(255, 255, 255, 0.74);
  font-size: 0.68rem;
  font-weight: 700;
}

.editor-card {
  margin-top: 20px;
  padding: 16px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(180deg, rgba(31, 31, 31, 0.98), rgba(24, 24, 24, 0.96));
}

.editor-eyebrow {
  margin: 0 0 6px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.editor-head strong {
  font-size: 0.92rem;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.field-grid-single {
  grid-template-columns: 1fr;
}

.field-block {
  display: grid;
  gap: 8px;
}

.field-block-spaced {
  margin-top: 16px;
}

.field-label {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.field-input {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  background: #1b1b1b;
  color: #f3f1ec;
  font: inherit;
}

.field-select {
  appearance: none;
}

.field-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.34);
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.14);
}

.footer-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 18px;
}

.ghost-btn,
.cta {
  min-height: 52px;
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

@media (max-width: 360px) {
  .field-grid,
  .footer-actions {
    grid-template-columns: 1fr;
  }
}
</style>