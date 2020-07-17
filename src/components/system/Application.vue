<template>
<div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path:'/welcome'}">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    <el-breadcrumb-item>采购申请</el-breadcrumb-item>
  </el-breadcrumb>
  <el-radio-group v-model="labelPosition" size="small">
    <el-radio-button label="left">左对齐</el-radio-button>
    <el-radio-button label="right">右对齐</el-radio-button>
    <el-radio-button label="top">顶部对齐</el-radio-button>
  </el-radio-group>
  <div style="margin: 20px;"></div>
  <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
    <el-form-item label="物资名称">
      <el-input v-model="formLabelAlign.name"></el-input>
    </el-form-item>
    <el-form-item label="规格型号">
      <el-input v-model="formLabelAlign.model"></el-input>
    </el-form-item>
    <el-form-item label="单位">
      <el-input v-model="formLabelAlign.unit"></el-input>
    </el-form-item>
    <el-form-item label="数量">
      <el-input v-model="formLabelAlign.quantity"></el-input>
    </el-form-item>
    <el-form-item label="申请人">
      <el-input v-model="formLabelAlign.applicant"></el-input>
    </el-form-item>
    <el-form-item style="float: right">
      <el-button type="primary" @click="open()">立即申请</el-button>
      <el-button @click="resetForm()">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'Application',
  data () {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        model: '',
        unit: '',
        quantity: '',
        applicant: ''
      }
    }
  },
  methods: {
    open () {
      this.$confirm('提交申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '申请成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    resetForm () {
      location.reload()
    }
  }
}
</script>

<style scoped>

</style>
