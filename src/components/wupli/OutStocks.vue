<template>
    <div class="outStocks">
      <!--面包导航-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>业务管理</el-breadcrumb-item>
        <el-breadcrumb-item>物资管理</el-breadcrumb-item>
        <el-breadcrumb-item>物资发放</el-breadcrumb-item>
      </el-breadcrumb>
        <!-- 卡片部分-->
        <el-card>
         <!-- <el-row :gutter="20">
            <el-col :span="8">
              <el-input placeholder="请输入出库单号" v-model="queryInfo.outNumber">
                <el-button slot="append" icon="el-icon-search" @click="getstoList"></el-button>
              </el-input>
            </el-col>
          </el-row>-->
        <!--搜索部分-->
            <el-form :inline="true" :model="queryMap" class="demo-form-inline">
                <el-form-item label="发放单号">
                    <el-input v-model="queryMap.outNumber" placeholder="发放单号"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button  @click="reset">重置</el-button>
                </el-form-item>

                <el-form-item>
                    <router-link to="/publishStocks">
                        <el-button type="success" >发放</el-button>
                    </router-link>
                </el-form-item>
            </el-form>
<!--数据表格-->
          <template>
            <el-table :data="getstockList" stripe style="width: 100%">
              <el-table-column prop="id" type="index" label="ID"></el-table-column>
              <el-table-column prop="outNumber" label="出库单号"></el-table-column>
              <el-table-column prop="supName" label="物资名称"></el-table-column>
              <el-table-column prop="outQuantity" label="出库数量"></el-table-column>
              <el-table-column prop="unit" label="单位"></el-table-column>
              <el-table-column prop="speModel" label="规格型号"></el-table-column>
              <el-table-column prop="outAddress" label="物资去向地址"></el-table-column>
              <el-table-column prop="createTime" label="出库时间"></el-table-column>
              <el-table-column prop="remarks" label="备注"></el-table-column>
              <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button @click="openEditUser(scope.row)" type="primary" size="small" class="el-icon-edit"></el-button>
                  <el-button type="danger" size="small" class="el-icon-delete" @click="delUserById(scope.row.id)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="queryInfo.page"
                         :page-sizes="[5, 10, 15, 30]" :page-size="queryInfo.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      total: 0,
      queryMap: { pageNum: 1, pageSize: 7, status: 0 },
      getstockList: [{}],
      editForm: {},
      editDialogVisible: false,
      queryInfo: {
        outNumber: '',
        page: 1,
        size: 5
      }
    }
  },
  mounted () {
    this.getstoList()
  },
  methods: {
    openEditUser (userInfo) {
      this.editForm = userInfo
      this.editDialogVisible = true
    },
    handleSizeChange (val) {
      this.queryInfo.size = val
      this.getstoList()
    },
    handleCurrentChange (val) {
      this.queryInfo.page = val
      this.getstoList()
    },
    /**
     * 加载表格数据
     */
    async getstoList () {
      const { data: res } = await this.$http.get('wpl/stock', { params: this.queryInfo })
      // console.log(res.data.result)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.total = res.data.total
      this.getstockList = res.data.result
    },
    /**
             * 重置查询表单
             */
    reset () {
      this.queryMap = { pageNum: 1, pageSize: 7, status: 0 }
    },
    // 搜索
    search () {
      this.queryMap.pageNum = 1
      this.getstoList()
    },
    delUserById (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('wpl/stock/' + id)
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        await this.getstoList()
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
    }
  }
}
</script>
