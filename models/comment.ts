import firebase from 'firebase'
import { DateTime } from 'luxon'
export const FieldValue = firebase.firestore.FieldValue

export interface INoteComment {
  id: string
  content: string
  userId: string
  noteId: string
  createdAt: firebase.firestore.Timestamp
}
export class NoteComment implements INoteComment {
  id: string = ''
  content: string = ''
  userId: string = ''
  noteId: string = ''
  createdAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp

  constructor({
    id = '',
    content = '',
    userId = '',
    noteId = '',
    createdAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
  }: Partial<INoteComment>) {
    Object.assign(this, {
      id,
      content,
      userId,
      noteId,
      createdAt,
    })
  }

  createdAtString() {
    const dt = DateTime.fromJSDate(this.createdAt.toDate())
    return dt.toFormat('yyyy-MM-dd HH:mm')
  }
}
