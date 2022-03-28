
export interface Request {
    amount: number
    place_id: string
    user_id: string
    type: RequestType
}

enum RequestType {
    give = 0,
    take = 1,
}