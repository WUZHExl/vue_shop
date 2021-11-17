<template>
  <div>
    <!-- 导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！"type="warning" :closable="false"></el-alert>

      <!-- 选择商品分类区 -->
      <el-row class="cat_opt">
          <span>选择商品分类：</span>
            <!-- 选择商品分类的级联选择框 -->
            <el-cascader
            v-model="selectedKeys"
            :options="catelist"
            :props="cascaderProps"
            @change="handleChange" clearable ></el-cascader>
      </el-row>

      <!-- Tap -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
        <!-- 动态参数表格 -->
        <el-table :data="manyTableData" border stripe>
          <!-- 展开 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag v-for="(item,i) in scope.row.attr_vals" 
              :key="i" closable @close="handleClose(i,scope.row)"> 
                {{item}}
              </el-tag>

              <!-- 输入文本框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>

              <!-- 添加按钮 -->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                + New Tag</el-button>



            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
               <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
        <!-- 静态参数表格 -->
        <el-table :data="onlyTableData" border stripe>
          <!-- 展开 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag v-for="(item,i) in scope.row.attr_vals" 
              :key="i" closable @close="handleClose(i,scope.row)"> 
                {{item}}
              </el-tag>

              <!-- 输入文本框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>

              <!-- 添加按钮 -->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                + New Tag</el-button>



            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
               <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      
      
      
      </el-tab-pane>

    </el-tabs>

    </el-card>



    <!-- 添加参数/属性对话框 -->
    <el-dialog
      :title="'添加'+addDialogTitle"
      :visible.sync="addDialogVisible"
      width="50%"  @close="addDialogClose">
      <!-- 添加参数对话框 -->
       <el-form :model="addForm" :rules="addFormRules" 
        ref="addFormRef" label-width="80px">
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>

      </el-form>  
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="addParams">确 定</el-button>
      </span> 
    </el-dialog>

    <!-- 修改参数/属性对话框 -->
    <el-dialog
      :title="'修改'+addDialogTitle"
      :visible.sync="editDialogVisible"
      width="50%"  @close="editDialogClose">
      <!-- 添加参数对话框 -->
       <el-form :model="editForm" :rules="editFormRules" 
        ref="editFormRef" label-width="80px">
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>

      </el-form>  
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="editParams">确 定</el-button>
      </span> 
    </el-dialog>



  </div>
</template>

<script>
export default {
  data(){
    return{
      // 商品分类数据列表//父级分类列表
      catelist:[],
      // 指定级联选择器的配置对象
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover',
        checkStrictly:'true',
      },
      // 选中的父级分类的I的数组
      selectedKeys:[],

      // 被激活的页签名称
      activeName:'many',

      // 动态参数的数据
      manyTableData:[],
      // 静态属性的数据
      onlyTableData:[],
      // 控制添加对话框的显示与隐藏
      addDialogVisible:false,

      addForm:{
        attr_name:'',
      },
      addFormRules:{
        attr_name:[
          {required:true,message:'请输入参数名称',trigger:'blur'},
        ],
      },

      // 控制修改对话框的显示与隐藏
      editDialogVisible:false,
      editForm:{},
      editFormRules:{

      },

      // 控制按钮与文本框的切换显示
      // inputVisible:false,
      // 文本框中输入的内容
      // inputValue:""

    }
  },
  created(){
    this.getCateList()
  },
  computed:{
    // 如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled(){
      if(this.selectedKeys.length!==3){
        return true
      }
      return false
    },
    cateId(){
      if(this.selectedKeys.length==3){
        return this.selectedKeys[2]
      }
      return null
    },
    addDialogTitle(){
      if(this.activeName==='many')return '动态参数'
      return '静态属性'
    }
  },
  methods:{
     async getCateList(){
       const {data:res}=await this.$http.get('categories')
       if(res.meta.status!==200) return this.$message.error('获取商品分类失败')
       this.catelist=res.data
     },

    //  级联选择框选择会触发
     async parentCateChange(){
      //  选择的不是三级分类
       if(this.selectedKeys.length!==3) {
         this.selectedKeys=[]
         this.manyTableData=[]
         this.onlyTableData=[]
         return
       }
      //  选择的是三级分类
      // 根据所选ID和所处面板获取对应的参数
      const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{
        sel:this.activeName
      }})

      if(res.meta.status!==200) return this.$message.error('获取参数失败')
      // console.log(res.data)

      res.data.forEach(item=>{
        item.attr_vals=item.attr_vals===""?[]:item.attr_vals.split(' ')
        item.inputVisible=false
        item.inputValue=''
      })

      // console.log(res.data)
      if(this.activeName==='many'){
        this.manyTableData=res.data
      }else{
        this.onlyTableData=res.data
      }


     },


     handleChange(){
       this.parentCateChange()
     },

    // tab页签点击是的事件
     handleTabClick(){
      //  console.log(this.activeName)
      // 修改参数列表
       this.parentCateChange()
     },

    //  监听添加对话框的关闭事件
     addDialogClose(){
       this.$refs.addFormRef.resetFields()
     },

    // 点击按钮，添加参数
     addParams(){
       this.$refs.addFormRef.validate(async valid=>{
         if(!valid) return;
         const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{
           attr_name:this.addForm.attr_name,
           attr_sel:this.activeName
         })

         if(res.meta.status!==201) return this.$message.error('添加参数失败')
         this.$message.success('添加参数成功')
         this.addDialogVisible=false
         // 修改参数列表
         this.parentCateChange()
       })
     },

    // 展示修改对话框
     async showEditDialog(attr_id){
      const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
       { params:{attr_sel:this.activeName}
      })

      if(res.meta.status !==200) return this.$message.error('获取参数信息失败')

      this.editForm=res.data

       this.editDialogVisible=true
     },

     editDialogClose(){
       this.$refs.editFormRef.resetFields()
     },

    // 点击按钮修改信息
     editParams(){
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return;
          const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
            attr_name:this.editForm.attr_name,
            attr_sel:this.activeName
          })

          if(res.meta.status!==200) return this.$message.error('修改参数失败')
          this.$message.success('修改参数成功')

          // 修改参数列表
          this.parentCateChange()
          this.editDialogVisible=false

        })
     },

      // 根据id提示是否删除
    async removeParams(attr_id){

      await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          const {data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
          if(res.meta.status!==200){
            return this.$message.error('删除失败')
          }
          this.$message.success('删除成功')
          // this.getRoleList()
          this.parentCateChange()

        }).catch(() => {
          this.$message.info("已取消删除")
        });


      },


      // 文本框失去焦点或摁下Enter键都会触发
      async handleInputConfirm(row){
        // console.log("111")
        if(row.inputValue.trim().length===0){
          row.inputValue =''
          row.inputVisible=false
          return
        }

        row.attr_vals.push(row.inputValue.trim());
        row.inputValue=''
        row.inputVisible=false

        this.saveAttrVals(row);
      },

      // 点击按钮，展示文本输入框
      showInput(row){
        row.inputVisible=true;

        // 在下次 DOM 更新循环结束之后执行延迟回调。
        // 在修改数据之后立即使用这个方法，获取更新后的 DOM
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },


      // 
      async saveAttrVals(row){
        const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(' ')
        })

        if(res.meta.status!==200) return this.$message.error('修改参数失败')

        this.$message.success('修改参数成功')
      },

      // 删除对应的参数可选项
      handleClose(i,row){ 
        row.attr_vals.splice(i,1);
        this.saveAttrVals(row);
      }

  }
}
</script>

<style lang="less" scoped>
.cat_opt{
  margin: 15px 0px;
}

.el-tag{
  margin: 10px;
}

.input-new-tag{
  width: 120px;
}
</style>