/**
 * UserInfo
 */
export interface UserInfo {
    /**
     * 详细地址
     */
    address?: string;
    /**
     * 年龄
     */
    age?: number;
    /**
     * 创建时间
     */
    createdTime?: Date;
    /**
     * 逻辑删除
     */
    deleted?: number;
    id?: number;
    /**
     * 姓名
     */
    name?: string;
    /**
     * 联系电话
     */
    phone?: string;
    /**
     * 性别 1-男 0-女
     */
    sex?: boolean;

    areaCode?: string;
}


/**
 * UserInfoHistory
 */
export interface UserInfoHistory {
    /**
     * 地址
     */
    address?: string;
    /**
     * 年龄
     */
    age?: number;
    /**
     * 地址编码
     */
    areaCode?: string;
    /**
     * 创建时间
     */
    createdTime?: Date;
    id?: number;
    /**
     * 名称
     */
    name?: string;
    /**
     * 操作类型
     */
    operateType?: string;
    /**
     * 手机
     */
    phone?: string;
    /**
     * 用户id
     */
    userId?: number;
}