<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const username = ref('');
 
onMounted(() => { 
  username.value = route.query.username;
});

</script>

<template>
  <div class="home">
    <h1>Hello, {{ username }}!</h1>
  </div>
</template>
