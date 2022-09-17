import axios from 'axios'
import { createStore, Commit } from 'vuex'
// eslint-disable-next-line @typescript-eslint/ban-types
export interface ResponseType<P = Record<string, unknown>> {
  code: number;
  msg: string;
  data: P;
}
export interface ImageProps {
  fitUrl?: string;
  _id?: string;
  url?: string;
  createdAt?: string;
}
export interface UserProps { // 定义用户信息对象接口
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalDataProps { // 定义数据类型并导出为全局类型
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => { // payload就是需要传的data
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data // 此处返回的应该是一个Promise对象，因为async返回的就是Promise
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [], // 置空等待后端传入数据,下同
    posts: [],
    user: { isLogin: false }
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
      state.posts = [rawData.data]
    },
    fetchPost(state, rawData) {
      state.posts = [rawData.data]
    },
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    login(state, rawData) {
      const { token } = rawData.data // 获取token字符串
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}` // 通过axios提供的方法为每次请求添加指定的响应头
    },
    logout(state) {
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    // 自定义函数实现重复性的请求功能
    fetchColumns({ commit }) {
      return getAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn({ commit }, cid) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost({ commit }, id) {
      return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
    },
    fetchCurrentUser({ commit }) { // 发送请求获取用户的信息（已设置好token响应头）
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    createPost({ commit }, payload) { // 创建文章异步请求
      return postAndCommit('/posts', 'createPost', commit, payload)
    },
    loginAndFetch({ dispatch }, loginData) { // 组合式异步action请求，因为action返回的是一个promise，所以用then可以再组合一个异步请求action
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
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
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.find(post => post._id === id)
    }
  }
})

export default store
