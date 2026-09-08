<template>
  <div class="splash" :class="{ 'splash--leaving': leaving }">
    <img :src="`${base}logos/logo-dark.png`" alt="Transparency Interactive" class="splash__logo" />
    <div class="splash__text">Transparency Interactive</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const base = import.meta.env.BASE_URL;
const emit = defineEmits(['done']);
const leaving = ref(false);

onMounted(() => {
  setTimeout(() => {
    leaving.value = true;
  }, 1000);
  setTimeout(() => {
    emit('done');
  }, 1750);
});
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  z-index: 100;
  opacity: 1;
  transition: opacity 0.6s ease;
}

.splash--leaving {
  opacity: 0;
}

.splash__logo {
  width: min(300px, 60vw);
  height: auto;
  border-radius: 12px;
}

.splash__text {
  margin-top: 20px;
  font-size: clamp(16px, 3vw, 24px);
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #fff;
  opacity: 0;
  animation: splash-text-in 0.7s 0.15s ease forwards;
}

@keyframes splash-text-in {
  to {
    opacity: 1;
  }
}
</style>
