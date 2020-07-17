<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path:'/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>报废管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table stripe :data="scrapList" style="width: 100%">
      <el-table-column prop="supName" label="物资名称" width="180"></el-table-column>
      <el-table-column prop="speModel" label="规格型号" width="180"></el-table-column>
      <el-table-column prop="unit" label="单位（个/包/箱）" width="180"></el-table-column>
      <el-table-column prop="quantity" label="数量" width="180"></el-table-column>
      <el-table-column prop="scrData" label="报废时间">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="delScrapId(scope.row.id)">立即报废</el-button>
        </template>
      </el-table-column>
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
  name: 'Scrap',
  mounted () {
    this.getScrapList()
  },
  methods: {
    async getScrapList () {
      const { data: res } = await this.$http.get('sys/scrap')
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.scrapList = res.data.list
      this.total = res.data.total
    },
    delScrapId (id) {
      this.$confirm('确认报废此物资？ 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('sys/scrap/' + id)
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        await this.getScrapList()
        this.$message({
          type: 'success',
          message: '报废成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消报废'
        })
      })
    },
    handleSizeChange (val) {
      this.queryInfo.size = val
      this.getScrapList()
    },
    handleCurrentChange (val) {
      this.queryInfo.page = val
      this.getScrapList()
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
      scrapList: [{}]
    }
  }
}

</script>

<style scoped>

</style>
