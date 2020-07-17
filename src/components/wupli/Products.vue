<template>
  <div>
    <!--面包导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>业务管理</el-breadcrumb-item>
      <el-breadcrumb-item>物资管理</el-breadcrumb-item>
      <el-breadcrumb-item>库存信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--右边卡片内容-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入物资名称" v-model="queryInfo.supName">
            <el-button slot="append" icon="el-icon-search" @click="getproductList">查询</el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">新增</el-button>
        </el-col>
      </el-row>
      <template>
        <el-table :data="getInveList" stripe style="width: 100%">
          <el-table-column prop="id" type="index" label="ID"></el-table-column>
          <el-table-column prop="supName" label="物资名称" width="180"></el-table-column>
          <el-table-column prop="speModel" label="物资规格" width="100"></el-table-column>
          <el-table-column prop="unit" label="单位" width="180"></el-table-column>
          <el-table-column prop="stoQuantity" label="库存数量"></el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="sort" label="分类"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
    <el-dialog title="新增物资信息" :visible.sync="addDialogVisible" width="50%" @close="closeAdd">
      <el-form :model="addForm" :rules="rulesAdd" ref="ruleFormAdd" label-width="100px">
        <el-form-item label="物资名称" prop="supName">
          <el-input v-model="addForm.supName"></el-input>
        </el-form-item>
        <el-form-item label="物资规格" prop="speModel">
          <el-input v-model="addForm.speModel"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="addForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="stoQuantity">
          <el-input v-model="addForm.stoQuantity"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="addForm.remarks"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
        <el-input v-model="addForm.status"></el-input>
      </el-form-item>
        <el-form-item label="分类" prop="sort">
        <el-input v-model="addForm.sort"></el-input>
      </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="addForm.createTime"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addInve">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="修改物资信息" :visible.sync="editDialogVisible" width="50%" @close="closeEdit">
      <el-form :model="editForm" :rules="rulesAdd" ref="ruleFormEdit" label-width="100px">
        <el-form-item label="物资名称" prop="supName">
          <el-input v-model="editForm.supName"></el-input>
        </el-form-item>
        <el-form-item label="物资规格" prop="speModel">
          <el-input v-model="editForm.speModel"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="editForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="stoQuantity">
          <el-input v-model="editForm.stoQuantity"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="editForm.remarks"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="editForm.status"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="sort">
          <el-input v-model="editForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="editForm.createTime"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Products',
  mounted () {
    this.getproductList()
  },
  methods: {
    async editUser () {
      this.$refs.ruleFormEdit.validate(async (valid) => {
        if (valid === true) {
          const { data: res } = await this.$http.put('wpl/inve', this.editForm)
          if (res.code !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.$message.success(res.msg)
          this.editDialogVisible = false
        }
      })
    },
    closeEdit () {
      this.$refs.ruleFormEdit.resetFields()
    },
    async addInve () {
      this.$refs.ruleFormAdd.validate(async (valid) => {
        if (valid === true) {
          const { data: res } = await this.$http.post('wpl/inve', this.addForm)
          if (res.code !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.$message.success(res.msg)
          await this.getproductList()
          this.addDialogVisible = false
        }
      })
    },
    closeAdd () {
      this.$refs.ruleFormAdd.resetFields()
    },
    handleSizeChange (val) {
      this.queryInfo.size = val
      this.getproductList()
    },
    handleCurrentChange (val) {
      this.queryInfo.page = val
      this.getproductList()
    },
    async delUserById (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('wpl/inve/' + id)
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        await this.getproductList()
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
    openEditUser (userInfo) {
      this.editForm = userInfo
      this.editDialogVisible = true
    },
    async getproductList () {
      const { data: res } = await this.$http.get('wpl/inve', { params: this.queryInfo })
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.total = res.data.total
      this.getInveList = res.data.result
    }
  },
  data () {
    return {
      iid: '',
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      getInveList: [],
      addForm: {
        supName: '',
        speModel: '',
        unit: '',
        stoQuantity: '',
        remarks: '',
        status: '',
        sort: '',
        createTime: ''
      },
      queryInfo: {
        supName: '',
        page: 1,
        size: 5
      },
      editForm: {
      },
      rulesAdd: {
        supName: [
          {
            required: true,
            message: '请输入物资名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ],
        speModel: [
          {
            required: true,
            message: '请输入物资规格',
            trigger: 'blur'
          }
        ],
        stoQuantity: [
          {
            required: true,
            message: '请输入物资数量',
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
        remarks: [
          {
            required: true,
            message: '请输入备注信息',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '请输入分类编号',
            trigger: 'blur'
          }
        ],
        createTime: [
          {
            required: true,
            message: '请输入创建时间',
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
