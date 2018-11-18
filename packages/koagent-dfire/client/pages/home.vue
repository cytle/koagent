<template>
  <div>
    <el-button-group>
      <el-button
        type="primary"
        :icon="proxyOn ? 'el-icon-success' : 'el-icon-error'"
      >代理端口: {{ proxyPort }}</el-button>
      <el-button type="primary" icon="el-icon-edit"></el-button>
      <el-button
        @click="refresh"
        :disabled="refreshing"
        :icon="refreshing ? 'el-icon-loading' : 'el-icon-refresh'"
        type="primary"
      />
    </el-button-group>

    <el-table
      :data="projects"
      style="width: 100%">
      <el-table-column label="项目">
        <template slot-scope="scope">
          <i class="el-icon-loading" v-if="scope.row.loading"></i>
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标端口">
        <template slot-scope="scope">
          {{ scope.row.localPort }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-switch
            @change="toggleForward(scope.row.name, !scope.row.needForward)"
            :value="scope.row.needForward"
            :disabled="scope.row.loading"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-table height="250" :data="logs">
      <el-table-column prop="logAt" label="时间" width="200"/>
      <el-table-column prop="payload" label="日志"/>
    </el-table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import store from './store';

export default {
  data() {
    return {
      refreshing: false,
    };
  },
  computed: {
    ...mapState(['projects', 'proxyOn', 'proxyPort', 'logs']),
  },
  beforeCreate() {
    this.$store = store;
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions(['fetchProjects', 'fetchServer']),
    async refresh() {
      if (this.refreshing) {
        return;
      }
      try {
        await Promise.all([
          this.fetchProjects(),
          this.fetchServer(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        this.refreshing = false;
      }
    },
    async toggleForward(projectName, needForward) {
      try {
        await store.dispatch(needForward ? 'addForward' : removeForward, projectName);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.home__refresh-btn {
  position: fixed;
  right: 20px;
  bottom: 30px;
}
</style>
