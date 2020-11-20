export default function ({ route, redirect, store }) {
  if (route.fullPath !== '/' && !store.getters.userSignedIn) {
    return redirect('/')
  }
}
