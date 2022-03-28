export interface User {
    id: string;
    name: string
    phoneNumber: string
    banned: boolean
    approved: boolean
    blocked_ids: string[]
}