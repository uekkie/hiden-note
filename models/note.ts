import firebase from 'firebase'
import { FieldValue } from '@/plugins/firebase'

export interface INote {
  id: string
  title: string
  content: string
  tags: string[]
  userId: string
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}
export class Note implements INote {
  id: string = ''
  title: string = ''
  content: string = ''
  tags: string[] = []
  userId: string = ''
  createdAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp
  updatedAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp

  constructor({
    id = '',
    title = '',
    content = '',
    tags = [],
    userId = '',
    createdAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    updatedAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
  }: Partial<INote>) {
    Object.assign(this, {
      id,
      title,
      content,
      tags,
      userId,
      createdAt,
      updatedAt,
    })
  }
}
export class NoteHistory {
  constructor(
    public userRef: firebase.firestore.DocumentReference,
    public title: string,
    public content: string,
    public createdAt?: Date
  ) {
    this.userRef = userRef
    this.title = title
    this.content = content
    this.createdAt = createdAt
  }
}

export const noteConverter = {
  toFirestore(note: Note): firebase.firestore.DocumentData {
    return {
      userId: note.userId,
      title: note.title,
      content: note.content,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Note {
    const note = snapshot.data(options)
    if (!isValid(note)) {
      console.error(note)
      alert('invalid note')
      throw new Error('invalid note')
    }
    return new Note({
      title: note.title,
      content: note.content,
      tags: note.tags,
      userId: note.userId,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    })
  },
}

const isValid = (note: any): note is Note => {
  if (!(note.title && typeof note.title === 'string')) {
    return false
  }
  if (!(note.content && typeof note.content === 'string')) {
    return false
  }
  return true
}
