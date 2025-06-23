<template>
    <div id="container">
        <div id="title">
            <h1>后台管理系统</h1>
        </div>
        <div class="input">
            <el-input v-model="name" prefix-icon="User" placeholder="请输入用户名"></el-input>
        </div>
        <div class="input">
            <el-input v-model="password" prefix-icon="lock" placeholder="请输入密码"></el-input>
        </div>
        <div class="input">
            <el-button class="btn" @click="login" type="primary" :disabled="disabled">登录</el-button>
        </div>
    </div>
</template>


<script>
import Storage from '../../tools/Storage'
import { ElMessage } from 'element-plus'
export default {
    name: 'userLogin',//有改动
    data() {
        return {
            name: '',
            password: '',
        }
    },
    computed: {
        disabled() {
            return this.name.length == 0 || this.password.length == 0
        }
    },
    methods: {
        login() {
            Storage.commit("registUserInfo", {
                name: this.name,
                password: this.password
            })
            ElMessage({
                message: '登录成功',
                type: 'success',
                duration: 3000
            })
            setTimeout(() => {
                this.$router.push({ name: 'home' })
            }, 2000)
        }
    }
}
</script>
<style scoped>
#container {
    background: linear-gradient(to bottom, #93e9ed, #9945ca);
    height: 100%;
    width: 100%;
    position: absolute;
}

#title {
    text-align: center;
    color: azure;
    margin-top: 200px;
}

.input {
    margin: 20px auto;
    width: 500px;
    height: 50px;
}

.btn {
    width: 500px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
}
</style>