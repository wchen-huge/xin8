<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              clearable
              v-model="queryMap.name"
              placeholder="请输入部门查询"
              @clear="search"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button
              v-hasPermission="'department:add'"
              type="success"
              icon="el-icon-circle-plus-outline"
              @click="addDialogVisible=true"
            >添加</el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              icon="el-icon-download"
              v-hasPermission="'department:export'"
              @click="downExcel"
            >导出</el-button>
          </el-col>
        </el-row>
        <!-- 表格区域 -->
          <el-table border stripe :data="departmentData" style="width: 100%;margin-top:20px;" >
            <el-table-column prop="id" type="index" label="ID" width="80"></el-table-column>
            <el-table-column prop="phone" label="办公电话" width="150"></el-table-column>
            <el-table-column prop="name" label="部门名" width="150"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>
        <!-- 部门别编辑弹出框 -->
        <el-dialog
          @open="getDeanList"
          title="更新部门"
          :visible.sync="editDialogVisible"
          width="50%"
          @close="closeEditDialog"
        >
        <span>
          <el-form :model="editRuleForm" :rules="addRules" ref="editRuleFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="editRuleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="部门主任" prop="mgrId">
              <el-select v-model="editRuleForm.mgrId" placeholder="请选择部门主任">
                <el-option v-for="dean in deans" :key="dean.id" :label="dean.name" :value="dean.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="办公电话" prop="phone">
              <el-input v-model="editRuleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="办公地址" prop="address">
              <el-input type="textarea" v-model="editRuleForm.address"></el-input>
            </el-form-item>
          </el-form>
        </span>
          <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="update"
            :disabled="btnDisabled"
            :loading="btnLoading"
          >确 定</el-button>
        </span>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Department',
  data () {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    return {
      btnLoading: false,
      btnDisabled: false,
      editDialogVisible: false,
      addDialogVisible: false, // 添加弹框是否显示
      total: 0, // 总共多少条数据
      departmentData: [], // 表格数据
      queryMap: {
        pageNum: 1,
        pageSize: 7,
        name: ''
      }, // 查询对象
      addRuleForm: {}, // 添加表单数据
      editRuleForm: {}, // 修改表单数据
      deans: [], // 所有部门主任
      addRules: {
        name: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入办公地址',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 12,
            message: '长度在 4 到 12 个字符',
            trigger: 'blur'
          }
        ],
        mgrId: [{
          required: true,
          message: '请选择部门主任',
          trigger: 'blur'
        }],
        phone: [
          {
            required: true,
            message: '请输入联部门方式',
            validator: checkPhone,
            trigger: 'blur'
          }
        ]
      } // 添加验证
    }
  },
  mounted () {
    this.downExcel()
  },
  methods: {
    /**
     * 加载部门表格
     */ async downExcel () {
      const { data: res } = await this.$http.get('department/excel')
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.departmentData = res.data
      // console.log(this.downExcel())
      console.log(res.data)
    },
    /**
     * 搜索部门
     */
    search () {
      this.queryMap.pageNum = 1
      this.getDepartmentList()
    },
    /**
     * 删除部门
     */
    async del (id) {
      var res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (res === 'confirm') {
        const { data: res } = await this.$http.delete(
          'department/delete/' + id
        )
        if (res.code === 200) {
          this.$message.success('部门删除成功')
          await this.getDepartmentList()
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    /**
     * 更新用户
     */
    async update () {
      this.$refs.editRuleFormRef.validate(async valid => {
        if (!valid) {
        } else {
          (this.btnLoading = true); (this.btnDisabled = true)
          const { data: res } = await this.$http.put(
            'department/update/' + this.editRuleForm.id,
            this.editRuleForm
          )
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: '部门信息更新',
              type: 'success'
            })
            await this.getDepartmentList()
          } else {
            this.$message.error('部门信息更新失败:' + res.msg)
          }
          this.editRuleForm = {}
          this.btnDisabled = false
          this.btnLoading = false
          this.editDialogVisible = false
        }
      })
    },
    /**
     * 编辑
     * @param {Object} id
     */
    async edit (id) {
      const { data: res } = await this.$http.get('department/edit/' + id)
      if (res.code === 200) {
        this.editRuleForm = res.data
      } else {
        return this.$message.error('部门信息编辑失败' + res.msg)
      }
      this.editDialogVisible = true
    },
    // 添加
    add () {
      this.$refs.addRuleFormRef.validate(async valid => {
        if (!valid) {

        } else {
          (this.btnLoading = true); (this.btnDisabled = true)
          const { data: res } = await this.$http.post(
            'department/add',
            this.addRuleForm
          )
          if (res.code === 200) {
            this.$message.success('部门添加成功')
            this.addRuleForm = {}
            await this.getDepartmentList()
          } else {
            return this.$message.error('部门添加失败:' + res.msg)
          }
          this.addDialogVisible = false;
          (this.btnLoading = false); (this.btnDisabled = false)
        }
      })
    },
    // 加载部门别列表
    async getDepartmentList () {
      const { data: res } = await this.$http.get(
        'department/findDepartmentList',
        {
          params: this.queryMap
        }
      )
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败')
      } else {
        this.total = res.data.total
        this.departmentData = res.data.rows
      }
    },
    // 加载所有部门主任
    async getDeanList () {
      const { data: res } = await this.$http.get('department/findDeanList')
      if (res.code !== 200) {
        return this.$message.error('获取部门主任失败')
      } else {
        this.deans = res.data
      }
    },
    // 改变页码
    handleSizeChange (newSize) {
      this.queryMap.pageSize = newSize
      this.getDepartmentList()
    },
    // 翻页
    handleCurrentChange (current) {
      this.queryMap.pageNum = current
      this.getDepartmentList()
    },
    // 关闭弹出框
    closeAddDialog () {
      this.$refs.addRuleFormRef.clearValidate()
      this.addRuleForm = {}
    },
    // 关闭弹出框
    closeEditDialog () {
      this.$refs.editRuleFormRef.clearValidate()
      this.editRuleForm = {}
    }
  }
}
</script>

<style scoped>

</style>
