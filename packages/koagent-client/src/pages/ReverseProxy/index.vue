<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="rule of rules" :key="rule">{{ rule }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from './store';

export default {
  name: 'ReverseProxy',
  data() {
    return {
      msg: 'ReverseProxy123213',
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
