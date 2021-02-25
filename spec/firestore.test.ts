/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
/* eslint-disable import/first */
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:58080'

import * as fs from 'fs'
import * as firebase from '@firebase/testing'

const PROJECT_ID = 'hiden-note'
// 管理者権限で操作できるFreistore appを作成する
const getFirestoreAdmin = (): firebase.firestore.Firestore => {
  return firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore();
};

function getFirestoreWithAuth({
  uid,
  email = 'test@test.local',
  admin = false,
  sign_in_provider = 'google'
}: {
  uid: string
  email?: string
  admin?: boolean
  sign_in_provider?: string
}) {
  const auth: any = {
    uid,
    email,
    admin,
  }
  if (sign_in_provider) {
    auth.firebase = { sign_in_provider }
  }

  const app = firebase.initializeTestApp({
    projectId: PROJECT_ID,
    auth
  })

  return app.firestore()
}

const correctUser = {
  uid: 'correct_user',
  email: 'user@sonicgarden.jp'
}
const incorrectUser = {
  uid: 'incorrect_user',
  email: 'user@incorrect.jp'
}
const correctOtherUser = {
  uid: 'correct_other_user',
  email: 'other_user@sonicgarden.jp'
}
const correctNoteData = {
  title: "はじめに読むノート",
  content: "積極的にアップデートしましょう！",
  userId: correctUser.uid
};

describe('noteのCRUD', () => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({
      projectId: PROJECT_ID,
      rules: fs.readFileSync('./firestore.rules', 'utf8')
    })
  })

  afterEach(async () => {
    await Promise.all(
      firebase.apps().map((app: any) => {
        return app.delete()
      })
    )
  })

  afterAll(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID })
  })

  describe('アクセス権限のないユーザーのとき', ()=> {
    test('追加の失敗', async()=> {
      const db = getFirestoreWithAuth(incorrectUser)
      const doc = db.collection('notes')
      await firebase.assertFails(doc.add({userId: incorrectUser.uid, title: '追加できないノート', content: '保存しないでね'}))
    })
  })
  describe('noteの作成', () => {
    test('titleがないと保存できない', async () => {
      const db = getFirestoreWithAuth(correctUser)
      const doc = db.collection('notes')
      await firebase.assertFails(doc.add({ userId: correctUser.uid, title: '', content: 'コンテンツ' }))
    })
    test('titleは100文字以内であること', async () => {
      const db = getFirestoreWithAuth(correctUser)
      const doc = db.collection('notes')
      const too_long_title = "a".repeat(101)
      await firebase.assertFails(doc.add({ userId: correctUser.uid, title: too_long_title, content: 'コンテンツ' }))
    })
    test('contentがないと保存できない', async () => {
      const db = getFirestoreWithAuth(correctUser)
      const doc = db.collection('notes')
      await firebase.assertFails(doc.add({ userId: correctUser.uid, title: 'タイトル', content: '' }))
    })
    test('正しい形式なので保存できる', async () => {
      const db = getFirestoreWithAuth(correctUser)
      const doc = db.collection('notes')
      await firebase.assertSucceeds(doc.add({ userId: correctUser.uid, title: 'OK', content: 'Success' }))
    })
  })
  describe('noteの更新', () => {
    getFirestoreAdmin()
    .collection("notes")
    .doc("memo")
    .set(correctNoteData);

    test('作成したユーザーは更新できる', async () => {
      const db = getFirestoreWithAuth(correctUser)
      const docRef = db.collection('notes').doc('memo')
      await firebase.assertSucceeds(docRef.update({title: '新しいタイトル'}))
    })
    test('別ユーザーは更新できる', async () => {
      const db = getFirestoreWithAuth(correctOtherUser)
      const docRef = db.collection('notes').doc('memo')
      await firebase.assertSucceeds(docRef.update({title: '新しいタイトル'}))
    })
  })
  describe('noteの削除', () => {
    getFirestoreAdmin()
      .collection("notes")
      .doc("memo")
      .set(correctNoteData);

    test('作成したユーザーは削除できる', async () => {
      const db = getFirestoreWithAuth(correctUser)
      const docRef = db.collection('notes').doc('memo')
      await firebase.assertSucceeds(docRef.delete())
    })
    test('別ユーザーは削除できない', async () => {
      const db = getFirestoreWithAuth(correctOtherUser)
      const docRef = db.collection('notes').doc('memo')
      await firebase.assertFails(docRef.delete())
    })
  })
})
