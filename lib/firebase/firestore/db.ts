// Get the imports
import { initializeApp } from 'firebase/app'
import { getFirestore, CollectionReference, collection, DocumentData } from 'firebase/firestore'

// Export firestore incase we need to access it directly
export const firestore = getFirestore()

// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) => {
    return collection(firestore, collectionName) as CollectionReference<T>
}

// Import all your model types
import { User } from './types/user'
import { Place } from './types/place'
import { Report } from './types/report'
import { Request } from './types/request'


// export all your collections
export const usersCol = createCollection<User>('users')
export const placesCol = createCollection<Place>('places')
export const reportsCol = createCollection<Report>('reports')
export const requestsCol = createCollection<Request>('requests')