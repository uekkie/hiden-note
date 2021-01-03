// import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { algoliaClient } from './algolia/client'
import { INoteRecord } from './types/algolia'

const db = admin.firestore()

const createNoteIndex = async function (
  doc: functions.firestore.DocumentSnapshot
) {
  const docData = doc.data()
  if (!docData) {
    return
  }
  const index = algoliaClient().initIndex('notes')
  const recordData: INoteRecord = {
    objectID: doc.id,
    id: doc.id,
    title: docData.title,
    content: docData.content,
    createdAt: docData.createdAt?.toDate().getTime(),
    updatedAt: docData.updatedAt?.toDate().getTime(),
  }
  await index.saveObject(recordData)
}

const calcNoteTagsCount = async function (
  doc: functions.firestore.DocumentSnapshot
) {
  const docData = doc.data()
  if (!docData) {
    return
  }
  if (docData.tags === {}) {
    return
  }

  for (const tag of Object.keys(docData.tags)) {
    const tagLowerCase = tag.toLowerCase()
    const querySnapshot = await db
      .collection('notes')
      .where(`tags.${tagLowerCase}`, '==', true)
      .get()

    if (querySnapshot.size) {
      await db
        .collection('tags')
        .doc(tagLowerCase)
        .set({ content: tag, noteCount: querySnapshot.size })
    } else {
      await db
        .collection('tags')
        .doc(tagLowerCase)
        .set({ content: tag, noteCount: 1 })
    }
  }
}

module.exports = async (
  doc: functions.firestore.DocumentSnapshot,
  _context: functions.EventContext
) => {
  if (!doc.data()) {
    return
  }
  await createNoteIndex(doc)
  await calcNoteTagsCount(doc)

  return null
}
