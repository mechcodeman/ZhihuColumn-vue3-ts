import axios, { AxiosRequestConfig } from 'axios'
import { createStore, Commit } from 'vuex'
import { arrToObj, objToArr } from './helper'
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
  author?: string | UserProps;
  isHTML?: boolean;
}
interface ListProps<P> {
  [id: string]: P;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalDataProps { // 定义数据类型并导出为全局类型
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ListProps<ColumnProps>;
  posts: ListProps<PostProps>;
  user: UserProps;
}
const asyncAndCommit = async(url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }) => {
  const { data } = await axios(url, config)
  commit(mutationName, data)
  return data // 此处返回的应该是一个Promise对象，因为async返回的就是Promise
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: {}, // 置空等待后端传入数据,下同
    posts: {},
    user: { isLogin: false }
  },
  mutations: {
    /* login(state) { // 使用mutations修改数据，实现点击页面上的登录时能够发生数据的变化并且触发页面的变化
      state.user = { isLogin: true, name: '低调的viking' }
    }, */
    createPost(state, newPost) {
      state.posts[newPost._id] = newPost
    },
    fetchColumns(state, rawData) {
      state.columns = arrToObj(rawData.data.list)
    },
    fetchColumn(state, rawData) {
      state.columns[rawData.data._id] = rawData.data
    },
    fetchPosts(state, rawData) {
      state.posts = arrToObj(rawData.data.list)
    },
    fetchPost(state, rawData) {
      state.posts[rawData.data._id] = rawData.data
    },
    deletePost(state, { data }) {
      delete state.posts[data._id]
    },
    updatePost(state, { data }) {
      state.posts[data._id] = data
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
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    // 自定义函数实现重复性的请求功能
    fetchColumns({ commit }) {
      return asyncAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn({ commit }, cid) {
      return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'fetchPost', commit)
    },
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    fetchCurrentUser({ commit }) { // 发送请求获取用户的信息（已设置好token响应头）
      return asyncAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    login({ commit }, payload) {
      return asyncAndCommit('/user/login', 'login', commit, { method: 'post', data: payload })
    },
    createPost({ commit }, payload) { // 创建文章异步请求
      return asyncAndCommit('/posts', 'createPost', commit, { method: 'post', data: payload })
    },
    deletePost({ commit }, id) { // 创建文章异步请求
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
    },
    loginAndFetch({ dispatch }, loginData) { // 组合式异步action请求，因为action返回的是一个promise，所以用then可以再组合一个异步请求action
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: { // 同计算属性一样，getter可以根据他的依赖值缓存起来，当依赖值发生改变时才会重新计算
    getColumnById: (state) => (id: string) => {
      return state.columns[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts[id]
    },
    getColumns: (state) => {
      return objToArr(state.columns)
    }
  }
})

export default store
