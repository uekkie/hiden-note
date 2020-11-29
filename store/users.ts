import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import { db } from '@/plugins/firebase'
import { User } from '@/models'

const usersRef = db.collection('users')

@Module({
  name: 'users',
  stateFactory: true,
  namespaced: true,
})
class Users extends VuexModule {
  storedUsers: User[] = []
  initialized: boolean = false
  storedUnsubscribed?: () => void = undefined

  get users() {
    return this.storedUsers
  }

  @Mutation
  SET_INITIALIZED(value: boolean) {
    this.initialized = value
  }

  @Mutation
  SET_UNSUBSCRIBE(value?: () => void) {
    this.storedUnsubscribed = value
  }

  @Mutation
  CLEAR_STATE() {
    if (this.storedUnsubscribed) {
      this.storedUnsubscribed()
    }
    this.storedUnsubscribed = undefined
    this.initialized = false
    this.storedUsers.length = 0
  }

  @Mutation
  STORE_USER(user: User) {
    this.storedUsers = this.storedUsers.filter((q) => q.id !== user.id)
    this.storedUsers.push(user)
  }

  @Mutation
  CLEAR_USERS() {
    this.storedUsers = []
  }

  @Mutation
  REMOVE_USER(user: User) {
    this.storedUsers = this.storedUsers.filter((q) => q.id !== user.id)
  }

  @Action
  async initialize() {
    if (this.initialized) {
      return true
    }
    await this.storeUsers()
    this.watchUsers()

    this.SET_INITIALIZED(true)
  }

  @Action
  clear() {
    this.CLEAR_STATE()
  }

  @Action
  private watchUsers() {
    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const user = new User(
          Object.assign({ id: change.doc.id }, change.doc.data())
        )

        if (change.type === 'added' || change.type === 'modified') {
          this.STORE_USER(user)
        } else if (change.type === 'removed') {
          this.REMOVE_USER(user)
        }
      })
    })
    this.SET_UNSUBSCRIBE(unsubscribe)
  }

  // @Action
  // getUser(id: string): User | null {
  //   console.log('this.storedUsers ', this.storedUsers)
  //   const matchUsers = this.storedUsers.filter((user) => {
  //     console.log('matched users ', user)
  //     return user.id === id
  //   })

  //   return matchUsers.length === 0 ? null : matchUsers[0]
  // }

  // @Action
  // async getNoteHistory({
  //   id,
  //   historyId,
  // }: {
  //   id: string
  //   historyId: string
  // }): Promise<NoteHistory> {
  //   const noteHistoryRef = await notesRef
  //     .doc(id)
  //     .collection('histories')
  //     .doc(historyId)
  //     .get()
  //   return new NoteHistory({
  //     id: noteHistoryRef.id,
  //     ...noteHistoryRef.data(),
  //   })
  // }

  // @Action
  // async createNote(note: Note): Promise<string> {
  //   const noteRef = await notesRef.add({
  //     userId: authStore.userId,
  //     title: note.title,
  //     content: note.content,
  //     tags: note.tags.length > 0 ? FieldValue.arrayUnion(...note.tags) : [],
  //     createdAt: FieldValue.serverTimestamp(),
  //     updatedAt: FieldValue.serverTimestamp(),
  //   })
  //   return noteRef.id
  // }

  // @Action
  // async updateNote(note: Note) {
  //   const noteRef = notesRef.doc(note.id)
  //   const beforeNote = await noteRef.get()
  //   const beforeContent = beforeNote.get('content')

  //   // NOTE: 内容（content）に変更がないときは履歴に残さない
  //   if (beforeContent !== note.content) {
  //     await noteRef.collection('histories').add({
  //       content: beforeContent,
  //       userId: authStore.userId,
  //       createdAt: FieldValue.serverTimestamp(),
  //     })
  //   }

  //   noteRef.update({
  //     title: note.title,
  //     content: note.content,
  //     tags: note.tags,
  //     updatedAt: FieldValue.serverTimestamp(),
  //   })
  // }

  @Action
  async storeUsers() {
    this.CLEAR_USERS()

    const querySnapshot = await usersRef.get()

    querySnapshot.forEach((doc) => {
      this.STORE_USER(new User(Object.assign({ id: doc.id }, doc.data())))
    })
  }
}
export default Users
