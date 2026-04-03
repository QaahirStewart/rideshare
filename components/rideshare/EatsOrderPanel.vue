<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem, MenuItem, RestaurantSpot } from '../../types/rideshare'

type OrderLineItem = CartItem & {
  menuItem: MenuItem
}

const props = defineProps<{
  restaurant: RestaurantSpot | null
  menuItems: MenuItem[]
  cartItems: CartItem[]
  cartTotal: number
}>()

const emit = defineEmits<{
  remove: [menuItemId: string]
  update: [menuItemId: string, quantity: number]
  close: []
}>()

const orderItems = computed<OrderLineItem[]>(() =>
  props.cartItems.reduce<OrderLineItem[]>((items, cartItem) => {
    const menuItem = props.menuItems.find((item) => item.id === cartItem.menuItemId)

    if (menuItem) {
      items.push({
        ...cartItem,
        menuItem,
      })
    }

    return items
  }, []),
)

const hasOrderItems = computed(() => orderItems.value.length > 0)

const deliveryFee = computed(() => (hasOrderItems.value ? props.restaurant?.deliveryFee ?? 0 : 0))
const serviceFee = computed(() => (hasOrderItems.value ? props.restaurant?.serviceFee ?? 0 : 0))
const orderTotal = computed(() => props.cartTotal + deliveryFee.value + serviceFee.value)

const orderMeta = computed(() => {
  const segments = [props.restaurant?.name?.toUpperCase(), props.restaurant?.etaLabel].filter(
    (segment): segment is string => Boolean(segment),
  )

  return segments.join(' • ')
})
</script>

<template>
  <section class="sheet sheet-order">
    <div class="sheet-handle" aria-hidden="true" />

    <header class="order-header">
      <h2>Your Order</h2>
      <p v-if="orderMeta" class="order-meta">{{ orderMeta }}</p>
    </header>

    <div class="section-head">
      <span>Items</span>
    </div>

    <div v-if="hasOrderItems" class="order-list">
      <article v-for="orderItem in orderItems" :key="orderItem.menuItemId" class="order-card">
        <div class="order-thumb">
          <img :src="orderItem.menuItem.image" alt="" class="order-thumb-image">
        </div>

        <div class="order-details">
          <div class="order-details-top">
            <strong class="order-item-name">{{ orderItem.menuItem.name }}</strong>
            <button
              class="remove-btn"
              type="button"
              :aria-label="`Remove ${orderItem.menuItem.name}`"
              @click="emit('remove', orderItem.menuItemId)"
            >
              <UIcon name="i-material-symbols-close-rounded" class="remove-icon" aria-hidden="true" />
            </button>
          </div>

          <div class="order-details-bottom">
            <div class="price-block">
              <span class="item-price">${{ (orderItem.menuItem.price * orderItem.quantity).toFixed(2) }}</span>
              <span v-if="orderItem.quantity > 1" class="item-price-note">
                {{ orderItem.quantity }} x ${{ orderItem.menuItem.price.toFixed(2) }}
              </span>
            </div>

            <div class="qty-controls">
              <button
                class="qty-btn"
                type="button"
                aria-label="Decrease quantity"
                @click="emit('update', orderItem.menuItemId, orderItem.quantity - 1)"
              >
                <UIcon name="i-material-symbols-remove-rounded" class="qty-icon" aria-hidden="true" />
              </button>
              <span class="qty-val">{{ orderItem.quantity }}</span>
              <button
                class="qty-btn"
                type="button"
                aria-label="Increase quantity"
                @click="emit('update', orderItem.menuItemId, orderItem.quantity + 1)"
              >
                <UIcon name="i-material-symbols-add-rounded" class="qty-icon" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="order-empty">
      <strong>Your bag is empty</strong>
      <p>Add a few items from the restaurant menu to continue to checkout.</p>
      <button class="empty-btn" type="button" @click="emit('close')">
        Back to menu
      </button>
    </div>

    <template v-if="hasOrderItems">
      <div class="order-summary">
        <div class="price-breakdown">
          <div class="price-row">
            <span>Subtotal</span>
            <span>${{ cartTotal.toFixed(2) }}</span>
          </div>
          <div class="price-row">
            <span>Delivery Fee</span>
            <span>${{ deliveryFee.toFixed(2) }}</span>
          </div>
          <div class="price-row">
            <span>Service Fee</span>
            <span>${{ serviceFee.toFixed(2) }}</span>
          </div>
        </div>

        <div class="total-row">
          <span class="total-label">Total</span>
          <strong class="total-amount">${{ orderTotal.toFixed(2) }}</strong>
        </div>
      </div>

      <button class="checkout-btn" type="button">
        <span class="checkout-copy">Checkout</span>
        <UIcon name="i-material-symbols-arrow-forward-rounded" class="checkout-icon" aria-hidden="true" />
      </button>
    </template>
  </section>
</template>

<style scoped>
.sheet-order {
  width: 100%;
  height: auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 8px;
  border-radius: 30px;
  background: #171717;
  color: #f3f1ec;
  box-shadow: 0 24px 44px rgba(0, 0, 0, 0.32);
  overflow: hidden;
}

.sheet-handle {
  width: 52px;
  height: 4px;
  margin: 12px auto 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}

.order-header {
  padding: 0 18px 12px;
  flex-shrink: 0;
}

.order-header h2 {
  margin: 0 0 6px;
  font-family: 'Inter', sans-serif;
  font-size: 1.58rem;
  font-weight: 800;
  letter-spacing: -0.028em;
  line-height: 1.02;
}

.order-meta {
  margin: 0;
  color: rgba(229, 226, 225, 0.54);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.section-head {
  padding: 18px 18px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(229, 226, 225, 0.44);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  flex-shrink: 0;
}

.order-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;
  padding: 0 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.order-list::-webkit-scrollbar {
  display: none;
}

.order-card {
  display: grid;
  grid-template-columns: 76px 1fr;
  align-items: start;
  gap: 16px;
  padding: 12px 14px 12px 12px;
  border-radius: 20px;
  background: rgba(42, 42, 42, 0.52);
}

.order-thumb {
  width: 72px;
  height: 72px;
  border-radius: 14px;
  overflow: hidden;
  background: #1c1c1c;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
}

.order-thumb-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.order-details-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.order-item-name {
  color: #e5e2e1;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
}

.remove-btn {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgba(229, 226, 225, 0.44);
  flex-shrink: 0;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}

.remove-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #f3f1ec;
}

.remove-icon {
  width: 16px;
  height: 16px;
}

.order-details-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.price-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-price {
  color: #e5e2e1;
  font-size: 0.96rem;
  font-weight: 800;
}

.item-price-note {
  color: #8f8788;
  font-size: 0.66rem;
  line-height: 1.3;
}

.qty-controls {
  display: flex;
  align-items: center;
  min-height: 42px;
  padding: 0 4px;
  border-radius: 14px;
  background: #101010;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
}

.qty-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #f3f1ec;
  cursor: pointer;
  transition: background 150ms ease;
}

.qty-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.qty-icon {
  width: 14px;
  height: 14px;
}

.qty-val {
  min-width: 28px;
  text-align: center;
  color: #ffffff;
  font-size: 0.84rem;
  font-weight: 700;
}

.order-empty {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  padding: 0 18px 24px;
}

.order-empty strong {
  font-size: 1.02rem;
  font-weight: 700;
}

.order-empty p {
  margin: 0;
  max-width: 240px;
  color: rgba(229, 226, 225, 0.58);
  font-size: 0.76rem;
  line-height: 1.45;
}

.empty-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: 14px;
  background: #252525;
  color: #f3f1ec;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.order-summary {
  padding: 16px 18px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.84rem;
}

.price-row span:last-child {
  color: #e5e2e1;
}

.total-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 18px;
}

.total-label {
  color: #f3f1ec;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.total-amount {
  color: #ffffff;
  font-size: 1.56rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  align-self: stretch;
  min-height: 64px;
  margin: 14px 18px 18px;
  padding: 16px 20px;
  border: 0;
  border-radius: 20px;
  background: #3b82f6;
  color: #f8fbff;
  font-family: inherit;
  font-size: 0.98rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 18px 34px rgba(59, 130, 246, 0.22);
  transition:
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 180ms ease,
    filter 180ms ease;
}

.checkout-btn:hover {
  box-shadow: 0 22px 38px rgba(59, 130, 246, 0.3);
  filter: saturate(1.03);
}

.checkout-btn:active {
  transform: translateY(1px) scale(0.988);
  box-shadow: 0 12px 20px rgba(59, 130, 246, 0.18);
}

.checkout-copy {
  letter-spacing: 0.1em;
}

.checkout-icon {
  width: 24px;
  height: 24px;
}
</style>
