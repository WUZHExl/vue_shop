<template>
  <div>
      <!-- 导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- /卡片视图 -->
    <el-card>
      <el-row>
          <el-col>
            <el-button type="primary" @click="addDialogVisible= true">添加角色</el-button>
          </el-col>
      </el-row>
      <el-table :data="roleList" border script>
        <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 渲染一级权限 -->
              <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">

                <el-col :span="5">
                  <el-tag closable @close="removRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>


                <!-- 渲染二级和三级 -->
                <el-col :span="19">
                  <!-- 通过for循环，渲染二级权限 -->
                  <el-row  :class="[i2!==0?'bdtop':'','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id" >
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                    
                  </el-row>

                </el-col>



              </el-row>

               <!-- <pre>
                {{scope.row}}
               </pre> -->
            </template>

        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="300px">
           <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
           <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
           <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="路径" prop="path"></el-table-column> -->

      </el-table>
    </el-card>


    <!--添加角色的对话框  -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"  @close="addDialogClose">
      <!-- 内容主体区 -->
       <el-form :model="addForm" :rules="addFormRules" 
        ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>  
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="addRole">确 定</el-button>
      </span> 
    </el-dialog>

    <!--编辑角色的对话框  -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClose">
      <!-- 内容主体区 -->
       <el-form :model="editForm" :rules="editFormRules" 
        ref="editFormRef" label-width="80px">
        <el-form-item label="角色ID">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>  
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="editRole">确 定</el-button>
      </span> 
    </el-dialog>

    <!--分配角色权限的对话框  -->
    <el-dialog
      title="添加角色"
      :visible.sync="setRightDialogVisible"
      width="50%"  @close="setRightDialogClose">
      <!-- 内容主体区 -->
      <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" 
      :default-expand-all="true" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="allotRights">确 定</el-button>
      </span> 
    </el-dialog>


  </div>
</template>

<script>
export default {
  data(){
    return {
      // 所有角色列表数据
      roleList:[],

      // 权限数据
      rightList:[],

      // 树形控件属性绑定对象
      treeProps:{
        label:'authName',//指定节点标签为节点对象的某个属性值
        children:'children'//指定子树为节点对象的某个属性值
      },

      // 控制是否显示添加角色对话框
      addDialogVisible:false,

      // 控制是否显示编辑角色的对话框
      editDialogVisible:false,

      // 控制是否显示分配权限的对话框
      setRightDialogVisible:false,

      addForm:{
        roleName:'',
        roleDesc:''
      },
      addFormRules:{
        roleName:[
          {required:true,message:'请输入角色名', trigger: 'blur'},
          {min:2,max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'}
        ]

      },

      editForm:{
        roleId:'',
        roleName:'',
        roleDesc:''
      },
      editFormRules:{
        roleName:[
          {required:true,message:'请输入角色名', trigger: 'blur'},
          {min:2,max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'}
        ]
      },

      // 默认选中的id值数组
      defKeys:[],
      roleId:'',//当前即将分配权限的角色id




    }
  },
  created(){
    this.getRoleList()
  },
  methods:{
    // 获取所有角色列表
    async getRoleList(){
      const {data:res}=await this.$http.get('roles')

      if(res.meta.status!==200) return this.$message.error('获取权限失败')

      this.roleList=res.data
    },

    // 添加角色
    async addRole(){
      const {data:ans}=await this.$http.post('roles',this.addForm)
      if(ans.meta.status!==201) return this.$message.error('添加角色失败')
      
      // this.roleList=ans.data
      // console.log(ans)
      this.$message.success('添加角色成功')
      this.addDialogVisible = false
      // 重新获取用户列表数据
      this.getRoleList()

    },

    // 删除角色
    async deleteRole(id){
              // 弹框询问
        const res=await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          const {data:res}=await this.$http.delete('roles/'+id)
          if(res.meta.status!==200){
            return this.$message.error('删除失败')
          }
          this.$message.success('删除成功')
          this.getRoleList()
        }).catch(() => {
          this.$message.info("已取消删除")
        });
    },

    // 编辑角色对话框
    async showEditDialog(id){

      // 获取你需要编辑的那个角色的信息，根据id查询
      const {data:res}=await this.$http.get('roles/'+id)
      if(res.meta.status!==200) return this.$message.error('获取角色信息失败')

      this.editForm=res.data

      this.editDialogVisible=true

    },

    // 编辑角色方法
    editRole(){

      this.$refs.editFormRef.validate(async valid=>{//验证表单校验是否通过
          if(!valid) return //不通过返回

          const {data:res}=await this.$http.put('roles/'+this.editForm.roleId,{
            roleName:this.editForm.roleName,
            roleDesc:this.editForm.roleDesc
          })

          if(res.meta.status!==200) return this.$message.error('修改角色信息失败')
          // 关闭对话框
          this.editDialogVisible = false
          // 重新获取用户列表数据
          this.getRoleList()
          // 提示修改成功
          this.$message.success('更新角色信息成功')

      })
    },//editRole

    addDialogClose(){
      this.$refs.addFormRef.resetFields()
    },
    editDialogClose(){
      this.$refs.editFormRef.resetFields()
    },


    // 删除角色指定权限
    async removRightById(role,rightid){

      await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
          if(res.meta.status!==200){
            return this.$message.error('删除失败')
          }
          this.$message.success('删除成功')
          // this.getRoleList()
          role.children=res.data

        }).catch(() => {
          this.$message.info("已取消删除")
        });
      },

    // 展示分配权限的对话框
    async showSetRightDialog(role){

      this.roleId=role.id

      const {data:res}=await this.$http.get("rights/tree")
      if(res.meta.status!==200) return this.$message.error('获取权限数据失败')


      this.rightList=res.data

      // 递归获取三级节点id
      this.getLeafKeys(role,this.defKeys)

      this.setRightDialogVisible=true
    },

    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }

      node.children.forEach(item=>{
        this.getLeafKeys(item,arr)
      })

    },

    setRightDialogClose(){
      this.defKeys=[]
    },

    // 点击为角色分配权限
    async allotRights(){
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // console.log(keys)

      const idStr=keys.join(",")

      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{
        rids:idStr,
      })

      if(res.meta.status!==200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible=false
    }


  }//methods


}
</script>

<style lang="less" scope>
.el-tag{
  margin: 7px;
}

.bdtop{
  border-top: 1px solid #eee;
}

.bdbottom{
  border-bottom: 1px solid #eee;
}

.vcenter{
  display:flex;
  align-items:center;
}
</style>