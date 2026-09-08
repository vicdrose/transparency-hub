<template>
  <div class="floating-logo">
    <transition name="flogo-swap" mode="out-in">
      <div :key="product.id" class="floating-logo__wrap">
        <img
          :src="product.logo"
          :alt="product.name"
          class="floating-logo__img"
          draggable="false"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.floating-logo {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 0;
  perspective: 900px;
}

.floating-logo__wrap {
  animation: flogo-bob 3.2s ease-in-out infinite;
}

.floating-logo__img {
  width: min(280px, 62vw);
  height: auto;
  max-height: 42vh;
  object-fit: contain;
  filter: drop-shadow(0 0 24px rgba(255, 255, 255, 0.12));
  -webkit-user-drag: none;
}

.flogo-swap-enter-active,
.flogo-swap-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.flogo-swap-leave-to {
  opacity: 0;
  transform: translateX(-14px) scale(0.96);
}

.flogo-swap-enter-from {
  opacity: 0;
  transform: translateX(14px) scale(0.96);
}

@keyframes flogo-bob {
  0%, 100% {
    transform: translateY(0) rotate(-1.2deg);
  }
  50% {
    transform: translateY(-9px) rotate(1.2deg);
  }
}
</style>
