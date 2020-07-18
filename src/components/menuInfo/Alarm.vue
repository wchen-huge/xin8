<template>
  <div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>消息管理</el-breadcrumb-item>
    <el-breadcrumb-item>告警设置</el-breadcrumb-item>
  </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="msgList" border style="width: 100%">
        <el-table-column align="
center" fixed prop="id" label="编号" width="60">
        </el-table-column>
        <el-table-column align="
center" prop="msgTitle" label="消息标题" width="120">
        </el-table-column>
        <el-table-column align="
center" prop="receiver" label="接收人" width="80">
        </el-table-column>
        <el-table-column align="center" prop="msgContent" label="发送内容" width="240">
        </el-table-column>
        <el-table-column align="center" prop="sendtime" label="发送时间" width="160">
        </el-table-column>
        <el-table-column align="center" prop="status" label="发送状态" width="80">
            <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949" @click="sta">
            </el-switch>
        </el-table-column>
        <el-table-column align="center" prop="frequency" label="发送次数" width="155">
          <el-input-number size="small" v-model="num" @change="handleChange" :min="1" :max="10"></el-input-number>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="170">
          <template slot-scope="scope">
            <el-button @click="openMsgClick(scope.row.id)" type="primary" class="el-icon-edit" size="small">编辑</el-button>
            <el-button type="warning" size="small" class="el-icon-delete" @click="msgDelVisible">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
     </el-card>
    <el-dialog title="告警信息设置" :visible.sync="msgFormVisible" width="50%">
      <el-form :model="msgForm">
        <el-form-item label="消息标题" :label-width="formLabelWidth">
          <el-input v-model="msgForm.msgTitle"></el-input>
        </el-form-item>
        <el-form-item label="接收人" :label-width="formLabelWidth">
          <el-select placeholder="指定接收人">
          </el-select>
        </el-form-item>
        <el-form-item label="发送内容" :label-width="formLabelWidth">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发送次数" :label-width="formLabelWidth">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发送时间" :label-width="formLabelWidth">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="消息等级" :label-width="formLabelWidth">
          <el-select placeholder="级别">
            <el-option label="A" value="zs"></el-option>
            <el-option label="B" value="ls"></el-option>
            <el-option label="C" value="zl"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="msgFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="msgFormUpd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Alarm',
  data () {
    return {
      num: 1,
      msgList: [],
      msgFormVisible: false,
      msgForm: {},
      formLabelWidth: '100px',
      value: true
    }
  },
  mounted () {
    this.getMsgData()
  },
  methods: {
    sta () {
      this.value = !this.value
    },
    handleChange (value) {
      // console.log(value)
    },
    async getMsgData () {
      const { data: res } = await this.$http.get('sys/msg')
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.msgList = res.data
      console.log(this.msgList)
      // console.log(this.msgForm)
    },
    msgFormUpd () {
      this.$refs.ruleFormEdit.validate(async (valid) => {
        if (valid === true) {
          const { data: res } = await this.$http.put('sys/msg')
          if (res.code !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.$message.success(res.msg)
          this.msgFormVisible = false
        }
      })
    },
    openMsgClick (id) {
      console.log(id)
      // this.msgForm = msgInfo
      this.msgFormVisible = true
    },
    msgDelVisible () {
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
