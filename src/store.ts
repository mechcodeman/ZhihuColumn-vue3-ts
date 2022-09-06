import { createStore } from 'vuex'
import { testData, testPosts, ColumnProps, PostProps } from './testData'
export { ColumnProps, PostProps } from './testData'
interface UserProps { // 定义用户信息对象接口
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
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
    user: { isLogin: false, name: '低调的viking', columnId: 1 }
  },
  mutations: {
    login(state) { // 使用mutations修改数据，实现点击页面上的登录时能够发生数据的变化并且触发页面的变化
      state.user = { isLogin: true, name: '低调的viking' }
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
    }
  },
  getters: { // 同计算属性一样，getter可以根据他的依赖值缓存起来，当依赖值发生改变时才会重新计算
    biggerColumnsLen(state) {
      return state.columns.filter(c => c.id > 2).length
    },
    getColumnById: (state) => (id: number) => {
      return state.columns.find(c => c.id === id)
    },
    // 这个 getter 的特殊之处在于要传参数进去, 对于这种 getter 我们需要返回一个对应的函数，其实就是假如有参数就要返回一个函数。然后调用的时候可以传入参数。对比以下两个程序段以理解
    /*
      // 不需要参数，直接返回结果
        getColumns: (state) => {
            return state.columns.data
        },
      // 需要参数，前面和上面是一样的，可以拿到 state
        getColumnById: (state) => (id: string) => {
            return ...
        },
    */
    getPostsByCid: (state) => (cid: number) => {
      return state.posts.filter(post => post.columnId === cid)
    }
  }
})

export default store
