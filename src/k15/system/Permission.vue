<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输权限名称" clearable v-model="name" @clear="searchPermission">
                        <el-button slot="append" icon="el-icon-search" @click="searchPermission"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addFormVisible=true">添加权限</el-button>
                </el-col>
            </el-row>
            <el-table :data="permissionList" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="权限名称" prop="name"></el-table-column>
                <el-table-column label="权限路径" prop="url"></el-table-column>
                <el-table-column label="权限类型">
                    <template slot-scope="sc">{{sc.row.urlType==1?'菜单权限':'接口权限'}}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" @click="showEditDialog(scope.row)">修改</el-button>
                        <el-button type="danger" size="mini" @click="removePermissionById(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[5, 10 , 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
            ></el-pagination>
        </el-card>

      <!--修改-->
      <el-dialog title="修改权限" :visible.sync="modifyFormVisible" :close-on-click-modal="false">
        <el-form :model="modifyRuleForm" v-bind:rules="modifyRules" ref="modifyRules">

          <el-form-item label="权限代码" :label-width="formLabelWidth" prop="code">
            <el-input v-model="modifyRuleForm.code" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="权限名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="modifyRuleForm.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="权限路径" :label-width="formLabelWidth" prop="url">
            <el-input v-model="modifyRuleForm.url" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="权限类型" :label-width="formLabelWidth" prop="urlType">
            <el-radio v-model="modifyRuleForm.urlType" v-bind:label="0">接口权限</el-radio>
            <el-radio v-model="modifyRuleForm.urlType" v-bind:label="1">菜单权限</el-radio>
          </el-form-item>

          <el-form-item label="上一级菜单" :label-width="formLabelWidth" prop="parentId">
            <el-select v-model="modifyRuleForm.parentId" placeholder="请选择上一级菜单">
              <el-option label="请选择上一级菜单" value="-1"></el-option>
              <el-option v-for="m in ParentMenus" v-bind:label="m.name" v-bind:value="m.id"></el-option>
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modifyFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyForm('modifyRules')">确 定</el-button>
        </div>
      </el-dialog>

      <!--添加-->
      <el-dialog title="添加权限" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addRuleForm" v-bind:rules="addRules" ref="addRules">

          <el-form-item label="权限代码" :label-width="formLabelWidth" prop="code">
            <el-input v-model="addRuleForm.code" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="权限名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="addRuleForm.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="权限路径" :label-width="formLabelWidth" prop="url">
            <el-input v-model="addRuleForm.url" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="权限类型" :label-width="formLabelWidth" prop="urlType">
            <el-radio v-model="addRuleForm.urlType" v-bind:label="0">接口权限</el-radio>
            <el-radio v-model="addRuleForm.urlType" v-bind:label="1">菜单权限</el-radio>
          </el-form-item>

          <el-form-item label="上一级菜单" :label-width="formLabelWidth" prop="parentId">
            <el-select v-model="addRuleForm.parentId" placeholder="请选择上一级菜单">
              <el-option label="请选择上一级菜单" value="-1"></el-option>
              <el-option v-for="m in ParentMenus" v-bind:label="m.name" v-bind:value="m.id"></el-option>
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addForm('addRules')">确 定</el-button>
        </div>
      </el-dialog>

    </div>

</template>
<script>
    export default {
        data() {
            return {
              pageNum: 1,
              pageSize: 5,
              permissionList: [],
              ParentMenus:[],
              total: 0,
              name: "", //权限名称
              urlTypeDesc: "菜单权限",
              modifyFormVisible:false,
              addFormVisible:false,
              formLabelWidth: '120px',
              modifyRuleForm:{  //修改表单
                code:"",
                name:"",
                url: '',
                urlType: '',
                parentId:""
              },
              addRuleForm:{  //添加表单
                code:"",
                name:"",
                url: '',
                urlType: '',
                parentId:""
              },
              modifyRules: {  //修改表单规则
                code: [
                  { required: false, message: '', trigger: 'blur' }
                ],
                name: [
                  { required: true, message: '权限名称不能为空', trigger: 'blur' }
                ],
                url: [
                  { required: false, message: '', trigger: 'blur' }
                ],
                urlType: [
                  { required: true, message: '权限类型不能为空', trigger: 'change' }
                ],
              },
              addRules: {  //修改表单规则
                code: [
                  { required: false, message: '', trigger: 'blur' }
                ],
                name: [
                  { required: true, message: '权限名称不能为空', trigger: 'blur' }
                ],
                url: [
                  { required: false, message: '', trigger: 'blur' }
                ],
                urlType: [
                  { required: true, message: '权限类型不能为空', trigger: 'change' }
                ],
              },
            };
        },
        methods: {
            handleSizeChange(size){
              this.pageSize = size ;
              this.reloadData();
            },
            handleCurrentChange(now){
              this.pageNum = now;
              this.reloadData();
            },
            searchPermission(){
              this.reloadData();
            },
            showEditDialog(obj){
              this.modifyFormVisible=true;
              this.modifyRuleForm = obj;
              console.log(this.modifyRuleForm)
            },
            reloadData(){
              let url = "permission/queryAllPermission"
              this.$axios.get(url,{params:{
                  "pageNum":this.pageNum,
                  "pageSize":this.pageSize,
                  "permission":this.name
                }}).then(res=>{
                if (res.data.code == 200){
                  this.permissionList = res.data.data.list
                  this.total = res.data.data.total
                }
              })
            },
          edit(){
            let url = "permission/modify"

            this.$axios.put(url,this.modifyRuleForm).then(res=>{
              if (res.data.code == 200){
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.reloadData();
                this.modifyFormVisible = false
              }else {
                this.$message({
                  type: 'error',
                  message: '修改失败!'
                });
              }
            })
          },
          add(){
            let url = "permission/add"

            this.$axios.put(url,this.addRuleForm).then(res=>{
              if (res.data.code == 200){
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                this.reloadData();
                this.addFormVisible = false
              }else {
                this.$message({
                  type: 'error',
                  message: '添加失败!'
                });
              }
            })
          },
          modifyForm(formName) {

            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.edit();
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          addForm(formName) {

            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.add();
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          initParentMenus(){
            let url = "menu/showParentMenus"
            this.$axios.get(url).then(res=>{
              if (res.data.code == 200){
                this.ParentMenus = res.data.data
              }
            })
          },
          removePermissionById(id){
            console.log(id)
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let url = "/permission/delete/"+id
              this.$axios.delete(url).then(
                  res=>{
                    if (res.data.code==200){
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                      this.reloadData();
                    }else {
                      this.$message({
                        type: 'error',
                        message: '删除失败!'
                      });
                    }
                  }
              )

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
        },

        created() {
            this.reloadData();
            this.initParentMenus();
        }
    };
</script>
<style lang="less" scoped>
</style>