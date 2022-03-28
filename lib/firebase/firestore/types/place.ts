export interface Place {
    id: string;
    name: string
    phoneNumber: string
    banned: boolean
    approved: boolean
    photoUrl: string
    location: {
        latitude: number,
        longitude: number
    }
    city: string
    district: string
    active_donations: object
}

export const getSumOfPlaceDonations = (place: Place) => {
    return Object.values(place.active_donations).reduce((acc, val) => acc + val, 0)
}