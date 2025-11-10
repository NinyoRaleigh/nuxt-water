<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { jwtDecode } from "jwt-decode";

const refreshKey = useState<number>("navbarRefreshKey", () => 0);
const user = ref<JwtUserInfo | null>(null);

async function verifyAuth() {
  const token = useCookie("jwt_token").value;
  if (!token) return;

  const result = await $fetch("/api/auth/verifyToken", {
    method: "POST",
    body: { token }
  });

  if (!result?.success) return;

  user.value = result.user.user; // adjust if you simplify API
}

onMounted(() => {
  // Initial verification
  verifyAuth();

  // Auto-logout interval: checks token expiry every second
  const interval = setInterval(() => {
    const token = useCookie("jwt_token").value;
    if (!token) return;

    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      const now = Date.now() / 1000;
      if (!exp || now > exp) {
        useCookie("jwt_token").value = null;
        user.value = null;
        navigateTo("/login");
        clearInterval(interval);
      }
    } catch {
      useCookie("jwt_token").value = null;
      user.value = null;
      navigateTo("/login");
      clearInterval(interval);
    }
  }, 1000); // check every second
});

watch(refreshKey, () => {
  verifyAuth();
});
</script>

<template>
  <nav class="flex justify-between p-4 text-white bg-neutral-800" :key="refreshKey">
    <NuxtLink to="/">Website</NuxtLink>
    <ul class="inline-flex gap-4">
      <li><NuxtLink to="/dashboard">Dashboard</NuxtLink></li>

      <div v-if="!user" class="inline-flex gap-4">
        <li><NuxtLink to="/register">Register</NuxtLink></li>
        <li><NuxtLink to="/login">Login</NuxtLink></li>
      </div>

      <div v-else class="inline-flex gap-4">
        {{ user.username }}
      </div>
    </ul>
  </nav>
  <slot />
</template>

<style scoped></style>
