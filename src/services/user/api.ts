import {http} from '@/util/http'
import {GetUserParam} from "@/services/user/type/request";
import {UserInfo, UserInfoHistory} from "@/services/user/type/response";
import {BasePageParam, ResponsePage} from "~/types/http";

export const searchUserPage = (param: GetUserParam) => http.get<GetUserParam, ResponsePage<UserInfo>>("/service/user/page", param)
export const addUser = (param: UserInfo) => http.post<UserInfo, void>("/service/user/", param)
export const updateUser = (param: UserInfo) => http.put<UserInfo, void>("/service/user/", param)
export const deleteUser = (ids: number []) => http.put<{ ids: number[] }, void>("/service/user/delete", {ids})
export const revoke = () => http.put<void, void>('/service/user/revoke')
export const getHistory = (id: number, param: BasePageParam) => http.get<BasePageParam, ResponsePage<UserInfoHistory>>(`/service/user/${id}/history`, param)
export const revokeTo = (id: number) => http.put<number, void>(`/service/user/revoke/${id}/history`)


