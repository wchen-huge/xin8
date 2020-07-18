<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息管理</el-breadcrumb-item>
      <el-breadcrumb-item>催办消息</el-breadcrumb-item>
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
        <el-table-column prop="status" label="事件状态" width="100px" align="center">
          <el-tag size="mini" type="danger">紧急</el-tag>
        </el-table-column>
        <el-table-column prop="sendtime" label="发送时间" width="180">
        </el-table-column>
        <el-table-column prop="sendtime" label="操作">
          <template slot-scope="scope">
            <el-button @click="enterFLall(scope.row)" type="primary" size="small" class="el-icon-thumb">&nbsp;确认</el-button>
            <el-button type="danger" size="small" class="el-icon-delete" @click="enterSeall(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Urge',
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
    },
    enterFLall () {
      this.$confirm('是否确认办理该消息？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '发送成功！'
        })
      })
    },
    enterSeall () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
