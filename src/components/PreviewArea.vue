<template>
  <div class="preview-area">
    <transition name="preview-fade" mode="out-in">
      <div v-if="product" :key="product.id" class="preview-area__container">
        <img
          v-if="product.preview"
          :src="product.preview"
          :alt="product.name"
          class="preview-area__gif"
        />
        <div v-else class="preview-area__placeholder">
          <div class="preview-area__placeholder-text">{{ product.name }}</div>
          <div class="preview-area__placeholder-sub">Preview coming soon</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    default: null
  }
});
</script>

<style scoped>
.preview-area {
  width: 100%;
  max-width: 640px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.preview-area__container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.preview-area__gif {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-area__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.preview-area__placeholder-text {
  font-size: 20px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}

.preview-area__placeholder-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.25);
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.25s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}
</style>
