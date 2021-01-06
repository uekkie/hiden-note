/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
/* eslint-disable import/first */
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:58080'
import * as firebase from '@firebase/testing'
import * as admin from 'firebase-admin'

const PROJECT_ID = 'hiden-note'
admin.initializeApp({ projectId: PROJECT_ID})
const db = admin.firestore()
const test = require('firebase-functions-test')();

const myFunctions = require('../index');

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

// const noteData2 = {
//   title: "次のノート",
//   content: "やっていきましょう！",
//   userId: correctUser.uid,
//   tags: { first: true }
// };

describe('tags', () => {
  beforeEach(async () => {
    // await firebase.loadFirestoreRules({
    //   projectId: PROJECT_ID,
    //   rules: fs.readFileSync('./firestore.rules', 'utf8')
    // })
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
    afterEach(async () => {
      await firebase.clearFirestoreData({ projectId: PROJECT_ID })
    })
    const noteId = 'test-note1'

    beforeAll(async () => {
      const wrapped = test.wrap(myFunctions.onNoteCreated);
      const docRef = db
        .collection('notes')
        .doc(noteId)
      await docRef.set(correctNoteData)
      const snapshot = await docRef.get()
      await wrapped(snapshot, { params: { noteId } });
    });
    it('tagsのnoteCountが更新される', () => {
      admin.database().ref('tags/first').once('value').then((tagSnap) => {
        const tag = tagSnap.val()
        expect(tag.content).toBe('first')
        expect(tag.noteCount).toBe(1)
      });
    });
  });

  // describe('onNoteCreated: /notes/test-note1 におなじタグをもつドキュメント追加', () => {
  //   const noteId = 'test-note1'
  //   const noteId2 = 'test-note2'

  //   beforeAll(async () => {
  //     const wrapped = test.wrap(myFunctions.onNoteCreated);
  //     const docRef = db
  //       .collection('notes')
  //       .doc(noteId)
  //     await docRef.set(correctNoteData)
  //     const snapshot = await docRef.get()
  //     await wrapped(snapshot, { params: { noteId } });

  //     const docRef2 = db
  //       .collection('notes')
  //       .doc(noteId2)
  //     await docRef2.set(noteData2)
  //     const snapshot2 = await docRef2.get()
  //     await wrapped(snapshot2, { params: { noteId2 } });
  //   });
  //   it('tagsのnoteCountが2になる', async () => {
  //     const doc = await db.collection('tags').doc('first').get()
  //     expect(doc.id).toBe('first')
  //     const tag = doc.data()!
  //     expect(tag.content).toBe('first')
  //     expect(tag.noteCount).toBe(2)
  //   });
  // });
})
