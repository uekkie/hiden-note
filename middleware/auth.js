export default function ({ redirect, store }) {
  if (!store.getters.userSignedIn) {
    return redirect('/')
  }
}
