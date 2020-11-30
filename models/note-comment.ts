import firebase from 'firebase'
import { FieldValue } from '@/plugins/firebase'

export interface INoteComment {
  id: string
  content: string
  userId: string
  createdAt: firebase.firestore.Timestamp
}
export class NoteComment implements INoteComment {
  id: string = ''
  content: string = ''
  userId: string = ''
  createdAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp

  constructor({
    id = '',
    content = '',
    userId = '',
    createdAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
  }: Partial<INoteComment>) {
    Object.assign(this, {
      id,
      content,
      userId,
      createdAt,
    })
  }
}

export const commentConverter = {
  toFirestore(comment: NoteComment): firebase.firestore.DocumentData {
    return {
      userId: comment.userId,
      content: comment.content,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): NoteComment {
    const comment = snapshot.data(options)
    if (!isValid(comment)) {
      console.error(comment)
      alert('invalid comment')
      throw new Error('invalid comment')
    }
    return new NoteComment({
      content: comment.content,
      userId: comment.userId,
      createdAt: comment.createdAt,
    })
  },
}

const isValid = (comment: any): comment is NoteComment => {
  if (!(comment.content && typeof comment.content === 'string')) {
    return false
  }
  if (!(comment.userId && typeof comment.userId === 'string')) {
    return false
  }
  return true
}
