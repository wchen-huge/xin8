<template>
  <div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>消息管理</el-breadcrumb-item>
    <el-breadcrumb-item>催办消息</el-breadcrumb-item>
  </el-breadcrumb>
    <el-card class="box-card">
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Urge'
}
</script>

<style scoped>

</style>
