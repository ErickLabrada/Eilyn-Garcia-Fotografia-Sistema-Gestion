<template src="./paquetes/paquetesTemplate.html"> </template>

<script>
import Navbar from '../components/HeaderComponent.vue';
import logica2 from './paquetes/paquetes.js'; 

export default {
  components: {
    Navbar,
  },
  mixins: [logica2], 
};
</script>

<style src="../components/paquetes/paquetesStyless.css"></style>