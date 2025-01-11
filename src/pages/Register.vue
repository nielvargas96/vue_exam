<script setup>
import { ref } from 'vue';
import { otp_api } from '../api.ts'
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const phone = ref('');
const otp = ref('');
const otpFieldEnabled = ref(false);
const errorMsg = ref(false);
const loading = ref(false);
const randomOTP = ref('');

function validatePhone() {
  const regex = /^(09|\+639)\d{9}$/;
  if (regex.test(phone.value)) {
    console.log(phone.value)
    handleSendOTP()
    errorMsg.value = false;
  } else {
    errorMsg.value = true;
  }
}

async function handleSendOTP() {
  try {
    // const response = await otp_api.get('/random?min=100000&max=999999');
    // randomOTP.value = response.data.randomNumber;
    // console.log(randomOTP.value)
    // otpFieldEnabled.value = true; 
    
    const response = await axios.get('https://dummyjson.com/c/1669-1cb5-4fe6-b13d')
    randomOTP.value = response.data.otp; 

    console.log(randomOTP.value)
    alert(`Copy your OTP code: ${randomOTP.value}`);

    otpFieldEnabled.value = true; 

  } catch (error) {
    alert('Failed to send OTP.');
  }
}

 function verifyOTP() {
  if (otp.value === randomOTP.value) {
    loading.value = true;
    setTimeout(()=> {
      loading.value = false
      router.push('/set-credential');
    }, 500)
  } else {
    errorMsg.value = true; 
  }
}
</script>

<template>
  <section>
    <form v-if="!otpFieldEnabled" @submit.prevent="handleSendOTP">
      <h1>Register</h1>
      <div class="form-group">
        <label for="phone">Enter Phone Number:</label>
        <input type="text" id="phone" v-model="phone" placeholder="+639123456789" />
        <p v-if="errorMsg" class="err-msg">* Phone number is not valid.</p>
      </div>

      <div>
        <button type="button" @click="validatePhone">Send OTP</button>
      </div> 
    </form>

    <form v-if="otpFieldEnabled">
      <div v-if="!loading">
        <h1>OTP</h1> 
        <div class="form-group">
          <label for="otp">Enter OTP:</label>
          <input type="text" id="otp" v-model="otp" />
        </div>
        <p v-if="errorMsg" class="err-msg">* Invalid OTP.</p>
        <button type="button" @click="verifyOTP">Verify OTP</button>
      </div>
      <p v-if="loading">Loading...</p>
    </form>

  </section>
</template>
