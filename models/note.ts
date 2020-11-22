import firebase from 'firebase'
export default class Note {
  constructor(
    public id: string,
    public userRef: firebase.firestore.DocumentReference,
    public title: string,
    public content: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {
    this.id = id
    this.userRef = userRef
    this.title = title
    this.content = content
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  formatDate(): string {
    return (
      this.updatedAt?.toDateString() ||
      this.createdAt?.toDateString() ||
      '日付なし'
    )
  }
}

// Firestore data converter
export const noteConverter = {
  toFirestore(note: Note) {
    return {
      id: note.id,
      userRef: note.userRef,
      title: note.title,
      content: note.content,
      // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
  },
  fromFirestore(snapshot: any, options: any) {
    const note = snapshot.data(options)
    return new Note(
      note.id,
      note.userRef,
      note.title,
      note.content,
      note.createdAt.toDate(),
      note.updatedAt.toDate()
    )
  },
}
