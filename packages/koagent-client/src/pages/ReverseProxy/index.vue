<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from './store';

export default {
  name: 'ReverseProxy',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  beforeCreate() {
    this.$store = store;
  },
  computed: {
    ...mapState(['rules']),
  },
};
</script>
