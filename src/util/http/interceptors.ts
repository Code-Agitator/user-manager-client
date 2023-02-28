import type {AxiosError, InternalAxiosRequestConfig, AxiosResponse} from 'axios'


export function reqResolve(config: InternalAxiosRequestConfig) {
    // 请求拦截
    return config
}

export function reqReject(error: AxiosError) {
    // 请求异常拦截
    return Promise.reject(error)
}

export function resResolve(response: AxiosResponse) {

    // 响应拦截
    return response
}

export function resReject(error: AxiosError) {

    return Promise.resolve(error)
}
