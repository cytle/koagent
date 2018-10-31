<template>
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
  },
  async created() {
    try {
      await store.dispatch('fetchProjects');
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
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
