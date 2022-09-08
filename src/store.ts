import axios from 'axios'
import { createStore } from 'vuex'
import { testPosts } from './testData'
interface UserProps { // 定义用户信息对象接口
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}
interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  columnId: number;
}
export interface GlobalDataProps { // 定义数据类型并导出为全局类型
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: [], // 置空等待后端传入数据
    posts: testPosts,
    user: { isLogin: true, name: '低调的viking', columnId: 1 }
  },
  mutations: {
    login(state) { // 使用mutations修改数据，实现点击页面上的登录时能够发生数据的变化并且触发页面的变化
      state.user = { isLogin: true, name: '低调的viking' }
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    }
  },
  actions: {
    fetchColumns(context) { // actions函数接收一个与store实例具有相同方法和属性的context对象
      axios.get('/columns').then(resp => {
        context.commit('fetchColumns', resp.data) // 通过context的commit方法来调用一个mutation，传入参数请求结果的data，利用mutation动态监视数据
      })
    }
  },
  getters: { // 同计算属性一样，getter可以根据他的依赖值缓存起来，当依赖值发生改变时才会重新计算
    getColumnById: (state) => () => {
      return state.columns
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
