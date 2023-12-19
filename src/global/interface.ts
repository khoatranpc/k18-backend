import { PositionTe, ROLE } from "./enum"

export interface Obj {
    [k: string]: {} | undefined | unknown
}
export interface JwtVerify {
    role: ROLE,
    accId: string,
    position?: PositionTe,
    userId?: string
}