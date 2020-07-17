<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入角色名称">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table stripe :data="roleList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row v-for="(i1,index) in props.row.children" :key="index" :class="['vCenter',index === 0? 'bdTop':'']">
              <el-col :span="4">
                <el-tag closable @close="delRights(props.row,i1)">{{i1.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(i2,index) in i1.children" :key="index" :class="['vCenter','bdBottom']">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="delRights(props.row,i2)">{{i2.name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18" class="vCenter">
                    <el-tag v-for="(i3,index) in i2.children" :key="index" closable type="warning"
                            @close="delRights(props.row,i3)">{{i3.name}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!--列表显示所有的信息<pre>{{ props.row}}</pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index" style="width: 10%"></el-table-column>
        <el-table-column prop="name" label="角色名称" style="width: 30%"></el-table-column>
        <el-table-column prop="remark" label="角色描述" style="width: 30%"></el-table-column>
        <el-table-column label="操作" style="width: 30%">
          <template slot-scope="scope">
            <el-button @click="openEditUser(scope.row)" type="primary" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="small" icon="el-icon-setting" @click="openAssignRight(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限" :visible.sync="rightDialogVisible" width="50%">
      <el-tree :data="rights" show-checkbox default-expand-all node-key="id"
               :default-checked-keys="keys"
               ref="tree" highlight-current :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="rightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="assignRight()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleId: '',
      keys: [],
      roleList: [],
      rightDialogVisible: false,
      rights: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  name: 'Roles',
  mounted () {
    this.getRoleList()
    this.getRights()
  },
  methods: {
    async assignRight () {
      /*
       * ...代表展开
       */
      const rights = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
      const roleId = this.roleId
      const roleRes = rights.map(resId => {
        return {
          roleId, resId
        }
      })
      const { data: res } = await this.$http.put('sys/roleRes/' + roleId, roleRes)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
      this.rightDialogVisible = false
      await this.getRoleList()
    },
    async getRights () {
      const { data: res } = await this.$http.get('sys/res')
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.rights = res.data
    },
    openAssignRight (role) {
      this.rightDialogVisible = true
      const arr = []
      this.keys = []
      this.roleId = role.id
      role.children.forEach(item => this.leaKey(item, arr))
      this.keys = arr
    },
    leaKey (right, arr) {
      if (right.children.length === 0) {
        arr.push(right.id)
      }
      right.children.forEach(item => this.leaKey(item, arr))
    },
    delRights (role, rights) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const arr = []
        this.findChildId(rights, arr)
        const { data: res } = await this.$http.delete('sys/roleRes/' + role.id + '/' + arr.join(','))
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        await this.getRoleList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    findChildId (right, arr) {
      if (right.children.length !== 0) {
        right.children.forEach(item => this.findChildId(item, arr))
      }
      arr.push(right.id)
    },
    async getRoleList () {
      const { data: res } = await this.$http.get('sys/role')
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.roleList = res.data.result
    }
  }
}
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .vCenter {
    display: flex;
    align-items: center;
  }

  .bdTop {
    border-top: 1px solid #eee;
  }

  .bdBottom {
    border-bottom: 1px solid #eee;
  }
</style>
