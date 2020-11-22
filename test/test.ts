import firebase from '@firebase/testing'

const PROJECT_ID = 'hiden-note'
const myId = 'user_abc'
const theirId = 'user_xyz'
const myAuth = { uid: myId, email: 'uekkie@sonicgarden.jp' }
const theirAuth = { uid: theirId, email: 'uekkie@holicgarden.jp' }

function getFirestore(auth) {
  return firebase.initializeTestApp({ projectId: PROJECT_ID, auth }).firestore()
}

// function getAdminFirestore(auth) {
//   return firebase
//     .initializeAdminApp({ projectId: PROJECT_ID, auth })
//     .firestore()
// }

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: PROJECT_ID })
})

describe('app', () => {
  it('ログインしていないときはノートコレクションを読み込めないこと', async () => {
    const db = getFirestore(null)
    const testDoc = db.collection('notes').doc('testDoc')
    await firebase.assertFails(testDoc.get())
  })

  describe('sonicgarden.jpアドレスでログインしているとき', () => {
    it('ノートコレクションを読み込めること', async () => {
      const db = getFirestore(myAuth)
      const testDoc = db.collection('notes').doc('testDoc')
      await firebase.assertSucceeds(testDoc.get())
    })
  })

  describe('sonicgarden.jp以外のアドレスでログインしているとき', () => {
    it('ノートコレクションを読み込めないこと', async () => {
      const db = getFirestore(theirAuth)
      const testDoc = db.collection('notes').doc('testDoc')
      await firebase.assertFails(testDoc.get())
    })
  })

  it('ノートコレクションに書き込めないこと', async () => {
    const db = getFirestore(null)
    const testDoc = db.collection('notes').doc('testDoc2')
    await firebase.assertFails(testDoc.set({ foo: 'bar' }))
  })
})
