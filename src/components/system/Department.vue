<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Department'
}
</script>

<style scoped>

</style>
