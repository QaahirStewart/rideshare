<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CartItem, EatsMenuCategory, MenuItem, RestaurantSpot } from '../../types/rideshare'

const props = defineProps<{
  restaurant: RestaurantSpot | null
  menuItems: MenuItem[]
  cartItems: CartItem[]
  cartTotal: number
  cartCount: number
}>()

const emit = defineEmits<{
  addToCart: [id: string]
  viewOrder: []
}>()

const activeCategory = ref('')

const menuCategories = computed<EatsMenuCategory[]>(() => {
  if (props.restaurant?.menuCategories.length) {
    return props.restaurant.menuCategories
  }

  const seen = new Set<string>()

  return props.menuItems.reduce<EatsMenuCategory[]>((categories, item) => {
    if (seen.has(item.category)) {
      return categories
    }

    seen.add(item.category)
    categories.push({
      id: item.category,
      label: formatCategoryLabel(item.category),
    })

    return categories
  }, [])
})

const activeCategoryLabel = computed(
  () => menuCategories.value.find((category) => category.id === activeCategory.value)?.label ?? 'Items',
)

const deliveryFeeLabel = computed(() =>
  props.restaurant ? `$${props.restaurant.deliveryFee.toFixed(2)} Delivery` : '',
)

const filteredItems = computed(() =>
  activeCategory.value
    ? props.menuItems.filter((item) => item.category === activeCategory.value)
    : props.menuItems,
)

const hasFilteredItems = computed(() => filteredItems.value.length > 0)

watch(
  menuCategories,
  (categories) => {
    if (!categories.length) {
      activeCategory.value = ''
      return
    }

    const [firstCategory] = categories

    if (!categories.some((category) => category.id === activeCategory.value)) {
      activeCategory.value = firstCategory?.id ?? ''
    }
  },
  { immediate: true },
)

function cartQtyFor(menuItemId: string) {
  return props.cartItems.find((c) => c.menuItemId === menuItemId)?.quantity ?? 0
}

function formatCategoryLabel(categoryId: string) {
  return categoryId
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
</script>

<template>
  <section class="sheet sheet-restaurant">
    <div class="sheet-handle" aria-hidden="true" />

    <!-- Restaurant header -->
    <header class="rest-header">
      <h2>{{ restaurant?.name }}</h2>
      <div class="rest-meta">
        <UIcon name="i-material-symbols-star-rounded" class="star-icon" aria-hidden="true" />
        <span class="star-val">{{ restaurant?.rating }}</span>
        <span class="meta-sep">•</span>
        <span>{{ restaurant?.etaLabel }}</span>
        <span class="meta-sep">•</span>
        <span>{{ deliveryFeeLabel }}</span>
      </div>
    </header>

    <!-- Category tabs -->
    <div class="cat-tabs">
      <button
        v-for="cat in menuCategories"
        :key="cat.id"
        class="cat-tab"
        :class="{ 'cat-tab-active': cat.id === activeCategory }"
        type="button"
        @click="activeCategory = cat.id"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Section label -->
    <div class="section-head">
      <span>{{ activeCategoryLabel }}</span>
    </div>

    <!-- Menu items -->
    <div v-if="hasFilteredItems" class="menu-list">
      <article v-for="item in filteredItems" :key="item.id" class="menu-item">
        <div class="menu-thumb">
          <img :src="item.image" alt="" class="menu-thumb-image">
        </div>

        <div class="menu-copy">
          <strong class="menu-name">{{ item.name }}</strong>
          <span class="menu-desc">{{ item.description }}</span>
          <strong class="menu-price">${{ item.price.toFixed(2) }}</strong>
        </div>

        <button
          class="add-btn"
          :class="{ 'add-btn-active': cartQtyFor(item.id) > 0 }"
          type="button"
          :aria-label="`Add ${item.name}`"
          @click="emit('addToCart', item.id)"
        >
          <UIcon name="i-material-symbols-add-rounded" class="add-icon" aria-hidden="true" />
        </button>
      </article>
    </div>

    <div v-else class="menu-placeholder">
      <strong>{{ activeCategoryLabel }} is coming up next</strong>
      <p>We are still building out this section. Try Popular for now, or check back for more items soon.</p>
    </div>

    <!-- Cart bar -->
    <Transition name="cart-bar" mode="out-in">
      <button v-if="cartCount > 0" key="cart-full" class="cart-bar" type="button" @click="emit('viewOrder')">
        <span class="cart-badge">{{ cartCount }}</span>
        <span class="cart-label-wrap">
          <span class="cart-eyebrow">View Order</span>
          <span class="cart-name">{{ restaurant?.name }}</span>
        </span>
        <span class="cart-total">${{ cartTotal.toFixed(2) }}</span>
      </button>

      <div v-else key="cart-empty" class="cart-placeholder" aria-live="polite">
        <span class="cart-placeholder-badge">0</span>
        <span class="cart-label-wrap">
          <span class="cart-eyebrow">Cart empty</span>
          <span class="cart-name cart-name-muted">Tap + to add items</span>
        </span>
        <span class="cart-total cart-total-muted">$0.00</span>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.sheet-restaurant {
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

/* ── Header ── */
.rest-header {
  padding: 0 18px 16px;
  flex-shrink: 0;
}

.rest-header h2 {
  margin: 0 0 7px;
  font-family: 'Inter', sans-serif;
  font-size: 1.58rem;
  font-weight: 800;
  letter-spacing: -0.028em;
  line-height: 1.02;
}

.rest-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(229, 226, 225, 0.54);
  font-size: 0.74rem;
  font-weight: 500;
}

.star-icon {
  width: 13px;
  height: 13px;
  color: #3b82f6;
  flex-shrink: 0;
}

.star-val {
  color: #3b82f6;
  font-weight: 700;
}

.meta-sep {
  color: rgba(229, 226, 225, 0.3);
}

/* ── Category tabs ── */
.cat-tabs {
  display: flex;
  gap: 18px;
  padding: 0 18px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
  scrollbar-width: none;
  flex-shrink: 0;
}

.cat-tabs::-webkit-scrollbar {
  display: none;
}

.cat-tab {
  padding: 8px 0 7px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: rgba(229, 226, 225, 0.4);
  font: inherit;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease;
}

.cat-tab-active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

/* ── Section heading ── */
.section-head {
  padding: 18px 18px 12px;
  color: rgba(229, 226, 225, 0.44);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  flex-shrink: 0;
}

/* ── Menu list ── */
.menu-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;
  padding: 0 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.menu-list::-webkit-scrollbar {
  display: none;
}

.menu-placeholder {
  padding: 0 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-placeholder strong {
  color: #e5e2e1;
  font-size: 0.94rem;
  font-weight: 700;
}

.menu-placeholder p {
  margin: 0;
  max-width: 260px;
  color: #8f8788;
  font-size: 0.74rem;
  line-height: 1.45;
}

.menu-item {
  display: grid;
  grid-template-columns: 76px 1fr auto;
  align-items: start;
  gap: 16px;
  padding: 12px 14px 12px 12px;
  border-radius: 20px;
  background: rgba(42, 42, 42, 0.5);
}

.menu-item:last-child {
  border-bottom: 0;
}

.menu-thumb {
  width: 72px;
  height: 72px;
  border-radius: 14px;
  flex-shrink: 0;
  overflow: hidden;
  background: #1c1c1c;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.menu-thumb-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.menu-name {
  color: #e5e2e1;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
}

.menu-desc {
  color: #8f8788;
  font-size: 0.68rem;
  line-height: 1.45;
}

.menu-price {
  margin-top: 8px;
  color: #e5e2e1;
  font-size: 0.96rem;
  font-weight: 800;
}

.add-btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  align-self: end;
  background: #f5f1ee;
  color: #161616;
  flex-shrink: 0;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.16);
  transition: background 150ms ease, transform 150ms ease;
}

.add-btn:hover {
  background: #ffffff;
}

.add-btn-active {
  background: #f5f1ee;
  transform: scale(1.03);
}

.add-icon {
  width: 20px;
  height: 20px;
}

/* ── Cart bar ── */
.cart-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 18px 16px;
  padding: 0 18px 0 16px;
  min-height: 66px;
  border: 0;
  border-radius: 18px;
  background: #383838;
  color: #fff;
  font: inherit;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
  transition: background 150ms ease;
}

.cart-placeholder {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 18px 16px;
  padding: 0 18px 0 16px;
  min-height: 66px;
  border-radius: 18px;
  background: rgba(56, 56, 56, 0.82);
  color: #fff;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.cart-bar:hover {
  background: #424242;
}

.cart-badge {
  display: grid;
  place-items: center;
  width: 32px;
  min-width: 32px;
  height: 32px;
  aspect-ratio: 1;
  border-radius: 8px;
  background: #3b82f6;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  flex-shrink: 0;
}

.cart-placeholder-badge {
  display: grid;
  place-items: center;
  width: 32px;
  min-width: 32px;
  height: 32px;
  aspect-ratio: 1;
  border-radius: 8px;
  background: #0d0d0d;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.75rem;
  font-weight: 800;
  flex-shrink: 0;
}

.cart-label-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2px;
  text-align: left;
  min-width: 0;
}

.cart-eyebrow {
  color: rgba(229, 226, 225, 0.68);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.cart-name {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-total {
  color: #ffffff;
  font-size: 1.02rem;
  font-weight: 800;
  flex-shrink: 0;
}

.cart-name-muted {
  color: rgba(255, 255, 255, 0.9);
}

.cart-total-muted {
  color: rgba(255, 255, 255, 0.58);
}

/* ── Cart bar transition ── */
.cart-bar-enter-active,
.cart-bar-leave-active {
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease;
}

.cart-bar-enter-from,
.cart-bar-leave-to {
  transform: translateY(12px);
  opacity: 0;
}
</style>
