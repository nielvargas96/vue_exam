<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMsg = ref(false);
const usernameError = ref('');
const passwordError = ref('');

function validateForm() {
  usernameError.value = '';
  passwordError.value = '';

  if (!username.value.trim()) {
    usernameError.value = '*Username is required.';
  }

  if (!password.value.trim()) {
    passwordError.value = '*Password is required.';
  }
}

function login() {
  validateForm();
  if (usernameError.value || passwordError.value) return;

  const storedPassword = localStorage.getItem(username.value);
  const hashedPassword = CryptoJS.SHA1(password.value).toString();

  if (storedPassword && storedPassword === hashedPassword) {
    router.push(`/home?username=${username.value}`);
  } else {
    errorMsg.value = true;
  }
}
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" @input="usernameError = ''; errorMsg = false" />
        <p v-if="usernameError" class="err-msg">{{ usernameError }}</p>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" @input="passwordError = ''; errorMsg = false" />
        <p v-if="passwordError" class="err-msg">{{ passwordError }}</p>
      </div>
      <p v-if="errorMsg" class="err-msg">*Invalid credentials.</p>
      <button type="submit">Login</button>
    </form>
  </div>
</template>
