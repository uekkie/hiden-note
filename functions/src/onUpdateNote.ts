import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { algoliaClient } from './algolia/client'

const db = admin.firestore()

const updateNoteIndex = async function (
  change: functions.Change<functions.firestore.DocumentSnapshot>
) {
  const docData: any = change.after.data()
  const index = algoliaClient().initIndex('notes')

  await index.partialUpdateObject({
    objectID: change.after.id,
    title: docData.title,
    content: docData.content,
    updatedAt: docData.updatedAt?.toDate().getTime(),
  })
}

const updateNoteTagsCount = async function (
  change: functions.Change<functions.firestore.DocumentSnapshot>
) {
  const beforeTagsMap = change.before.data()?.tags || {}
  const afterTagsMap = change.after.data()?.tags || {}

  if (beforeTagsMap === afterTagsMap) {
    return
  }

  const beforeTags = Object.keys(beforeTagsMap)
  const afterTags = Object.keys(afterTagsMap)
  const incrementTags = afterTags.filter((tag) => !beforeTags.includes(tag))
  const decrementTags = beforeTags.filter((tag) => !afterTags.includes(tag))
  if (incrementTags.length > 0) {
    console.log('incrementTags ', incrementTags)
    await calcNoteTagsCount(incrementTags, true)
  }
  if (decrementTags.length > 0) {
    console.log('decrementTags ', decrementTags)
    await calcNoteTagsCount(decrementTags, false)
  }
}

const calcNoteTagsCount = async function (
  calcTagNames: string[],
  isIncrement: boolean
) {
  for (const tag of calcTagNames) {
    const querySnapshot = await db
      .collection('notes')
      .where(`tags.${tag}`, '==', true)
      .get()

    const tagLowerCase = tag.toLowerCase()
    if (querySnapshot.size) {
      await db
        .collection('tags')
        .doc(tagLowerCase)
        .set({ content: tag, noteCount: querySnapshot.size })
    } else {
      await db
        .collection('tags')
        .doc(tagLowerCase)
        .set({ content: tag, noteCount: isIncrement ? 1 : 0 })
    }
  }
}

module.exports = async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  _context: functions.EventContext
) => {
  await updateNoteIndex(change)
  await updateNoteTagsCount(change)

  return null
}
