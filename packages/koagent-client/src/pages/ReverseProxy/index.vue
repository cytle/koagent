<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from './store';

export default {
  name: 'ReverseProxy',
  data() {
    return {
      msg: 'ReverseProxy',
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
