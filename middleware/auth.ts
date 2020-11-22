import { Context } from '@nuxt/types'

export default function ({ route, redirect, store }: Context) {
  if (route.fullPath !== '/' && !store.getters['users/userSignedIn']) {
    return redirect('/')
  }
}
