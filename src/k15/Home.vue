<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/logo.png" />
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleClapse">||||</div>
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        router
                        unique-opened
                        :collapse="isCollapse"
                        :collapse-transition="false"
                >
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item
                                :index="subMenu.url+''"
                                v-for="subMenu in item.children"
                                :key="subMenu.id"
                        >
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{subMenu.name}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view v-if="isRouterAlive" />
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        data() {
            return {
                menuList: [
                    {
                        id: 1,
                        name: "用户管理~~~~",
                        children: [{ id: 2, name: "用户列表", url: "/employee" }]
                    },
                    {
                        id: 4,
                        name: "部门管理",
                        children: [{ id: 5, name: "部门列表", url: "/department" }]
                    },
                    {
                        id: 7,
                        name: "权限管理",
                        children: [{ id: 8, name: "权限列表", url: "/permission" }]
                    },
                    {
                        id: 10,
                        name: "角色管理",
                        children: [{ id: 11, name: "角色列表", url: "/sysrole" }]
                    },
                    {
                        id: 20,
                        name: "课程管理",
                        children: [{ id: 21, name: "课程列表", url: "/courseList" }]
                    }
                ],
                isCollapse: false,
                isRouterAlive: true
            };
        },
        methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(function() {
                    this.isRouterAlive = true;
                });
            },
            toggleClapse() {
                this.isCollapse = !this.isCollapse;
            },
            logout() {
               // window.sessionStorage.clear();
              //  this.$router.push("/login");
            },
            loadMenus() {
              let url = "menu/showMenus"
              this.$axios(url).then(res=>{
                if (res.data.code == 200){
                  this.menuList = res.data.data
                }
              })
            }
        },
        created() {
          this.loadMenus()
        }
    };
</script>
<style lang="less" scoped>
    img {
        width: 30px;
        height: 30px;
    }
    .toggle-button {
        background-color: #373d48;
        font-size: 10px;
        text-align: center;
        color: #fff;
        letter-spacing: 0.2em;
        cursor: pointer;
    }

    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 22px;
        > div {
            display: flex;
            align-items: center;
            span {
                margin-left: 14px;
            }
        }
    }
    .el-aside {
        background-color: #333744;
        .el-menu {
            border-right: 0;
        }
    }
    .el-main {
        background-color: #eaedf1;
    }
    .home-container {
        height: 100%;
    }
</style>