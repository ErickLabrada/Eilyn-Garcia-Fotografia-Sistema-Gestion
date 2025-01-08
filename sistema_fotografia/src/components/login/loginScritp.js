export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      handleSubmit() {
        console.log('El formulario se envió');
        console.log('Email:', this.email);
        console.log('Password:', this.password);
        this.$router.push('/paginaInicial');
      },
    },
  };
  