<template>
    <div class="vue-pagebar">
        <ul class="pagenation">
            <li v-for="(item, index) in items"
                :class="{'active' : item.isCurrent}">
                <a  :class="{'disabled' : item.disabled}"
                    @click="pageJump(item.pageNum, item.disabled)">
                    {{ item.title }}
                </a>
            </li>
        </ul>
        <p class="page-jump">
            <span class="page-jump-text">前往</span>
            <input class="page-jump-input"
                   id="page-jump-input"
                   type="text"
                   v-model="pageJumpVal"
                   @keyup.enter="pageJump(0,false,this)">
            <span class="page-jump-text">页</span>
        </p>
    </div>
</template>
<script>
    import axios from 'axios'
    import TipsDialog from './lib/tips-dialog'

    const EXTEND_SIZE = 4;

    export default {
        name: 'pagenation',
        props: {
            totalpage: {},
            pageSize: {
                default: 10
            },
            curpage: {
                default: 1
            }
        },
        data () {
            return {
                pageJumpVal: '',
                viewHeiAllNum: ''
            }
        },
        created() {
            this.pageJumpVal = this.curpage
        },
        computed: {
            items() {
                let me = this;
                let curpage = me.curpage;
                let lastPage = me.totalpage;

                let items = [];

                items.push({
                    title: '«',
                    disabled: curpage === 1,
                    pageNum: curpage - 1
                });

                // 往前扩展
                let prevExtendItems = [];
                prevExtendItems = this.extendPre(EXTEND_SIZE, curpage);

                // 当前页距离之前有四个或大于四个 就出现一个省略号 && prevExtendItems[0].pageNum !== 1
                if (prevExtendItems.length === EXTEND_SIZE) {
                    // 向前扩展两个数字
                    let preExtNum;
                    prevExtendItems = [];
                    if (lastPage - curpage >= 4) {
                        preExtNum = EXTEND_SIZE - 3;
                    } else if (lastPage - curpage < 4) {
                        preExtNum = EXTEND_SIZE - (lastPage - curpage);
                    }
                    prevExtendItems = this.extendPre(preExtNum, curpage);

                    // 向数组前面插入一个省略号
                    prevExtendItems.unshift({
                        title: '...',
                        disabled: true,
                        pageNum: curpage
                    });
                    prevExtendItems.unshift({
                        title: 1,
                        disabled: false,
                        pageNum: 1
                    });
                }
                // 第二个数组融合进第一个数组
                Array.prototype.push.apply(items, prevExtendItems);

                // 当前页加入数组
                items.push({
                    title: curpage,
                    disabled: true,
                    pageNum: curpage,
                    isCurrent: true
                });

                // 往后扩展
                let nextExtendItems = [];
                let nextExtendNum;
                if (curpage > 4 && (lastPage - curpage) >= 4) {
                    nextExtendNum = EXTEND_SIZE - 3;
                } else if (curpage < 5) {
                    nextExtendNum = 5 - curpage;
                } else {
                    nextExtendNum = EXTEND_SIZE;
                }
                nextExtendItems = this.extendNext(nextExtendNum, curpage, lastPage);

                if (nextExtendItems.length === nextExtendNum && nextExtendItems[nextExtendNum - 1].pageNum !== lastPage) {
                    nextExtendItems.push({
                        title: '...',
                        disabled: true,
                        pagNum:curpage
                    });
                    nextExtendItems.push({
                        title: lastPage,
                        disabled: false,
                        pageNum: lastPage
                    });
                }
                Array.prototype.push.apply(items, nextExtendItems);

                items.push({
                    title: '»',
                    disabled: curpage === lastPage,
                    pageNum: curpage + 1
                });

                return items;
            }
        },
        methods: {
            /**
             * 分页往前扩展
             * @param _extendSize 分页从当前页向前扩展的长度
             * @param _curpage    当前页
             * @returns {Array}
             */
            extendPre(_extendSize, _curpage) {
                let prevExtendArr = [];
                for (let i = 0; i < _extendSize; i++) {
                    let pageNum = _curpage - i - 1;

                    if (pageNum < 1) {
                        break;
                    }
                    prevExtendArr.push({
                        title: pageNum,
                        disabled: false,
                        pageNum: pageNum
                    });
                }
                prevExtendArr.reverse();

                return prevExtendArr;
            },
            /**
             * 分页向后扩展
             * @param _extendSize 分页从当前页向前扩展的长度
             * @param _curpage    分页当前页
             * @param _lastPage   最后一页的数字
             * @returns {Array}
             */
            extendNext(_extendSize, _curpage, _lastPage) {
                let nextExtendArr = [];
                for (let i = 0; i < _extendSize; i++) {
                    let pageNum = _curpage + i + 1;
                    if (pageNum > _lastPage) {
                        break;
                    }
                    nextExtendArr.push({
                        title: pageNum,
                        disabled: false,
                        pageNum: pageNum
                    });
                }

                return nextExtendArr;
            },
            /**
             * 计算当前可是高度能放的数据条数
             * @returns {*}
             */
            windowViewHeight() {
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
            },
            /**
             * 分页获取数据
             * @param pageNum
             * @param disabled
             * @param even    enter事件的this
             * @returns {boolean}
             */
            pageJump(pageNum, disabled, even) {
                let me = this;
                let data = {};
                let jumpPageNum = pageNum;
                let jumpInput = '';

                // 提供给监听函数
                me.pageJumpVal = pageNum;

                // 当前点击的是激活页码，直接返回
                if(disabled){
                    return false;
                }

                // 跳转前往第几页
                if (pageNum == 0) {
                    jumpInput = even.document.getElementById('page-jump-input');
                    jumpPageNum = parseInt(jumpInput.value);
                    me.pageJumpVal = jumpPageNum;
                }

                // 重新获取当前需要几条数据
                this.windowViewHeight();

                data = {
                    cur_page: jumpPageNum,
                    pageSize: this.viewHeiAllNum
                };

                // 触发父组件的获取数据事件
                this.$emit('getTableData', data);

            }
        },
        watch: {
            pageJumpVal(newVal, oldVal) {
                let reg = /^[0-9]*$/;
                let isInterger = reg.test(newVal) ? true : false;

                if (!newVal) {
                    this.pageJumpVal = oldVal;
                    return false;
                }

                if (isInterger && (newVal > this.totalpage)) {
                    // 不能输入大于总页数的数值
                    this.pageJumpVal = this.totalpage
                } else if (isInterger && (newVal < 1)) {
                    // 不能输入小于0的数字
                    this.pageJumpVal = 1
                } else if (!isInterger) {
                    // 不能输入字符串
                    this.pageJumpVal = 1

                    if (!document.getElementsByClassName('cfx-dialog').length) {
                        // 消息提示框 组件调用
                        var Dialog = new TipsDialog({
                            style: 'warn',
                            width: 230,
                            title: '警告框',
                            isShowTitle: true,
                            content: '请问你有什么不满意吗',
                            comfirmBtnText: '哟，是的',
                            cancelBtnText: '放弃吧',
                            themeClass: 'k-a',
                            onConfirm: function () {
                                alert('点击了确定进行回调')
                            },
                            onCancel: function () {
                                alert('点击了取消进行回调')
                            }
                        }).show();
                    }
                }
            }
        }
    };
</script>
<style scoped>
    .vue-pagebar {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        float: right;
    }
    .pagenation {
        width: auto;
        list-style-type: none;
        margin: 20px 0 40px 0;
    }
    .pagenation li,
    .pagenation li:hover {
        float: left;
        display: inline-block;
        width: 28px;
        height: 28px;
        font-size: 14px;
        color: #000;
        line-height: 28px;
        text-align: center;
        padding: 0 4px;
        border: 1px solid #d1dbe5;
        border-left: 0;
        padding-left: 3px;
        cursor: pointer;
    }
    .pagenation li:hover {
        background: #e5edf7;
    }
    .pagenation .active {
        background: #00adf7;
        color: #fff;
    }
    .pagenation li:first-child {
        border-left: 1px solid #d1dbe5;
    }
    .page-jump {
        height: 30px;
        margin-top: 6px;
        margin-left: 10px;
    }
    .page-jump-text {
        font-size: 14px;
        color: #000;
    }
    .page-jump-input {
        width: 25px;
        height: 20px;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        padding: 0 2px;
    }
    .vue-pagebar a {
        display: inline-block;
        width: 28px;
        height: 28px;
        cursor: pointer;
    }

    .vue-pagebar select {
        margin: 0 10px 0 0;
        width: auto;
    }
</style>