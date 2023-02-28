import {MessageApi} from 'naive-ui'

declare global {
    interface Window {
        $message: MessageApi
    }
}
export {}
