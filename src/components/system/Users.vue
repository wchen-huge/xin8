<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入用户名" v-model="queryInfo.username">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true" v-has-permission="'sys:user:add'">新增</el-button>
        </el-col>
      </el-row>
      <el-table stripe :data="userList" style="width: 100%">
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮件"></el-table-column>
        <el-table-column prop="isvaild" label="是否有效">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isvaild" @change="updateUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="openEditUser(scope.row)" type="primary" size="small" class="el-icon-edit"></el-button>
            <el-button type="danger" size="small" class="el-icon-delete" @click="delUserBuId(scope.row.id)"></el-button>
            <el-button type="warning" size="small" class="el-icon-setting" @click="openAssignRole(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="新增用户" :visible.sync="addDialogVisible" width="50%" @close="closeAdd">
      <el-form :model="addForm" :rules="rulesAdd" ref="ruleFormAdd" label-width="100px">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="closeEdit">
      <el-form :model="editForm" :rules="rulesAdd" ref="ruleFormEdit" label-width="100px">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="55%" center>
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="roleIds"
        :titles="['未拥有', '已拥有']"
        :button-texts="['到左边', '到右边']"
        :data="roles">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
    <el-button @click="roleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="assignRole">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  mounted () {
    this.getUserList()
  },
  methods: {
    async assignRole () {
      /*
      *方式一
      const { data: res } = await this.$http.put('sys/userRole/' + this.userId, { roleIds: this.roleIds.join(',') })
      */

      /*
      *方式二
      */
      const { data: res } = await this.$http.put('sys/userRole/' + this.userId + '/' + (this.roleIds.join(',') || 'aa'))
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.userId = ''
      this.$message.success(res.msg)
      this.roleDialogVisible = false
    },
    async openAssignRole (userId) {
      this.roleDialogVisible = true
      const { data: res } = await this.$http.get('sys/role/' + userId)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.userId = userId
      this.roles = res.data.roles
      this.roleIds = res.data.roleIds
    },
    editUser () {
      this.$refs.ruleFormEdit.validate(async (valid) => {
        if (valid === true) {
          const { data: res } = await this.$http.put('sys/user', this.editForm)
          if (res.code !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.$message.success(res.msg)
          this.editDialogVisible = false
        }
      })
    },
    openEditUser (userInfo) {
      this.editForm = userInfo
      this.editDialogVisible = true
    },
    closeEdit () {
      this.$refs.ruleFormEdit.resetFields()
    },
    closeAdd () {
      this.$refs.ruleFormAdd.resetFields()
    },
    addUser () {
      this.$refs.ruleFormAdd.validate(async (valid) => {
        if (valid === true) {
          const { data: res } = await this.$http.post('sys/user', this.addForm)
          if (res.code !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.$message.success(res.msg)
          await this.getUserList()
          this.addDialogVisible = false
        }
      })
    },
    delUserBuId (userId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('sys/user/' + userId)
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        await this.getUserList()
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
    async updateUserState (userInfo) {
      const { data: res } = await this.$http.put('sys/user/' + userInfo.id + '/' + userInfo.isvaild)
      if (res.code !== 200) {
        userInfo.isvaild = !userInfo.isvaild
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
    },
    async getUserList () {
      const { data: res } = await this.$http.get('sys/user', { params: this.queryInfo })
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.userList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.queryInfo.size = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.queryInfo.page = val
      this.getUserList()
    }
  },
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      userId: '',
      roles: [],
      roleIds: [],
      roleDialogVisible: false,
      editDialogVisible: false,
      editForm: {},
      rulesAdd: {
        username: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addForm: {
        username: '',
        email: '',
        phone: ''
      },
      addDialogVisible: false,
      total: 0,
      queryInfo: {
        username: '',
        page: 1,
        size: 10
      },
      userList: []
    }
  }
}
</script>

<style scoped>

</style>
