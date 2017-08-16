import Vue from 'vue'
import Pagenation from '@/components/pagenation'

/**
 * 分页组件单元测试
 * 每个describe块应该包括一个或多个it块，即测试用例（test case）
 * 每个describe块应该包括一个或多个it块，即测试用例（test case）
 */
describe('pagenation.vue', () => {
    it('should render correct pagenation', () => {
        // 获得组件实例
        const Constructor = Vue.extend(Pagenation)
        // 将组件挂载到DOM上
        const vm = new Constructor().$mount()

        //断言：DOM中 对应的 querySelector('.className') 元素中的 内容为 equal()的内容
        expect(vm.$el.querySelector('.vue-pagebar a').click())
    })
})
