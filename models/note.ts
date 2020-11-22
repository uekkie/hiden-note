import firebase from 'firebase'
export class Note {
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

  // MEMO: Note.createdAtを表示する箇所がなくなったのでコメントアウトしているが、
  // あとあとどこかで使い始めそうなので残してます
  // formatDate(): string {
  //   return (
  //     this.createdAt?.toDateString() || '日付なし'
  //   )
  // }
}

export const noteConverter = {
  toFirestore(note: Note): firebase.firestore.DocumentData {
    return {
      userRef: note.userRef,
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
    return new Note(note.userRef, note.title, note.content, note.createdAt)
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
