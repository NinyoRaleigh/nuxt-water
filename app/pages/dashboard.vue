<script lang="ts" setup>
import { ref, onMounted } from "vue";

// Fetch fruits data
const data = await $fetch<string[]>("/api/fruits", {
  method: "GET",
});

// Reactive countdown value
const timeLeft = ref(59);

// Decrement countdown every second
onMounted(() => {
  const interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
});
</script>

<template>
  <NuxtLayout name="nav-bar">
    <div class="p-10">
      <h1 class="text-2xl font-bold mb-5">Welcome to dashboard</h1>

      <ul class="list-disc list-inside mb-10">
        <li v-for="(fruit, index) in data" :key="index">{{ fruit }}</li>
      </ul>

      <!-- Reactive DaisyUI countdown -->
      <span class="countdown font-mono text-6xl">
        <span
          :style="`--value: ${timeLeft}; --digits: 2;`"
          aria-live="polite"
          aria-label="Countdown"
        >
          {{ timeLeft }}
        </span>
      </span>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
