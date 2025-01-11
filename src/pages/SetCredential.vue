<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import {api_pwnedpasswords} from '../api'

const router = useRouter();
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errors = ref({
  username: '',
  password: '',
  confirmPassword: '',
  userExist: ''
});

async function checkPwnedPassword(password: string): Promise<boolean> {

  const hashedPassword = CryptoJS.SHA1(password).toString();
  const passwordPrefix = hashedPassword.substring(0, 5);
  
  const apiUrl = `https://api.pwnedpasswords.com/range/${passwordPrefix}`

  console.log(hashedPassword) 
  console.log(passwordPrefix)

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;


    console.log(data)


    const lines = data.split('\r');
   
    let totalOccurrences = 0;

    lines.forEach((line: string) => {
      const [suffix, count] = line.split(':');
      if (hashedPassword.substring(5).toUpperCase() === suffix) {
        totalOccurrences += parseInt(count, 10);
      }
    });

    return totalOccurrences < 100000;

  } catch (error) {
    console.error('Error checking password:', error);

    return false;
  }
}

function validate(): boolean {
  let isValid = true;

  if (!username.value) {
    errors.value.username = '*Username is required.';
    isValid = false;
  } else {
    errors.value.username = '';
  }

  if (!password.value) {
    errors.value.password = '*Password is required.';
    isValid = false;
  } else {
    errors.value.password = '';
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = '*Please confirm your password.';
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = '*Passwords do not match.';
    isValid = false;
  } else {
    errors.value.confirmPassword = '';
  }

  return isValid;
}

async function saveCredentials() {
  if (!validate()) {
    return;
  }

  const storedUsernames = JSON.parse(
    localStorage.getItem('usernames') || '[]'
  );

  if (storedUsernames.includes(username.value)) {
    alert('*Username already exists.'); 
    return;
  }

  const isPasswordSafe = await checkPwnedPassword(password.value);
  if (!isPasswordSafe) {
    alert('*Password is too common. Try a different one.');
    return;
  }

  const hashedPassword = CryptoJS.SHA1(password.value).toString();

  // Save to LocalStorage
  localStorage.setItem(
    'usernames',
    JSON.stringify([...storedUsernames, username.value])
  );
  localStorage.setItem(username.value, hashedPassword);

  alert('Credentials saved.');
  router.push('/login');
}
</script>

<template>
  <div>
    <h1>Set Credentials</h1>
    <form @submit.prevent="saveCredentials">
      <div class="form-group">
        <label for="username">Username:</label>
        <span v-if="errors.username" class="err-msg">{{ errors.username }}</span>
        <input type="text" id="username" v-model="username" />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <span v-if="errors.password" class="err-msg">{{ errors.password }}</span>
        <input type="password" id="password" v-model="password" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <span v-if="errors.confirmPassword" class="err-msg">{{ errors.confirmPassword }}</span>
        <input type="password" id="confirmPassword" v-model="confirmPassword" />
      </div>
      <button type="submit">Save</button>
    </form>
  </div>
</template>
