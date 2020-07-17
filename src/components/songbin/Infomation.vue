<template>
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path:'/welcome'}">首页</el-breadcrumb-item>
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>采购信息管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-col :span="8">
          <el-input placeholder="请输入物资名称" v-model="queryInfo.supName" >
            <el-button slot="append" icon="el-icon-search" @click="getInformationList"></el-button>
          </el-input>
        </el-col>
        <el-table stripe :data="InformationList" style="width: 100%">
          <el-table-column prop="purNumber" label="采购单号" width="90"></el-table-column>
          <el-table-column prop="supName" label="物资名称" width="90"></el-table-column>
          <el-table-column prop="speModel" label="规格型号" width="90"></el-table-column>
          <el-table-column prop="unit" label="单位" width="90"></el-table-column>
          <el-table-column prop="quantity" label="数量" width="90"></el-table-column>
          <el-table-column prop="purContent" label="采购说明" width="90"></el-table-column>
          <el-table-column prop="supplier" label="供应商" width="90"></el-table-column>
          <el-table-column prop="conPerson" label="联系人" width="90"></el-table-column>
          <el-table-column prop="phone" label="电话" width="115"></el-table-column>
          <el-table-column prop="data" label="申请日期" width="115"></el-table-column>
          <el-table-column prop="status" label="审批状态" width="90"><el-tag>已完成</el-tag></el-table-column>
          <el-table-column prop="buyer" label="采购员" width="90"></el-table-column>
          <el-table-column prop="remarks" label="备注" width="90"></el-table-column>
          <el-table-column prop="classification" label="分类">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="250">
            <template slot-scope="scope">
              <el-button @click="JumpApplication(scope.row)" type="primary" size="small" >加购</el-button>
              <el-button type="danger" size="small"  @click=" delInformationId (scope.row.id)">删除</el-button>
              <el-button type="warning" size="small" @click="donation(scope.row.id)">查看捐赠</el-button>
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
  name: 'Infomation',
  mounted () {
    this.getInformationList()
  },
  methods: {
    async getInformationList () {
      const { data: res } = await this.$http.get('sys/information')
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.InformationList = res.data.list
      this.total = res.data.total
    },
    delInformationId (id) {
      this.$confirm('确认删除此信息？ 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('sys/information/' + id)
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        await this.getInformationList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    JumpApplication () {
      this.$router.push({ path: 'application' })
    },
    donation () {
      this.$router.push({ path: 'donate' })
    },
    handleSizeChange (val) {
      this.queryInfo.size = val
      this.getInformationList()
    },
    handleCurrentChange (val) {
      this.queryInfo.page = val
      this.getInformationList()
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
      InformationList: [{}]
    }
  }
}
</script>

<style scoped>

</style>
