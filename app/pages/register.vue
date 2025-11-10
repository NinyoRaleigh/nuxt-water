<script setup lang="ts">
import { ref } from 'vue';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

const username = ref('');
const password = ref('');
const loading = ref(false);
const errorName = ref<string | null>(null);
const errorPassword = ref<string | null>(null);
const successMessage = ref('');

async function add() {
  errorName.value = null;
  errorPassword.value = null;
  successMessage.value = '';

  if (!username.value) {
    errorName.value = 'Please enter username';
    return;
  }
  if (!password.value) {
    errorPassword.value = 'Please enter password';
    return;
  }

  try {
    loading.value = true;

    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value,
      },
    });

    successMessage.value = 'User registered successfully!';
    username.value = '';
    password.value = '';

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <NuxtLayout name="nav-bar">
    <div class="p-20">
      <NuxtLink to="/dashboard">
        <Button>Dashboard</Button>
      </NuxtLink>
    </div>

    <div class="flex justify-center items-center mt-50">
      <div class="space-y-5 w-[300px]">
        <form @submit.prevent="add">
          <Label>Username</Label>
          <Input v-model="username" class="w-full" />
          <p v-if="errorName" class="text-red-500 text-sm">{{ errorName }}</p>

          <Label class="mt-3 block">Password</Label>
          <Input v-model="password" type="password" class="w-full" />
          <p v-if="errorPassword" class="text-red-500 text-sm">{{ errorPassword }}</p>

          <Button type="submit" class="mt-5 w-full" :disabled="loading">
            {{ loading ? 'Registering...' : 'Add' }}
          </Button>
        </form>

        <p v-if="successMessage" class="text-green-500 text-sm">{{ successMessage }}</p>
      </div>
    </div>
  </NuxtLayout>
</template>
