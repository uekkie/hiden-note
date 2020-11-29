import { firebase } from '@/plugins/firebase'

export interface IUser {
  id: string
  email: string
  displayName: string
  photoURL: string
}
export class User implements IUser {
  id: string = ''
  email: string = ''
  displayName: string = ''
  photoURL: string = ''
  constructor({
    id = '',
    email = '',
    displayName = '',
    photoURL = '',
  }: Partial<IUser>) {
    Object.assign(this, {
      id,
      email,
      displayName,
      photoURL,
    })
  }
}

export const userConverter = {
  toFirestore(user: User): firebase.firestore.DocumentData {
    return {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): User {
    const user = snapshot.data(options)
    if (!isValid(user)) {
      console.error(user)
      alert('invalid user')
      throw new Error('invalid user')
    }
    return new User({
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    })
  },
}

const isValid = (user: any): user is User => {
  if (!(user.uid && typeof user.uid === 'string')) {
    return false
  }
  if (!(user.email && typeof user.email === 'string')) {
    return false
  }
  if (!(user.displayName && typeof user.displayName === 'string')) {
    return false
  }
  if (!(user.photoURL && typeof user.photoURL === 'string')) {
    return false
  }
  return true
}
