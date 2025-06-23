<template>
    <!-- 表格展示 -->
    <div>
        <table v-if="goodsData.length > 0">
            <thead>
                <tr>
                    <th>商品ID</th>
                    <th>轮播图顺序</th>
                    <th>图片二进制</th>
                    <th>编辑/删除</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in goodsData" :key="index">
                    <td>{{ item._id }}</td>
                    <td>{{ item.sequence }}</td>
                    <td>{{ item.binary }}</td>
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
    name: 'lunBotu',
    data() {
        return {
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
                    query: `db.collection('lunbotu').skip(${(this.queryParam.page - 1) * this.queryParam.limit}).limit(${this.queryParam.limit}).get()`,
                    totalQuery: "db.collection('lunbotu').count()"
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
        this.queryCloudDatabase();
        this.timer = setInterval(() => {
            this.queryCloudDatabase().catch(() => { });
        }, 10000);
    },
    beforeUnmount() {
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
