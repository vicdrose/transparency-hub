<template>
  <button
    class="product-card"
    :class="{ 'product-card--active': active }"
    :style="{ '--accent': product.color }"
    @click="$emit('select')"
  >
    <div class="product-card__icon">
      <img
        v-if="product.icon"
        :src="product.icon"
        :alt="product.name"
        class="product-card__icon-img"
      />
      <div v-else class="product-card__icon-letter">
        {{ product.name.charAt(0) }}
      </div>
    </div>
    <div class="product-card__name">{{ product.name }}</div>
  </button>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select']);
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: none;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  outline: none;
  min-width: 90px;
  color: var(--text);
  font-family: inherit;
}

.product-card:hover {
  background: rgba(255, 255, 255, 0.04);
}

.product-card--active {
  border-color: var(--accent, #fff);
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-4px);
}

.product-card__icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  transition: background var(--transition-speed) ease;
}

.product-card--active .product-card__icon {
  background: var(--accent, rgba(255, 255, 255, 0.15));
}

.product-card__icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card__icon-letter {
  font-size: 22px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.product-card--active .product-card__icon-letter {
  color: #fff;
}

.product-card__name {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  opacity: 0.6;
  transition: opacity var(--transition-speed) ease;
  white-space: nowrap;
}

.product-card--active .product-card__name {
  opacity: 1;
}
</style>
