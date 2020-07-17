<template>
    <div>
      <!--面包导航-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>业务管理</el-breadcrumb-item>
        <el-breadcrumb-item>物资管理</el-breadcrumb-item>
        <el-breadcrumb-item>物资类别</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addDialogVisible=true">添加</el-button>
          </el-col>
        </el-row>
        <template>
          <el-table :data="getMateList" stripe style="width: 100%">
            <el-table-column prop="id" type="index" label="ID" width="200"></el-table-column>
            <el-table-column prop="supName" label="分类名称" width="300"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="300"></el-table-column>
            <el-table-column prop="modifiedTime" label="修改时间" width="300"></el-table-column>
            <el-table-column fixed="right" label="操作" width="280">
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
      <el-dialog title="新增物资分类" :visible.sync="addDialogVisible" width="50%" @close="closeAdd">
        <el-form :model="addForm" :rules="rulesAdd" ref="ruleFormAdd" label-width="100px">
          <el-form-item label="分类名称" prop="supName">
            <el-input v-model="addForm.supName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addMate">确 定</el-button>
  </span>
      </el-dialog>
      <el-dialog title="修改物资分类" :visible.sync="editDialogVisible" width="50%" @close="closeEdit">
        <el-form :model="editForm" :rules="rulesAdd" ref="ruleFormEdit" label-width="100px">
          <el-form-item label="分类名称" prop="supName">
            <el-input v-model="editForm.supName"></el-input>
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
  name: 'MateCategorys',
  mounted () {
    this.getsortList()
  },
  methods: {
    editUser () {
      this.$refs.ruleFormEdit.validate(async (valid) => {
        if (valid === true) {
          const { data: res } = await this.$http.put('wpl/mate', this.editForm)
          if (res.code !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.$message.success(res.msg)
          this.editDialogVisible = false
        }
      })
    },
    addMate () {
      this.$refs.ruleFormAdd.validate(async (valid) => {
        if (valid === true) {
          const { data: res } = await this.$http.post('wpl/mate', this.addForm)
          if (res.code !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.$message.success(res.msg)
          await this.getsortList()
          this.addDialogVisible = false
        }
      })
    },
    delUserById (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('wpl/mate/' + id)
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        await this.getsortList()
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
    async getsortList () {
      const { data: res } = await this.$http.get('wpl/mate', { params: this.queryInfo })
      // console.log(res.data.result)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.total = res.data.total
      this.getMateList = res.data.result
    },
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
    closeEdit () {
      this.$refs.ruleFormEdit.resetFields()
    },
    openEditUser (userInfo) {
      this.editForm = userInfo
      this.editDialogVisible = true
    }
  },
  data () {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      total: 0,
      getMateList: [{}],
      editForm: {},
      queryInfo: {
        supName: '',
        page: 1,
        size: 5
      },
      addForm: {
        supName: '',
        createTime: '',
        modifiedTime: ''
      },
      rulesAdd: {
        supName: [
          {
            required: true,
            message: '请输入分类名称',
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
