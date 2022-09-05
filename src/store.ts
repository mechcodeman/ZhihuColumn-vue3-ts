import { createStore } from 'vuex'
import { testData, testPosts, ColumnProps, PostProps } from './testData'
interface UserProps { // 定义用户信息对象接口
  isLogin: boolean;
  name?: string;
  id?: number
}
export interface GlobalDataProps { // 定义数据类型并导出为全局类型
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: testData, // testData.ts中导出的数据模块，下同
    posts: testPosts,
    user: { isLogin: false }
  },
  mutations: {
    login(state) { // 使用mutations修改数据，实现点击页面上的登录时能够发生数据的变化并且触发页面的变化
      state.user = { ...state.user, isLogin: true, name: '低调的viking' }
    }
  }
})

export default store
