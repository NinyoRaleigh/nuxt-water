<script setup lang="ts">
import { ref } from 'vue';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

const username = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const navbarRefreshKey = useState<number>("navbarRefreshKey", () => 0);

async function add() {
  try {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    const result =await $fetch('/api/auth/login', {
      method: 'post',
      body: {
        username: username.value,
        password: password.value
      }
    });

    successMessage.value = 'User logged in successfully!';
    username.value = '';
    password.value = '';

    if(!(result && result.token)){
      errorMessage.value = "Login failed";
      return;
    }
    
    useCookie("jwt_token").value = result.token; 
    navbarRefreshKey.value++;
    await navigateTo("/dashboard")


  } catch (error: any) {
    if (error?.statusCode === 409) {
      errorMessage.value = 'Username already exists.';
    } else {
      errorMessage.value = 'Registration failed.';
    }
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

        <Label class="mt-3 block">Password</Label>
        <Input v-model="password" type="password" class="w-full" />

        <Button type="submit" class="mt-5 w-full" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </Button>
      </form>

      <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-green-500 text-sm">{{ successMessage }}</p>
    </div>
  </div>
  </NuxtLayout>
</template>
