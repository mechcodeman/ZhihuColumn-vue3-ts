import { h, render } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (message: string, type: MessageType, timeout?: number) => {
  const messageVnode = h(Message, { // 原来的app是应用程序，对于一个组件来用力过猛，换做应用h函数创建vnode
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  render(messageVnode, mountNode) // 利用render函数将创建的vnode渲染到特定节点上
  const destroy = () => {
    render(null, mountNode)
    document.body.removeChild(mountNode)
  }
  if (timeout) {
    setTimeout(() => {
      destroy()
    }, timeout)
  }
  return {
    destroy
  }
}

export default createMessage
