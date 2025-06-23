<template>

    <!-- 信息编辑模块 -->
    <el-dialog v-model="dialogVisible" title="编辑分类信息">
        <el-form :model="editForm" label-width="120px">
            <el-form-item label="分类ID">
                <el-input v-model="editForm.good"></el-input>
            </el-form-item>
            <el-form-item label="分类名称">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确定</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 物品上传模块 -->
    <div class="content-container" style="padding-bottom: 0; margin-bottom: 0;">
        <div style="margin: 0 0 20px 10px;">物品上传:</div>
        <el-container class="content-row">
            <div class="input-tip">
                分类ID:
            </div>
            <div class="input-field">
                <el-input v-model="queryParam.good"></el-input>
            </div>
            <div class="input-tip">
                分类名称:
            </div>
            <div class="input-field">
                <el-input v-model="queryParam.name"></el-input>
            </div>
        </el-container>


        <!-- 上传按钮 -->
        <el-container class="content-row">
            <div class="input-tip">
            </div>
            <div class="input-field">
                <el-button type="primary" @click="handleUpload">上传后台云数据</el-button>
            </div>
        </el-container>
    </div>

    <!-- 表格展示 -->
    <div>
        <table v-if="goodsData.length > 0">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>类别</th>
                    <th>分类名称</th>
                    <th>编辑/删除</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in goodsData" :key="index">
                    <td>{{ item._id }}</td>
                    <td>{{ item.good }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <el-button type="primary" @click="handleEdit(item)" style="width: 100px;">编辑</el-button>
                            <el-button type="danger" @click="handleDelete(item._id)"
                                style="width: 100px; margin-left: 0px;">删除</el-button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <el-pagination background :page-sizes="[10, 20, 50]" :current-page="queryParam.page"
            :page-size="queryParam.limit" layout="total, sizes, prev, pager, next" :total="total"
            @size-change="handleSizeChange" @current-change="handlePageChange" />
    </div>
</template>

<script>
const axios = require('axios');
const CONFIG = {
    appId: 'wx6872b1e938e23c07',
    appSecret: 'bb0342f524bf2fe87416defe5797f40a',
    env: 'cloud1-6gzxjy5k59c1f367'
};
export default {
    name: 'goodsCategoriesList',
    data() {
        return {
            dialogVisible: false,
            editForm: {
                good: '',
                name: '',
                _id: ''
            },
            goodsData: [],
            queryParam: {
                page: 1,
                limit: 10,
                good: '',
                name: ''
            },
            total: 0,
            timer: null
        };
    },
    methods: {
        // 将数据上传到微信云数据库
        async handleUpload() {
            try {
                const accessToken = await this.getAccessToken();
                const dataToUpload = {
                    good: this.queryParam.good,
                    name: this.queryParam.name
                };
                await axios.post(
                    `/wechat-api/tcb/databaseadd?access_token=${accessToken}`,
                    {
                        env: CONFIG.env,
                        query: `db.collection('categories').add({ data: ${JSON.stringify(dataToUpload)} })`
                    }
                );
                this.$message.success('分类数据上传成功');
                this.queryCloudDatabase();
            } catch (error) {
                console.error('分类数据上传失败:', error);
                this.$message.error('分类数据上传失败，请重试');
            }
        },

        handleSizeChange(val) {
            this.queryParam.limit = val;
            this.queryCloudDatabase();
        },

        handlePageChange(val) {
            this.queryParam.page = val;
            this.queryCloudDatabase();
        },

        // 提交编辑信息
        async submitEdit() {
            try {
                const accessToken = await this.getAccessToken();
                const dataToUpdate = {
                    good: this.editForm.good,
                    name: this.editForm.name
                };
                await axios.post(
                    `/wechat-api/tcb/databaseupdate?access_token=${accessToken}`,
                    {
                        env: CONFIG.env,
                        query: `db.collection('categories').doc('${this.editForm._id}').update({ data: ${JSON.stringify(dataToUpdate)} })`
                    }
                );
                this.$message.success('分类信息编辑成功');
                this.dialogVisible = false;
                this.queryCloudDatabase();
            } catch (error) {
                console.error('分类信息编辑失败:', error);
                this.$message.error('分类信息编辑失败，请重试');
            }
        },

        // 编辑分类信息
        handleEdit(item) {
            this.editForm = {
                _id: item._id,
                good: item.good,
                name: item.name
            };
            this.dialogVisible = true;
        },

        // 删除分类信息
        async handleDelete(id) {
            try {
                const accessToken = await this.getAccessToken();
                await axios.post(
                    `/wechat-api/tcb/databasedelete?access_token=${accessToken}`,
                    {
                        env: CONFIG.env,
                        query: `db.collection('categories').doc('${id}').remove()`
                    }
                );
                this.$message.success('分类删除成功');
                this.queryCloudDatabase();
            } catch (error) {
                console.error('分类删除失败:', error);
                this.$message.error('分类删除失败，请重试');
            }
        },

        // 获取微信访问令牌
        async getAccessToken() {
            try {
                const response = await axios.get('/cgi-bin/token', {
                    params: {
                        grant_type: 'client_credential',
                        appid: CONFIG.appId,
                        secret: CONFIG.appSecret
                    }
                });
                return response.data.access_token;
            } catch (error) {
                console.error('获取访问令牌失败:', error);
                throw error;
            }
        },


        // 查询云数据库
        async queryCloudDatabase() {
            try {
                const accessToken = await this.getAccessToken();
                const query = {
                    env: CONFIG.env,
                    query: `db.collection('categories').skip(${(this.queryParam.page - 1) * this.queryParam.limit}).limit(${this.queryParam.limit}).get()`,
                    totalQuery: "db.collection('categories').count()"
                };
                const [dataRes, countRes] = await Promise.all([
                    axios.post(`/wechat-api/tcb/databasequery?access_token=${accessToken}`, { env: CONFIG.env, query: query.query }),
                    axios.post(`/wechat-api/tcb/databasecount?access_token=${accessToken}`, { env: CONFIG.env, query: query.totalQuery })
                ]);
                const newData = dataRes.data.data ? dataRes.data.data.map(item => JSON.parse(item)) : [];
                if (JSON.stringify(newData) !== JSON.stringify(this.goodsData)) {
                    this.goodsData = newData;
                    this.total = countRes.data.count;
                }
                return dataRes.data;
            } catch (error) {
                console.error('查询云数据库失败:', error);
                throw error;
            }
        }
    },
    mounted() {
        // 首次加载数据
        this.queryCloudDatabase();
        // 启动定时器（每~秒请求一次）
        this.timer = setInterval(() => {
            this.queryCloudDatabase().catch(() => { });
        }, 10000);
    },
    beforeUnmount() {
        // 组件卸载时清除定时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}
</script>
<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}
th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}
th {
    background-color: #f2f2f2;
}
</style>
