<template>
    <div>
      <!--面包导航-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>业务管理</el-breadcrumb-item>
        <el-breadcrumb-item>物资管理</el-breadcrumb-item>
        <el-breadcrumb-item>物资入库</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片区域 -->
      <el-card>
        <!-- 搜索部分 -->
        <el-form :inline="true" :model="queryInfo" class="demo-form-inline">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input placeholder="请输入物资单号" v-model="queryInfo.purNumber">
                <el-button slot="append" icon="el-icon-search" @click="getpurinfoList">查询</el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addDialogVisible=true">添加入库</el-button>
            </el-col>
          </el-row>
        </el-form>
        <template>
          <el-table :data="getpurList" stripe style="width: 100%">
            <el-table-column prop="purNumber" label="入库单号"></el-table-column>
            <el-table-column prop="supName" label="物资名称"></el-table-column>
            <el-table-column prop="speModel" label="规格型号"></el-table-column>
            <el-table-column prop="unit" label="单位"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="purContent" label="采购说明"></el-table-column>
            <el-table-column prop="supplier" label="供应商"></el-table-column>
            <el-table-column prop="conPerson" label="联系人"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="data" label="申请日期"></el-table-column>
            <el-table-column prop="status" label="审批状态"></el-table-column>
            <el-table-column prop="buyer" label="采购员"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column prop="classification" label="分类"></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
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
      <el-dialog title="新增入库信息" :visible.sync="addDialogVisible" width="50%" @close="closeAdd">
        <el-form :model="addForm" :rules="rulesAdd" ref="ruleFormAdd" label-width="100px">
          <el-form-item label="入库单号" prop="purNumber">
            <el-input v-model="addForm.purNumber"></el-input>
          </el-form-item>
          <el-form-item label="物资名称" prop="supName">
            <el-input v-model="addForm.supName"></el-input>
          </el-form-item>
          <el-form-item label="规格型号" prop="speModel">
            <el-input v-model="addForm.speModel"></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input v-model="addForm.unit"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="quantity">
            <el-input v-model="addForm.quantity"></el-input>
          </el-form-item>
          <el-form-item label="采购说明" prop="purContent">
            <el-input v-model="addForm.purContent"></el-input>
          </el-form-item>
          <el-form-item label="供应商" prop="supplier">
            <el-input v-model="addForm.supplier"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="conPerson">
            <el-input v-model="addForm.conPerson"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="申请日期" prop="data">
            <el-date-picker v-model="addForm.data" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="审批状态" prop="status">
            <el-input v-model="addForm.status"></el-input>
          </el-form-item>
          <el-form-item label="采购员" prop="buyer">
            <el-input v-model="addForm.buyer"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="addForm.remarks"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="classification">
            <el-input v-model="addForm.classification"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addMate">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'PurInfo',
  mounted () {
    this.getpurinfoList()
  },
  methods: {
    closeAdd () {
      this.$refs.ruleFormAdd.resetFields()
    },
    handleSizeChange (val) {
      this.queryInfo.size = val
      this.getsortList()
    },
    handleCurrentChange (val) {
      this.queryInfo.page = val
      this.getsortList()
    },
    addMate () {
      this.$refs.ruleFormAdd.validate(async (valid) => {
        if (valid === true) {
          const { data: res } = await this.$http.post('wpl/purinfo', this.addForm)
          if (res.code !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.$message.success(res.msg)
          await this.getpurinfoList()
          this.addDialogVisible = false
        }
      })
    },
    async  delUserById (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('wpl/purinfo/' + id)
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        await this.getpurinfoList()
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
    async getpurinfoList () {
      const { data: res } = await this.$http.get('wpl/purinfo', { params: this.queryInfo })
      // console.log(res.data.result)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.total = res.data.total
      this.getpurList = res.data.result
    }
  },
  data () {
    return {
      queryMap: { pageNum: 1, pageSize: 5, status: 0 },
      getpurList: [{}],
      queryInfo: {
        purNumber: '',
        page: 1,
        size: 5
      },
      total: 0,
      addDialogVisible: false,
      addForm: {
        purNumber: '',
        supName: '',
        speModel: '',
        unit: '',
        quantity: '',
        purContent: '',
        supplier: '',
        conPerson: '',
        phone: '',
        data: '',
        status: '',
        buyer: '',
        remarks: '',
        classification: ''
      },
      rulesAdd: {
        purNumber: [
          {
            required: true,
            message: '请输入入库单号',
            trigger: 'blur'
          }
        ],
        supName: [
          {
            required: true,
            message: '请输入物资名称',
            trigger: 'blur'
          }
        ],
        speModel: [
          {
            required: true,
            message: '请输入物资规格型号',
            trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true,
            message: '请输入单位',
            trigger: 'blur'
          }
        ],
        quantity: [
          {
            required: true,
            message: '请输入入库数量',
            trigger: 'blur'
          }
        ],
        purContent: [
          {
            required: true,
            message: '请输入采购说明',
            trigger: 'blur'
          }
        ],
        supplier: [
          {
            required: true,
            message: '请输入供应商名称',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '请输入审批状态',
            trigger: 'blur'
          }
        ],
        conPerson: [
          {
            required: true,
            message: '请输入联系人',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          }
        ],
        data: [
          {
            required: true,
            message: '请输入入库时间',
            trigger: 'blur'
          }
        ],
        buyer: [
          {
            required: true,
            message: '请输入采购员',
            trigger: 'blur'
          }
        ],
        remarks: [
          {
            required: true,
            message: '请输入备注信息',
            trigger: 'blur'
          }
        ],
        classification: [
          {
            required: true,
            message: '请输入物资分类',
            trigger: 'blur'
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
