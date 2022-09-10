import axios from 'axios'
import { createStore, Commit } from 'vuex'
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
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}
export interface GlobalDataProps { // 定义数据类型并导出为全局类型
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => { // payload就是需要传的data
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data // 此处返回的应该是一个Promise对象，因为async返回的就是Promise
}
const store = createStore<GlobalDataProps>({
  state: {
    token: '',
    loading: false,
    columns: [], // 置空等待后端传入数据,下同
    posts: [],
    user: { isLogin: false, name: '低调的viking', columnId: 1 }
  },
  mutations: {
    /* login(state) { // 使用mutations修改数据，实现点击页面上的登录时能够发生数据的变化并且触发页面的变化
      state.user = { isLogin: true, name: '低调的viking' }
    }, */
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    },
    setLoading(state, status) {
      state.loading = status
    },
    login(state, rawData) {
      state.token = rawData.data.token
    }
  },
  actions: {
    // 自定义函数实现重复性的请求功能
    fetchColumns({ commit }) {
      getAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn({ commit }, cid) {
      getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    }
  },
  getters: { // 同计算属性一样，getter可以根据他的依赖值缓存起来，当依赖值发生改变时才会重新计算
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
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
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    }
  }
})

export default store
