<template>
    <div class="components-main">
        <h2>{{ titleMsg }}</h2>
        <tables
            :tableData="tableData">
        </tables>
        <pagenation @getTableData="getTableData"
                    :totalpage="totalPage"
                    :curpage="curPage"
                    :pageSize="pageSize">
        </pagenation>
    </div>
</template>

<script>
    import axios from 'axios'
    import tables from './table.vue'
    import pagenation from './pagenation.vue'

    export default {
        name: 'index',
        components: {tables, pagenation},
        data () {
            return {
                titleMsg: 'VUE 表格开发',
                tableData: '',
                totalPage: 18,
                curPage: 1,
                pageSize: 10,
                viewHeiAllNum: '',
                windowHeight: ''
            }
        },
        created() {
            // 初始化的分页数据
            let initPage = {
                cur_page: this.curPage,
                pageSize: Math.floor((document.documentElement.clientHeight - (74+90))/36) // 也可设置默认值 15
            };

            // 检测浏览器高度
            this.windowResize();

            // 获取本地测试数据
            this.getTableData(initPage);
        },
        methods: {
            /**
             * 浏览器窗口的resize
             */
            windowResize() {
                let resizeTimer = null;
                let self = this;

                window.onresize = function () {
                    if (resizeTimer) {
                        clearTimeout(resizeTimer)
                    }
                    resizeTimer = setTimeout(function () {
                        self.windowHeight = document.documentElement.clientHeight
                    }, 400);
                }
            },
            /**
             * 获取本地测试数据
             * @param _data
             */
            getTableData(_data) {
                let self = this;
                let arrLen;
                let newArr = [];
                let newArrStartIndex;
                let allArrNum;
                axios({
                    method: 'get',
                    url: '/static/json/test.json',
                    data: _data
                }).then((res) => {
                    // 计算当前页需要的数据
                    newArrStartIndex = (_data.cur_page - 1) * _data.pageSize;
                    newArr.push(res.data[0]);  // 表头数据

                    if ((newArrStartIndex + _data.pageSize) > res.data.length) {
                        allArrNum = res.data.length - 1;
                    } else {
                        allArrNum = newArrStartIndex + _data.pageSize;
                    }
                    for (let i = newArrStartIndex + 1, len = allArrNum; i <= len; i++) {
                        // 表格内容数据
                        newArr.push(res.data[i]);
                    }
                    self.tableData = newArr;

                    self.totalPage = Math.ceil((res.data.length - 1)/_data.pageSize);
                    self.curPage = _data.cur_page;
                    self.pageSize = _data.pageSize;
                }).catch(err => {
                    console.log('接口失败' + err)
                    self.tableData = []
                });
            },
            /**
             * 计算当前可是高度能放的数据条数
             * @returns {*}
             */
            getWindowViewHeight() {
                let reg = /^[0-9]*$/;
                let tableRowDom = document.getElementById('table-row');
                let tableRowHeiStr;
                let tableRowHei;

                this.windowHeight = document.documentElement.clientHeight;
                tableRowHeiStr = tableRowDom.currentStyle || document.defaultView.getComputedStyle(tableRowDom,null);

                // 得到当前表格的行高
                if (tableRowHeiStr.height && tableRowHeiStr.height.length) {
                    let numIndex = tableRowHeiStr.height.indexOf('p');
                    tableRowHei = parseInt(tableRowHeiStr.height.substring(0, numIndex));
                } else {
                    tableRowHei = 36;
                }

                // 计算当前浏览器可视宽度可以放下多少行数据  (74 + 90) -- 头部和底部固定高度
                this.viewHeiAllNum = Math.floor((this.windowHeight - (74+90))/tableRowHei);
            }
        },
        watch: {
            /**
             * 监听浏览器高度
             * @param newVal
             * @param oldVal
             */
            windowHeight(newVal, oldVal) {
                let initPage = {};

                this.getWindowViewHeight();

                initPage = {
                    cur_page: this.curPage,
                    pageSize: this.viewHeiAllNum
                };

                this.getTableData(initPage);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .components-main {
        width: 1190px;
        margin: 0 auto;
    }
</style>
