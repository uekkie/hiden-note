import { Context } from '@nuxt/types'
import { authStore } from '@/store'
import { auth } from '@/plugins/firebase'
import firebase from 'firebase'

export default async function ({ route, redirect }: Context) {
  if (!authStore.userSignedIn) {
    const authenticatedUser: firebase.User | null = await new Promise(
      (resolve): void => {
        auth.onAuthStateChanged((authenticatedUser): void => {
          resolve(authenticatedUser)
        })
      }
    )
    if (authenticatedUser) {
      authStore.doSignIn(authenticatedUser)
    }
  }

  const isRootPath = route.name === 'index'
  if (authStore.userSignedIn) {
    if (isRootPath) {
      return redirect({
        name: 'notes',
      })
    }
  } else if (!isRootPath) {
    return redirect({
      name: '/',
    })
  }
}
