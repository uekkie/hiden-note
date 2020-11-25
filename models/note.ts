import firebase from 'firebase'
export class Note {
  constructor(
    public title: string,
    public content: string,
    public tags: string[],
    public userRef?: firebase.firestore.DocumentReference,
    public createdAt?: Date
  ) {
    this.userRef = userRef
    this.title = title
    this.content = content
    this.tags = tags
    this.createdAt = createdAt
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
    return new Note(
      note.title,
      note.content,
      note.tags,
      note.userRef,
      note.createdAt
    )
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
