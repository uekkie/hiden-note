/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
/* eslint-disable import/first */
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:58080'

import * as fs from 'fs'
import * as firebase from '@firebase/testing'
// const Timestamp = firebase.firestore.Timestamp

const test = require('firebase-functions-test')();

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

const correctNoteData = {
  title: "はじめに読むノート",
  content: "積極的にアップデートしましょう！",
  userId: correctUser.uid,
  tags: { first: true }
};

describe('tags', () => {
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
  
  describe('onNoteCreated: /notes/test-note1 に新規ドキュメント追加', () => {
    const noteId = 'test-note1'
    const refPath = `notes/${noteId}`;
    const myFunctions = require('../functions/lib/index');
    const db = getFirestoreWithAuth(correctUser)

    beforeAll(async () => {
      const snapshot = test.firestore.makeDocumentSnapshot(correctNoteData, refPath);
      const wrapped = test.wrap(myFunctions.onNoteCreated);
      await wrapped(snapshot, { params: { noteId } });
    });
    it('tagsのnoteCountが更新される', async () => {
      const snap = await db.collection('notes').doc(noteId).get();
      const note = snap.data();
      expect(note!.tags).toBe({ first: true })
      await firebase.assertSucceeds(db.collection('tags').doc('first').get())
    });
  });
  describe('タグを追加できる', () => {
    test('タグを保存できる', async () => {
      const db = getFirestoreWithAuth(correctUser)
      const doc = db.collection('notes')
      await firebase.assertSucceeds(doc.add({ userId: correctUser.uid, title: 'OK', content: 'Success', tags: { javascript: true } }))
    })
  })
  describe('タグの更新', () => {
    getFirestoreAdmin()
    .collection("notes")
    .doc("memo")
    .set(correctNoteData);
    
    test('作成したタグを更新できる', async () => {
      const db = getFirestoreWithAuth(correctUser)
      const docRef = db.collection('notes').doc('memo')
      await firebase.assertSucceeds(docRef.update({tags: {first: true, second: true}}))
    })
  })
})