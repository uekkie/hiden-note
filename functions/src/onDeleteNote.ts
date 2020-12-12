import * as functions from 'firebase-functions'
import { algoliaClient } from './algolia/client'
module.exports = async (
  doc: functions.firestore.DocumentSnapshot,
  _context: functions.EventContext
) => {
  if (!doc.data()) {
    return
  }
  const filterQuery = `id:${doc.id}`
  const notesIndex = algoliaClient().initIndex('notes')
  await notesIndex.deleteBy({
    filters: filterQuery,
  })

  return null
}
