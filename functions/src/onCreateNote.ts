// import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { algoliaClient } from './algolia/client'
import { INoteRecord } from './types/algolia'

module.exports = async (
  doc: functions.firestore.DocumentSnapshot,
  _context: functions.EventContext
) => {
  console.log(process.env.ALGOLIA_APP_ID)
  if (!doc.data()) {
    return
  }
  const docData = doc.data()!
  const index = algoliaClient().initIndex('notes')
  const recordData: INoteRecord = {
    objectID: doc.id,
    id: doc.id,
    title: docData.title,
    content: docData.content,
    createdAt: docData.createdAt.toDate().getTime(),
    updatedAt: docData.updatedAt.toDate().getTime(),
  }
  await index.saveObject(recordData)

  return null
}
