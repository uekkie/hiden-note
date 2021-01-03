import * as functions from 'firebase-functions'
import { algoliaClient } from './algolia/client'
const admin = require('firebase-admin')

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

// arr1 [1,2,3]
// arr2 [2,3,4]
// arrayDifference( arr1, arr2 ) => [1,4]
const arrayDifference = function (arr1: string[], arr2: string[]) {
  const counts = new Map<string, number>()

  const arr = arr1.concat(arr2)

  arr.forEach(function (value) {
    if (typeof value !== 'string') return
    const count = counts.get(value) || 0
    counts.set(value, count + 1)
  })

  const calcTags: string[] = []
  counts.forEach(function (value, key) {
    if (value === 1) {
      calcTags.push(key)
    }
  })
  return calcTags
}
const updateNoteTagsCount = async function (
  change: functions.Change<functions.firestore.DocumentSnapshot>
) {
  console.log('start updateNoteTagsCount')

  const beforeTagsMap = change.before.data()?.tags || {}
  const afterTagsMap = change.after.data()?.tags || {}
  console.log(
    'beforeTagsMap ',
    beforeTagsMap,
    'afterTagsMap ',
    afterTagsMap,
    ' == ',
    beforeTagsMap !== afterTagsMap
  )

  if (beforeTagsMap !== afterTagsMap) {
    const beforeTags = Object.keys(beforeTagsMap)
    const afterTags = Object.keys(afterTagsMap)
    const calcTags = arrayDifference(beforeTags, afterTags)
    if (calcTags.length > 0) {
      await calcNoteTagsCount(calcTags)
    }
  }
}

const calcNoteTagsCount = async function (calcTagNames: string[]) {
  console.log('start calcNoteTagsCount ', calcTagNames)
  for (const tag of calcTagNames) {
    const tagLowerCase = tag.toLowerCase()
    const querySnapshot = await db
      .collection('notes')
      .where(`tags.${tagLowerCase}`, '==', true)
      .get()

    if (querySnapshot.empty) {
      await db
        .collection('tags')
        .doc(tagLowerCase)
        .set({ content: tag, noteCount: 0 })
      return
    }

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
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  _context: functions.EventContext
) => {
  await updateNoteIndex(change)
  await updateNoteTagsCount(change)

  return null
}
