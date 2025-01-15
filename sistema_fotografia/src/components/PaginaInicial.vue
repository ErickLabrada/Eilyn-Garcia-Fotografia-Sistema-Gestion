<template src="./dashboard/dashboardTemplate.html">
  
</template>
<script>
import Navbar from '../components/HeaderComponent.vue';
import dashboradScritp from './dashboard/dashboradScritp'; 

export default {
  components: {
    Navbar, 
  },
  mixins: [dashboradScritp], 
};
</script>
<style scoped>
@import './dashboard/dashboardStyles.css'; 
</style>
