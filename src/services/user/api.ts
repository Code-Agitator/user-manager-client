import {http} from '@/util/http'
import {GetUserParam} from "@/services/user/type/request";
import {UserInfo, UserInfoHistory} from "@/services/user/type/response";
import {BasePageParam, ResponsePage} from "~/types/http";

export const searchUserPage = (param: GetUserParam) => http.get<GetUserParam, ResponsePage<UserInfo>>("/api/user/page", param)
export const addUser = (param: UserInfo) => http.post<UserInfo, void>("/api/user/", param)
export const updateUser = (param: UserInfo) => http.put<UserInfo, void>("/api/user/", param)
export const deleteUser = (ids: number []) => http.put<{ ids: number[] }, void>("/api/user/delete", {ids})
export const revoke = () => http.put<void, void>('/api/user/revoke')
export const getHistory = (id: number, param: BasePageParam) => http.get<BasePageParam, ResponsePage<UserInfoHistory>>(`/api/user/${id}/history`, param)
export const revokeTo = (id: number) => http.put<number, void>(`/api/user/revoke/${id}/history`)


