<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="代理端口">
        {{ server.proxyPort }}
      </el-form-item>

      <el-form-item label="服务状态">
        <i class="el-icon-success" v-if="server.proxyOn"></i>
        <i class="el-icon-error" v-else></i>
      </el-form-item>
    </el-form>
    <el-table
      :data="projects"
      style="width: 100%">
      <el-table-column label="项目">
        <template slot-scope="scope">
          <i class="el-icon-loading" v-if="scope.row.loading"></i>
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
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
  </div>
</template>
<script>
import store from './store';

export default {
  data() {
    return {
      name: 'world',
    };
  },
  computed: {
    projects() {
      return store.state.projects;
    },
    server() {
      return store.state.server;
    },
  },
  created() {
    this.refreshProjects();
    this.refreshServer();
  },
  methods: {

    async refreshProjects() {
      try {
        await store.dispatch('fetchProjects');
      } catch (error) {
        console.error(error);
      }
    },
    async refreshServer() {
      try {
        await store.dispatch('fetchServer');
      } catch (error) {
        console.error(error);
      }
    },
    async toggleForward(projectName, needForward) {
      try {
        if (needForward) {
        await store.dispatch('forward', projectName);
        } else {
          await store.dispatch('dontForward', projectName);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
