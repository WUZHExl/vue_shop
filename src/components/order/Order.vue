<template>
  <div>
    <!-- 导航区 -->
    <el-breadcrumb sseparator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>


    <!-- 卡片视图区 -->
    <el-card>


      <!--搜索与添加区域  -->
      <el-row :gutter="20">
        <el-col :span="7">          
          <!-- 搜索与添加 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>

        </el-col>
      </el-row>



      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope"> 
            {{scope.row.create_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox">
            </el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>



       <!-- 分页 -->
        <el-pagination 
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total,sizes, prev, pager, next"
          :total="total">
        </el-pagination>


    </el-card>



    <!--    修改地址的对话框-->
    <el-dialog title="修改地址" :visible.sync="addressVisible" @close="addressDialogClosed" width="50%">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <!--          <el-input v-model="addressForm.address1"></el-input>-->
          <el-cascader :options="cityData" v-model="addressForm.address1" :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>



    <!-- 显示物流进度的对话框-->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.ftime">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>





  </div>
</template>

<script>
import cityData from './citydata'
export default {
      data(){
        return {
          queryInfo:{
            query:'',
            // 当前的页数
            pagenum:1,
            // 当前页面总数
            pagesize:2
          },
          orderList:[],
          total:0,
          addressVisible:false,
          addressForm: {
            address1: [],
            address2: ''
          },
          addressFormRules: {
            address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
            address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
          },
          // 地址的选择
          cityData,

          // 显示物流进度的
          progressDialogVisible: false,
          progressInfo: []


        }
      },

      created(){
        this.getOrderList()
      },

      methods:{
        async getOrderList(){
         const {data:res}=await this.$http.get('orders',{params: this.queryInfo})
         if(res.meta.status!==200){
          return this.$message.error('获取订单列表失败')
         }

        this.orderList=res.data.goods
        this.total=res.data.total
        
        },


        handleSizeChange(newSize){
          this.queryInfo.pagesize=newSize
          this.getOrderList()
        },

        // 监听页码值改变的事件
        handleCurrentChange(newPage){
          // console.log(newPage)
          this.queryInfo.pagenum=newPage
          this.getOrderList()
        },

        showBox(){
          this.addressVisible=true
        },

        addressDialogClosed() {
           this.$refs.addressFormRef.resetFields()
        },


        async showProgressBox() {
          const { data: res } = await this.$http.get('/kuaidi/1106975712662')
          if (res.meta.status !== 200) {
            return this.$message.error('获取物流进度失败！')
          }
          this.progressInfo = res.data

          this.progressDialogVisible = true
          //   console.log(this.progressInfo)
        }



      }
}
</script>

<style>

</style>