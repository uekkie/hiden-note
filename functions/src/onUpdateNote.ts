import * as functions from 'firebase-functions'
import { algoliaClient } from './algolia/client'

module.exports = async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  _context: functions.EventContext
) => {
  const docData: any = change.after.data()
  const index = algoliaClient().initIndex('notes')

  await index.partialUpdateObject({
    objectID: change.after.id,
    title: docData.title,
    content: docData.content,
    updatedAt: docData.updatedAt.toDate().getTime()
  })
  return null
}
