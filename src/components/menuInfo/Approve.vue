<template>
  <div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>消息管理</el-breadcrumb-item>
    <el-breadcrumb-item>审批消息</el-breadcrumb-item>
  </el-breadcrumb>
    <el-card class="box-card">

      <el-table :data="msgList" style="width: 100%">
        <el-table-column fixed prop="id" label="编号" width="80px">
        </el-table-column>
        <el-table-column prop="msgTitle" label="消息标题" width="150px">
        </el-table-column>
        <el-table-column prop="receiver" label="接收人" width="80px">
        </el-table-column>
        <el-table-column prop="msgContent" label="发送内容" width="300px">
        </el-table-column>
        <el-table-column prop="status" label="是否审批" width="80px">
          <el-switch v-model="valueOff" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-table-column>
        <el-table-column prop="sendtime" label="发送时间" width="180">
        </el-table-column>
        <el-table-column prop="sendtime" label="发送状态">
          <el-steps :space="100" :active="1" finish-status="success">
            <el-step title="已确认"></el-step>
            <el-step title="进行中"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Approve',
  data () {
    return {
      valueOff: true,
      msgList: []
    }
  },
  mounted () {
    this.getMsgData()
  },
  methods: {
    async getMsgData () {
      const { data: res } = await this.$http.get('sys/msg')
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.msgList = res.data
      console.log(res.data)
    }
  }
}
</script>

<style scoped>

</style>
