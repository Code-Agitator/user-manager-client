import type {AxiosRequestConfig} from 'axios'
import axios from 'axios'
// @ts-ignore
import qs from 'qs'

import {reqReject, reqResolve, resReject, resResolve} from './interceptors'
import type {IResponseData} from '~/types/http'

/**
 * 初始化axios
 * @param options
 */
export function createAxios(options = {}) {
    const defaultOptions = {
        baseURL: import.meta.env.VITE_BASE_API,
        timeout: 12000,
    }
    const service = axios.create({
        ...defaultOptions,
        ...options,
    })
    service.interceptors.request.use(reqResolve, reqReject, options)
    service.interceptors.response.use(resResolve, resReject)
    return service
}

const instance = createAxios()


/**
 * 封装原生请求
 */
const httpNative = {
    get: <P, R>(url: string, param?: P, config?: AxiosRequestConfig): Promise<R> => new Promise<R>((resolve, reject) => {
        const paramStr = qs.stringify(param)
        instance.get(`${url}?${paramStr}`, config).then((res) => {
            res.data.success ? resolve(res.data as R) : reject(res)
        }).catch(err => reject(err))
    }),
    delete: <P, R>(url: string, param?: P, config?: AxiosRequestConfig): Promise<R> => new Promise<R>((resolve, reject) => {
        const paramStr = qs.stringify(param)
        instance.delete(`${url}?${paramStr}`, config).then((res) => {
            res.data.success ? resolve(res.data as R) : reject(res)
        }).catch(err => reject(err))
    }),
    post: <P, R>(url: string, data?: P, config?: AxiosRequestConfig): Promise<R> => new Promise<R>((resolve, reject) => {
        instance.post(url, data, config).then((res) => {
            res.data.success ? resolve(res.data as R) : reject(res)
        }).catch(err => reject(err))
    }),
    put: <P, R>(url: string, data?: P, config?: AxiosRequestConfig): Promise<R> => new Promise<R>((resolve, reject) => {
        instance.put(url, data, config).then((res) => {
            res.data.success ? resolve(res.data as R) : reject(res)
        }).catch(err => reject(err))
    }),
}
/**
 * 封装统一响应体
 */
const httpPack = {
    get: <P, R>(url: string, param?: P, config?: AxiosRequestConfig): Promise<IResponseData<R>> => httpNative.get<P, IResponseData<R>>(url, param, config),
    delete: <P, R>(url: string, param?: P, config?: AxiosRequestConfig): Promise<IResponseData<R>> => httpNative.delete<P, IResponseData<R>>(url, param, config),
    post: <P, R>(url: string, data?: P, config?: AxiosRequestConfig): Promise<IResponseData<R>> => httpNative.post<P, IResponseData<R>>(url, data, config),
    put: <P, R>(url: string, data?: P, config?: AxiosRequestConfig): Promise<IResponseData<R>> => httpNative.put<P, IResponseData<R>>(url, data, config),
}

/**
 * 包装响应体后的http请求
 */
export const http = httpPack
/**
 * 原生不包装的http请求
 */
export const httpNa = httpNative
