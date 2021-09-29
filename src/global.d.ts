import { MsgType } from 'src/logic/constant'

declare const __DEV__: boolean

declare module '*.vue' {
  const component: any
  export default component
}

type TMsg = MsgType.HELP
export interface IMsg {
  type: TMsg
}
