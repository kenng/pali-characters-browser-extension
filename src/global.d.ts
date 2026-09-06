import { MsgType } from './logic/constant'

declare const __DEV__: boolean

declare module '*.vue' {
  const component: any
  export default component
}

export interface IMsg {
  type: string
  char?: string
  action?: string
}
