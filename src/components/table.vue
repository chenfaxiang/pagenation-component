<template>
    <div class="table-main">
        <table cellpadding="0" cellspacing="0">
            <tr class="table-row"
                v-for="(itemList, index) in tableData"
                :key="itemList.id"
                id="table-row">
                <th class="table-th"
                    v-if="index == 0"
                    v-for="item in itemList">
                    {{ item }}
                </th>
                <td class="table-td"
                    v-else>
                    {{ item }}
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'table',
        data () {
            return {

            }
        },
        props: ['tableData'],
        methods: {}
    }
</script>

<style scoped>
    .table-main {
        width: 100%;
    }
    .table-main table {
        width: 100%;
        border: 1px solid #ccc;
    }
    .table-row {
        width: 100%;
    }
    .table-row:nth-child(odd){
        background: #e5edf7;
    }
    .table-th,
    .table-td {
        width: 7%;
        font-size: 14px;
        color: #000;
        line-height: 36px;
        text-align: center;
    }
</style>
