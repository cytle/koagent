<template>
  <div class='app'>
    <div class="app__hd" v-show="showMenu">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        style="min-height: 100%"
        :router="true"
      >
        <el-menu-item :index="vo.path" v-for="vo of menu" :key="vo.name">
          <i class="el-icon-menu"></i>
          <span slot="title">{{ vo.title }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="app__bd">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapState(['menu', 'showMenu']),
  },
};
</script>

<style>
html, body {
  height: 100%;
  min-height: 100%;
}
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.app {
  display: flex;
  min-height: 100%;
}
.app__hd {
  flex: 0 0 200px;
  min-height: 100%;
}
.app__bd {
  flex: 1;
}
</style>
