<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path:'/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>采购管理</el-breadcrumb-item>
      <el-breadcrumb-item>捐赠详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="donaList" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column prop="donData" label="捐赠日期" sortable width="180"></el-table-column>
      <el-table-column prop="donSupplies" label="企业/个人名称" width="180"></el-table-column>
      <el-table-column prop="speModel" label="捐赠物资" ></el-table-column>
      <el-table-column prop="quantity" label="数量" ></el-table-column>
      <el-table-column prop="classification" label="分类" ></el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryInfo.page"
                   :page-sizes="[5, 10, 15, 30]" :page-size="queryInfo.size"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Donate',
  mounted () {
    this.donationList()
  },
  methods: {
    async donationList () {
      const { data: res } = await this.$http.get('sys/donation')
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.donaList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.queryInfo.size = val
      this.donationList()
    },
    handleCurrentChange (val) {
      this.queryInfo.page = val
      this.donationList()
    }
  },
  data () {
    return {
      total: 0,
      queryInfo: {
        supName: '',
        page: 1,
        size: 5
      },
      donaList: [{}]
    }
  }
}
</script>

<style scoped>

</style>
