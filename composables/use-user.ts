import { toRefs, reactive, inject, provide } from '@nuxtjs/composition-api'
import firebase from '@/plugins/firebase'
import { User } from '@/models/user'

import UserKey from '@/composables/use-user-key'
export const db = firebase.firestore()

const usersRef = db.collection('users')

export function provideUserStore() {
  provide(UserKey, useUser())
}
export function useUserStore() {
  return inject(UserKey) as UserStore
}

export default function useUser() {
  const state = reactive<{
    users: User[]
  }>({
    users: [],
  })

  const clear = () => {
    state.users = []
  }

  const fetchUsers = async () => {
    clear()

    const querySnapshot = await usersRef.get()

    querySnapshot.forEach((doc) => {
      state.users.push(new User(Object.assign({ id: doc.id }, doc.data())))
    })
  }

  const getUserById = (userId: string) => {
    return state.users.find((user) => user.id === userId)
  }
  return {
    ...toRefs(state),
    getUserById,
    fetchUsers,
  }
}
export type UserStore = ReturnType<typeof useUser>
