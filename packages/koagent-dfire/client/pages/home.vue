<template>
  <div>
    <el-button-group>
      <el-tooltip effect="dark" :content="'示例路径: ' + localUrl" placement="bottom">
        <el-button
          type="primary"
          @click="openLocalUrl"
          :icon="server.proxyOn ? 'el-icon-success' : 'el-icon-error'"
        >代理端口: {{ server.proxyPort }}</el-button>
      </el-tooltip>
      <!-- <el-button type="primary" icon="el-icon-edit"></el-button> -->
      <el-button
        @click="refresh"
        :loading="refreshing"
        icon="el-icon-refresh"
        type="primary"
      />
    </el-button-group>
    <el-table
      :data="projects"
      style="width: 100%">
      <el-table-column prop="name" label="项目"></el-table-column>
      <el-table-column prop="localPort" label="本地端口"></el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-switch
            @change="toggleForward(scope.row.name, !scope.row.needForward)"
            :value="scope.row.needForward"
            :disabled="scope.row.loading"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-table height="250" :data="requestLogs" style="width: 100%">
      <el-table-column prop="logAt" label="时间" width="200"></el-table-column>
      <el-table-column prop="payload.method" label="method"></el-table-column>
      <el-table-column prop="payload.url" label="url"></el-table-column>
      <el-table-column prop="payload.status" label="status"></el-table-column>
      <el-table-column prop="payload.time" label="time"></el-table-column>
      <el-table-column prop="payload.length" label="length"></el-table-column>
    </el-table> -->
    <el-table height="400" :data="logs" style="width: 100%">
      <el-table-column prop="logAt" label="时间" width="100"></el-table-column>
      <el-table-column prop="payload" label="日志"></el-table-column>
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
      branchName: '变更名',
      projectName: '项目名',
      path: '请求路径',
    };
  },
  computed: {
    ...mapState(['projects', 'server', 'logs', 'requestLogs']),
    localUrl() {
      return `http://localhost:${this.server.proxyPort}/${this.branchName}/${this.projectName}/${this.path}`;
    },
  },
  beforeCreate() {
    this.$store = store;
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions(['fetchProjects', 'fetchServer', 'addForward', 'removeForward']),
    openLocalUrl() {
      window.open(this.localUrl, '_blank');
    },
    async refresh() {
      if (this.refreshing) {
        return;
      }
      this.refreshing = true;
      try {
        await Promise.all([
          this.fetchProjects(),
          this.fetchServer(),
        ]);
      } catch (error) {
        console.error(error);
        this.$message({
          message: error.message,
          type: 'error'
        });
      } finally {
        setTimeout(() => {
          this.refreshing = false;
        }, 300);
      }
    },
    async toggleForward(projectName, needForward) {
      try {
        if (needForward) {
          await this.addForward(projectName);
        } else {
          await this.removeForward(projectName);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
